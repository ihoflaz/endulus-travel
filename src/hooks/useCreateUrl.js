import { useCallback } from 'react';

/**
 * Build a same-origin URL for a relative path. Backend /data/*.json routes are
 * served by nginx (prod) or the Vite proxy (dev), so we just need an
 * origin-relative URL.
 */
export const useCreateUrl = () => {
  return useCallback((path) => {
    if (typeof path !== 'string') return path;
    if (path.startsWith('http')) return path;
    const clean = path.startsWith('/') ? path.slice(1) : path;
    return `/${clean}`;
  }, []);
};
