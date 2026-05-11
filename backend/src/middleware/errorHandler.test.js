import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import errorHandler, { createError } from './errorHandler.js';

const makeReq = (method = 'GET', url = '/test') => ({ method, url });
const makeRes = () => {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
};
const next = vi.fn();

describe('errorHandler middleware', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults to 500 and INTERNAL_SERVER_ERROR for a plain Error', () => {
    const err = new Error('Something broke');
    const res = makeRes();

    errorHandler(err, makeReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    const body = res.json.mock.calls[0][0];
    expect(body.statusCode).toBe(500);
    expect(body.code).toBe('INTERNAL_SERVER_ERROR');
    expect(body.error).toBe('Something broke');
  });

  it('uses err.statusCode when set', () => {
    const err = createError('Not found', 404, 'NOT_FOUND');
    const res = makeRes();

    errorHandler(err, makeReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    const body = res.json.mock.calls[0][0];
    expect(body.statusCode).toBe(404);
    expect(body.code).toBe('NOT_FOUND');
    expect(body.error).toBe('Not found');
  });

  it('falls back to err.status when err.statusCode is absent', () => {
    const err = new Error('Forbidden');
    err.status = 403;
    const res = makeRes();

    errorHandler(err, makeReq(), res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    const body = res.json.mock.calls[0][0];
    expect(body.statusCode).toBe(403);
  });

  it('uses err.code in the response when set', () => {
    const err = createError('Conflict', 409, 'DUPLICATE_EMAIL');
    const res = makeRes();

    errorHandler(err, makeReq(), res, next);

    const body = res.json.mock.calls[0][0];
    expect(body.code).toBe('DUPLICATE_EMAIL');
  });

  it('logs timestamp, method, url, statusCode, message, and stack', () => {
    const err = new Error('Oops');
    errorHandler(err, makeReq('POST', '/api/registrations'), makeRes(), next);

    expect(console.error).toHaveBeenCalledOnce();
    const logged = JSON.parse(console.error.mock.calls[0][0]);
    expect(logged.method).toBe('POST');
    expect(logged.url).toBe('/api/registrations');
    expect(logged.statusCode).toBe(500);
    expect(logged.message).toBe('Oops');
    expect(typeof logged.timestamp).toBe('string');
    expect(typeof logged.stack).toBe('string');
    // timestamp should be a valid ISO string
    expect(() => new Date(logged.timestamp).toISOString()).not.toThrow();
  });

  it('hides internal error message in production for 5xx errors', () => {
    process.env.NODE_ENV = 'production';
    const err = new Error('DB connection string exposed');
    const res = makeRes();

    errorHandler(err, makeReq(), res, next);

    const body = res.json.mock.calls[0][0];
    expect(body.error).toBe('An unexpected error occurred');
  });

  it('does NOT hide message in production for 4xx errors', () => {
    process.env.NODE_ENV = 'production';
    const err = createError('Email already registered', 409, 'DUPLICATE_EMAIL');
    const res = makeRes();

    errorHandler(err, makeReq(), res, next);

    const body = res.json.mock.calls[0][0];
    expect(body.error).toBe('Email already registered');
  });
});

describe('createError', () => {
  it('creates an Error with statusCode and code properties', () => {
    const err = createError('Bad request', 400, 'VALIDATION_ERROR');

    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Bad request');
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe('VALIDATION_ERROR');
  });
});
