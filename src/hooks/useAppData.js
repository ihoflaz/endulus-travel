import { useData } from './useData';

/**
 * Kategorileri getiren hook
 * @returns {Object} - { categories, isLoading, error } şeklinde dönüş yapar
 */
export const useCategories = () => {
  const { data, isLoading, error } = useData('data/categories.json');
  
  return {
    categories: data,
    isLoading,
    error
  };
};

/**
 * Hizmetleri getiren hook
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
 * Hero içeriğini getiren hook
 * @returns {Object} - { heroData, isLoading, error } şeklinde dönüş yapar
 */
export const useHeroData = () => {
  const { data, isLoading, error } = useData('data/hero.json');
  
  return {
    heroData: data,
    isLoading,
    error
  };
};

/**
 * Form seçeneklerini getiren hook
 * @returns {Object} - { formOptions, isLoading, error } şeklinde dönüş yapar
 */
export const useFormOptions = () => {
  const { data, isLoading, error } = useData('data/form-options.json');
  
  return {
    formOptions: data,
    isLoading,
    error
  };
};

/**
 * İletişim bilgilerini getiren hook
 * @returns {Object} - { contactData, isLoading, error } şeklinde dönüş yapar
 */
export const useContactData = () => {
  const { data, isLoading, error } = useData('data/contact.json');
  
  return {
    contactData: data,
    isLoading,
    error
  };
}; 