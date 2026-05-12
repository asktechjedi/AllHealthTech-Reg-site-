/**
 * Global error handler middleware for Express.
 * Logs errors with timestamps and returns structured JSON responses.
 * Requirements: 10.1, 10.2, 10.5 (error handling and logging)
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? err.status ?? 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Enhanced logging with request details and timestamp
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    statusCode,
    message: err.message,
    code: err.code,
    // Include request body for debugging (excluding sensitive fields)
    requestBody: req.body ? sanitizeRequestBody(req.body) : undefined,
    // Include user agent and IP for tracking
    userAgent: req.get ? req.get('user-agent') : undefined,
    ip: req.ip || (req.connection && req.connection.remoteAddress),
    stack: isProduction ? undefined : err.stack, // Only log stack in development
  };

  // Log to console (in production, this would go to a logging service)
  if (statusCode >= 500) {
    console.error('[ERROR]', JSON.stringify(logEntry, null, 2));
  } else if (statusCode >= 400) {
    console.warn('[WARN]', JSON.stringify(logEntry, null, 2));
  }

  // Determine if this is an internal server error
  const isInternalError = statusCode >= 500;

  // Handle specific error types with user-friendly messages
  let errorMessage = err.message ?? 'An unexpected error occurred';
  let errorCode = err.code ?? 'INTERNAL_SERVER_ERROR';

  // Database connection errors
  if (err.message && (err.message.includes('ECONNREFUSED') || err.message.includes('database'))) {
    errorMessage = isProduction 
      ? 'Service temporarily unavailable. Please try again later.'
      : 'Database connection failed';
    errorCode = 'DATABASE_ERROR';
  }
  // Prisma-specific errors
  else if (err.code && err.code.startsWith('P')) {
    errorMessage = isProduction
      ? 'A database error occurred. Please try again.'
      : err.message;
    errorCode = 'DATABASE_ERROR';
  }
  // Network/timeout errors
  else if (err.message && (err.message.includes('timeout') || err.message.includes('ETIMEDOUT'))) {
    errorMessage = 'Request timed out. Please try again.';
    errorCode = 'TIMEOUT_ERROR';
  }

  // Build response body
  const responseBody = {
    error: (isProduction && isInternalError) ? 'An unexpected error occurred' : errorMessage,
    code: errorCode,
    statusCode,
    // Include timestamp for debugging
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(responseBody);
};

/**
 * Sanitize request body for logging (remove sensitive fields)
 * @param {Object} body - Request body
 * @returns {Object} Sanitized body
 */
function sanitizeRequestBody(body) {
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
  const sanitized = { ...body };
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

/**
 * Helper to create a structured error object.
 * @param {string} message - Human-readable error message
 * @param {number} statusCode - HTTP status code
 * @param {string} code - Machine-readable error code
 * @returns {Error}
 */
export const createError = (message, statusCode, code) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
};

export default errorHandler;
