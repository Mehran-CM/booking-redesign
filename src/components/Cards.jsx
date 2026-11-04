import { useRef, useState } from 'react';
import Badge from './Badge.jsx';
import Icon from './Icon.jsx';
import { Favorite } from './Controls.jsx';
import { IconButton } from './Button.jsx';
import { money, plural } from '../lib/format.js';

/**
 * Photo carousel. Drag, arrow keys and (on details) chevrons change the photo;
 * dots are real buttons so there is an operable alternative to dragging.
 */
export function CardPhotoCarousel({ photos, name, chevrons = false, counter, children, aspect = 'card', onOpen }) {
  const [i, setI] = useState(0);
  const drag = useRef(null);
  const moved = useRef(false);
  const n = photos.length;
  const go = (k) => setI(Math.max(0, Math.min(n - 1, k)));
  const onDown = (e) => { drag.current = e.clientX; moved.current = false; };
  const onMove = (e) => { if (drag.current != null && Math.abs(e.clientX - drag.current) > 8) moved.current = true; };
  const onUp = (e) => {
    if (drag.current == null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
  };
  return (
    <div
      className={`carousel carousel--${aspect}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${name} photos`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={() => (drag.current = null)}
      onClickCapture={(e) => { if (moved.current) { e.stopPropagation(); moved.current = false; } }}
      onClick={(e) => { if (onOpen && !e.target.closest('button')) onOpen(); }}
    >
      <div className="carousel__track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {photos.map((src, k) => (
          <img key={k} className="carousel__img" src={src} alt={k === i ? `${name}, photo ${k + 1}` : ''} draggable="false" />
        ))}
      </div>
      {chevrons && (
        <div className="carousel__chevrons">
          <IconButton tone="white" icon="back" label="Previous photo" onClick={() => go(i - 1)} disabled={i === 0} />
          <IconButton tone="white" icon="right" label="Next photo" onClick={() => go(i + 1)} disabled={i === n - 1} />
        </div>
      )}
      {counter ? (
        <span className="carousel__count t-caption" aria-live="polite">{i + 1} / {counter}</span>
      ) : (
        <div className="carousel__dots">
          {photos.map((_, k) => (
            <button key={k} type="button" className={`dot ${k === i ? 'is-active' : ''}`} aria-label={`Show photo ${k + 1} of ${n}`} aria-current={k === i} onClick={() => go(k)}><span /></button>
          ))}
        </div>
      )}
      {children}
    </div>
  );
}

/** Result card · Photo first */
export function ResultCard({ property, total, nights, saved, onToggleSave, onOpen, active }) {
  return (
    <article className={`resultcard ${active ? 'is-active' : ''}`} data-id={property.id}>
      <CardPhotoCarousel photos={property.photos} name={property.name} onOpen={onOpen}>
        {property.tag && <span className="resultcard__tag"><Badge kind="tag">{property.tag}</Badge></span>}
        <span className="resultcard__fav"><Favorite saved={saved} onToggle={onToggleSave} name={property.name} /></span>
      </CardPhotoCarousel>
      <div className="resultcard__info">
        <div className="resultcard__ident">
          <div className="resultcard__names">
            <h3 className="t-title resultcard__name">
              <button type="button" className="linkbtn" onClick={onOpen}>{property.name}</button>
            </h3>
            <p className="t-caption">{property.area}</p>
          </div>
          <div className="resultcard__rating">
            <Badge kind="rating">{property.rating}</Badge>
            <p className="t-caption">{property.reviews.toLocaleString('en-US')} reviews</p>
          </div>
        </div>
        <div className="resultcard__price">
          <div>
            <p className="t-headline">{money(total)}</p>
            <p className="t-caption">for {plural(nights, 'night')}</p>
          </div>
          <IconButton icon="arrow" label={`View ${property.name}`} onClick={onOpen} />
        </div>
      </div>
    </article>
  );
}

/** Stay summary · UI Kit — compact property summary used on room, review, payment and wishlist. */
export function StaySummary({ property, line1, line2, rating = false, action, thumb = true }) {
  return (
    <div className="staysummary">
      {thumb && <img className="staysummary__img" src={property.thumb} alt="" />}
      <div className="staysummary__text">
        <div className="staysummary__top">
          <h2 className="t-label staysummary__name">{property.name}</h2>
          {rating && <Badge kind="rating">{property.rating}</Badge>}
        </div>
        {line1 && <p className="t-caption">{line1}</p>}
        {line2 && <p className="t-caption">{line2}</p>}
      </div>
      {action}
    </div>
  );
}

export function MapPin({ price, x, y, onClick, label, active }) {
  return (
    <button type="button" className={`mappin ${active ? 'is-active' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} aria-label={label} aria-pressed={active} onClick={onClick}>
      <span className="mappin__bubble t-label">{price}</span>
    </button>
  );
}

/** Compact preview shown over the map when a pin is tapped. */
export function MapCard({ property, total, nights, saved, onToggleSave, onOpen, onClose }) {
  return (
    <div className="mapcard" role="group" aria-label={`${property.name} preview`}>
      <button type="button" className="mapcard__main" onClick={onOpen}>
        <img className="mapcard__img" src={property.thumb} alt="" />
        <span className="mapcard__text">
          <span className="t-label mapcard__name">{property.name}</span>
          <span className="t-caption">{property.area} · {property.rating} · {plural(nights, 'night')}</span>
          <span className="t-title">{money(total)}</span>
        </span>
      </button>
      <Favorite saved={saved} onToggle={onToggleSave} name={property.name} />
      <IconButton tone="plain" icon="close" label="Close preview" onClick={onClose} />
    </div>
  );
}
