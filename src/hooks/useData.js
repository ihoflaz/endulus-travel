import { useState, useEffect, useRef } from 'react';

// Maps legacy "data/X.json" paths to backend endpoints. The backend's
// /data/*.json routes return the exact same JSON shape the public site
// originally consumed, so most callers don't need to change.
const resolveUrl = (path) => {
  if (path.startsWith('http')) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  if (clean.startsWith('data/')) {
    return `/${clean}`;
  }
  return `/${clean}`;
};

/**
 * Generic data fetcher used by the public hooks.
 * - Aborts on unmount / dep change to avoid setState on unmounted components.
 * - Does not retry refresh-on-401 (those endpoints are public).
 *
 * @param {string} path  e.g. "data/tours.json"
 * @param {function} [transformFn]  optional response transformer
 * @returns {{data, isLoading, error}}
 */
const useData = (path, transformFn = null) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Keep transformFn in a ref so callers can pass inline functions without
  // triggering a refetch loop.
  const transformRef = useRef(transformFn);
  transformRef.current = transformFn;

  useEffect(() => {
    if (!path) return undefined;
    const abort = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(resolveUrl(path), {
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
          },
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        setData(transformRef.current ? transformRef.current(json) : json);
      } catch (e) {
        if (e?.name === 'AbortError' || cancelled) return;
        setError(`Veri yüklenirken bir hata oluştu: ${e.message}`);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      abort.abort();
    };
  }, [path]);

  return { data, isLoading, error };
};

export { useData };
