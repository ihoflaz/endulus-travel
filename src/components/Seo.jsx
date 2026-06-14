import { useEffect } from 'react';
import { useSiteSettings } from '../hooks/useAppData';

const setMeta = (selector, attrName, attrValue, content) => {
  if (typeof document === 'undefined' || !content) return null;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  const prev = el.getAttribute('content');
  el.setAttribute('content', content);
  return () => {
    if (prev !== null) el.setAttribute('content', prev);
    else el.parentNode?.removeChild(el);
  };
};

const setLink = (rel, href) => {
  if (typeof document === 'undefined' || !href) return null;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  const prev = el.getAttribute('href');
  el.href = href;
  return () => {
    if (prev !== null) el.setAttribute('href', prev);
    else el.parentNode?.removeChild(el);
  };
};

// Lightweight head manager — sets title + description + OG/Twitter cards +
// canonical without pulling in react-helmet. Falls back to /api/settings/site
// when individual props aren't provided.
const Seo = ({ title, description, image, url, type = 'website', noindex = false, jsonLd }) => {
  const { value: site } = useSiteSettings();

  useEffect(() => {
    const resolvedTitle = title || site?.title;
    const resolvedDesc = description || site?.description;
    const resolvedImage = image || site?.ogImage;
    const resolvedUrl = url || (typeof window !== 'undefined' ? window.location.href : null);

    const cleanups = [];
    if (resolvedTitle) {
      const prevTitle = document.title;
      document.title = resolvedTitle;
      cleanups.push(() => { document.title = prevTitle; });
    }
    cleanups.push(setMeta('meta[name="description"]', 'name', 'description', resolvedDesc));
    cleanups.push(setMeta('meta[property="og:title"]', 'property', 'og:title', resolvedTitle));
    cleanups.push(setMeta('meta[property="og:description"]', 'property', 'og:description', resolvedDesc));
    cleanups.push(setMeta('meta[property="og:image"]', 'property', 'og:image', resolvedImage));
    cleanups.push(setMeta('meta[property="og:url"]', 'property', 'og:url', resolvedUrl));
    cleanups.push(setMeta('meta[property="og:type"]', 'property', 'og:type', type));
    cleanups.push(setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image'));
    cleanups.push(setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', resolvedTitle));
    cleanups.push(setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', resolvedDesc));
    cleanups.push(setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', resolvedImage));
    cleanups.push(setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow'));
    cleanups.push(setLink('canonical', resolvedUrl));

    // JSON-LD: append a single <script type="application/ld+json"> block.
    let ldScript = null;
    if (jsonLd) {
      ldScript = document.createElement('script');
      ldScript.type = 'application/ld+json';
      ldScript.dataset.seo = '1';
      try { ldScript.textContent = JSON.stringify(jsonLd); }
      catch { ldScript.textContent = '{}'; }
      document.head.appendChild(ldScript);
    }

    return () => {
      cleanups.forEach((c) => c && c());
      if (ldScript) ldScript.parentNode?.removeChild(ldScript);
    };
  }, [title, description, image, url, type, noindex, jsonLd, site]);

  return null;
};

export default Seo;
