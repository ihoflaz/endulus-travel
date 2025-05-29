import { useData } from './useData';
import { useCreateUrl } from './useCreateUrl';
import { useState, useEffect } from 'react';

/**
 * Tüm turları getiren hook
 * @param {Object} filters - [İsteğe bağlı] Turları filtrelemek için parametreler
 * @returns {Object} - { tours, filteredTours, isLoading, error } şeklinde dönüş yapar
 */
export const useTours = (filters = null) => {
  const { data, isLoading, error } = useData('data/tours.json');
  
  // Eğer filtre parametreleri verildiyse, turları filtrele
  const filteredTours = !isLoading && data && filters 
    ? filterTours(data, filters) 
    : data;
  
  return {
    tours: data,
    filteredTours,
    isLoading,
    error
  };
};

/**
 * Belirli bir turu slug'a göre getiren hook
 * @param {string} slug - Turun slug değeri
 * @returns {Object} - { tour, isLoading, error, notFound } şeklinde dönüş yapar
 */
export const useTour = (slug) => {
  const { data, isLoading, error } = useData('data/tours.json');
  
  // Slug parametresi ile eşleşen turu bul
  const tour = data ? data.find(tour => tour.slug === slug) : null;
  
  // Tur bulunamadıysa notFound değerini true olarak ayarla
  const notFound = !isLoading && !error && !tour;
  
  return {
    tour,
    isLoading,
    error,
    notFound
  };
};

/**
 * Detay sayfası için belirli bir turu ve ilgili turları getiren hook
 * @param {string} slug - Turun slug değeri
 * @returns {Object} - { tour, relatedTours, isLoading, error, notFound } şeklinde dönüş yapar
 */
export const useTourDetail = (slug) => {
  const createUrl = useCreateUrl();
  const [tour, setTour] = useState(null);
  const [relatedTours, setRelatedTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchTourDetails = async () => {
      if (!slug) return;
      
      try {
        setIsLoading(true);
        
        // JSON dosyasından veri çekiyoruz (useCreateUrl hook'unu kullanarak)
        const url = createUrl('data/tours.json');
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Tur verileri yüklenemedi');
        }
        
        const data = await response.json();
        
        // Slug'a göre turu bul
        const foundTour = data.featured.find(t => t.slug === slug);
        
        if (!foundTour) {
          setNotFound(true);
          throw new Error('Tur bulunamadı');
        }
        
        setTour(foundTour);
        
        // İlgili turları bul (aynı kategorideki diğer turlar)
        const tourCategory = foundTour.category;
        const related = data.featured
          .filter(t => t.category === tourCategory && t.id !== foundTour.id)
          .slice(0, 3); // En fazla 3 ilgili tur göster
        
        setRelatedTours(related);
      } catch (err) {
        console.error('Tur detayı yüklenirken hata:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourDetails();
  }, [slug, createUrl]);

  return {
    tour,
    relatedTours,
    isLoading,
    error,
    notFound
  };
};

/**
 * Turları filtreleme yardımcı fonksiyonu
 * @param {Array} tours - Filtrelenecek turlar dizisi
 * @param {Object} filters - Filtre parametreleri
 * @returns {Array} - Filtrelenmiş turlar dizisi
 */
const filterTours = (tours, filters) => {
  return tours.filter(tour => {
    let match = true;
    
    // Kategori filtreleme
    if (filters.category && filters.category !== 'all') {
      match = match && tour.category === filters.category;
    }
    
    // Fiyat aralığı filtreleme
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      const price = parseInt(tour.price);
      match = match && (price >= filters.minPrice && price <= filters.maxPrice);
    }
    
    // Süre filtreleme
    if (filters.duration && filters.duration !== 'all') {
      match = match && tour.duration === parseInt(filters.duration);
    }
    
    return match;
  });
}; 