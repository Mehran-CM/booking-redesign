import { useEffect, useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { Badge, Button, Header, Section } from '../components/Layout.jsx';
import { IconButton } from '../components/Button.jsx';
import PriceDetails from '../components/Price.jsx';
import Icon from '../components/Icon.jsx';
import { heroImage } from '../data/properties.js';
import { fmtCheck, fmtRange, guestsText, money, plural } from '../lib/format.js';

const CONF = '4821 337 905 · 5824';
const ics = (b) => {
  const d = (x) => `${x.getFullYear()}${String(x.getMonth() + 1).padStart(2, '0')}${String(x.getDate()).padStart(2, '0')}`;
  return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Stay at ${b.property.name}\nDTSTART;VALUE=DATE:${d(b.checkIn)}\nDTEND;VALUE=DATE:${d(b.checkOut)}\nLOCATION:${b.property.area}\\, London\nEND:VEVENT\nEND:VCALENDAR`;
};

export default function Confirmed() {
  const { s, set, go, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [details, setDetails] = useState(false);
  const b = s.booking;
  useEffect(() => { if (!b) go('home', { replace: true }); }, [b, go]);
  if (!b) return null;
  const nights = b.quote.nights;

  const copy = async () => {
    try { await navigator.clipboard.writeText(CONF.replace(/[^\d]/g, ' ').replace(/\s+/g, ' ').trim()); } catch { /* clipboard may be blocked */ }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const addCal = () => {
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([ics(b)], { type: 'text/calendar' })), download: 'stay.ics' });
    a.click(); showToast('Calendar event downloaded.');
  };
  const share = async () => {
    const text = `${b.property.name}, ${fmtRange(b.checkIn, b.checkOut)}`;
    try { navigator.share ? await navigator.share({ title: 'My trip', text }) : (await navigator.clipboard.writeText(text), showToast('Trip details copied.')); } catch { /* cancelled */ }
  };
  const prep = [
    ['calendar', 'Add to calendar', addCal],
    ['pin', 'Get directions to the property', () => window.open(`https://www.google.com/maps/search/${encodeURIComponent(`${b.property.name} London`)}`, '_blank', 'noopener')],
    ['chat', 'Message the property', () => showToast('Messaging is outside the booking flow.')],
    ['share', 'Share trip details', share],
  ];

  return (
    <div className="screen">
      <Header onBack={() => go('home')} icon="close" backLabel="Close" title="Confirmation" right={<IconButton icon="share" label="Share trip details" onClick={share} />} />
      <main className="page page--stack" tabIndex={-1} data-main>
        <div className="hero">
          <span className="hero__check"><Icon name="check" size="control" /></span>
          <p className="t-label hero__kicker">Booking confirmed</p>
          <h1 className="t-headline">You’re going to London!</h1>
          <p className="t-body muted">We’ve emailed your confirmation to <b>{b.email}</b>.</p>
        </div>

        <section className="card booked">
          <img className="booked__img" src={heroImage} alt={`${b.property.name} guest room`} />
          <div className="booked__body">
            <h2 className="t-title">{b.property.name}</h2>
            <p className="t-caption booked__loc"><Icon name="pin" /> {b.property.area}, London</p>
            <div className="staybox staybox--dates">
              <div><p className="t-caption">Check-in</p><p className="t-label">{fmtCheck(b.checkIn)}</p><p className="t-caption">from 15:00</p></div>
              <Badge kind="count">{plural(nights, 'night')}</Badge>
              <div className="is-end"><p className="t-caption">Check-out</p><p className="t-label">{fmtCheck(b.checkOut)}</p><p className="t-caption">until 11:00</p></div>
            </div>
            <div className="confrow">
              <div><p className="t-caption">Confirmation number · PIN</p><p className="t-title">{CONF}</p></div>
              <Button variant="text" icon="copy" onClick={copy}>{copied ? 'Copied' : 'Copy'}</Button>
            </div>
            <dl className="policies policies--rows">
              <div><dt><Icon name="users" /> Guests</dt><dd>{guestsText(b)}</dd></div>
              <div><dt><Icon name="user" /> Booked under</dt><dd>{b.guest.first} {b.guest.last}</dd></div>
            </dl>
            <Button variant="secondary" block aria-expanded={details} onClick={() => setDetails(!details)}>View booking details</Button>
            {details && <p className="t-caption muted" role="status">{b.room.name} · {b.room.bed} · {b.room.refundable ? 'Free cancellation until 3 days before check-in' : 'Non-refundable'}</p>}
          </div>
        </section>

        <PriceDetails quote={b.quote} nights={nights} checkIn={b.checkIn} mode="confirmed"
          extras={<p className="t-caption pricedetails__note">Receipt sent to {b.email}</p>} />

        <Section title="Prepare for your stay">
          <ul className="actionlist">
            {prep.map(([ic, label, run]) => (
              <li key={label}><button type="button" onClick={run}><Icon name={ic} size="control" /><span className="t-body">{label}</span><Icon name="right" size="control" /></button></li>
            ))}
          </ul>
        </Section>

        <Section title="Complete your trip">
          <div className="grid2">
            {[['taxi', 'plane', 'Airport taxi', 'From €45 · one way'], ['car', 'car', 'Car rental', 'Up to 15% off']].map(([k, ic, t, sub]) => (
              <div key={k} className="card addon">
                <span className="addon__icon"><Icon name={ic} size="control" /></span>
                <Badge kind="tag">Genius</Badge>
                <h3 className="t-label">{t}</h3>
                <p className="t-caption">{sub}</p>
                <Button variant="text" aria-pressed={s.addons[k]} onClick={() => set({ addons: { ...s.addons, [k]: !s.addons[k] } })}>{s.addons[k] ? 'Added to trip' : 'Add to trip'}</Button>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <div className="stepfooter stepfooter--col">
        <Button block onClick={() => go('profile')}>Go to my trips</Button>
        <Button block variant="text" onClick={() => go('home')}>Back to home</Button>
      </div>
    </div>
  );
}
