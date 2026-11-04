import { useId } from 'react';
import Icon from './Icon.jsx';

export function Chip({ selected = false, tone = 'brand', icon, onClick, children, className = '' }) {
  return (
    <button type="button" className={`chip chip--${tone} ${selected ? 'is-selected' : ''} ${className}`} aria-pressed={selected} onClick={onClick}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

export function Favorite({ saved, onToggle, name }) {
  return (
    <button type="button" className={`fav ${saved ? 'is-saved' : ''}`} aria-pressed={saved} aria-label={`Save ${name} to wishlist`} onClick={onToggle}>
      <span className="fav__visual"><Icon name={saved ? 'heart-filled' : 'heart'} /></span>
    </button>
  );
}

/** Radio: native input inside a labelled card. Use inside role="radiogroup". */
export function Radio({ name, value, checked, onChange, title, sub, children, className = '' }) {
  return (
    <label className={`choice choice--radio ${checked ? 'is-selected' : ''} ${className}`}>
      <input className="sr-only" type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span className="choice__mark" aria-hidden="true">{checked && <span className="choice__dot" />}</span>
      <span className="choice__text">
        <span className="t-label choice__title">{title}</span>
        {sub && <span className="t-caption choice__sub">{sub}</span>}
      </span>
      {children}
    </label>
  );
}

export function Checkbox({ checked, onChange, title, sub, right, className = '', ...rest }) {
  return (
    <label className={`choice choice--check ${checked ? 'is-selected' : ''} ${className}`}>
      <input className="sr-only" type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} {...rest} />
      <span className="choice__box" aria-hidden="true">{checked && <Icon name="check" />}</span>
      <span className="choice__text">
        <span className="t-label choice__title">{title}</span>
        {sub && <span className="t-caption choice__sub">{sub}</span>}
      </span>
      {right && <span className="t-label">{right}</span>}
    </label>
  );
}

export function Stepper({ label, sub, value, min = 0, max = 9, onChange }) {
  const id = useId();
  return (
    <div className="stepper" role="group" aria-labelledby={id}>
      <div className="stepper__text">
        <div id={id} className="t-label stepper__label">{label}</div>
        {sub && <div className="t-caption">{sub}</div>}
      </div>
      <button type="button" className="stepper__btn" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)}><Icon name="minus" size="control" /></button>
      <output className="stepper__value t-title" aria-live="polite">{value}</output>
      <button type="button" className="stepper__btn" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)}><Icon name="plus" size="control" /></button>
    </div>
  );
}

export function Field({ label, hint, error, children, className = '', ...input }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errId = `${id}-err`;
  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      <label htmlFor={id} className="t-label field__label">{label}</label>
      {children ?? (
        <input
          id={id}
          className="field__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={[error && errId, hint && hintId].filter(Boolean).join(' ') || undefined}
          {...input}
        />
      )}
      {error && <p id={errId} className="t-caption field__error">{error}</p>}
      {hint && <p id={hintId} className="t-caption field__hint">{hint}</p>}
    </div>
  );
}

/** Switch — a labelled on/off setting. */
export function Switch({ checked, onChange, title, sub }) {
  return (
    <label className="switch">
      <span className="choice__text">
        <span className="t-label choice__title">{title}</span>
        {sub && <span className="t-caption choice__sub">{sub}</span>}
      </span>
      <input className="sr-only" type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch__track" aria-hidden="true"><span className="switch__thumb" /></span>
    </label>
  );
}
