import prisma from '../lib/prisma.js';
import { syncRegistrationToSheets, TransientSyncError, PermanentSyncError } from './googleSheetsService.js';

/**
 * Calculate exponential backoff delay
 * @param {number} retryCount - Current retry attempt number (0-indexed)
 * @param {number} initialDelayMs - Initial delay in milliseconds
 * @param {number} backoffMultiplier - Multiplier for exponential backoff
 * @returns {number} Delay in milliseconds
 */
export function calculateBackoffDelay(retryCount, initialDelayMs, backoffMultiplier) {
  return initialDelayMs * Math.pow(backoffMultiplier, retryCount);
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Queue a failed sync for retry
 * @param {string} registrationId - Registration ID
 * @param {Object} registrationData - Registration data to sync
 * @param {string} error - Error message
 * @param {string} errorType - 'TRANSIENT' or 'PERMANENT'
 * @returns {Promise<Object>} Created FailedSync record
 */
export async function queueFailedSync(registrationId, registrationData, error, errorType) {
  const nextRetryTime = new Date();

  const failedSync = await prisma.failedSync.create({
    data: {
      registrationId,
      registrationData,
      error,
      errorType,
      retryCount: 0,
      nextRetryTime,
    },
  });

  console.log('[RetryManager] Failed sync queued', {
    failedSyncId: failedSync.id,
    registrationId,
    errorType,
  });

  return failedSync;
}

/**
 * Move a failed sync to the dead letter queue
 * @param {string} failedSyncId - FailedSync ID
 * @param {number} retryCount - Number of retries attempted
 * @returns {Promise<Object>} Created DeadLetterSync record
 */
export async function moveToDeadLetterQueue(failedSyncId, retryCount) {
  const failedSync = await prisma.failedSync.findUnique({
    where: { id: failedSyncId },
  });

  if (!failedSync) {
    throw new Error(`FailedSync not found: ${failedSyncId}`);
  }

  const deadLetterSync = await prisma.deadLetterSync.create({
    data: {
      registrationId: failedSync.registrationId,
      registrationData: failedSync.registrationData,
      error: failedSync.error,
      errorType: failedSync.errorType,
      retryCount,
      lastAttemptTime: new Date(),
    },
  });

  // Delete from retry queue
  await prisma.failedSync.delete({
    where: { id: failedSyncId },
  });

  console.log('[RetryManager] Sync moved to dead letter queue', {
    deadLetterSyncId: deadLetterSync.id,
    registrationId: failedSync.registrationId,
    retryCount,
  });

  return deadLetterSync;
}

/**
 * Retry a failed sync
 * @param {string} failedSyncId - FailedSync ID
 * @param {Object} config - Retry configuration
 * @param {number} config.maxRetries - Maximum number of retries
 * @param {number} config.initialDelayMs - Initial delay in milliseconds
 * @param {number} config.backoffMultiplier - Exponential backoff multiplier
 * @param {Object} googleSheetsConfig - Google Sheets configuration
 * @returns {Promise<void>}
 */
export async function retryFailedSync(failedSyncId, config, googleSheetsConfig) {
  const { maxRetries, initialDelayMs, backoffMultiplier } = config;

  const failedSync = await prisma.failedSync.findUnique({
    where: { id: failedSyncId },
  });

  if (!failedSync) {
    console.warn('[RetryManager] FailedSync not found:', failedSyncId);
    return;
  }

  try {
    // Calculate backoff delay
    const delayMs = calculateBackoffDelay(failedSync.retryCount, initialDelayMs, backoffMultiplier);

    // Wait for backoff period
    await sleep(delayMs);

    // Attempt sync retry
    const registrationData = failedSync.registrationData;
    await syncRegistrationToSheets(registrationData, googleSheetsConfig);

    // Log successful retry
    console.log('[RetryManager] Failed sync retry succeeded', {
      failedSyncId,
      registrationId: failedSync.registrationId,
      retryCount: failedSync.retryCount,
    });

    // Remove from retry queue
    await prisma.failedSync.delete({
      where: { id: failedSyncId },
    });
  } catch (error) {
    // Determine if error is transient or permanent
    if (error instanceof TransientSyncError) {
      // Transient error - queue for another retry
      if (failedSync.retryCount < maxRetries) {
        const nextRetryCount = failedSync.retryCount + 1;
        const nextDelayMs = calculateBackoffDelay(nextRetryCount, initialDelayMs, backoffMultiplier);
        const nextRetryTime = new Date(Date.now() + nextDelayMs);

        await prisma.failedSync.update({
          where: { id: failedSyncId },
          data: {
            retryCount: nextRetryCount,
            nextRetryTime,
            error: error.message,
            updatedAt: new Date(),
          },
        });

        console.log('[RetryManager] Failed sync queued for retry', {
          failedSyncId,
          registrationId: failedSync.registrationId,
          retryCount: nextRetryCount,
          nextRetryTime,
        });
      } else {
        // Max retries exceeded - move to dead letter queue
        await moveToDeadLetterQueue(failedSyncId, failedSync.retryCount + 1);
        console.error('[RetryManager] Max retries exceeded for sync', {
          failedSyncId,
          registrationId: failedSync.registrationId,
        });
        // TODO: Alert support team
      }
    } else if (error instanceof PermanentSyncError) {
      // Permanent error - move to dead letter queue immediately
      await moveToDeadLetterQueue(failedSyncId, failedSync.retryCount + 1);
      console.error('[RetryManager] Permanent error in sync', {
        failedSyncId,
        registrationId: failedSync.registrationId,
        error: error.message,
      });
      // TODO: Alert support team
    } else {
      // Unknown error - treat as transient
      if (failedSync.retryCount < maxRetries) {
        const nextRetryCount = failedSync.retryCount + 1;
        const nextDelayMs = calculateBackoffDelay(nextRetryCount, initialDelayMs, backoffMultiplier);
        const nextRetryTime = new Date(Date.now() + nextDelayMs);

        await prisma.failedSync.update({
          where: { id: failedSyncId },
          data: {
            retryCount: nextRetryCount,
            nextRetryTime,
            error: error.message,
            updatedAt: new Date(),
          },
        });

        console.log('[RetryManager] Failed sync queued for retry (unknown error)', {
          failedSyncId,
          registrationId: failedSync.registrationId,
          retryCount: nextRetryCount,
        });
      } else {
        await moveToDeadLetterQueue(failedSyncId, failedSync.retryCount + 1);
      }
    }
  }
}

/**
 * Process all pending retries
 * @param {Object} config - Retry configuration
 * @param {Object} googleSheetsConfig - Google Sheets configuration
 * @returns {Promise<void>}
 */
export async function processPendingRetries(config, googleSheetsConfig) {
  try {
    // Find all failed syncs that are ready for retry
    const pendingRetries = await prisma.failedSync.findMany({
      where: {
        nextRetryTime: {
          lte: new Date(),
        },
      },
      orderBy: {
        nextRetryTime: 'asc',
      },
    });

    console.log('[RetryManager] Processing pending retries', {
      count: pendingRetries.length,
    });

    for (const failedSync of pendingRetries) {
      await retryFailedSync(failedSync.id, config, googleSheetsConfig);
    }
  } catch (error) {
    console.error('[RetryManager] Error processing pending retries:', error);
  }
}

/**
 * Start a background job to process retries periodically
 * @param {Object} config - Retry configuration
 * @param {Object} googleSheetsConfig - Google Sheets configuration
 * @param {number} intervalMs - Interval in milliseconds (default: 10 seconds)
 * @returns {NodeJS.Timeout} Interval ID for cleanup
 */
export function startRetryProcessor(config, googleSheetsConfig, intervalMs = 10000) {
  console.log('[RetryManager] Starting retry processor with interval:', intervalMs);

  const intervalId = setInterval(() => {
    processPendingRetries(config, googleSheetsConfig).catch((error) => {
      console.error('[RetryManager] Unexpected error in retry processor:', error);
    });
  }, intervalMs);

  return intervalId;
}

/**
 * Stop the retry processor
 * @param {NodeJS.Timeout} intervalId - Interval ID from startRetryProcessor
 */
export function stopRetryProcessor(intervalId) {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('[RetryManager] Retry processor stopped');
  }
}
