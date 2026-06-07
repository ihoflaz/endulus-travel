import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { env } from '../config/env.js';

const jwtBase = {
  issuer: env.JWT_ISSUER,
  audience: env.JWT_AUDIENCE,
};

export const signAccess = (payload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    ...jwtBase,
    expiresIn: env.JWT_ACCESS_TTL,
  });

export const verifyAccess = (token) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET, jwtBase);

export const signRefresh = (payload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    ...jwtBase,
    expiresIn: env.JWT_REFRESH_TTL,
  });

export const verifyRefresh = (token) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET, jwtBase);

export const randomToken = (bytes = 48) =>
  crypto.randomBytes(bytes).toString('hex');

// SHA-256 (hex) of a token — stored in DB instead of the plaintext token,
// so a DB leak does not yield usable session tokens.
export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');
