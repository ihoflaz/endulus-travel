// Generic data fetcher
export { useData } from './useData';

// Blog hooks
export { useBlogPosts, useBlogPost, useBlogPostDetail } from './useBlog';

// About hook
export { default as useAbout } from './useAbout';

// Tours hooks
export { useTours, useTour, useTourDetail } from './useTours';

// Services hooks
export { useServices, useServiceDetail } from './useServices';

// URL helper
export { useCreateUrl } from './useCreateUrl';

// App-wide data hooks
export {
  useCategories,
  useServices as useAppServices,
  useHeroData,
  useFormOptions,
  useContactData,
} from './useAppData';

// Admin CRUD hook
export { useCrudResource } from './useCrudResource';
