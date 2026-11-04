const img = (f) => `${import.meta.env.BASE_URL}img/${f}`;

export const PHOTO_COUNT = 12; // gallery shows "1 / 12"; the design supplies a handful of images, which repeat.

const P = {
  main: img('harbor-main.png'),
  a: img('harbor-thumb-a.png'),
  b: img('harbor-thumb-b.png'),
  queen: img('room-queen.png'),
  king: img('room-king.png'),
  sq: img('harbor-sq.png'),
};

export const facilities = [
  { id: 'wifi', label: 'Free Wi-Fi', icon: 'wifi' },
  { id: 'parking', label: 'Parking', icon: 'parking' },
  { id: 'pool', label: 'Swimming pool', icon: 'pool' },
  { id: 'aircon', label: 'Air conditioning', icon: 'check' },
  { id: 'kitchen', label: 'Kitchen', icon: 'coffee' },
  { id: 'pets', label: 'Pets allowed', icon: 'check' },
  { id: 'gym', label: 'Fitness centre', icon: 'check' },
  { id: 'spa', label: 'Spa', icon: 'check' },
  { id: 'shuttle', label: 'Airport shuttle', icon: 'plane' },
  { id: 'ev', label: 'EV charging', icon: 'check' },
  { id: 'desk', label: '24-hour front desk', icon: 'clock' },
  { id: 'lift', label: 'Lift', icon: 'check' },
  { id: 'family', label: 'Family rooms', icon: 'users' },
  { id: 'access', label: 'Wheelchair accessible', icon: 'check' },
];
export const facilityById = Object.fromEntries(facilities.map((f) => [f.id, f]));

export const placeTypes = ['Any type', 'Entire home', 'Hotel', 'Apartment', 'Private room', 'Guest house', 'Hostel'];
export const reviewScores = [0, 6, 7, 8, 9];
export const distances = [0, 1, 3, 5];
export const sorts = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price (lowest first)' },
  { id: 'price-desc', label: 'Price (highest first)' },
  { id: 'rating', label: 'Guest rating' },
  { id: 'distance', label: 'Distance from center' },
];

const rooms = (kind, a, b) => {
  const hotel = kind === 'Hotel' || kind === 'Guest house';
  return [
    { id: 'queen', name: hotel ? 'Standard Double Room' : kind === 'Hostel' ? 'Private Room' : 'One-bedroom Space', short: hotel ? 'Standard Double' : 'Standard', bed: '1 double bed', sleeps: 2, nightlyDelta: 0, refundable: true, photo: a },
    { id: 'king', name: hotel ? 'Superior King Room' : 'Larger Space with View', short: hotel ? 'Superior King' : 'Larger', bed: '1 king bed', sleeps: 2, nightlyDelta: 30, refundable: false, photo: b },
  ];
};

const make = (p) => ({
  tag: null,
  noPrepay: false,
  stars: 0,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  taxPerNight: 24,
  ...p,
  rooms: p.rooms ?? rooms(p.kind, p.photos[1], p.photos[2]),
  thumb: p.thumb ?? p.photos[0],
});

