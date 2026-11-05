import { useApp } from '../lib/store.jsx';
import { BottomNav, Badge, Button, Header, PriceBar } from '../components/Layout.jsx';
import { Favorite } from '../components/Controls.jsx';
import { IconButton } from '../components/Button.jsx';
import Icon from '../components/Icon.jsx';
import { byId, facilityById } from '../data/properties.js';
import { money, nightsOf, stayTotal, plural } from '../lib/format.js';

export const amenityLine = (p) =>
  [p.fac.includes('wifi') && 'Wi-Fi', p.breakfast && 'Breakfast', ...p.fac.filter((f) => f !== 'wifi').slice(0, 2).map((f) => facilityById[f].label)]
    .filter(Boolean)
    .slice(0, 3)
    .join(' · ');

export function Wishlist() {
  const { s, set, go, back, toggleSaved, showToast } = useApp();
  const items = s.saved.map(byId);
  const nights = nightsOf(s);
  const sel = s.compareSel;
  const toggleSel = (id, on) => set({ compareSel: on ? [...sel, id].slice(-2) : sel.filter((x) => x !== id) });
  const share = async () => {
    const text = `My saved stays: ${items.map((p) => p.name).join(', ')}`;
    try { navigator.share ? await navigator.share({ title: 'Wishlist', text }) : (await navigator.clipboard.writeText(text), showToast('Wishlist copied.')); } catch { /* cancelled */ }
  };
  return (
    <div className="screen has-nav has-bar">
      <Header onBack={back} title="Wishlist" right={<IconButton icon="share" label="Share wishlist" onClick={share} />} />
      <main className="page page--stack" tabIndex={-1} data-main>
        <div>
          <h2 className="t-label" aria-live="polite">{plural(items.length, 'saved stay')}</h2>
          {items.length > 0 && <p className="t-caption">Save first, then select two stays to compare.</p>}
        </div>
        {items.length === 0 ? (
          <div className="empty">
            <span className="empty__icon"><Icon name="heart" size="control" /></span>
            <h2 className="t-title">No saved stays yet</h2>
            <p className="t-body">Tap the heart on a stay you love to save it here later.</p>
            <Button onClick={() => { if (!s.searchKey) set({ searchKey: 1 }); go('results'); }}>Browse stays</Button>
          </div>
        ) : (
          items.map((p) => {
            const on = sel.includes(p.id);
            return (
              <article key={p.id} className={`wishcard ${on ? 'is-selected' : ''}`}>
                <div className="wishcard__top">
                  <div className="wishcard__photo">
                    <img src={p.thumb} alt="" />
                    <span className="wishcard__fav"><Favorite saved name={p.name} onToggle={() => toggleSaved(p.id, p.name)} /></span>
                  </div>
                  <div className="wishcard__body">
                    <h3 className="t-label wishcard__name">{p.name}</h3>
                    <p className="t-caption">{p.area} · {p.reviews.toLocaleString('en-US')} reviews</p>
                    <p className="t-caption">{amenityLine(p)}</p>
                    <div className="wishcard__price"><p className="t-title">{money(stayTotal(p, nights))} total</p><Badge kind="rating">{p.rating}</Badge></div>
                  </div>
                </div>
                <p className="t-caption wishcard__note">{money(p.nightly)}/night · includes all mandatory charges</p>
                <label className="wishcard__select">
                  <input className="sr-only" type="checkbox" checked={on} onChange={(e) => toggleSel(p.id, e.target.checked)} />
                  <span className="choice__box" aria-hidden="true">{on && <Icon name="check" />}</span>
                  <span className="t-label">{on ? 'Selected for comparison' : 'Select to compare'}</span>
                </label>
              </article>
            );
          })
        )}
      </main>
      {sel.length > 0 && (
        <PriceBar total={`${sel.length} selected`} sub={sel.length < 2 ? 'Select one more stay' : 'Change selection anytime'}
          action={<Button disabled={sel.length < 2} onClick={() => go('compare')}>Compare</Button>} />
      )}
      <BottomNav active="wishlist" />
    </div>
  );
}
