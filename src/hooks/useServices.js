import { useData } from './useData';

export const useServices = () => {
  const { data, isLoading, error } = useData('data/services.json');
  return { services: data ?? [], isLoading, error };
};

/**
 * Returns service + detailed content for a given id (slug-like).
 */
export const useServiceDetail = (id) => {
  const services = useData('data/services.json');
  const content = useData('data/service-content.json');
  const isLoading = services.isLoading || content.isLoading;
  const error = services.error || content.error;
  const service = services.data
    ? services.data.find((s) => s.id === id) ?? null
    : null;
  const notFound = !isLoading && !error && !service;
  const serviceContent = content.data?.[id] || {
    image: '/images/services/default.jpg',
    fullDescription: 'Bu hizmet hakkında detaylı bilgi çok yakında eklenecektir.',
    features: ['Detaylı özellikler yakında'],
  };
  return { service, serviceContent, isLoading, error, notFound };
};
