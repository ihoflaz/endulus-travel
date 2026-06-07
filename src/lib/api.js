// Lightweight fetch wrapper used by both admin and public hooks.
// - Auth lives in HttpOnly cookies set by the backend. We never read tokens
//   from JS — XSS therefore cannot exfiltrate them.
// - Concurrent 401s are deduped via a single in-flight refresh promise.
// - All same-origin paths go via /api which nginx proxies to the backend.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const buildUrl = (path) => {
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith('/')) return `${BASE_URL}${path}`;
  return `${BASE_URL}/${path}`;
};

const buildHeaders = (init = {}, { json = true } = {}) => {
  const headers = new Headers(init.headers || {});
  if (json && init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  // CSRF defense: backend csrfGuard requires this exact header for cookie-auth
  // mutations. Browsers can't set arbitrary X-Requested-With from a <form>.
  if (!headers.has('X-Requested-With')) {
    headers.set('X-Requested-With', 'XMLHttpRequest');
  }
  return headers;
};

// Single shared refresh promise — concurrent 401s wait on the same call.
let inflightRefresh = null;
const refreshOnce = async () => {
  if (!inflightRefresh) {
    inflightRefresh = (async () => {
      try {
        const res = await fetch(buildUrl('/auth/refresh'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          credentials: 'include',
        });
        return res.ok;
      } catch {
        return false;
      } finally {
        setTimeout(() => { inflightRefresh = null; }, 0);
      }
    })();
  }
  return inflightRefresh;
};

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error || `Request failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

export const apiFetch = async (path, init = {}, opts = {}) => {
  const url = buildUrl(path);
  let res = await fetch(url, {
    ...init,
    headers: buildHeaders(init, { json: opts.json !== false }),
    credentials: 'include',
  });

  if (res.status === 401 && opts._retried !== true && opts.skipRefresh !== true) {
    const ok = await refreshOnce();
    if (ok) return apiFetch(path, init, { ...opts, _retried: true });
  }

  if (!res.ok) {
    let body = null;
    const ct = res.headers.get('content-type') || '';
    try {
      body = ct.includes('application/json')
        ? await res.json()
        : { error: await res.text() };
    } catch { /* ignore */ }
    throw new ApiError(res.status, body);
  }

  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
};

export const api = {
  get: (path, opts) => apiFetch(path, { method: 'GET' }, opts),
  post: (path, body, opts) =>
    apiFetch(path, { method: 'POST', body: JSON.stringify(body ?? {}) }, opts),
  put: (path, body, opts) =>
    apiFetch(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }, opts),
  patch: (path, body, opts) =>
    apiFetch(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }, opts),
  delete: (path, opts) =>
    apiFetch(path, { method: 'DELETE' }, opts),
  upload: (path, formData, opts) =>
    apiFetch(path, { method: 'POST', body: formData }, { ...opts, json: false }),
};

export { BASE_URL };
