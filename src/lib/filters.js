import { facilityById } from '../data/properties.js';

const fac = (id, tone = 'brand') => ({
  id,
  label: facilityById[id].label,
  icon: facilityById[id].icon === 'check' ? 'key' : facilityById[id].icon,
  tone,
  on: (f) => f.fac.includes(id),
  patch: (f) => ({ fac: f.fac.includes(id) ? f.fac.filter((x) => x !== id) : [...f.fac, id] }),
});

/** Every quick filter, shared by the results chip row and the Popular filters tiles. */
export const quickFilters = [
  { id: 'breakfast', label: 'Breakfast included', icon: 'coffee', tone: 'brand', on: (f) => f.breakfast, patch: (f) => ({ breakfast: !f.breakfast }) },
  { id: 'freeCancel', label: 'Free cancellation', icon: 'calendar', tone: 'success', on: (f) => f.freeCancel, patch: (f) => ({ freeCancel: !f.freeCancel }) },
  { id: 'rating8', label: '8+ rating', icon: 'star', tone: 'rating', on: (f) => f.rating >= 8, patch: (f) => ({ rating: f.rating >= 8 ? 0 : 8 }) },
  fac('parking'),
  fac('pool'),
  fac('wifi'),
  fac('pets'),
  fac('kitchen'),
  fac('spa'),
  fac('gym'),
  { id: 'noPrepay', label: 'No prepayment', icon: 'wallet', tone: 'brand', on: (f) => f.noPrepay, patch: (f) => ({ noPrepay: !f.noPrepay }) },
];
