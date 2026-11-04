import { useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { BottomNav, Badge, Button, Header, Section } from '../components/Layout.jsx';
import { Field, Radio, Switch } from '../components/Controls.jsx';
import { Banner, HScroll } from '../components/Tiles.jsx';
import Icon from '../components/Icon.jsx';
import { byId } from '../data/properties.js';
import { fmtRange, money } from '../lib/format.js';

const GROUPS = [
  { title: 'Account', rows: [
    { id: 'personal', icon: 'user', label: 'Personal details' },
    { id: 'payments', icon: 'card', label: 'Payment methods' },
    { id: 'security', icon: 'key', label: 'Security' },
    { id: 'notifications', icon: 'bell', label: 'Notifications' },
  ] },
  { title: 'Preferences', rows: [
    { id: 'language', icon: 'map', label: 'Language', value: 'English' },
    { id: 'currency', icon: 'wallet', label: 'Currency', value: 'Euro (€)' },
  ] },
  { title: 'Support', rows: [
    { id: 'help', icon: 'chat', label: 'Help center' },
    { id: 'legal', icon: 'list', label: 'Terms and privacy' },
  ] },
];

export default function Profile() {
  const { s, set, go, showToast } = useApp();
  const trips = [
    s.booking && { id: 'new', p: s.booking.property, dates: fmtRange(s.booking.checkIn, s.booking.checkOut), total: s.booking.quote.total, status: 'Confirmed' },
    { id: 'dec', p: byId('harbor'), dates: 'Dec 11 – Dec 13', total: 284, status: 'Upcoming' },
  ].filter(Boolean);
  const initials = `${s.guest.first[0] ?? ''}${s.guest.last[0] ?? ''}`.toUpperCase();
  const open = (id) => {
    if (id === 'legal') return showToast('Legal pages are outside the booking flow.');
    set({ profileSub: id });
    go('profileDetail');
  };
  return (
    <div className="screen has-nav">
      <Header title="Profile" />
      <main className="page page--stack" tabIndex={-1} data-main>
        <section className="card usercard">
          <span className="avatar" aria-hidden="true">{initials}</span>
          <div className="usercard__text">
            <h2 className="t-title">{s.guest.first} {s.guest.last}</h2>
            <p className="t-caption">{s.guest.email}</p>
            <Badge kind="tag" icon="star">Genius Level 1</Badge>
          </div>
        </section>

        <section className="card" aria-label="Genius progress">
          <p className="t-label">{s.booking ? '1 more booking to reach Genius Level 2' : '2 more bookings to reach Genius Level 2'}</p>
          <div className="meter" role="progressbar" aria-valuemin={0} aria-valuemax={2} aria-valuenow={s.booking ? 1 : 0} aria-label="Progress to Genius Level 2"><span style={{ width: s.booking ? '50%' : '8%' }} /></div>
          <p className="t-caption">Level 2 unlocks 15% off and free room upgrades.</p>
        </section>

        <div className="stats">
          <div><p className="t-headline">{trips.length}</p><p className="t-caption">Trips</p></div>
          <div><p className="t-headline">{s.saved.length}</p><p className="t-caption">Saved stays</p></div>
          <div><p className="t-headline">3</p><p className="t-caption">Reviews</p></div>
        </div>

        <Section title="Your trips">
          <HScroll label="Your trips">
            {trips.map((t) => (
              <article key={t.id} role="listitem" className={`ptile ptile--trip ${t.id === 'new' ? 'is-selected' : ''}`}>
                <img className="ptile__img" src={t.p.photos[0]} alt="" />
                <div className="ptile__body">
                  <span className="t-label">{t.p.name}</span>
                  <span className="t-caption">{t.dates}</span>
                  <span className="ptile__row"><Badge kind={t.status === 'Confirmed' ? 'cancellation' : 'breakfast'}>{t.status}</Badge><span className="t-label">{money(t.total)}</span></span>
                </div>
              </article>
            ))}
          </HScroll>
        </Section>

        <HScroll label="Invitations">
          <Banner tone="brand" title="Invite a friend" text="Share your link and you both get a travel reward." cta="Share link" onClick={() => showToast('Sharing is outside the booking flow.')} />
          <Banner tone="soft" badge="Genius" title="Your Genius perks" text="Discounts, free breakfast and room upgrades." cta="See perks" onClick={() => showToast('Perks are outside the booking flow.')} />
        </HScroll>

        {GROUPS.map((g) => (
          <section key={g.title}>
            <h2 className="t-title listtitle">{g.title}</h2>
            <ul className="actionlist actionlist--page">
              {g.rows.map((r) => (
                <li key={r.id}>
                  <button type="button" onClick={() => open(r.id)}>
                    <Icon name={r.icon} size="control" /><span className="t-body">{r.label}</span>
                    {r.value && <span className="t-caption">{r.value}</span>}
                    <Icon name="right" size="control" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <Button variant="secondary" block onClick={() => showToast('Signing out is outside the booking flow.')}>Sign out</Button>
      </main>
      <BottomNav active="profile" />
    </div>
  );
}

const FAQ = [
  ['How do I change or cancel a booking?', 'Open your trip, choose Manage booking, then change dates or cancel. Free cancellation applies until the date shown on your confirmation.'],
  ['When is my card charged?', 'Refundable rooms charge a deposit now and the rest at the property. Non-refundable rooms charge the full amount when you book.'],
  ['Where is my confirmation?', 'We email it to the address on your booking and keep a copy under Your trips.'],
  ['How do Genius perks work?', 'Genius members see lower prices and extra benefits on eligible stays, marked with the Genius badge.'],
];

export function ProfileDetail() {
  const { s, set, back, showToast } = useApp();
  const sub = s.profileSub;
  const [g, setG] = useState(s.guest);
  const [lang, setLang] = useState('en');
  const [cur, setCur] = useState('eur');
  const [sec, setSec] = useState({ twofa: false, alerts: true });
  const titles = { personal: 'Personal details', payments: 'Payment methods', security: 'Security', notifications: 'Notifications', language: 'Language', currency: 'Currency', help: 'Help center' };
  return (
    <div className="screen">
      <Header onBack={back} title={titles[sub]} />
      <main className="page page--stack" tabIndex={-1} data-main>
        {sub === 'personal' && (
          <section className="card">
            <div className="grid2">
              <Field label="First name" value={g.first} onChange={(e) => setG({ ...g, first: e.target.value })} autoComplete="given-name" />
              <Field label="Last name" value={g.last} onChange={(e) => setG({ ...g, last: e.target.value })} autoComplete="family-name" />
            </div>
            <Field label="Email address" type="email" value={g.email} onChange={(e) => setG({ ...g, email: e.target.value })} autoComplete="email" />
            <Button onClick={() => { set({ guest: g, pay: { ...s.pay, name: `${g.first} ${g.last}` } }); showToast('Personal details saved.'); }}>Save changes</Button>
          </section>
        )}
        {sub === 'payments' && (
          <>
            <section className="card"><div className="staysummary__top"><span className="t-label">Visa ending 1111</span><Badge kind="breakfast">Default</Badge></div><p className="t-caption">Expires 08 / 28 · {s.guest.first} {s.guest.last}</p></section>
            <Button variant="secondary" onClick={() => showToast('Cards are added during payment.')}>Add a payment method</Button>
          </>
        )}
        {sub === 'security' && (
          <section className="card">
            <Switch checked={sec.twofa} onChange={(v) => setSec({ ...sec, twofa: v })} title="Two-step verification" sub="Ask for a code when you sign in on a new device." />
            <Switch checked={sec.alerts} onChange={(v) => setSec({ ...sec, alerts: v })} title="Sign-in alerts" sub="Email me when someone signs in." />
            <Button variant="secondary" onClick={() => showToast('Password changes are outside the booking flow.')}>Change password</Button>
          </section>
        )}
        {sub === 'notifications' && (
          <section className="card">
            {[['deals', 'Deals and offers', 'Price drops and member-only offers.'], ['trips', 'Trip updates', 'Check-in details and booking changes.'], ['messages', 'Messages from properties', 'Replies from hosts and front desks.'], ['news', 'Travel inspiration', 'Ideas and guides, once a week.']].map(([k, t, d]) => (
              <Switch key={k} checked={s.notif[k]} onChange={(v) => set({ notif: { ...s.notif, [k]: v } })} title={t} sub={d} />
            ))}
          </section>
        )}
        {sub === 'language' && (
          <div role="radiogroup" aria-label="Language" className="stackgap">
            {[['en', 'English'], ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español']].map(([k, l]) => <Radio key={k} name="lang" value={k} checked={lang === k} title={l} sub={k === 'en' ? 'Current' : undefined} onChange={(v) => (v === 'en' ? setLang(v) : showToast(`${l} isn’t available in this prototype.`))} />)}
          </div>
        )}
        {sub === 'currency' && (
          <div role="radiogroup" aria-label="Currency" className="stackgap">
            {[['eur', 'Euro (€)'], ['gbp', 'British pound (£)'], ['usd', 'US dollar ($)']].map(([k, l]) => <Radio key={k} name="cur" value={k} checked={cur === k} title={l} onChange={(v) => (v === 'eur' ? setCur(v) : showToast('Prices stay in euros in this prototype.'))} />)}
          </div>
        )}
        {sub === 'help' && (
          <>
            <ul className="faq">{FAQ.map(([q, a]) => <li key={q}><details><summary className="t-label">{q}</summary><p className="t-body">{a}</p></details></li>)}</ul>
            <Button variant="secondary" icon="chat" onClick={() => showToast('Support chat is outside the booking flow.')}>Contact customer service</Button>
          </>
        )}
      </main>
    </div>
  );
}
