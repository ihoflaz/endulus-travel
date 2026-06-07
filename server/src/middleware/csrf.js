// Lightweight CSRF defense for cookie-authenticated mutations.
//
// Rationale:
//  1. SameSite=Lax on the cookie blocks classic form CSRF.
//  2. CORS allowlist blocks the browser from sending arbitrary origins.
//  3. This middleware: every non-idempotent request that authenticates via a
//     cookie (access OR refresh) must send `X-Requested-With: XMLHttpRequest`
//     — a header a <form> cannot forge from another origin without a CORS
//     preflight. We do NOT accept "fetch" or other casually-set values.
//
// Mutations with a `Bearer` Authorization header skip the check.

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const csrfGuard = (req, res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();
  const hasBearer = (req.headers.authorization || '').startsWith('Bearer ');
  if (hasBearer) return next();
  // Cookie-based auth covers both access_token AND refresh_token; an attacker
  // who CSRF's /auth/refresh can rotate the session without the access cookie.
  const cookieAuth = req.cookies?.access_token || req.cookies?.refresh_token;
  if (!cookieAuth) return next();
  const xrw = req.headers['x-requested-with'];
  if (xrw !== 'XMLHttpRequest') {
    return res.status(403).json({
      error: 'CSRF guard: missing or invalid X-Requested-With header',
    });
  }
  next();
};
