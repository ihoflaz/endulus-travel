import 'dotenv/config';

// Pattern that flags an env value as a placeholder rather than a real secret.
// Anything containing __REQUIRED__, "replace-with", "change-me", or "REPLACE"
// fails fast — operators sometimes copy .env.example verbatim.
const PLACEHOLDER_RE = /__REQUIRED__|replace-with|change-me|REPLACE|CHANGE_ME/i;

const required = (name) => {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing required env var: ${name}`);
  if (PLACEHOLDER_RE.test(v)) {
    throw new Error(`Env var ${name} still contains a placeholder value — set a real secret`);
  }
  return v;
};

const requireMinLength = (name, min) => {
  const v = required(name);
  if (v.length < min) throw new Error(`Env var ${name} must be at least ${min} chars`);
  return v;
};

const requiredInProd = (name, fallback) => {
  if (process.env.NODE_ENV === 'production') return required(name);
  return process.env[name] || fallback;
};

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';

const JWT_ACCESS_SECRET = requireMinLength('JWT_ACCESS_SECRET', 32);
const JWT_REFRESH_SECRET = requireMinLength('JWT_REFRESH_SECRET', 32);
if (JWT_ACCESS_SECRET === JWT_REFRESH_SECRET) {
  throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different');
}

// COOKIE_SECRET defaults to JWT_ACCESS_SECRET when not provided — we resolve
// the fallback here rather than in compose, where nested ${VAR:-${OTHER}}
// doesn't expand properly.
let COOKIE_SECRET = process.env.COOKIE_SECRET;
if (!COOKIE_SECRET || !COOKIE_SECRET.trim() || PLACEHOLDER_RE.test(COOKIE_SECRET)) {
  COOKIE_SECRET = JWT_ACCESS_SECRET;
}

export const env = {
  NODE_ENV,
  PORT: Number(process.env.PORT || 4000),
  DATABASE_URL: required('DATABASE_URL'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  TRUST_PROXY: process.env.TRUST_PROXY || '1',
  // Default off in prod, even if NODE_ENV is unset (defensive). Operators
  // must opt-in explicitly with EXPOSE_ERRORS=true.
  EXPOSE_ERRORS: process.env.EXPOSE_ERRORS === 'true',
  MORGAN_ENABLED: process.env.MORGAN_ENABLED !== 'false',

  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_TTL: Number(process.env.JWT_ACCESS_TTL || 900),
  JWT_REFRESH_TTL: Number(process.env.JWT_REFRESH_TTL || 2592000),
  JWT_ISSUER: process.env.JWT_ISSUER || 'endulus-travel',
  JWT_AUDIENCE: process.env.JWT_AUDIENCE || 'endulus-travel',

  COOKIE_SECRET,

  // Admin seeding — require explicit, non-placeholder values in production.
  ADMIN_EMAIL: requiredInProd('ADMIN_EMAIL', 'admin@endulustravel.com'),
  ADMIN_PASSWORD: requiredInProd('ADMIN_PASSWORD', isProd ? null : 'ChangeMe!2026'),
  ADMIN_NAME: process.env.ADMIN_NAME || 'Admin',
  RUN_SEED: process.env.RUN_SEED !== 'false', // default true; set "false" to skip

  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  PUBLIC_UPLOAD_BASE: process.env.PUBLIC_UPLOAD_BASE || '/uploads',
  MAX_UPLOAD_BYTES: Number(process.env.MAX_UPLOAD_BYTES || 10 * 1024 * 1024),

  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS || 12),
};

if (isProd && env.CORS_ORIGIN.includes('localhost')) {
  console.warn('[env] WARNING: NODE_ENV=production but CORS_ORIGIN includes localhost');
}

export { isProd };
