import { useMemo } from 'react';
import { useData } from './useData';

export const useBlogPosts = () => {
  const { data, isLoading, error } = useData('data/blog.json');
  return { blogPosts: data ?? [], isLoading, error };
};

// Fisher-Yates seeded shuffle (slug-stable so we don't re-shuffle on every render)
const shuffleStable = (arr, seed) => {
  const out = [...arr];
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) | 0;
  const rng = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export const useBlogPost = (slug) => {
  const { data, isLoading, error } = useData('data/blog.json');
  const blogPost = data ? data.find((p) => p.slug === slug) : null;
  const notFound = !isLoading && !error && !blogPost;

  const relatedPosts = useMemo(() => {
    if (!data || !blogPost) return [];
    const sameCategory = data
      .filter((p) => p.slug !== slug && p.category === blogPost.category)
      .slice(0, 2);
    if (sameCategory.length > 0) return sameCategory;
    return shuffleStable(
      data.filter((p) => p.slug !== slug),
      slug
    ).slice(0, 2);
  }, [data, blogPost, slug]);

  return { blogPost, isLoading, error, notFound, relatedPosts };
};

// Detail wrapper — kept for API compatibility with the old hook surface
export const useBlogPostDetail = useBlogPost;
