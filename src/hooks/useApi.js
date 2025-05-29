import { useState, useCallback } from 'react';

/**
 * API istekleri yapmak için kullanılan hook
 * @returns {Object} - { makeRequest, isLoading, error, data } şeklinde dönüş yapar
 */
const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * API isteği yapmak için kullanılan fonksiyon
   * @param {string} url - İstek yapılacak URL
   * @param {Object} options - fetch API için opsiyonlar
   * @returns {Promise} - API isteğinin sonucu
   */
  const makeRequest = useCallback(async (url, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Varsayılan ayarlar
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (error) {
      console.error(`API isteği sırasında hata: ${url}`, error);
      setError(`API isteği sırasında bir hata oluştu: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { makeRequest, isLoading, error, data };
};

export default useApi; 