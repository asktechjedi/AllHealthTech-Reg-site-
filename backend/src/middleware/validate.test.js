import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import validate from './validate.js';

// Minimal mock for Express req/res/next
const makeReq = (body = {}, query = {}) => ({ body, query });
const makeRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};
const next = vi.fn();

describe('validate middleware', () => {
  const schema = z.object({
    name: z.string().min(1),
    age: z.number().int().positive(),
  });

  it('calls next() when body is valid', () => {
    const req = makeReq({ name: 'Alice', age: 30 });
    const res = makeRes();
    const nextFn = vi.fn();

    validate(schema)(req, res, nextFn);

    expect(nextFn).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 with structured errors when body is invalid', () => {
    const req = makeReq({ name: '', age: -1 });
    const res = makeRes();
    const nextFn = vi.fn();

    validate(schema)(req, res, nextFn);

    expect(nextFn).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    const body = res.json.mock.calls[0][0];
    expect(body.error).toBe('Validation failed');
    expect(Array.isArray(body.details)).toBe(true);
    expect(body.details.length).toBeGreaterThan(0);
    expect(body.details[0]).toHaveProperty('field');
    expect(body.details[0]).toHaveProperty('message');
  });

  it('validates query params when source is "query"', () => {
    const querySchema = z.object({ email: z.string().email() });
    const req = makeReq({}, { email: 'not-an-email' });
    const res = makeRes();
    const nextFn = vi.fn();

    validate(querySchema, 'query')(req, res, nextFn);

    expect(nextFn).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    const body = res.json.mock.calls[0][0];
    expect(body.error).toBe('Validation failed');
    expect(body.details[0].field).toBe('email');
  });

  it('passes valid query params and calls next()', () => {
    const querySchema = z.object({ email: z.string().email() });
    const req = makeReq({}, { email: 'user@example.com' });
    const res = makeRes();
    const nextFn = vi.fn();

    validate(querySchema, 'query')(req, res, nextFn);

    expect(nextFn).toHaveBeenCalledOnce();
  });

  it('replaces req.body with parsed (coerced) data on success', () => {
    const coerceSchema = z.object({ count: z.coerce.number() });
    const req = makeReq({ count: '5' });
    const res = makeRes();
    const nextFn = vi.fn();

    validate(coerceSchema)(req, res, nextFn);

    expect(nextFn).toHaveBeenCalledOnce();
    expect(req.body.count).toBe(5); // coerced from string to number
  });

  it('includes field path in error details for nested schemas', () => {
    const nestedSchema = z.object({ address: z.object({ city: z.string().min(1) }) });
    const req = makeReq({ address: { city: '' } });
    const res = makeRes();
    const nextFn = vi.fn();

    validate(nestedSchema)(req, res, nextFn);

    expect(res.status).toHaveBeenCalledWith(400);
    const body = res.json.mock.calls[0][0];
    expect(body.details[0].field).toBe('address.city');
  });
});
