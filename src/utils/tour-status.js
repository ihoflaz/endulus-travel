// Date-only helpers (no time): compare against the start of today.
const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// Has this date already passed (strictly before today)?
const hasPassed = (v) => {
  if (!v) return false;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return false;
  return d < startOfToday();
};

const ms = (v) => (v ? new Date(v).getTime() || 0 : 0);

// Upcoming (not-yet-ended) departures from a tour's departure calendar,
// sorted soonest-first. Returns [] when the tour has no departures array.
export const upcomingDepartures = (tour) => {
  const deps = Array.isArray(tour?.departures) ? tour.departures : [];
  return deps
    .filter((d) => d && (d.startDate || d.endDate || d.label))
    .filter((d) => !hasPassed(d.endDate || d.startDate))
    .sort((a, b) => (ms(a.startDate || a.endDate) || Infinity) - (ms(b.startDate || b.endDate) || Infinity));
};

// The soonest upcoming departure, or null.
export const nextDeparture = (tour) => upcomingDepartures(tour)[0] || null;

// A tour is "past" once it can no longer be joined. When a departure calendar
// exists it wins: the tour is past only when every departure has ended. Without
// departures we fall back to the single startDate/endDate window. Tours with
// neither are evergreen (never auto-past).
export const isPastTour = (tour) => {
  if (!tour) return false;
  const deps = Array.isArray(tour.departures) ? tour.departures.filter((d) => d && (d.startDate || d.endDate)) : [];
  if (deps.length) return upcomingDepartures(tour).length === 0;
  const ref = tour.endDate || tour.startDate;
  if (!ref) return false;
  return hasPassed(ref);
};

// Best date value to sort an upcoming tour by: its soonest upcoming departure,
// else its own startDate.
const sortKey = (t) => {
  const nd = nextDeparture(t);
  return ms(nd?.startDate || nd?.endDate) || ms(t.startDate) || Infinity;
};

// Split a tour list into upcoming/evergreen vs past, each sorted sensibly:
// upcoming by soonest start first; past by most-recent end first.
export const partitionTours = (list = []) => {
  const past = [];
  const upcoming = [];
  for (const t of list) (isPastTour(t) ? past : upcoming).push(t);
  upcoming.sort((a, b) => sortKey(a) - sortKey(b));
  past.sort((a, b) => ms(b.endDate || b.startDate) - ms(a.endDate || a.startDate));
  return { past, upcoming };
};
