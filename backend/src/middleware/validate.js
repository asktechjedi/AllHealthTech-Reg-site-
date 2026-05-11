/**
 * Zod validation middleware factory.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @param {'body'|'query'} source - Which part of the request to validate (default: 'body')
 * @returns {import('express').RequestHandler}
 */
const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.') || err.path[0] || 'unknown',
      message: err.message,
    }));

    return res.status(400).json({
      error: 'Validation failed',
      details,
    });
  }

  // Replace the source with the parsed (coerced/stripped) data
  req[source] = result.data;
  return next();
};

export default validate;
