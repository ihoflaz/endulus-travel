import { useData } from './useData';

export const useCategories = () => {
  const { data, isLoading, error } = useData('data/categories.json');
  return { categories: data, isLoading, error };
};

export const useServices = () => {
  const { data, isLoading, error } = useData('data/services.json');
  return { services: data, isLoading, error };
};

export const useHeroData = () => {
  const { data, isLoading, error } = useData('data/hero.json');
  return { heroData: data, isLoading, error };
};

export const useFormOptions = () => {
  const { data, isLoading, error } = useData('data/form-options.json');
  return { formOptions: data, isLoading, error };
};

export const useContactData = () => {
  const { data, isLoading, error } = useData('data/contact.json');
  return { contactData: data, isLoading, error };
};

// Settings hooks — these hit /api/settings/<key>
export const useSetting = (key) => {
  const { data, isLoading, error } = useData(key ? `/api/settings/${key}` : null);
  return { value: data, isLoading, error };
};

export const useSiteSettings = () => useSetting('site');
export const useFooterSettings = () => useSetting('footer');
export const useWhatsAppSettings = () => useSetting('whatsapp');
export const useAboutSetting = () => useSetting('about');
