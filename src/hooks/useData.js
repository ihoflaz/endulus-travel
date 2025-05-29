import { useState, useEffect } from 'react';

/**
 * Genel veri çekme hook'u
 * @param {string} path - Veri çekilecek dosya yolu
 * @param {function} transformFn - [İsteğe bağlı] Veriyi dönüştürmek için fonksiyon
 * @returns {Object} - { data, isLoading, error } şeklinde dönüş yapar
 */
const useData = (path, transformFn = null) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // URL oluşturma - Her durumda çalışacak şekilde ayarlanmış
        let url;
        
        // Tam URL ise direkt kullan
        if (path.startsWith('http')) {
          url = path;
        } else {
          // Path'in başındaki slash'ı kaldır ve base URL ile birleştir
          const cleanPath = path.startsWith('/') ? path.slice(1) : path;
          
          // Eğer import.meta.env.BASE_URL mevcutsa ve boş değilse kullan
          const baseUrl = import.meta.env.BASE_URL && import.meta.env.BASE_URL !== '/' 
            ? (import.meta.env.BASE_URL.endsWith('/') 
                ? import.meta.env.BASE_URL 
                : `${import.meta.env.BASE_URL}/`)
            : './';
            
          url = `${baseUrl}${cleanPath}`;
        }
        
        console.log(`Fetching data from: ${url}`); // Debugging için log
        
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Eğer bir dönüştürme fonksiyonu verildiyse, veriyi dönüştür
        if (transformFn && typeof transformFn === 'function') {
          setData(transformFn(result));
        } else {
          setData(result);
        }
      } catch (error) {
        console.error(`Veri yüklenirken hata: ${path}`, error);
        setError(`Veri yüklenirken bir hata oluştu: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [path, transformFn]);

  return { data, isLoading, error };
};

export { useData }; 