import { useMemo } from 'react';
import { useData } from './useData';

// The /data/tours.json endpoint returns { featured: [...] }. We unwrap it once
// here so every consumer can rely on `tours` being an array.
const useToursRaw = () => useData('data/tours.json');

/**
 * @param {Object} [filters] optional filter object passed to filterTours
 * @returns {{ tours, filteredTours, isLoading, error }}
 */
export const useTours = (filters = null) => {
  const { data, isLoading, error } = useToursRaw();
  const tours = data?.featured ?? [];
  const filteredTours = useMemo(
    () => (filters ? filterTours(tours, filters) : tours),
    [tours, filters]
  );
  return { tours, filteredTours, isLoading, error };
};

export const useTour = (slug) => {
  const { tours, isLoading, error } = useTours();
  const tour = slug ? tours.find((t) => t.slug === slug) || null : null;
  const notFound = !isLoading && !error && slug && !tour;
  return { tour, isLoading, error, notFound };
};

export const useTourDetail = (slug) => {
  const { tours, isLoading, error } = useTours();
  const tour = slug ? tours.find((t) => t.slug === slug) || null : null;
  const notFound = !isLoading && !error && slug && !tour;
  const relatedTours = useMemo(() => {
    if (!tour || !tour.category) return [];
    // Without a category we can't compute "related"; otherwise this matched
    // every tour because `undefined === undefined`.
    return tours
      .filter((t) => t.category === tour.category && t.slug !== tour.slug)
      .slice(0, 3);
  }, [tours, tour]);
  return { tour, relatedTours, isLoading, error, notFound };
};

// Filter tours by category / numeric price range / duration. Reads
// pricePerPerson (number) not the legacy `price` string.
const filterTours = (tours, filters) =>
  tours.filter((tour) => {
    if (filters.category && filters.category !== 'all') {
      if (tour.category !== filters.category) return false;
    }
    if (filters.type && filters.type !== 'all') {
      if (tour.type !== filters.type) return false;
    }
    if (filters.minPrice != null && filters.maxPrice != null) {
      const price = tour.pricePerPerson;
      if (price == null) return false;
      if (price < filters.minPrice || price > filters.maxPrice) return false;
    }
    if (filters.duration && filters.duration !== 'all') {
      // tour.duration is a free-form string like "7 gün / 6 gece" — extract
      // first integer and compare to filter days.
      const m = String(tour.duration ?? '').match(/\d+/);
      const days = m ? Number(m[0]) : null;
      if (days !== Number(filters.duration)) return false;
    }
    return true;
  });