export const properties = [
  make({
    id: 'harbor', name: 'Harbor House London', kind: 'Hotel', area: 'South Bank', distance: 0.9, rating: 8.9, reviews: 1248, tag: 'Most booked', stars: 4,
    breakfast: true, freeCancel: true, noPrepay: true, nightly: 180, fac: ['wifi', 'aircon', 'desk', 'gym', 'lift', 'access'], pin: { x: 22, y: 58 },
    photos: [P.main, P.a, P.b], thumb: P.sq,
    rooms: [
      { id: 'queen', name: 'Standard Queen Room', short: 'Standard Queen', bed: '1 queen bed', sleeps: 2, nightlyDelta: 0, refundable: true, photo: P.queen },
      { id: 'king', name: 'King Room with View', short: 'King Room', bed: '1 king bed', sleeps: 2, nightlyDelta: 30, refundable: false, photo: P.king },
    ],
  }),
  make({
    id: 'fitz', name: 'Fitzrovia Residence', kind: 'Entire home', area: 'Fitzrovia', distance: 1.4, rating: 8.6, reviews: 932, tag: 'Popular',
    breakfast: true, freeCancel: true, nightly: 173, bedrooms: 2, beds: 3, bathrooms: 1, fac: ['wifi', 'kitchen', 'parking', 'aircon', 'pets', 'family'], pin: { x: 63, y: 22 },
    photos: [P.king, P.a, P.main],
    rooms: [
      { id: 'queen', name: 'One-bedroom Apartment', short: 'One-bedroom', bed: '1 queen bed', sleeps: 2, nightlyDelta: 0, refundable: true, photo: P.king },
      { id: 'king', name: 'Two-bedroom Apartment', short: 'Two-bedroom', bed: '2 queen beds', sleeps: 4, nightlyDelta: 30, refundable: false, photo: P.queen },
    ],
  }),
  make({
    id: 'covent', name: 'Covent Garden Rooms', kind: 'Hotel', area: 'Covent Garden', distance: 0.5, rating: 8.1, reviews: 612, stars: 3,
    breakfast: true, freeCancel: true, noPrepay: true, nightly: 114, fac: ['wifi', 'desk'], pin: { x: 44, y: 48 },
    photos: [P.b, P.queen, P.a],
    rooms: [
      { id: 'queen', name: 'Classic Double Room', short: 'Classic Double', bed: '1 double bed', sleeps: 2, nightlyDelta: 0, refundable: true, photo: P.b },
      { id: 'king', name: 'Superior Room', short: 'Superior', bed: '1 king bed', sleeps: 2, nightlyDelta: 30, refundable: false, photo: P.queen },
    ],
  }),
  make({
    id: 'marylebone', name: 'Marylebone Courtyard', kind: 'Hotel', area: 'Marylebone', distance: 1.8, rating: 9.2, reviews: 2104, tag: 'Top rated', stars: 5,
    breakfast: true, freeCancel: true, noPrepay: true, nightly: 240, taxPerNight: 30, fac: ['wifi', 'pool', 'spa', 'gym', 'aircon', 'desk', 'lift', 'parking', 'ev', 'access', 'shuttle'], pin: { x: 33, y: 33 },
    photos: [P.a, P.main, P.king],
  }),
  make({
    id: 'shoreditch', name: 'Shoreditch Loft', kind: 'Apartment', area: 'Shoreditch', distance: 3.2, rating: 8.4, reviews: 388,
    breakfast: false, freeCancel: true, nightly: 150, bedrooms: 2, bathrooms: 2, beds: 3, fac: ['wifi', 'kitchen', 'pets', 'aircon'], pin: { x: 82, y: 40 },
    photos: [P.queen, P.b, P.a],
  }),
  make({
    id: 'camden', name: 'Camden Guest House', kind: 'Guest house', area: 'Camden Town', distance: 3.8, rating: 7.6, reviews: 274,
    breakfast: true, freeCancel: false, noPrepay: true, nightly: 85, taxPerNight: 12, fac: ['wifi', 'pets', 'family'], pin: { x: 53, y: 8 },
    photos: [P.main, P.queen, P.b],
  }),
  make({
    id: 'kensington', name: 'Kensington Garden Suites', kind: 'Hotel', area: 'Kensington', distance: 4.6, rating: 8.8, reviews: 1431, stars: 4,
    breakfast: false, freeCancel: true, nightly: 220, taxPerNight: 28, fac: ['wifi', 'aircon', 'gym', 'lift', 'desk', 'shuttle', 'parking', 'access'], pin: { x: 8, y: 72 },
    photos: [P.king, P.main, P.a],
  }),
  make({
    id: 'bloomsbury', name: 'Bloomsbury Private Room', kind: 'Private room', area: 'Bloomsbury', distance: 1.1, rating: 8.0, reviews: 156,
    breakfast: false, freeCancel: true, noPrepay: true, nightly: 70, taxPerNight: 12, fac: ['wifi'], pin: { x: 50, y: 33 },
    photos: [P.b, P.king, P.queen],
  }),
  make({
    id: 'greenwich', name: 'Greenwich Riverside Hostel', kind: 'Hostel', area: 'Greenwich', distance: 7.3, rating: 7.9, reviews: 905,
    breakfast: true, freeCancel: false, nightly: 45, taxPerNight: 8, beds: 6, fac: ['wifi', 'desk', 'access'], pin: { x: 92, y: 80 },
    photos: [P.a, P.queen, P.main],
  }),
  make({
    id: 'nottinghill', name: 'Notting Hill Townhouse', kind: 'Entire home', area: 'Notting Hill', distance: 5.0, rating: 9.0, reviews: 521, tag: 'Guest favourite',
    breakfast: false, freeCancel: true, noPrepay: true, nightly: 260, taxPerNight: 30, bedrooms: 3, bathrooms: 2, beds: 4, fac: ['wifi', 'kitchen', 'pets', 'parking', 'family', 'aircon', 'ev'], pin: { x: 6, y: 40 },
    photos: [P.main, P.king, P.a],
  }),
];


