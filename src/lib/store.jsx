import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { properties } from '../data/properties.js';
import { roomQuote, nightsOf, stayTotal } from './format.js';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export const PRICE_DEFAULT = [0, 1000]; // no price limit until the user narrows it
export const PRICE_BOUNDS = [0, 1000];

export const DEFAULT_FILTERS = {
  breakfast: true,
  freeCancel: true,
  noPrepay: false,
  rating: 0, // minimum guest score, 0 = any
  types: ['Any type'],
  price: PRICE_DEFAULT,
  bedrooms: 0,
  bathrooms: 0,
  stars: [],
  fac: [],
  distance: 0, // max km from centre, 0 = any
};
export const CLEAR_FILTERS = { ...DEFAULT_FILTERS, breakfast: false, freeCancel: false };

const initial = {
  screen: 'home',
  destination: 'London',
  destinationFull: 'London, United Kingdom',
  checkIn: new Date(2027, 9, 12),
  checkOut: new Date(2027, 9, 15),
  flex: 'exact',
  adults: 2,
  children: 0,
  childAges: [],
  rooms: 1,
  filters: DEFAULT_FILTERS,
  sort: 'recommended',
  saved: ['fitz', 'covent'],
  compareSel: [],
  propertyId: 'harbor',
  roomId: 'queen',
  transfer: false,
  guest: { first: 'Alex', last: 'Morgan', email: 'alex@example.com' },
  pay: { method: 'card', name: 'Alex Morgan', number: '4111 1111 1111 1111', expiry: '', cvc: '' },
  booking: null,
  searchKey: 0,
  addons: { taxi: false, car: false },
  profileSub: 'personal',
  notif: { deals: true, trips: true, messages: true, news: false },
  recent: ['harbor', 'marylebone', 'nottinghill'],
};

export function activeFilterCount(f) {
  return (
    ['breakfast', 'freeCancel', 'noPrepay'].filter((k) => f[k]).length +
    (f.rating > 0 ? 1 : 0) +
    (f.types.includes('Any type') ? 0 : 1) +
    (f.price[0] !== PRICE_DEFAULT[0] || f.price[1] !== PRICE_DEFAULT[1] ? 1 : 0) +
    (f.bedrooms > 0 ? 1 : 0) +
    (f.bathrooms > 0 ? 1 : 0) +
    (f.stars.length ? 1 : 0) +
    f.fac.length +
    (f.distance > 0 ? 1 : 0)
  );
}

export function filterProperties(s, filters = s.filters) {
  const f = filters;
  const nights = nightsOf(s);
  const out = properties.filter((p) => {
    if (f.breakfast && !p.breakfast) return false;
    if (f.freeCancel && !p.freeCancel) return false;
    if (f.noPrepay && !p.noPrepay) return false;
    if (f.rating && p.rating < f.rating) return false;
    if (!f.types.includes('Any type') && !f.types.includes(p.kind)) return false;
    if (f.bedrooms && p.bedrooms < f.bedrooms) return false;
    if (f.bathrooms && p.bathrooms < f.bathrooms) return false;
    if (f.stars.length && !f.stars.includes(p.stars)) return false;
    if (f.fac.some((id) => !p.fac.includes(id))) return false;
    if (f.distance && p.distance > f.distance) return false;
    const t = stayTotal(p, nights);
    return t >= f.price[0] && t <= f.price[1];
  });
  const total = (p) => stayTotal(p, nights);
  const sorters = {
    recommended: () => 0,
    'price-asc': (a, b) => total(a) - total(b),
    'price-desc': (a, b) => total(b) - total(a),
    rating: (a, b) => b.rating - a.rating,
    distance: (a, b) => a.distance - b.distance,
  };
  return [...out].sort(sorters[s.sort] ?? sorters.recommended);
}

export function currentQuote(s) {
  const property = properties.find((p) => p.id === s.propertyId);
  const room = property.rooms.find((r) => r.id === s.roomId) ?? property.rooms[0];
  return { property, room, nights: nightsOf(s), ...roomQuote(property, room, nightsOf(s)) };
}

export function AppProvider({ children }) {
  const [s, setS] = useState(() => ({ ...initial, screen: 'home' }));
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  const set = useCallback((patch) => setS((p) => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) })), []);

  const go = useCallback((screen, opts = {}) => {
    setS((p) => ({ ...p, screen }));
    if (opts.replace) history.replaceState({ screen }, '');
    else history.pushState({ screen }, '');
  }, []);

  const back = useCallback(() => history.back(), []);

  useEffect(() => {
    history.replaceState({ screen: 'home' }, '');
    const onPop = (e) => setS((p) => ({ ...p, screen: e.state?.screen ?? 'home' }));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const showToast = useCallback((message, action) => {
    clearTimeout(toastTimer.current);
    setToast({ message, action, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);
  const hideToast = useCallback(() => setToast(null), []);

  const toggleSaved = useCallback(
    (id, name) => {
      setS((p) => {
        const was = p.saved.includes(id);
        const saved = was ? p.saved.filter((x) => x !== id) : [...p.saved, id];
        return { ...p, saved, compareSel: p.compareSel.filter((x) => saved.includes(x)) };
      });
      const wasSaved = s.saved.includes(id);
      if (wasSaved)
        showToast(`${name} removed from wishlist`, {
          label: 'Undo',
          run: () => setS((p) => (p.saved.includes(id) ? p : { ...p, saved: [...p.saved, id] })),
        });
      else showToast(`${name} saved to wishlist`);
    },
    [s.saved, showToast],
  );

  const openProperty = useCallback(
    (id) => {
      setS((p) => ({ ...p, propertyId: id, roomId: 'queen', recent: [id, ...p.recent.filter((x) => x !== id)].slice(0, 8), screen: 'details' }));
      history.pushState({ screen: 'details' }, '');
    },
    [],
  );

  /** Start a search from a preset (seasonal suggestions, stay-type tiles, recent searches). */
  const searchWith = useCallback((patch = {}, filters = {}) => {
    setS((p) => ({ ...p, ...patch, filters: { ...CLEAR_FILTERS, ...filters }, sort: 'recommended', searchKey: p.searchKey + 1, screen: 'results' }));
    history.pushState({ screen: 'results' }, '');
  }, []);

  const value = useMemo(
    () => ({ s, set, go, back, toast, showToast, hideToast, toggleSaved, openProperty, searchWith }),
    [s, set, go, back, toast, showToast, hideToast, toggleSaved, openProperty, searchWith],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
