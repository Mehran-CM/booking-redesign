import { useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { BottomNav, Badge, Button, Header, PriceBar } from '../components/Layout.jsx';
import { Checkbox, Chip, Favorite } from '../components/Controls.jsx';
import Icon from '../components/Icon.jsx';
import { byId } from '../data/properties.js';
import { fmtRange, money, nightsOf, plural, stayTotal } from '../lib/format.js';

export function Wishlist() {
  const { s, set, go, back, toggleSaved } = useApp();
  const items = s.saved.map(byId);
  const nights = nightsOf(s);
  const sel = s.compareSel;
  const toggleSel = (id, on) => set({ compareSel: on ? [...sel, id].slice(-2) : sel.filter((x) => x !== id) });
  return (
    <div className={`screen has-nav ${sel.length ? 'has-bar' : ''}`}>
      <Header title="Wishlist" subtitle={items.length ? `${plural(items.length, 'saved stay')}` : undefined} />
      <main className="page page--stack" tabIndex={-1} data-main>
        {items.length === 0 ? (
          <div className="empty">
            <span className="empty__icon"><Icon name="heart" size="control" /></span>
            <h2 className="t-title">No saved stays yet</h2>
            <p className="t-body">Tap the heart on a stay to save it here and compare later.</p>
            <Button onClick={() => go('where')}>Find stays</Button>
          </div>
        ) : (
          <>
            <p className="t-caption">Select two stays to compare. Use the heart to remove a stay.</p>
            {items.map((p) => (
              <article key={p.id} className={`wishcard ${sel.includes(p.id) ? 'is-selected' : ''}`}>
                <img className="wishcard__img" src={p.thumb} alt="" />
                <div className="wishcard__body">
                  <div className="staysummary__top"><h2 className="t-label">{p.name}</h2><Favorite saved name={p.name} onToggle={() => toggleSaved(p.id, p.name)} /></div>
                  <p className="t-caption">{p.area}, London · {fmtRange(s.checkIn, s.checkOut)}</p>
                  <div className="wishcard__price"><Badge kind="rating">{p.rating}</Badge><span className="t-label">{money(stayTotal(p, nights))} total</span></div>
                  <Checkbox checked={sel.includes(p.id)} onChange={(v) => toggleSel(p.id, v)} title="Compare" />
                </div>
              </article>
            ))}
          </>
        )}
      </main>
      {sel.length > 0 && (
        <PriceBar total={`${sel.length} selected`} sub={sel.length < 2 ? 'Select one more to compare' : 'Ready to compare'}
          action={<Button disabled={sel.length < 2} onClick={() => go('compare')}>Compare stays</Button>} />
      )}
      <BottomNav active="wishlist" />
    </div>
  );
}

export function Compare() {
  const { s, go, back, openProperty } = useApp();
  const [diff, setDiff] = useState(false);
  const nights = nightsOf(s);
  const ps = s.compareSel.map(byId);
  const yn = (v) => (v ? 'Yes' : 'No');
  const rows = [
    ['Total price', (p) => money(stayTotal(p, nights))],
    ['Guest rating', (p) => `${p.rating} · ${p.reviews.toLocaleString('en-US')} reviews`],
    ['Area', (p) => p.area],
    ['Type', (p) => p.kind],
    ['Breakfast', (p) => yn(p.breakfast)],
    ['Free cancellation', (p) => yn(p.freeCancel)],
    ['Parking', (p) => yn(p.fac.includes('parking'))],
    ['Distance from center', (p) => `${p.distance} km`],
  ].filter(([, f]) => !diff || new Set(ps.map(f)).size > 1);
  if (ps.length < 2) return <div className="screen"><Header onBack={back} title="Compare stays" /><main className="page empty"><Button onClick={() => go('wishlist', { replace: true })}>Back to wishlist</Button></main></div>;
  return (
    <div className="screen">
      <Header onBack={back} title="Compare stays" subtitle={`${fmtRange(s.checkIn, s.checkOut)} · ${plural(nights, 'night')}`} />
      <main className="page page--stack" tabIndex={-1} data-main>
        <Chip selected={diff} onClick={() => setDiff(!diff)}>Differences only</Chip>
        <table className="compare">
          <thead><tr><td />{ps.map((p) => <th key={p.id} scope="col" className="t-label">{p.name}</th>)}</tr></thead>
          <tbody>{rows.map(([label, f]) => <tr key={label}><th scope="row" className="t-caption">{label}</th>{ps.map((p) => <td key={p.id} className="t-label">{f(p)}</td>)}</tr>)}</tbody>
        </table>
        <div className="grid2">
          {ps.map((p) => <Button key={p.id} variant="secondary" onClick={() => openProperty(p.id)}>View {p.name.split(' ')[0]}</Button>)}
        </div>
      </main>
    </div>
  );
}