// [id, name, kind, area, km from centre, rating, reviews, stars, nightly €, breakfast, freeCancel, noPrepay, facilities, bedrooms, bathrooms, beds, tag]
const more = [
  ['southwark', 'The Southwark Arms', 'Hotel', 'Southwark', 1.2, 8.3, 1876, 3, 128, 1, 1, 1, ['wifi', 'desk', 'lift', 'aircon'], 1, 1, 1, null],
  ['soho', 'Soho Square Hotel', 'Hotel', 'Soho', 0.4, 8.7, 2310, 4, 205, 1, 1, 0, ['wifi', 'desk', 'gym', 'aircon', 'lift'], 1, 1, 1, 'Popular'],
  ['clerkenwell', 'Clerkenwell Mews', 'Apartment', 'Clerkenwell', 1.9, 8.5, 402, 0, 142, 0, 1, 1, ['wifi', 'kitchen', 'aircon'], 1, 1, 2, null],
  ['islington', 'Islington Garden Flat', 'Entire home', 'Islington', 3.1, 8.8, 287, 0, 165, 1, 1, 0, ['wifi', 'kitchen', 'pets', 'family'], 2, 1, 3, 'Guest favourite'],
  ['paddington', 'Paddington Basin Hotel', 'Hotel', 'Paddington', 2.6, 8.0, 1544, 4, 118, 1, 0, 1, ['wifi', 'desk', 'gym', 'lift', 'shuttle'], 1, 1, 1, null],
  ['mayfair', 'Mayfair Grand', 'Hotel', 'Mayfair', 1.0, 9.4, 3120, 5, 295, 1, 1, 1, ['wifi', 'spa', 'pool', 'gym', 'desk', 'lift', 'aircon', 'access'], 1, 1, 1, 'Top rated'],
  ['hackney', 'Hackney Studio', 'Apartment', 'Hackney', 5.4, 8.2, 198, 0, 92, 0, 1, 1, ['wifi', 'kitchen', 'pets'], 1, 1, 1, null],
  ['brixton', 'Brixton Village Rooms', 'Private room', 'Brixton', 5.8, 8.1, 233, 0, 64, 1, 1, 1, ['wifi', 'pets'], 1, 1, 1, null],
  ['stpancras', 'St Pancras Station Inn', 'Hotel', 'King\'s Cross', 2.2, 8.4, 2788, 4, 152, 1, 1, 1, ['wifi', 'desk', 'lift', 'access', 'aircon', 'family'], 1, 1, 1, null],
  ['chelsea', 'Chelsea Bridge Residence', 'Entire home', 'Chelsea', 3.7, 9.1, 144, 0, 250, 0, 1, 0, ['wifi', 'kitchen', 'parking', 'aircon', 'ev'], 3, 2, 4, 'Guest favourite'],
  ['wimbledon', 'Wimbledon Park Lodge', 'Guest house', 'Wimbledon', 9.1, 8.6, 311, 0, 98, 1, 1, 0, ['wifi', 'parking', 'pets', 'family'], 1, 1, 2, null],
  ['canary', 'Canary Wharf Skyline', 'Hotel', 'Canary Wharf', 6.9, 8.5, 1923, 4, 175, 0, 1, 1, ['wifi', 'pool', 'gym', 'desk', 'lift', 'aircon', 'parking'], 1, 1, 1, null],
  ['shoreditchh', 'Shoreditch Backpackers', 'Hostel', 'Shoreditch', 3.4, 8.3, 4120, 0, 38, 0, 1, 1, ['wifi', 'desk'], 1, 1, 8, 'Popular'],
  ['vauxhall', 'Vauxhall Riverside Apartments', 'Apartment', 'Vauxhall', 2.9, 8.2, 356, 0, 135, 0, 0, 1, ['wifi', 'kitchen', 'gym', 'lift', 'parking'], 2, 1, 2, null],
  ['hampstead', 'Hampstead Heath Cottage', 'Entire home', 'Hampstead', 7.2, 9.3, 96, 0, 230, 1, 1, 0, ['wifi', 'kitchen', 'pets', 'parking', 'family'], 3, 2, 4, 'Top rated'],
  ['bermondsey', 'Bermondsey Market Hotel', 'Hotel', 'Bermondsey', 2.4, 8.6, 640, 3, 119, 1, 1, 1, ['wifi', 'desk', 'aircon'], 1, 1, 1, null],
  ['fulham', 'Fulham Broadway Guest House', 'Guest house', 'Fulham', 6.2, 7.8, 428, 0, 76, 1, 0, 1, ['wifi', 'family'], 1, 1, 2, null],
  ['westminster', 'Westminster Abbey View', 'Hotel', 'Westminster', 1.6, 8.9, 2650, 4, 232, 1, 1, 0, ['wifi', 'desk', 'lift', 'gym', 'aircon', 'access'], 1, 1, 1, 'Most booked'],
  ['kingscross', 'King\'s Cross Loft', 'Apartment', 'King\'s Cross', 2.0, 8.7, 217, 0, 158, 0, 1, 1, ['wifi', 'kitchen', 'aircon', 'lift'], 2, 1, 2, null],
  ['richmond', 'Richmond Riverside Rooms', 'Private room', 'Richmond', 12.5, 8.8, 172, 0, 84, 1, 1, 1, ['wifi', 'parking', 'pets'], 1, 1, 1, null],
  ['greenpark', 'Green Park Boutique', 'Hotel', 'Green Park', 1.3, 9.0, 1112, 5, 268, 1, 1, 1, ['wifi', 'spa', 'desk', 'gym', 'lift', 'aircon', 'ev', 'access'], 1, 1, 1, null],
  ['peckham', 'Peckham Rye Rooms', 'Private room', 'Peckham', 6.0, 7.7, 141, 0, 58, 0, 1, 1, ['wifi'], 1, 1, 1, null],
  ['stratford', 'Stratford Olympic Hotel', 'Hotel', 'Stratford', 8.0, 8.1, 3380, 3, 99, 1, 1, 1, ['wifi', 'desk', 'gym', 'lift', 'parking', 'access'], 1, 1, 1, null],
  ['angel', 'Angel Canal Apartment', 'Entire home', 'Angel', 2.7, 8.9, 262, 0, 190, 1, 1, 1, ['wifi', 'kitchen', 'aircon', 'family'], 2, 1, 3, null],
];
const cycle = [[P.queen, P.main, P.b], [P.king, P.a, P.queen], [P.a, P.b, P.king], [P.b, P.king, P.main], [P.main, P.queen, P.a]];
more.forEach(([id, name, kind, area, distance, rating, reviews, stars, nightly, breakfast, freeCancel, noPrepay, fac, bedrooms, bathrooms, beds, tag], i) => {
  properties.push(make({
    id, name, kind, area, distance, rating, reviews, stars, nightly, breakfast: !!breakfast, freeCancel: !!freeCancel, noPrepay: !!noPrepay,
    fac, bedrooms, bathrooms, beds, tag, taxPerNight: Math.max(8, Math.round(nightly * 0.14)),
    pin: { x: (i * 37 + 11) % 97, y: (i * 53 + 17) % 94 },
    photos: cycle[i % cycle.length],
  }));
});

export const byId = (id) => properties.find((p) => p.id === id);

export const destinations = [
  { id: 'london', name: 'London', sub: 'City · United Kingdom', value: 'London, United Kingdom' },
  { id: 'city', name: 'City of London', sub: 'Neighborhood · London, UK', value: 'City of London, UK' },
  { id: 'greater', name: 'Greater London', sub: 'Region · United Kingdom', value: 'Greater London, UK' },
];

export const mapImage = img('map.png');
export const heroImage = img('hero.png');
export const images = P;
