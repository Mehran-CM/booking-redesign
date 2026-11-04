import { useRef, useState } from 'react';
import { useApp, currentQuote } from '../lib/store.jsx';
import { Button, Header, Notice, PriceBar } from '../components/Layout.jsx';
import { Field, Radio } from '../components/Controls.jsx';
import { StaySummary } from '../components/Cards.jsx';
import { BookingSummary } from './Review.jsx';
import PriceDetails from '../components/Price.jsx';
import { addDays, fmtShort, money } from '../lib/format.js';

const luhn = (n) => {
  let sum = 0, alt = false;
  for (let i = n.length - 1; i >= 0; i--) { let d = +n[i]; if (alt) { d *= 2; if (d > 9) d -= 9; } sum += d; alt = !alt; }
  return n.length >= 13 && sum % 10 === 0;
};
const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const fmtExp = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d; };

function validate(p) {
  const e = {};
  if (!p.name.trim()) e.name = 'Enter the name on your card.';
  const digits = p.number.replace(/\D/g, '');
  if (!digits) e.number = 'Enter your card number.';
  else if (!luhn(digits)) e.number = 'This card number isn’t valid. Check it and try again.';
  const [mm, yy] = p.expiry.replace(/\s/g, '').split('/');
  if (!p.expiry) e.expiry = 'Enter the expiry date.';
  else if (!(+mm >= 1 && +mm <= 12) || !yy || yy.length !== 2) e.expiry = 'Use the format MM / YY.';
  else if (2000 + +yy < 2027 || (2000 + +yy === 2027 && +mm < 10)) e.expiry = 'This card has expired.';
  if (!/^\d{3,4}$/.test(p.cvc)) e.cvc = 'Enter the 3 or 4 digit security code.';
  return e;
}

export default function Payment() {
  const { s, set, go, back } = useApp();
  const q = currentQuote(s);
  const p = s.pay;
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | pending | failed
  const [expanded, setExpanded] = useState(false);
  const ref = useRef();
  const cancelBy = fmtShort(addDays(s.checkIn, -3));
  const setP = (patch) => set({ pay: { ...p, ...patch } });

  const submit = () => {
    if (status === 'pending') return; // no duplicate submissions
    if (p.method === 'card') {
      const e = validate(p);
      setErrors(e);
      setStatus('idle'); // pre-submission errors never show together with a bank failure
      const bad = Object.keys(e)[0];
      if (bad) return ref.current.querySelector(`[name=${bad}]`)?.focus();
    }
    setStatus('pending');
    setTimeout(() => {
      const declined = p.method === 'card' && p.number.replace(/\D/g, '').endsWith('0002');
      if (declined) { setStatus('failed'); window.scrollTo({ top: 0 }); return; }
      set({
        booking: { propertyId: q.property.id, property: q.property, room: q.room, checkIn: s.checkIn, checkOut: s.checkOut, quote: { ...q }, guest: s.guest, transfer: s.transfer, adults: s.adults, children: s.children, rooms: s.rooms, email: s.guest.email },
      });
      go('confirmed', { replace: true });
    }, 1400);
  };

  const err = Object.keys(errors).length;
  return (
    <div className="screen has-bar">
      <Header onBack={back} title="Payment" />
      <main className="page page--stack" tabIndex={-1} data-main>
        {status === 'failed' && <Notice tone="error" role="alert" title="Payment didn’t go through">Your card was declined. Check the card details or choose another payment method. You have not been charged.</Notice>}
        <BookingSummary q={q} s={s} onChange={() => go('rooms')} />
        <section className="paynow" aria-label="Amount due now">
          <p className="t-label">{status === 'failed' ? 'Charged now' : 'Pay now'}</p>
          <p className="t-headline">{money(q.payNow)}</p>
          <p className="t-caption">Part of your {money(q.total)} total</p>
        </section>
        <PriceDetails quote={q} nights={q.nights} checkIn={s.checkIn} mode="payment" expanded={expanded} />
        <Button variant="text" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide price details' : 'View full price details'}</Button>

        <section>
          <h2 className="t-title">Payment method</h2>
          <div role="radiogroup" aria-label="Payment method" className="stackgap">
            <Radio name="method" value="card" checked={p.method === 'card'} onChange={(v) => setP({ method: v })} title="Credit or debit card" sub="Visa · Mastercard · Amex" />
            <Radio name="method" value="wallet" checked={p.method === 'wallet'} onChange={(v) => setP({ method: v })} title="Digital wallet" sub="Pay from a saved wallet" />
          </div>
        </section>

        {p.method === 'card' && (
          <section ref={ref}>
            <h2 className="t-title">Card details</h2>
            {err > 0 && <Notice tone="error" role="alert" title={`Fix ${err} ${err === 1 ? 'field' : 'fields'} to continue`}>{Object.values(errors)[0]}</Notice>}
            <fieldset className="fieldset" disabled={status === 'pending'}>
              <Field label="Name on card" name="name" autoComplete="cc-name" value={p.name} onChange={(e) => setP({ name: e.target.value })} error={errors.name} />
              <Field label="Card number" name="number" inputMode="numeric" autoComplete="cc-number" value={p.number} onChange={(e) => setP({ number: fmtCard(e.target.value) })} error={errors.number} hint="Visa · Mastercard · Amex" />
              <div className="grid2">
                <Field label="Expiry" name="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={p.expiry} onChange={(e) => setP({ expiry: fmtExp(e.target.value) })} error={errors.expiry} />
                <Field label="Security code" name="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="CVC" type="password" value={p.cvc} onChange={(e) => setP({ cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} error={errors.cvc} />
              </div>
            </fieldset>
          </section>
        )}

        <Notice title="Before you pay">
          {q.room.refundable ? `Free cancellation until ${cancelBy}. After that, the ${money(q.payNow)} you pay now is non-refundable. ${money(q.atProperty)} is due at the property on ${fmtShort(s.checkIn)}.` : `This rate is non-refundable. The full ${money(q.total)} is charged now.`}
        </Notice>
      </main>
      <PriceBar total={status === 'failed' ? money(q.payNow) : `${money(q.total)} total`}
        sub={status === 'failed' ? 'Charged now' : `${money(q.payNow)} today${q.atProperty ? ` · ${money(q.atProperty)} at property` : ''}`}
        action={<Button loading={status === 'pending'} onClick={submit}>{status === 'pending' ? 'Processing…' : status === 'failed' ? `Try again · pay ${money(q.payNow)}` : `Pay ${money(q.payNow)} now`}</Button>} />
      <p className="sr-only" role="status">{status === 'pending' ? 'Processing your payment' : ''}</p>
    </div>
  );
}
