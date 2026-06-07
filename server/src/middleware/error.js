import { HttpError } from '../utils/httpError.js';
import { ZodError } from 'zod';
import { env } from '../config/env.js';

export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
};

// Redact known secret keys from request bodies before logging.
const SECRET_KEYS = ['password', 'currentPassword', 'newPassword', 'refresh', 'token'];
const redactBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  const out = {};
  for (const [k, v] of Object.entries(body)) {
    out[k] = SECRET_KEYS.includes(k) ? '[REDACTED]' : v;
  }
  return out;
};

export const errorHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.flatten(),
    });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }
  if (err?.code === 'P2002') {
    return res.status(409).json({
      error: 'Unique constraint violation',
      details: err.meta,
    });
  }
  if (err?.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  if (err?.code === 'LIMIT_FILE_COUNT' || err?.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: err.message });
  }

  // Server-side log carries the redacted body so passwords never hit disk.
  console.error('[unhandled]', {
    method: req.method,
    path: req.originalUrl,
    body: redactBody(req.body),
    err: err.message,
    stack: env.EXPOSE_ERRORS ? err.stack : undefined,
  });
  res.status(500).json({
    error: 'Internal server error',
    ...(env.EXPOSE_ERRORS ? { message: err.message, stack: err.stack } : {}),
  });
};
