import Icon from './Icon.jsx';

/** Primary / secondary / text button. States: default, :active (pressed), :focus-visible, loading, disabled. */
export default function Button({ variant = 'primary', loading = false, disabled = false, icon, block = false, children, className = '', onClick, ...rest }) {
  const inert = loading || disabled;
  return (
    <button
      type="button"
      className={`btn btn--${variant} ${block ? 'btn--block' : ''} ${loading ? 'is-loading' : ''} ${className}`}
      aria-busy={loading || undefined}
      aria-disabled={inert || undefined}
      onClick={inert ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {loading && <span className="spinner" aria-hidden="true" />}
      {icon && <Icon name={icon} />}
      <span>{children}</span>
    </button>
  );
}

export function IconButton({ icon, label, onClick, tone = 'soft', size = 'icon', ...rest }) {
  return (
    <button type="button" className={`iconbtn iconbtn--${tone}`} aria-label={label} onClick={onClick} {...rest}>
      <span className="iconbtn__visual"><Icon name={icon} size={size} /></span>
    </button>
  );
}
