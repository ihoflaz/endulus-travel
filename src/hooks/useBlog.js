import { useData } from './useData';
import { useCreateUrl } from './useCreateUrl';
import { useState, useEffect } from 'react';

/**
 * Tüm blog yazılarını getiren hook
 * @returns {Object} - { blogPosts, isLoading, error } şeklinde dönüş yapar
 */
export const useBlogPosts = () => {
  const { data, isLoading, error } = useData('data/blog.json');
  
  return {
    blogPosts: data,
    isLoading,
    error
  };
};

/**
 * Belirli bir blog yazısını slug'a göre getiren hook
 * @param {string} slug - Blog yazısının slug değeri
 * @returns {Object} - { blogPost, isLoading, error, notFound, relatedPosts } şeklinde dönüş yapar
 */
export const useBlogPost = (slug) => {
  const { data, isLoading, error } = useData('data/blog.json');
  
  // Slug parametresi ile eşleşen blog yazısını bul
  const blogPost = data ? data.find(post => post.slug === slug) : null;
  
  // Blog yazısı bulunamadıysa notFound değerini true olarak ayarla
  const notFound = !isLoading && !error && !blogPost;
  
  // İlgili blog yazılarını getir (aynı kategorideki diğer yazılar)
  const relatedPosts = data && blogPost
    ? data
        .filter(post => post.slug !== slug && post.category === blogPost.category)
        .slice(0, 2) // En fazla 2 ilgili yazı göster
    : [];
  
  // Eğer aynı kategoride başka yazı yoksa, rastgele 2 yazı göster
  const randomPosts = data && relatedPosts.length === 0 && blogPost
    ? data
        .filter(post => post.slug !== slug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
    : [];
  
  return {
    blogPost,
    isLoading,
    error,
    notFound,
    relatedPosts: relatedPosts.length > 0 ? relatedPosts : randomPosts
  };
};

/**
 * Detay sayfası için belirli bir blog yazısını ve ilgili yazıları getiren hook
 * @param {string} slug - Blog yazısının slug değeri
 * @returns {Object} - { blogPost, relatedPosts, isLoading, error, notFound } şeklinde dönüş yapar
 */
export const useBlogPostDetail = (slug) => {
  const createUrl = useCreateUrl();
  const [blogPost, setBlogPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchBlogPostDetails = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        
        // JSON dosyasından veri çekiyoruz (useCreateUrl hook'unu kullanarak)
        const url = createUrl('data/blog.json');
        console.log(`Blog verisi alınıyor: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Blog yazıları yüklenemedi');
        }
        
        const data = await response.json();
        
        // Slug'a göre blog yazısını bul
        const foundPost = data.find(post => post.slug === slug);
        
        if (!foundPost) {
          setNotFound(true);
          throw new Error('Blog yazısı bulunamadı');
        }
        
        setBlogPost(foundPost);
        
        // İlgili yazıları bul (aynı kategorideki diğer yazılar)
        const postCategory = foundPost.category;
        
        // İlgili yazılar - aynı kategoride
        const related = data
          .filter(post => post.slug !== slug && post.category === postCategory)
          .slice(0, 2); // En fazla 2 ilgili yazı göster
        
        // Eğer aynı kategoride yazı yoksa rastgele göster
        const randomPosts = related.length === 0
          ? data
              .filter(post => post.slug !== slug)
              .sort(() => 0.5 - Math.random())
              .slice(0, 2)
          : [];
        
        setRelatedPosts(related.length > 0 ? related : randomPosts);
      } catch (err) {
        console.error('Blog detayı yüklenirken hata:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPostDetails();
  }, [slug, createUrl]);

  return {
    blogPost,
    relatedPosts,
    isLoading,
    error,
    notFound
  };
}; 