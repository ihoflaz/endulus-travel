// UTM + click-id capture. Two windows:
//   - first-touch: first time this browser ever landed on the site (immutable)
//   - last-touch:  most recent landing (updated on every fresh entry with UTMs)
//
// We persist to localStorage so navigation, refreshes, and same-day return
// visits keep the source intact. Cookies are NOT used here on purpose —
// localStorage is JS-readable and we want lead forms + analytics helpers to
// pick the values up trivially.

const FIRST_KEY = 'endulus.utm.first';
const LAST_KEY = 'endulus.utm.last';

const UTM_FIELDS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'fbclid', 'gclid', 'ttclid', 'msclkid',
];

const safe = (fn, fb = null) => {
  try { return fn(); } catch { return fb; }
};

const readJSON = (key) =>
  safe(() => JSON.parse(localStorage.getItem(key) || 'null'));

const writeJSON = (key, value) =>
  safe(() => localStorage.setItem(key, JSON.stringify(value)));

const readQuery = () => {
  if (typeof window === 'undefined') return {};
  const out = {};
  const params = new URLSearchParams(window.location.search);
  for (const f of UTM_FIELDS) {
    const v = params.get(f);
    if (v) out[f] = v;
  }
  return out;
};

// Captures the current URL's UTMs into localStorage. Safe to call on every
// route change — only updates `last` when there's something new in the URL.
export const captureUtm = () => {
  const params = readQuery();
  if (Object.keys(params).length === 0) return;
  const stamp = {
    ...params,
    ts: Date.now(),
    landing: typeof window !== 'undefined' ? window.location.pathname : '/',
    referrer: typeof document !== 'undefined' ? document.referrer || null : null,
  };
  if (!readJSON(FIRST_KEY)) writeJSON(FIRST_KEY, stamp);
  writeJSON(LAST_KEY, stamp);
};

export const getFirstTouch = () => readJSON(FIRST_KEY) || {};
export const getLastTouch = () => readJSON(LAST_KEY) || {};

// Flattened object suited for form hidden fields / API payloads. Last-touch
// wins for current attribution; first-touch is also carried so reports can
// pivot either way.
export const getUtmPayload = () => {
  const first = getFirstTouch();
  const last = getLastTouch();
  const flat = {};
  for (const f of UTM_FIELDS) {
    if (last[f]) flat[`last_${f}`] = last[f];
    if (first[f]) flat[`first_${f}`] = first[f];
  }
  if (first.landing) flat.first_landing = first.landing;
  if (last.landing) flat.last_landing = last.landing;
  if (first.referrer) flat.first_referrer = first.referrer;
  return flat;
};

// Convenience for marketing campaigns / single-string carriers (WhatsApp
// prefilled message etc.). Returns `utm_campaign` value or empty string.
export const getCampaign = () =>
  getLastTouch().utm_campaign || getFirstTouch().utm_campaign || '';

// Reads the `_fbp` / `_fbc` cookies that Pixel sets so CAPI can match
// browser-side and server-side events.
const readCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
};

export const getMetaCookies = () => {
  // _fbc may not yet exist if Pixel hasn't fired; synthesize from fbclid.
  const fbp = readCookie('_fbp');
  let fbc = readCookie('_fbc');
  if (!fbc) {
    const fbclid = getLastTouch().fbclid || getFirstTouch().fbclid;
    if (fbclid) {
      fbc = `fb.1.${Date.now()}.${fbclid}`;
    }
  }
  return { fbp, fbc };
};
