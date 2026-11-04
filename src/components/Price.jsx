import { money, fmtShort, plural } from '../lib/format.js';

/**
 * Price Details — one component for review, payment and confirmation.
 * mode: 'review' (full breakdown) | 'payment' (compact total + pay-at-property) | 'confirmed' (paid at booking)
 */
export default function PriceDetails({ quote, nights, checkIn, mode = 'review', expanded = false, extras }) {
  const showBreakdown = mode !== 'payment' || expanded;
  const first = mode === 'confirmed' ? 'Paid at booking' : 'Pay now';
  return (
    <section className={`pricedetails pricedetails--${mode}`} aria-label="Price details">
      {mode !== 'payment' && <h3 className="t-title">{mode === 'confirmed' ? 'Payment summary' : 'Price details'}</h3>}
      {showBreakdown && (
        <dl className="pricedetails__rows">
          <div><dt>Room ({money(quote.nightly)} × {plural(nights, 'night')})</dt><dd>{money(quote.roomCost)}</dd></div>
          <div><dt>Taxes &amp; fees</dt><dd>{money(quote.taxes)}</dd></div>
        </dl>
      )}
      <dl className={`pricedetails__rows ${showBreakdown ? 'pricedetails__totalrow' : ''}`}>
        <div className="pricedetails__total"><dt className="t-label">Total</dt><dd className="t-title">{money(quote.total)}</dd></div>
      </dl>
      {mode === 'payment' ? (
        quote.atProperty > 0 && (
          <dl className="pricedetails__rows">
            <div><dt>Pay at property · {fmtShort(checkIn)}</dt><dd>{money(quote.atProperty)}</dd></div>
          </dl>
        )
      ) : (
        <dl className="pricedetails__schedule">
          <div className={`pricedetails__now ${mode === 'confirmed' ? 'is-paid' : ''}`}><dt className="t-label">{first}</dt><dd className="t-label">{money(quote.payNow)}</dd></div>
          {quote.atProperty > 0 && <div><dt>Pay at property · {fmtShort(checkIn)}</dt><dd>{money(quote.atProperty)}</dd></div>}
        </dl>
      )}
      {extras}
    </section>
  );
}
