const MS_DAY = 86400000;
export const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
export const nightsBetween = (a, b) => Math.round((b - a) / MS_DAY);

export const money = (n) => `€${n.toLocaleString('en-US')}`;

const wd = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const mo = new Intl.DateTimeFormat('en-US', { month: 'short' });
const long = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });

export const fmtShort = (d) => `${mo.format(d)} ${d.getDate()}`; // Oct 12
export const fmtDay = (d) => `${wd.format(d)}, ${fmtShort(d)}`; // Tue, Oct 12
export const fmtMonth = (d) => long.format(d); // October 2027
export const fmtRange = (a, b) =>
  a.getMonth() === b.getMonth() ? `${fmtShort(a)}–${b.getDate()}` : `${fmtShort(a)} – ${fmtShort(b)}`;
export const fmtCheck = (d) => `${wd.format(d)} ${d.getDate()} ${mo.format(d)}`; // Tue 12 Oct

export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
export const guestsText = (s) =>
  [plural(s.adults, 'adult'), s.children ? plural(s.children, 'child', 'children') : null]
    .filter(Boolean)
    .join(', ') + ` · ${plural(s.rooms, 'room')}`;
export const adultsText = (s) => plural(s.adults + s.children, 'guest');

// ---- pricing -------------------------------------------------------------
export const PAY_NOW = 120;
export const nightsOf = (s) => nightsBetween(s.checkIn, s.checkOut);

export function roomQuote(property, room, nights) {
  const nightly = property.nightly + room.nightlyDelta;
  const roomCost = nightly * nights;
  const taxes = property.taxPerNight * nights;
  const total = roomCost + taxes;
  const payNow = room.refundable ? Math.min(PAY_NOW, total) : total;
  return { nightly, roomCost, taxes, total, payNow, atProperty: total - payNow };
}
export const stayTotal = (property, nights) => roomQuote(property, property.rooms[0], nights).total;
