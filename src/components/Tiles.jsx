import Badge from './Badge.jsx';
import Icon from './Icon.jsx';
import { money, plural } from '../lib/format.js';

/** Horizontal scroller with snap points. */
export function HScroll({ label, children }) {
  return <div className="hscroll" role="list" aria-label={label}>{children}</div>;
}

/** Banner — promotional card. tone: brand | soft | success | sun. */
export function Banner({ tone = 'soft', badge, title, text, cta, icon, onClick, wide = false }) {
  return (
    <button type="button" role="listitem" className={`banner banner--${tone} ${wide ? 'banner--wide' : ''}`} onClick={onClick}>
      {badge && <Badge kind="tag">{badge}</Badge>}
      {icon && <span className="banner__icon"><Icon name={icon} size="control" /></span>}
      <span className="t-title banner__title">{title}</span>
      <span className="t-caption banner__text">{text}</span>
      {cta && <span className="t-label banner__cta">{cta} <Icon name="right" /></span>}
    </button>
  );
}

/** Compact property card for horizontal lists (recently viewed, similar stays). */
export function PropertyTile({ property, total, nights, onOpen }) {
  return (
    <button type="button" role="listitem" className="ptile" onClick={onOpen}>
      <img className="ptile__img" src={property.photos[0]} alt="" />
      <span className="ptile__body">
        <span className="t-label ptile__name">{property.name}</span>
        <span className="t-caption">{property.area}</span>
        <span className="ptile__row"><Badge kind="rating">{property.rating}</Badge><span className="t-label">{money(total)}</span></span>
        <span className="t-caption">{plural(nights, 'night')}</span>
      </span>
    </button>
  );
}

/** Photo card with a caption — seasonal ideas and destinations. */
export function IdeaCard({ image, title, text, onClick }) {
  return (
    <button type="button" role="listitem" className="idea" onClick={onClick}>
      <img className="idea__img" src={image} alt="" />
      <span className="idea__body"><span className="t-label">{title}</span><span className="t-caption">{text}</span></span>
    </button>
  );
}

/** Icon tile — stay types. */
export function TypeTile({ icon, title, count, onClick }) {
  return (
    <button type="button" role="listitem" className="typetile" onClick={onClick}>
      <span className="typetile__icon"><Icon name={icon} size="control" /></span>
      <span className="t-label">{title}</span>
      <span className="t-caption">{plural(count, 'property', 'properties')}</span>
    </button>
  );
}
