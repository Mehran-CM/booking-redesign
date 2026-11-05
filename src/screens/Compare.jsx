import { useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { Badge, BottomSheet, Button, Header } from '../components/Layout.jsx';
import { Chip, Checkbox, Radio, Switch } from '../components/Controls.jsx';
import Icon from '../components/Icon.jsx';
import { byId } from '../data/properties.js';
import { addDays, fmtRange, fmtShort, money, nightsOf, plural, stayTotal } from '../lib/format.js';

const RIVER = ['South Bank', 'Southwark', 'Westminster', 'Vauxhall', 'Canary Wharf', 'Greenwich', 'Richmond', 'Chelsea', 'Bermondsey'];
const GARDEN = ['Hampstead', 'Wimbledon', 'Islington', 'Hackney', 'Kensington', 'Notting Hill', 'Green Park', 'Peckham'];
const viewOf = (p) => (RIVER.includes(p.area) ? 'River view' : GARDEN.includes(p.area) ? 'Garden view' : p.kind === 'Hotel' && p.stars >= 4 ? 'City view' : 'Not listed');
const ROOM = { Hotel: 'Hotel room', Apartment: 'Entire apartment', 'Entire home': 'Entire home', 'Private room': 'Private room', 'Guest house': 'Guest room', Hostel: 'Shared dormitory' };
const sizeOf = (p) => 16 + p.bedrooms * 12 + (p.stars || 2) * 2;
const ratingWord = (r) => (r >= 9 ? 'Exceptional' : r >= 8.5 ? 'Excellent' : r >= 8 ? 'Very good' : 'Good');
const AMENITIES = [
  ['wifi', 'Free Wi-Fi', (p) => p.fac.includes('wifi')],
  ['breakfast', 'Breakfast', (p) => p.breakfast],
  ['aircon', 'Air conditioning', (p) => p.fac.includes('aircon')],
  ['parking', 'Parking', (p) => p.fac.includes('parking')],
  ['gym', 'Fitness centre', (p) => p.fac.includes('gym')],
  ['pets', 'Pets allowed', (p) => p.fac.includes('pets')],
];

const SECTIONS = [
  { id: 'price', label: 'Price' },
  { id: 'view', label: 'View' },
  { id: 'cancel', label: 'Cancellation' },
  { id: 'location', label: 'Location' },
  { id: 'room', label: 'Room' },
  { id: 'amenities', label: 'Amenities' },
];

export default function Compare() {
  const { s, set, go, back, openProperty, showToast } = useApp();
  const [diff, setDiff] = useState(false);
  const [budget, setBudget] = useState(true);
  const [hidden, setHidden] = useState([]); // sections turned off in "Add filter"
  const [sheet, setSheet] = useState(null); // 'filter' | index of the column being replaced
  const nights = nightsOf(s);
  const ps = s.compareSel.map(byId);
  if (ps.length < 2) {
    return (
      <div className="screen">
        <Header onBack={back} title="Compare Stays" />
        <main className="page empty" tabIndex={-1} data-main>
          <h2 className="t-title">Select two stays to compare</h2>
          <Button onClick={() => go('wishlist', { replace: true })}>Back to wishlist</Button>
        </main>
      </div>
    );
  }
  const BUDGET = 900;
  const totals = ps.map((p) => stayTotal(p, nights));
  const cancelBy = fmtShort(addDays(s.checkIn, -3));
  const cmp = {
    price: (p) => money(stayTotal(p, nights)),
    view: viewOf,
    cancel: (p) => (p.freeCancel ? 'Free cancellation' : 'Non-refundable'),
    location: (p) => p.area,
    room: (p) => `${ROOM[p.kind]}|${sizeOf(p)}|${p.beds}`,
  };
  const differs = (id) => {
    if (id === 'amenities') return AMENITIES.some(([, , f]) => new Set(ps.map(f)).size > 1);
    if (id === 'location') return new Set(ps.map((p) => `${p.area}|${p.distance}`)).size > 1;
    return new Set(ps.map(cmp[id])).size > 1;
  };
  const visible = SECTIONS.filter((x) => !hidden.includes(x.id) && (!diff || differs(x.id)));
  const reset = () => { setDiff(false); setBudget(true); setHidden([]); };
  const replaceWith = (idx, id) => { set({ compareSel: s.compareSel.map((x, i) => (i === idx ? id : x)) }); setSheet(null); };
  const spare = s.saved.filter((id) => !s.compareSel.includes(id)).map(byId);
  const cheapest = Math.min(...totals);
  const short = (p) => p.name.split(' ').slice(0, 2).join(' ').replace(/,$/, '');

  const row = (children) => ps.map((p, i) => <div key={p.id} className="cmp__cell">{children(p, i)}</div>);

  return (
    <div className="screen cmp has-bar">
      <Header onBack={back} title="Compare Stays" right={<Button variant="text" onClick={reset}>Reset</Button>} />
      <div className="cmp__summary"><p className="t-caption">{fmtRange(s.checkIn, s.checkOut)} · {plural(nights, 'night')} · {plural(s.adults, 'adult')}</p><button type="button" className="textlink t-caption" onClick={() => go('where')}>Edit</button></div>
      <div className="scrollrow scrollrow--chips cmp__chips">
        <Chip selected={budget} onClick={() => setBudget(!budget)}>Up to {money(BUDGET)}</Chip>
        <Chip selected={!hidden.includes('view')} onClick={() => setHidden((h) => (h.includes('view') ? h.filter((x) => x !== 'view') : [...h, 'view']))}>View</Chip>
        <Chip icon="plus" onClick={() => setSheet('filter')}>Add filter</Chip>
      </div>

      <main className="page cmp__body" tabIndex={-1} data-main>
        <div className="cmp__grid">
          {ps.map((p) => (
            <article key={p.id} className="cmp__stay">
              <img src={p.photos[0]} alt={`${p.name}`} />
              <div className="cmp__staybody">
                <h2 className="t-label">{p.name}</h2>
                <p className="cmp__rating"><Badge kind="rating">{p.rating}</Badge><span className="t-caption">{ratingWord(p.rating)}</span></p>
              </div>
            </article>
          ))}
          {ps.map((p, i) => <Button key={`r${p.id}`} variant="secondary" aria-label={`Replace ${p.name}`} onClick={() => (spare.length ? setSheet(i) : showToast('Save another stay to replace this one.'))}>Replace</Button>)}
        </div>

        {visible.length === 0 && <p className="t-body muted cmp__none">These stays match on everything shown. Turn off “Show differences only” to see all details.</p>}

        {visible.map((sec) => (
          <section key={sec.id} className="cmp__section" aria-label={sec.label}>
            <h3 className="t-caption cmp__label">{sec.id === 'price' ? `Total price for ${plural(nights, 'night')}` : sec.label}</h3>
            <div className="cmp__grid">
              {sec.id === 'price' && row((p, i) => (
                <>
                  <p className={`t-title ${totals[i] === cheapest && totals[0] !== totals[1] ? 'is-best' : ''}`}>{money(totals[i])}</p>
                  <p className="t-caption">Includes taxes &amp; fees</p>
                  {budget && <p className={`t-caption cmp__budget ${totals[i] <= BUDGET ? 'is-ok' : 'is-over'}`}>{totals[i] <= BUDGET ? `Within ${money(BUDGET)}` : `Over ${money(BUDGET)}`}</p>}
                </>
              ))}
              {sec.id === 'view' && row((p) => <p className={`t-label ${viewOf(p) === 'Not listed' ? 'muted' : ''}`}>{viewOf(p)}</p>)}
              {sec.id === 'cancel' && row((p) => (
                <>
                  <p className={`t-label ${p.freeCancel ? 'is-best' : 'muted'}`}>{p.freeCancel ? 'Free cancellation' : 'Non-refundable'}</p>
                  {p.freeCancel && <p className="t-caption">Before {cancelBy}</p>}
                </>
              ))}
              {sec.id === 'location' && row((p) => (
                <>
                  <p className="t-label">{p.area}</p>
                  <p className="t-caption">{p.distance < 3 ? 'Near city center' : `${p.distance} km from center`}</p>
                </>
              ))}
              {sec.id === 'room' && row((p) => (
                <>
                  <p className="t-label">{ROOM[p.kind]}</p>
                  <p className="t-caption">{sizeOf(p)} m² · {plural(p.beds, 'bed')}</p>
                </>
              ))}
              {sec.id === 'amenities' && row((p) => {
                const list = AMENITIES.filter(([, , f]) => !diff || new Set(ps.map(f)).size > 1);
                return (
                  <ul className="cmp__amen">
                    {list.map(([id, label, f]) => (
                      <li key={id} className={f(p) ? 'is-yes' : 'is-no'}>
                        <Icon name={f(p) ? 'check' : 'close'} /><span className="t-caption"><span className="sr-only">{f(p) ? 'Included: ' : 'Not available: '}</span>{label}</span>
                      </li>
                    ))}
                  </ul>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      <div className="cmp__footer">
        <Switch checked={diff} onChange={setDiff} title="Show differences only" />
        <div className="grid2">
          {ps.map((p) => <Button key={p.id} block onClick={() => openProperty(p.id)}>Choose {short(p).split(' ')[0]}</Button>)}
        </div>
      </div>

      {sheet === 'filter' && (
        <BottomSheet title="Add filter" onClose={() => setSheet(null)}>
          <p className="t-caption">Choose what to compare.</p>
          <div className="checklist">
            {SECTIONS.map((x) => <Checkbox key={x.id} checked={!hidden.includes(x.id)} onChange={(v) => setHidden((h) => (v ? h.filter((y) => y !== x.id) : [...h, x.id]))} title={x.label} />)}
          </div>
          <Button onClick={() => setSheet(null)}>Done</Button>
        </BottomSheet>
      )}
      {typeof sheet === 'number' && (
        <BottomSheet title={`Replace ${ps[sheet].name}`} onClose={() => setSheet(null)}>
          <div role="radiogroup" aria-label="Choose a replacement" className="stackgap">
            {spare.map((p) => (
              <Radio key={p.id} name="replace" value={p.id} checked={false} title={p.name} sub={`${p.area} · ${money(stayTotal(p, nights))} total`} onChange={(v) => replaceWith(sheet, v)} />
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
