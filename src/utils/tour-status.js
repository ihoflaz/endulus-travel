// A tour is "past" once its departure window has ended. Date-only (no time)
// so we compare against the start of today. Tours without a structured
// endDate/startDate are evergreen (never auto-past).
export const isPastTour = (tour) => {
  if (!tour) return false;
  const ref = tour.endDate || tour.startDate;
  if (!ref) return false;
  const end = new Date(ref);
  if (Number.isNaN(end.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return end < today;
};

const ms = (v) => (v ? new Date(v).getTime() || 0 : 0);

// Split a tour list into upcoming/evergreen vs past, each sorted sensibly:
// upcoming by soonest start first; past by most-recent end first.
export const partitionTours = (list = []) => {
  const past = [];
  const upcoming = [];
  for (const t of list) (isPastTour(t) ? past : upcoming).push(t);
  upcoming.sort((a, b) => (ms(a.startDate) || Infinity) - (ms(b.startDate) || Infinity));
  past.sort((a, b) => ms(b.endDate || b.startDate) - ms(a.endDate || a.startDate));
  return { past, upcoming };
};
