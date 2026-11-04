import { useApp, filterProperties, PRICE_BOUNDS, PRICE_DEFAULT, CLEAR_FILTERS } from '../lib/store.jsx';
import { Button, Header } from '../components/Layout.jsx';
import { Chip, Checkbox, Stepper } from '../components/Controls.jsx';
import Icon from '../components/Icon.jsx';
import { facilities, placeTypes, reviewScores, distances, sorts } from '../data/properties.js';
import { quickFilters } from '../lib/filters.js';
import { fmtRange, guestsText, money, nightsOf, plural } from '../lib/format.js';

const HIST = [18, 28, 40, 55, 70, 82, 90, 96, 100, 94, 80, 66, 52, 40, 30, 22, 16, 12, 9, 6];

function PriceRange({ value, onChange }) {
  const [lo, hi] = value;
  const [min, max] = PRICE_BOUNDS;
  const pct = (v) => ((v - min) / (max - min)) * 100;
  return (
    <div className="range">
      <div className="range__hist" aria-hidden="true">
        {HIST.map((h, i) => {
          const mid = min + ((i + 0.5) / HIST.length) * (max - min);
          return <span key={i} className={mid >= lo && mid <= hi ? 'is-in' : ''} style={{ height: `${h}%` }} />;
        })}
      </div>
      <div className="range__track">
        <span className="range__fill" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input type="range" aria-label="Minimum price" min={min} max={max} step={10} value={lo} onChange={(e) => onChange([Math.min(Number(e.target.value), hi - 10), hi])} />
        <input type="range" aria-label="Maximum price" min={min} max={max} step={10} value={hi} onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + 10)])} />
      </div>
      <div className="range__fields">
        <div className="field"><span className="t-caption">Minimum</span><span className="field__input range__val t-label">{money(lo)}</span></div>
        <div className="field"><span className="t-caption">Maximum</span><span className="field__input range__val t-label">{money(hi)}</span></div>
      </div>
    </div>
  );
}

const Group = ({ title, sub, children }) => (
  <section className="fgroup">
    <h2 className="t-title">{title}</h2>
    {sub && <p className="t-caption">{sub}</p>}
    {children}
  </section>
);

export default function Filters() {
  const { s, set, go, back } = useApp();
  const f = s.filters;
  const setF = (patch) => set((p) => ({ filters: { ...p.filters, ...patch } }));
  const toggleType = (t) => {
    if (t === 'Any type') return setF({ types: ['Any type'] });
    const cur = f.types.filter((x) => x !== 'Any type');
    const next = cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t];
    setF({ types: next.length ? next : ['Any type'] });
  };
  const toggleIn = (key, v) => setF({ [key]: f[key].includes(v) ? f[key].filter((x) => x !== v) : [...f[key], v] });
  const n = filterProperties(s).length;
  const reset = () => set({ filters: { ...CLEAR_FILTERS, price: PRICE_DEFAULT }, sort: 'recommended' });
  return (
    <div className="screen has-bar">
      <Header onBack={back} backLabel="Back to results" title="Filters" right={<Button variant="text" onClick={reset}>Reset</Button>} />
      <main className="page page--stack" tabIndex={-1} data-main>
        <button type="button" className="searchsum" onClick={() => go('where')}>
          <span className="searchsum__top t-title"><Icon name="search" size="control" />{s.destination}</span>
          <span className="searchsum__bot t-caption"><Icon name="calendar" /> <b className="t-label">{fmtRange(s.checkIn, s.checkOut)}</b> · {guestsText(s)}<Icon name="down" /></span>
        </button>

        <Group title="Sort by">
          <div className="chiprow">
            {sorts.map((o) => <Chip key={o.id} selected={s.sort === o.id} onClick={() => set({ sort: o.id })}>{o.label}</Chip>)}
          </div>
        </Group>

        <Group title="Popular filters">
          <div className="scrollrow scrollrow--flush">
            {quickFilters.map((q) => (
              <button key={q.id} type="button" className={`tile tile--${q.tone} ${q.on(f) ? 'is-selected' : ''}`} aria-pressed={q.on(f)} onClick={() => setF(q.patch(f))}>
                <Icon name={q.icon} size="control" /><span className="t-label">{q.label}</span>
              </button>
            ))}
          </div>
        </Group>

        <Group title="Type of place" sub="Select one or more types.">
          <div className="chiprow">{placeTypes.map((t) => <Chip key={t} selected={f.types.includes(t)} onClick={() => toggleType(t)}>{t}</Chip>)}</div>
        </Group>

        <Group title="Price range" sub={`Total price for your stay · ${fmtRange(s.checkIn, s.checkOut)} · ${plural(nightsOf(s), 'night')} · ${plural(s.adults, 'adult')}`}>
          <PriceRange value={f.price} onChange={(price) => setF({ price })} />
        </Group>

        <Group title="Guest review score">
          <div className="chiprow">
            {reviewScores.map((r) => <Chip key={r} selected={f.rating === r} onClick={() => setF({ rating: r })}>{r ? `${r}+` : 'Any'}</Chip>)}
          </div>
        </Group>

        <Group title="Accommodation size" sub="Minimum for the whole stay.">
          <Stepper label="Bedrooms" value={f.bedrooms} min={0} max={5} onChange={(v) => setF({ bedrooms: v })} />
          <Stepper label="Bathrooms" value={f.bathrooms} min={0} max={4} onChange={(v) => setF({ bathrooms: v })} />
        </Group>

        <Group title="Star rating">
          <div className="chiprow">
            {[1, 2, 3, 4, 5].map((n2) => <Chip key={n2} icon="star" selected={f.stars.includes(n2)} onClick={() => toggleIn('stars', n2)}>{n2}</Chip>)}
          </div>
        </Group>

        <Group title="Meals and payment">
          <div className="checklist">
            <Checkbox checked={f.breakfast} onChange={(v) => setF({ breakfast: v })} title="Breakfast included" />
            <Checkbox checked={f.freeCancel} onChange={(v) => setF({ freeCancel: v })} title="Free cancellation" />
            <Checkbox checked={f.noPrepay} onChange={(v) => setF({ noPrepay: v })} title="No prepayment needed" />
          </div>
        </Group>

        <Group title="Facilities">
          <div className="checklist">
            {facilities.map((fa) => <Checkbox key={fa.id} checked={f.fac.includes(fa.id)} onChange={() => toggleIn('fac', fa.id)} title={fa.label} />)}
          </div>
        </Group>

        <Group title="Distance from center">
          <div className="chiprow">
            {distances.map((d) => <Chip key={d} selected={f.distance === d} onClick={() => setF({ distance: d })}>{d ? `Under ${d} km` : 'Any'}</Chip>)}
          </div>
        </Group>
      </main>
      <div className="stepfooter">
        <Button variant="text" onClick={reset}>Clear all</Button>
        <Button block onClick={back} disabled={n === 0}>{n === 0 ? 'No stays match' : n === 1 ? 'Show 1 stay' : `Show ${n} stays`}</Button>
      </div>
    </div>
  );
}
