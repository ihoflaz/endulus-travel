// Validates the runtime env before container start. Exits non-zero with a
// helpful message if anything looks wrong — operators see this in compose logs
// instead of a generic Node trace later.
import 'dotenv/config';

const PLACEHOLDER_RE = /__REQUIRED__|replace-with|change-me|REPLACE|CHANGE_ME/i;

const errors = [];

const checkRequired = (name) => {
  const v = process.env[name];
  if (!v || !v.trim()) return errors.push(`Missing required env: ${name}`);
  if (PLACEHOLDER_RE.test(v)) return errors.push(`${name} still has a placeholder value — set a real secret`);
};

const checkMinLen = (name, n) => {
  const v = process.env[name];
  if (v && v.length < n) errors.push(`${name} must be at least ${n} characters (currently ${v.length})`);
};

checkRequired('DATABASE_URL');
checkRequired('JWT_ACCESS_SECRET');
checkRequired('JWT_REFRESH_SECRET');
checkMinLen('JWT_ACCESS_SECRET', 32);
checkMinLen('JWT_REFRESH_SECRET', 32);
if (process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
  errors.push('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must differ');
}

if (process.env.NODE_ENV === 'production') {
  checkRequired('ADMIN_EMAIL');
  checkRequired('ADMIN_PASSWORD');
  if (process.env.CORS_ORIGIN?.includes('localhost')) {
    errors.push('CORS_ORIGIN contains "localhost" in production — set real domain(s)');
  }
}

if (errors.length) {
  console.error('[env:check] FAILED:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('[env:check] OK');
