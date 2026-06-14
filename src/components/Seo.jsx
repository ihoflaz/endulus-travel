import { useEffect } from 'react';
import { useSiteSettings } from '../hooks/useAppData';

// Upserts a <meta>/<link> with the given content. Last-writer-wins: we never
// restore previous values on cleanup, because in an SPA two <Seo> instances
// overlap during a route change and restoring the old value would clobber the
// new page's tags. Each page that cares sets its own values; pages that don't
// keep whatever the last page set (acceptable — social scrapers read the static
// index.html, not these runtime tags).
const upsertMeta = (attr, key, content) => {
  if (typeof document === 'undefined' || content == null || content === '') return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const upsertLink = (rel, href) => {
  if (typeof document === 'undefined' || !href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
};

// JSON-LD: keep a single managed <script data-seo-jsonld> and rewrite its body.
const upsertJsonLd = (obj) => {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector('script[data-seo-jsonld]');
  if (!obj) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-seo-jsonld', '');
    document.head.appendChild(el);
  }
  try { el.textContent = JSON.stringify(obj); } catch { el.textContent = '{}'; }
};

// Lightweight head manager — title + description + OG/Twitter + canonical +
// JSON-LD without react-helmet. Falls back to /api/settings/site for site-wide
// title/description/ogImage when individual props aren't supplied.
//
// IMPORTANT: callers passing `jsonLd` should memoize it (useMemo) — the effect
// keys on a serialized form to avoid re-running on every parent render.
const Seo = ({ title, description, image, type = 'website', noindex = false, jsonLd }) => {
  const { value: site } = useSiteSettings();
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const resolvedTitle = title || site?.title;
    const resolvedDesc = description || site?.description;
    const resolvedImage = image || site?.ogImage;
    // Canonical / og:url WITHOUT query string (strips UTM → no duplicate-content)
    const cleanUrl = typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : null;

    if (resolvedTitle) document.title = resolvedTitle;
    upsertMeta('name', 'description', resolvedDesc);
    upsertMeta('property', 'og:title', resolvedTitle);
    upsertMeta('property', 'og:description', resolvedDesc);
    upsertMeta('property', 'og:image', resolvedImage);
    upsertMeta('property', 'og:url', cleanUrl);
    upsertMeta('property', 'og:type', type);
    upsertMeta('name', 'twitter:title', resolvedTitle);
    upsertMeta('name', 'twitter:description', resolvedDesc);
    upsertMeta('name', 'twitter:image', resolvedImage);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertLink('canonical', cleanUrl);
    upsertJsonLd(jsonLd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, type, noindex, jsonLdKey, site]);

  return null;
};

export default Seo;
