import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useApp, activeFilterCount, filterProperties, CLEAR_FILTERS, PRICE_DEFAULT } from '../lib/store.jsx';
import { BottomNav, BottomSheet, Button, Header } from '../components/Layout.jsx';
import { Chip, Radio } from '../components/Controls.jsx';
import { ResultCard, MapPin, MapCard } from '../components/Cards.jsx';
import Icon from '../components/Icon.jsx';
import { fmtRange, money, nightsOf, plural, stayTotal } from '../lib/format.js';
import { mapImage, sorts } from '../data/properties.js';
import { quickFilters } from '../lib/filters.js';

let loadedKey = -1; // skip the loading state when returning to an already-loaded search
const PAGE = 8; // stays per page; "Load more results" adds another page
const MODES = ['list', 'peek', 'map']; // list: map above list · peek: bigger map · map: full map, list hidden

function Skeleton() {
  return (
    <div className="resultcard skeleton" aria-hidden="true">
      <div className="skeleton__photo" />
      <div className="resultcard__info"><div className="skeleton__line" /><div className="skeleton__line skeleton__line--short" /><div className="skeleton__line skeleton__line--price" /></div>
    </div>
  );
}

export default function Results() {
  const { s, set, go, back, toggleSaved, openProperty } = useApp();
  const [phase, setPhase] = useState(() => (loadedKey === s.searchKey ? 'ready' : 'loading'));
  const [mode, setMode] = useState('list');
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState(null); // pin tapped on the map
  const [visible, setVisible] = useState([]); // cards currently in view in the list
  const [scrolled, setScrolled] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const drag = useRef(null);
  const root = useRef();
  const top = useRef();
  const nights = nightsOf(s);
  const count = activeFilterCount(s.filters);
  const all = filterProperties(s);
  const list = all.slice(0, shown);
  useEffect(() => setShown(PAGE), [s.filters, s.sort, s.searchKey]);
  const sortLabel = sorts.find((o) => o.id === s.sort).label;

  const load = () => {
    setPhase('loading');
    const t = setTimeout(() => {
      const ok = navigator.onLine;
      if (ok) loadedKey = s.searchKey;
      setPhase(ok ? 'ready' : 'error');
    }, 900);
    return () => clearTimeout(t);
  };
  useEffect(() => (loadedKey === s.searchKey ? undefined : load()), [s.searchKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const off = () => phase === 'loading' || setPhase('error');
    window.addEventListener('offline', off);
    return () => window.removeEventListener('offline', off);
  }, [phase]);

  // The sticky map sits under the sticky header+chips; expose their height to CSS.
  useLayoutEffect(() => {
    const ro = new ResizeObserver(() => root.current?.style.setProperty('--hdr', `${top.current.offsetHeight}px`));
    ro.observe(top.current);
    return () => ro.disconnect();
  }, []);

  // Scroll-linked map: the card(s) in view highlight their pin; a "Map" pill appears once the list covers the map.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > top.current.offsetHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (phase !== 'ready' || mode === 'map') return undefined;
    const seen = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target.dataset.id) : seen.delete(e.target.dataset.id)));
        setVisible(list.map((p) => p.id).filter((id) => seen.has(id)));
      },
      { rootMargin: `-${top.current.offsetHeight}px 0px -40% 0px`, threshold: 0.3 }, // lint-allow-px: rootMargin only accepts px/% strings (measured height)
    );
    document.querySelectorAll('.resultcard[data-id]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [phase, mode, list.map((p) => p.id).join()]); // eslint-disable-line react-hooks/exhaustive-deps

  const patchFilters = (patch) => set((p) => ({ filters: { ...p.filters, ...patch } }));
  const open = openProperty;
  const step = (dir) => setMode((m) => MODES[Math.max(0, Math.min(2, MODES.indexOf(m) + dir))]);
  const onDown = (e) => { drag.current = e.clientY; };
  const onUp = (e) => {
    if (drag.current == null) return;
    const dy = e.clientY - drag.current; drag.current = null;
    if (Math.abs(dy) > 40) step(dy > 0 ? 1 : -1);
  };
  const activeId = selected ?? visible[0];
  const selectedProp = list.find((p) => p.id === selected);

  return (
    <div className="screen has-nav results" data-mode={mode} ref={root}>
      <div className="results__top" ref={top}>
        <Header onBack={back} backLabel="Back to search" right={
          <button type="button" className="filterbtn" aria-label={`Filters, ${count} active`} onClick={() => go('filters')}>
            <Icon name="filter" size="control" /><span className="filterbtn__count t-caption">{count}</span>
          </button>
        }>
          <h1 className="t-label header__h">{s.destination}</h1>
          <p className="t-caption">{fmtRange(s.checkIn, s.checkOut)} · {plural(s.adults, 'adult')}</p>
        </Header>
        <div className="scrollrow scrollrow--chips">
          <Chip icon="list" onClick={() => setSortOpen(true)}>Sort: {sortLabel}</Chip>
          {quickFilters.map((q) => (
            <Chip key={q.id} tone={q.tone} selected={q.on(s.filters)} onClick={() => patchFilters(q.patch(s.filters))}>{q.label}</Chip>
          ))}
        </div>
      </div>

      {phase === 'error' ? (
        <main className="page empty" tabIndex={-1} data-main role="alert">
          <span className="empty__icon"><Icon name="offline" size="control" /></span>
          <h2 className="t-title">Can’t load stays</h2>
          <p className="t-body">Check your connection and try again. Your search is saved.</p>
          <Button onClick={() => { loadedKey = -1; load(); }}>Try again</Button>
        </main>
      ) : (
        <>
          <div className="results__map" onClick={(e) => { if (e.target === e.currentTarget || e.target.tagName === 'IMG') setSelected(null); }}>
            <img className="results__mapimg" src={mapImage} alt="" />
            {phase === 'ready' && all.map((p) => (
              <MapPin key={p.id} x={10 + p.pin.x * 0.8} y={22 + p.pin.y * 0.5} active={p.id === activeId} price={money(stayTotal(p, nights))}
                label={`${p.name}, ${money(stayTotal(p, nights))} for ${plural(nights, 'night')}`} onClick={() => setSelected(p.id === selected ? null : p.id)} />
            ))}
            {selectedProp && (
              <MapCard property={selectedProp} total={stayTotal(selectedProp, nights)} nights={nights} saved={s.saved.includes(selectedProp.id)}
                onToggleSave={() => toggleSaved(selectedProp.id, selectedProp.name)} onOpen={() => open(selectedProp.id)} onClose={() => setSelected(null)} />
            )}
          </div>
          <main className="sheet" tabIndex={-1} data-main>
            <h2 className="sr-only">Stays in {s.destination}</h2>
            <button type="button" className="sheet__handle" aria-label={mode === 'list' ? 'Expand map' : mode === 'peek' ? 'Expand map fully' : 'Show list'}
              onPointerDown={onDown} onPointerUp={onUp} onClick={() => setMode((m) => (m === 'list' ? 'peek' : m === 'peek' ? 'map' : 'list'))}><span /></button>
            {mode === 'map' ? (
              <div className="sheet__bar"><Button variant="secondary" icon="list" onClick={() => setMode('list')}>Show list</Button></div>
            ) : phase === 'loading' ? (
              <div className="cards" aria-busy="true" aria-label="Loading stays"><Skeleton /><Skeleton /></div>
            ) : all.length === 0 ? (
              <div className="empty">
                <h2 className="t-title">No stays match</h2>
                <p className="t-body">Try removing a filter or widening the price range.</p>
                <Button variant="secondary" onClick={() => set({ filters: { ...CLEAR_FILTERS, price: PRICE_DEFAULT } })}>Clear all filters</Button>
                <Button variant="text" onClick={() => go('filters')}>Edit filters</Button>
              </div>
            ) : (
              <>
                <p className="t-label sheet__count" aria-live="polite">{plural(all.length, 'stay')} in {s.destination}</p>
                <div className="cards">
                  {list.map((p) => (
                    <ResultCard key={p.id} property={p} total={stayTotal(p, nights)} nights={nights} active={p.id === activeId}
                      saved={s.saved.includes(p.id)} onToggleSave={() => toggleSaved(p.id, p.name)} onOpen={() => open(p.id)} />
                  ))}
                </div>
                <div className="loadmore">
                  <p className="t-caption">Showing {list.length} of {all.length}</p>
                  {all.length > list.length && <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)}>Load more results</Button>}
                </div>
              </>
            )}
          </main>
          {scrolled && mode !== 'map' && (
            <button type="button" className="fab" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><Icon name="map" /> <span className="t-label">Map</span></button>
          )}
        </>
      )}

      {sortOpen && (
        <BottomSheet title="Sort by" onClose={() => setSortOpen(false)}>
          <div role="radiogroup" aria-label="Sort by" className="stackgap">
            {sorts.map((o) => <Radio key={o.id} name="sort" value={o.id} checked={s.sort === o.id} title={o.label} onChange={(v) => { set({ sort: v }); setSortOpen(false); }} />)}
          </div>
        </BottomSheet>
      )}
      <BottomNav active="search" />
    </div>
  );
}
