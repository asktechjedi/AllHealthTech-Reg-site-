/**
 * Global error handler middleware for Express.
 * Logs errors with timestamps and returns structured JSON responses.
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode ?? err.status ?? 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log with timestamp, request context, and stack trace
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    statusCode,
    message: err.message,
    stack: err.stack,
  }));

  const isInternalError = statusCode >= 500;

  const responseBody = {
    error: (isProduction && isInternalError)
      ? 'An unexpected error occurred'
      : (err.message ?? 'An unexpected error occurred'),
    code: err.code ?? 'INTERNAL_SERVER_ERROR',
    statusCode,
  };

  res.status(statusCode).json(responseBody);
};

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
