import { useEffect, useRef } from 'react';
import { useApp } from '../lib/store.jsx';
import Icon from './Icon.jsx';
import Badge from './Badge.jsx';
import Button, { IconButton } from './Button.jsx';

export function Header({ onBack, backLabel = 'Back', icon = 'back', title, subtitle, right, children }) {
  return (
    <header className="header">
      {onBack && <IconButton icon={icon} label={backLabel} onClick={onBack} />}
      <div className="header__title">
        {children ?? (
          <>
            <h1 className="t-label header__h">{title}</h1>
            {subtitle && <p className="t-caption">{subtitle}</p>}
          </>
        )}
      </div>
      {right && <div className="header__right">{right}</div>}
    </header>
  );
}

export function BottomNav({ active }) {
  const { s, set, go } = useApp();
  const items = [
    { id: 'home', label: 'Home', icon: 'home', run: () => go('home') },
    { id: 'search', label: 'Search', icon: 'search', run: () => { if (!s.searchKey) set({ searchKey: 1 }); go('results'); } },
    { id: 'wishlist', label: 'Wishlist', icon: 'heart', run: () => go('wishlist'), badge: s.saved.length },
    { id: 'profile', label: 'Profile', icon: 'user', run: () => go('profile') },
  ];
  return (
    <nav className="bottomnav" aria-label="Main">
      {items.map((i) => (
        <button key={i.id} type="button" className={`bottomnav__item ${active === i.id ? 'is-active' : ''}`} aria-current={active === i.id ? 'page' : undefined} onClick={i.run}>
          <span className="bottomnav__icon">
            <Icon name={i.icon} size="control" />
            {i.badge > 0 && <span className="bottomnav__badge" aria-label={`${i.badge} saved`}>{i.badge}</span>}
          </span>
          <span className="t-caption bottomnav__label">{i.label}</span>
        </button>
      ))}
    </nav>
  );
}

/** Sticky bottom summary with the primary action. Pages add .has-bar so content clears it. */
export function PriceBar({ total, sub, action, secondary }) {
  return (
    <div className="pricebar">
      {secondary}
      <div className="pricebar__sum">
        <div className="t-title pricebar__total">{total}</div>
        {sub && <div className="t-caption">{sub}</div>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ tone = 'info', title, children, role }) {
  return (
    <div className={`notice notice--${tone}`} role={role}>
      {title && <p className="t-label notice__title">{title}</p>}
      <p className="t-caption notice__body">{children}</p>
    </div>
  );
}

export function ProgressSteps({ step, total = 3 }) {
  return (
    <div className="progress">
      <p className="t-caption progress__label">Step {step} of {total}</p>
      <div className="progress__bar" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label="Search progress">
        {Array.from({ length: total }, (_, i) => <span key={i} className={i < step ? 'is-done' : ''} />)}
      </div>
    </div>
  );
}

export function Toast() {
  const { toast, hideToast } = useApp();
  if (!toast) return null;
  return (
    <div className="toast" role="status" key={toast.id}>
      <span className="t-label toast__msg">{toast.message}</span>
      {toast.action && (
        <button type="button" className="toast__action t-label" onClick={() => { toast.action.run(); hideToast(); }}>
          {toast.action.label}
        </button>
      )}
    </div>
  );
}

export function Section({ title, sub, children, action }) {
  return (
    <section className="section">
      <div className="section__head">
        <div>
          <h2 className="t-title">{title}</h2>
          {sub && <p className="t-caption section__sub">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Modal bottom sheet (focus moves in, Escape and the scrim close it). */
export function BottomSheet({ title, onClose, children }) {
  const ref = useRef();
  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); prev?.focus?.(); };
  }, [onClose]);
  return (
    <div className="scrim" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bsheet" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <div className="bsheet__head"><h2 className="t-title">{title}</h2><IconButton tone="plain" icon="close" label="Close" onClick={onClose} /></div>
        {children}
      </div>
    </div>
  );
}

export { Badge, Button };
