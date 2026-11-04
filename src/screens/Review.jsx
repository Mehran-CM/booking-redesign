import { useRef, useState } from 'react';
import { useApp, currentQuote } from '../lib/store.jsx';
import { Button, Header, Notice, PriceBar } from '../components/Layout.jsx';
import { Field } from '../components/Controls.jsx';
import { StaySummary } from '../components/Cards.jsx';
import PriceDetails from '../components/Price.jsx';
import { addDays, fmtRange, fmtShort, money, plural, adultsText } from '../lib/format.js';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function BookingSummary({ q, s, onChange }) {
  return (
    <StaySummary property={q.property} line1={`${q.room.short} · ${fmtRange(s.checkIn, s.checkOut)} · ${adultsText(s)}`}
      action={onChange && <Button variant="text" onClick={onChange}>Change</Button>} />
  );
}

export default function Review() {
  const { s, set, go, back } = useApp();
  const q = currentQuote(s);
  const [g, setG] = useState(s.guest);
  const [errors, setErrors] = useState({});
  const form = useRef();
  const cancelBy = fmtShort(addDays(s.checkIn, -3));

  const submit = () => {
    const e = {};
    if (!g.first.trim()) e.first = 'Enter your first name.';
    if (!g.last.trim()) e.last = 'Enter your last name.';
    if (!emailOk(g.email)) e.email = 'Enter a valid email address, like name@example.com.';
    setErrors(e);
    const bad = Object.keys(e)[0];
    if (bad) return form.current.querySelector(`[name=${bad}]`)?.focus();
    set({ guest: g, pay: { ...s.pay, name: `${g.first} ${g.last}` } });
    go('payment');
  };
  const upd = (k) => (e) => setG({ ...g, [k]: e.target.value });

  return (
    <div className="screen has-bar">
      <Header onBack={back} title="Review reservation" />
      <main className="page page--stack" tabIndex={-1} data-main>
        <BookingSummary q={q} s={s} onChange={() => go('rooms')} />
        <section ref={form} noValidate>
          <h2 className="t-title">Guest details</h2>
          <p className="t-caption">We’ll use these details for your booking confirmation.</p>
          {Object.keys(errors).length > 0 && <p className="sr-only" role="alert">{Object.keys(errors).length} fields need attention.</p>}
          <div className="grid2">
            <Field label="First name" name="first" autoComplete="given-name" value={g.first} onChange={upd('first')} error={errors.first} />
            <Field label="Last name" name="last" autoComplete="family-name" value={g.last} onChange={upd('last')} error={errors.last} />
          </div>
          <Field label="Email address" name="email" type="email" autoComplete="email" value={g.email} onChange={upd('email')} error={errors.email} hint="We’ll send your confirmation here." />
        </section>
        <section>
          <h2 className="t-title">Price &amp; cancellation</h2>
          {q.room.refundable
            ? <Notice title={`Free cancellation until ${cancelBy} at 11:59 PM`}>After that, the {money(q.payNow)} you pay now is non-refundable.</Notice>
            : <Notice tone="error" title="Non-refundable rate">The full {money(q.total)} is charged now and can’t be refunded.</Notice>}
        </section>
        <PriceDetails quote={q} nights={q.nights} checkIn={s.checkIn} mode="review"
          extras={<>
            {s.transfer && <p className="t-caption pricedetails__note">Airport transfer €45 is billed separately and isn’t included in the total.</p>}
            <p className="t-caption pricedetails__note">Includes VAT and city tax. No other charges at the property.</p>
          </>} />
      </main>
      <PriceBar total={`${money(q.total)} total`} sub={`${money(q.payNow)} due today`} action={<Button onClick={submit}>Continue to payment</Button>} />
    </div>
  );
}
