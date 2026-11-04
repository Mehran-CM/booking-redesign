import Icon from './Icon.jsx';

/** One source for every small label: rating, tag, cancellation, breakfast, non-refundable, genius, count. */
export default function Badge({ kind, children, icon }) {
  return (
    <span className={`badge badge--${kind}`}>
      {icon && <Icon name={icon} />}
      {children}
    </span>
  );
}
