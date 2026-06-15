// Locale-prefixed routing model. Public URLs are /<lang>/<localized-segment>,
// e.g. /tr/turlar and /en/tours. Internal links across the app are written with
// the Turkish-canonical path (e.g. "/turlar/abc"); localizedPath() translates
// AND prefixes them to the active locale at render time, so we don't have to
// rewrite every <Link to>.

export const LOCALES = ['tr', 'en'];
export const DEFAULT_LOCALE = 'tr';

// First-level route segment per locale. The :slug/:id child segments are not
// translated (the tour/blog/service slug itself is shared across locales).
export const ROUTE_SEGMENTS = [
  { key: 'tours',         tr: 'turlar',             en: 'tours' },
  { key: 'domestic',      tr: 'yurt-ici-turlar',    en: 'domestic-tours' },
  { key: 'international',  tr: 'yurt-disi-turlar',   en: 'international-tours' },
  { key: 'planning',      tr: 'tur-planlama',       en: 'tour-planning' },
  { key: 'blog',          tr: 'blog',               en: 'blog' },
  { key: 'about',         tr: 'hakkimizda',         en: 'about' },
  { key: 'contact',       tr: 'iletisim',           en: 'contact' },
  { key: 'budget',        tr: 'butceye-gore-rota',  en: 'budget-routes' },
  { key: 'survey',        tr: 'on-anket',           en: 'survey' },
  { key: 'offer',         tr: 'teklif-al',          en: 'request-offer' },
  { key: 'services',      tr: 'hizmetler',          en: 'services' },
  { key: 'privacy',       tr: 'gizlilik',           en: 'privacy' },
  { key: 'terms',         tr: 'kullanim-kosullari', en: 'terms' },
  { key: 'kvkk',          tr: 'kvkk',               en: 'kvkk' },
];

// Map any first segment (tr OR en spelling) -> the spelling for `lang`.
const segToLang = (seg, lang) => {
  const e = ROUTE_SEGMENTS.find((r) => r.tr === seg || r.en === seg);
  return e ? e[lang] : seg;
};

const isExternal = (p) =>
  /^(https?:|mailto:|tel:|#)/i.test(p) || p.startsWith('wa.me');

export const isLocale = (seg) => seg === 'tr' || seg === 'en';

// Returns the active locale embedded in a pathname, or null.
export const localeFromPath = (pathname = '') => {
  const seg = pathname.split('/').filter(Boolean)[0];
  return isLocale(seg) ? seg : null;
};

// Drops a leading /tr or /en, returning the unprefixed (still slug-translated) path.
export const stripLocale = (pathname = '') => {
  const segs = pathname.split('/').filter(Boolean);
  if (isLocale(segs[0])) return '/' + segs.slice(1).join('/');
  return pathname || '/';
};

// Translate + locale-prefix an internal path for the given language. Leaves
// admin/external/anchor links untouched. Idempotent for already-prefixed paths.
export const localizedPath = (path, lang = DEFAULT_LOCALE) => {
  if (!path || typeof path !== 'string') return path;
  if (isExternal(path) || !path.startsWith('/')) return path;
  if (path.startsWith('/admin')) return path;

  let segs = path.split('/').filter(Boolean);
  if (isLocale(segs[0])) segs = segs.slice(1); // re-localize an already-prefixed path
  if (segs.length === 0) return `/${lang}`;
  const [first, ...rest] = segs;
  return `/${lang}/${[segToLang(first, lang), ...rest].join('/')}`;
};

// hreflang alternates for the current pathname: { tr, en }.
export const alternates = (pathname = '/') => {
  const bare = stripLocale(pathname) || '/';
  return {
    tr: localizedPath(bare, 'tr'),
    en: localizedPath(bare, 'en'),
  };
};

// Pick a sensible default locale on first visit (no URL prefix yet).
export const detectLocale = () => {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const stored = window.localStorage.getItem('i18nextLng');
    if (isLocale(stored)) return stored;
  } catch { /* ignore */ }
  const nav = (typeof navigator !== 'undefined' && navigator.language || '').slice(0, 2);
  return isLocale(nav) ? nav : DEFAULT_LOCALE;
};
