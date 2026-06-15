// Returns a tour with its localized fields applied for the active language.
//
// Base columns (title, description, itinerary, ...) hold the Turkish content.
// `tour.translations[lng]` may override any of them. Only non-empty overrides
// are applied, so a partially-translated tour gracefully falls back to Turkish
// field-by-field. For 'tr' (or no translations) the tour is returned as-is.

const LOCALIZABLE = [
  'title', 'description', 'priceNote', 'duration', 'dates',
  'groupSize', 'destination', 'highlights', 'included', 'notIncluded',
  'itinerary', 'faq',
];

const hasValue = (v) => {
  if (v == null) return false;
  if (typeof v === 'string') return v.trim() !== '';
  if (Array.isArray(v)) return v.length > 0;
  return true;
};

export const localizeTour = (tour, lng) => {
  if (!tour || !lng || lng === 'tr') return tour;
  const overrides = tour.translations && tour.translations[lng];
  if (!overrides || typeof overrides !== 'object') return tour;
  const out = { ...tour };
  for (const field of LOCALIZABLE) {
    if (hasValue(overrides[field])) out[field] = overrides[field];
  }
  return out;
};
