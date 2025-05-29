import { useData } from './useData';

/**
 * Hakkımızda sayfası verilerini getiren hook
 * @returns {Object} - { aboutData, isLoading, error } şeklinde dönüş yapar
 */
const useAbout = () => {
  const { data, isLoading, error } = useData('data/about.json');
  
  return {
    aboutData: data,
    isLoading,
    error
  };
};

export default useAbout; 