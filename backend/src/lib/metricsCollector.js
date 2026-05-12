/**
 * Metrics Collector for Google Sheets Sync
 * Tracks sync success rate, retry attempts, and failed syncs
 */

class MetricsCollector {
  constructor() {
    this.metrics = {
      totalSyncs: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      transientErrors: 0,
      permanentErrors: 0,
      totalRetries: 0,
      deadLetterCount: 0,
      lastSyncTime: null,
      lastErrorTime: null,
    };
  }

  /**
   * Record a successful sync
   */
  recordSuccess() {
    this.metrics.totalSyncs++;
    this.metrics.successfulSyncs++;
    this.metrics.lastSyncTime = new Date();
    this.logMetrics('Sync successful');
  }

  /**
   * Record a transient error
   */
  recordTransientError() {
    this.metrics.failedSyncs++;
    this.metrics.transientErrors++;
    this.metrics.lastErrorTime = new Date();
    this.logMetrics('Transient error recorded');
  }

  /**
   * Record a permanent error
   */
  recordPermanentError() {
    this.metrics.failedSyncs++;
    this.metrics.permanentErrors++;
    this.metrics.lastErrorTime = new Date();
    this.logMetrics('Permanent error recorded');
  }

  /**
   * Record a retry attempt
   */
  recordRetry() {
    this.metrics.totalRetries++;
  }

  /**
   * Record a sync moved to dead letter queue
   */
  recordDeadLetter() {
    this.metrics.deadLetterCount++;
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalSyncs > 0
        ? ((this.metrics.successfulSyncs / this.metrics.totalSyncs) * 100).toFixed(2) + '%'
        : 'N/A',
      failureRate: this.metrics.totalSyncs > 0
        ? ((this.metrics.failedSyncs / this.metrics.totalSyncs) * 100).toFixed(2) + '%'
        : 'N/A',
    };
  }

  /**
   * Log metrics to console
   */
  logMetrics(message = 'Metrics') {
    const metrics = this.getMetrics();
    console.log(`[Metrics] ${message}:`, {
      totalSyncs: metrics.totalSyncs,
      successfulSyncs: metrics.successfulSyncs,
      failedSyncs: metrics.failedSyncs,
      successRate: metrics.successRate,
      failureRate: metrics.failureRate,
      transientErrors: metrics.transientErrors,
      permanentErrors: metrics.permanentErrors,
      totalRetries: metrics.totalRetries,
      deadLetterCount: metrics.deadLetterCount,
      lastSyncTime: metrics.lastSyncTime,
      lastErrorTime: metrics.lastErrorTime,
    });
  }

  /**
   * Reset metrics
   */
  reset() {
    this.metrics = {
      totalSyncs: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      transientErrors: 0,
      permanentErrors: 0,
      totalRetries: 0,
      deadLetterCount: 0,
      lastSyncTime: null,
      lastErrorTime: null,
    };
  }

  /**
   * Check if sync success rate is below threshold
   * @param {number} threshold - Success rate threshold (0-100)
   * @returns {boolean} true if success rate is below threshold
   */
  isBelowThreshold(threshold = 95) {
    if (this.metrics.totalSyncs === 0) {
      return false;
    }
    const successRate = (this.metrics.successfulSyncs / this.metrics.totalSyncs) * 100;
    return successRate < threshold;
  }

  /**
   * Alert if success rate drops below threshold
   * @param {number} threshold - Success rate threshold (0-100)
   */
  checkAndAlert(threshold = 95) {
    if (this.isBelowThreshold(threshold)) {
      console.error(`[ALERT] Google Sheets sync success rate below ${threshold}%:`, {
        successRate: ((this.metrics.successfulSyncs / this.metrics.totalSyncs) * 100).toFixed(2) + '%',
        totalSyncs: this.metrics.totalSyncs,
        successfulSyncs: this.metrics.successfulSyncs,
        failedSyncs: this.metrics.failedSyncs,
      });
      // TODO: Send alert to monitoring system
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const metricsCollector = new MetricsCollector();

export default MetricsCollector;
