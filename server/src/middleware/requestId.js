import crypto from 'node:crypto';

// Assigns a short correlation ID to every request so we can stitch together
// access logs, audit log entries, and error traces.
export const requestId = (req, res, next) => {
  const incoming = req.headers['x-request-id'];
  // Trust an upstream id only if it looks safe (no control chars, ≤64 chars).
  const id =
    typeof incoming === 'string' && /^[A-Za-z0-9_.-]{1,64}$/.test(incoming)
      ? incoming
      : crypto.randomBytes(8).toString('hex');
  req.id = id;
  res.setHeader('X-Request-Id', id);
  next();
};
