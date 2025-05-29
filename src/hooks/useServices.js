import { useData } from './useData';
import { useCreateUrl } from './useCreateUrl';
import { useState, useEffect } from 'react';

/**
 * Tüm hizmetleri getiren hook
 * @returns {Object} - { services, isLoading, error } şeklinde dönüş yapar
 */
export const useServices = () => {
  const { data, isLoading, error } = useData('data/services.json');
  
  return {
    services: data,
    isLoading,
    error
  };
};

/**
 * Detay sayfası için belirli bir hizmeti getiren hook
 * @param {string} id - Hizmetin ID değeri
 * @returns {Object} - { service, serviceContent, isLoading, error, notFound } şeklinde dönüş yapar
 */
export const useServiceDetail = (id) => {
  const createUrl = useCreateUrl();
  const [service, setService] = useState(null);
  const [serviceContent, setServiceContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Ana hizmet verisini yükle
        const servicesUrl = createUrl('data/services.json');
        console.log(`Hizmet verisi alınıyor: ${servicesUrl}`);
        
        const servicesResponse = await fetch(servicesUrl);
        if (!servicesResponse.ok) {
          throw new Error('Hizmet verileri yüklenemedi');
        }
        
        const servicesData = await servicesResponse.json();
        const serviceData = servicesData.find(item => item.id === id);
        
        if (!serviceData) {
          setNotFound(true);
          throw new Error('Hizmet bulunamadı');
        }
        
        setService(serviceData);
        
        // Detaylı içerik verisini yükle
        const contentUrl = createUrl('data/service-content.json');
        console.log(`Hizmet içeriği alınıyor: ${contentUrl}`);
        
        const contentResponse = await fetch(contentUrl);
        if (!contentResponse.ok) {
          throw new Error('Hizmet içeriği yüklenemedi');
        }
        
        const contentData = await contentResponse.json();
        setServiceContent(contentData[id] || {
          image: 'images/services/default.jpg',
          fullDescription: 'Bu hizmet hakkında detaylı bilgi çok yakında eklenecektir.',
          features: ['Detaylı özellikler yakında']
        });
      } catch (err) {
        console.error('Hizmet detayı yüklenirken hata:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id, createUrl]);

  return {
    service,
    serviceContent,
    isLoading,
    error,
    notFound
  };
}; 