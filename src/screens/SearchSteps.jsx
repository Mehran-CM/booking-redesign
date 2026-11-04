import { useMemo, useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { Button, Header, ProgressSteps, PriceBar } from '../components/Layout.jsx';
import { Chip, Stepper } from '../components/Controls.jsx';
import Icon from '../components/Icon.jsx';
import { destinations } from '../data/properties.js';
import { addDays, fmtDay, fmtMonth, fmtRange, fmtShort, nightsBetween, plural, sameDay } from '../lib/format.js';

function Summary({ icon, label, value, onEdit }) {
  return (
    <div className="stepsum">
      <span className="stepsum__icon"><Icon name={icon} size="control" /></span>
      <span className="t-body stepsum__label">{label}</span>
      <span className="t-label stepsum__value">{value}</span>
      <button type="button" className="textlink t-label" onClick={onEdit}>Edit</button>
    </div>
  );
}

function StepShell({ step, close, children, footer }) {
  return (
    <div className="screen has-bar">
      <Header onBack={close} backLabel="Close search" icon="close" title="Search stays" />
      <div className="stepwrap"><ProgressSteps step={step} /></div>
      <main className="page page--stack" tabIndex={-1} data-main>{children}</main>
      {footer}
    </div>
  );
}

const Footer = ({ onBack, next, nextDisabled, onNext }) => (
  <div className="stepfooter">
    {onBack && <Button variant="text" onClick={onBack}>Back</Button>}
    <Button block disabled={nextDisabled} onClick={onNext}>{next}</Button>
  </div>
);

/* ---------------- Step 1 · Where to ---------------- */
export function Where() {
  const { s, set, go } = useApp();
  const [q, setQ] = useState(s.destination);
  const [picked, setPicked] = useState(s.destinationFull);
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return destinations.filter((d) => !t || d.name.toLowerCase().includes(t) || d.value.toLowerCase().includes(t));
  }, [q]);
  const choose = (d) => { setPicked(d.value); setQ(d.name); };
  return (
    <StepShell step={1} close={() => go('home')} footer={
      <Footer next="Next: dates" nextDisabled={!picked} onNext={() => { const d = destinations.find((x) => x.value === picked); set({ destination: d.name, destinationFull: d.value }); go('when'); }} />
    }>
      <section className="card card--lg">
        <h2 className="t-headline">Where to?</h2>
        <div className="field">
          <label className="t-label field__label" htmlFor="dest">Destination</label>
          <div className="field__wrap is-focusable">
            <input id="dest" className="field__input field__input--bare" value={q} autoComplete="off" aria-describedby="dest-hint"
              onChange={(e) => { setQ(e.target.value); setPicked(null); }} />
            {q && <button type="button" className="field__clear" aria-label="Clear destination" onClick={() => { setQ(''); setPicked(null); }}><Icon name="close" /></button>}
          </div>
          <p id="dest-hint" className="t-caption field__hint">Search a city, region or landmark</p>
        </div>
        <div className="chiprow">
          <Chip icon="pin" onClick={() => choose(destinations[0])}>Nearby</Chip>
          <Chip onClick={() => choose(destinations[2])}>Anywhere</Chip>
        </div>
        <p className="t-label sectionlabel">Results</p>
        <ul className="results-list" role="listbox" aria-label="Destination results">
          {list.map((d) => (
            <li key={d.id} role="option" aria-selected={picked === d.value}>
              <button type="button" className={`placeopt ${picked === d.value ? 'is-selected' : ''}`} onClick={() => choose(d)}>
                <span className="placeopt__icon"><Icon name="pin" size="control" /></span>
                <span className="placeopt__text"><span className="t-label">{d.name}</span><span className="t-caption">{d.sub}</span></span>
                {picked === d.value && <Icon name="check" size="control" />}
              </button>
            </li>
          ))}
          {!list.length && <li className="t-caption emptyline">No places match “{q}”. Try London.</li>}
        </ul>
      </section>
      <Summary icon="calendar" label="Dates" value={fmtRange(s.checkIn, s.checkOut)} onEdit={() => go('when')} />
      <Summary icon="users" label="Guests" value={`${s.adults + s.children} guests`} onEdit={() => go('who')} />
    </StepShell>
  );
}

/* ---------------- Step 2 · When ---------------- */
const TODAY = new Date(2026, 10, 4);
export function When() {
  const { s, set, go, back } = useApp();
  const [start, setStart] = useState(s.checkIn);
  const [end, setEnd] = useState(s.checkOut);
  const [flex, setFlex] = useState(s.flex);
  const [month, setMonth] = useState(new Date(s.checkIn.getFullYear(), s.checkIn.getMonth(), 1));
  const first = (month.getDay() + 6) % 7; // Monday-first
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const pick = (d) => {
    if (!start || (start && end)) { setStart(d); setEnd(null); }
    else if (d > start) setEnd(d);
    else setStart(d);
  };
  const canPrev = month > new Date(TODAY.getFullYear(), TODAY.getMonth(), 1);
  const nights = start && end ? nightsBetween(start, end) : 0;
  return (
    <StepShell step={2} close={() => go('home')} footer={
      <Footer onBack={back} next="Next: guests" nextDisabled={!(start && end)} onNext={() => { set({ checkIn: start, checkOut: end, flex }); go('who'); }} />
    }>
      <Summary icon="pin" label="Destination" value={s.destination} onEdit={() => go('where')} />
      <section className="card card--lg">
        <h2 className="t-headline">When will you stay?</h2>
        <div className="cal__nav">
          <button type="button" className="iconbtn iconbtn--soft" aria-label="Previous month" disabled={!canPrev} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><span className="iconbtn__visual"><Icon name="back" size="control" /></span></button>
          <p className="t-label" aria-live="polite">{fmtMonth(month)}</p>
          <button type="button" className="iconbtn iconbtn--soft" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><span className="iconbtn__visual"><Icon name="right" size="control" /></span></button>
        </div>
        <div className="cal" role="grid" aria-label={fmtMonth(month)}>
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => <span key={d} className="cal__dow t-label" role="columnheader">{d}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={`b${i}`} />;
            const isS = sameDay(d, start), isE = sameDay(d, end);
            const inR = start && end && d > start && d < end;
            const past = d < TODAY;
            return (
              <button key={i} type="button" disabled={past} role="gridcell" aria-pressed={isS || isE}
                aria-label={d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) + (isS ? ', check-in' : isE ? ', check-out' : '')}
                className={`cal__day ${isS || isE ? 'is-edge' : ''} ${inR ? 'is-range' : ''} ${isS && end ? 'is-start' : ''} ${isE ? 'is-end' : ''}`}
                onClick={() => pick(d)}>{d.getDate()}</button>
            );
          })}
        </div>
        <div className="chiprow">
          {[['exact', 'Exact dates'], ['1', '± 1 day'], ['3', '± 3 days']].map(([k, l]) => (
            <Chip key={k} selected={flex === k} onClick={() => setFlex(k)}>{l}</Chip>
          ))}
        </div>
        <div className="staybox" aria-live="polite">
          <div><p className="t-caption">Check-in</p><p className="t-label">{start ? fmtDay(start) : 'Select a date'}</p></div>
          <div><p className="t-caption">Check-out</p><p className="t-label">{end ? fmtDay(end) : 'Select a date'}</p></div>
          <p className="t-label staybox__nights">{nights ? plural(nights, 'night') : ''}</p>
        </div>
      </section>
    </StepShell>
  );
}

/* ---------------- Step 3 · Who's coming ---------------- */
export function Who() {
  const { s, set, go, back } = useApp();
  const setKids = (n) => set({ children: n, childAges: Array.from({ length: n }, (_, i) => s.childAges[i] ?? null) });
  return (
    <StepShell step={3} close={() => go('home')} footer={
      <Footer onBack={back} next="Search stays" nextDisabled={s.childAges.some((a) => a == null)} onNext={() => { set((p) => ({ searchKey: p.searchKey + 1 })); go('results'); }} />
    }>
      <Summary icon="pin" label="Destination" value={s.destination} onEdit={() => go('where')} />
      <Summary icon="calendar" label="Dates" value={`${fmtRange(s.checkIn, s.checkOut)} · ${plural(nightsBetween(s.checkIn, s.checkOut), 'night')}`} onEdit={() => go('when')} />
      <section className="card card--lg">
        <h2 className="t-headline">Who’s coming?</h2>
        <p className="t-caption">Choose your guests and rooms.</p>
        <Stepper label="Adults" sub="Ages 18 and above" value={s.adults} min={1} max={8} onChange={(v) => set({ adults: v, rooms: Math.min(s.rooms, v) })} />
        <Stepper label="Children" sub="Ages 0–17" value={s.children} min={0} max={6} onChange={setKids} />
        {s.children > 0 && (
          <div className="ages">
            <p className="t-label ages__title">Children’s ages</p>
            <p className="t-caption">Add each child’s age on the check-in date. Hotels use it to show the right prices, beds and cots.</p>
            {s.childAges.map((a, i) => (
              <label key={i} className={`field ${a == null ? 'has-hint' : ''}`}>
                <span className="t-label field__label">Age of child {i + 1}</span>
                <select className="field__input" value={a ?? ''} onChange={(e) => set({ childAges: s.childAges.map((x, k) => (k === i ? Number(e.target.value) : x)) })}>
                  <option value="" disabled>Select age</option>
                  {Array.from({ length: 18 }, (_, n) => <option key={n} value={n}>{n === 0 ? 'Under 1' : n}</option>)}
                </select>
                {a == null && <span className="t-caption field__hint">Required</span>}
              </label>
            ))}
          </div>
        )}
        <Stepper label="Rooms" sub="At least 1 room · 1 adult per room" value={s.rooms} min={1} max={Math.min(5, s.adults)} onChange={(v) => set({ rooms: v })} />
        <p className="t-caption">Find stays with enough space for everyone. You can choose your room type on the property page.</p>
      </section>
    </StepShell>
  );
}
