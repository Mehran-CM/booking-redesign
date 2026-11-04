import { useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { Badge, Button, Header } from '../components/Layout.jsx';
import { Favorite } from '../components/Controls.jsx';
import { CardPhotoCarousel } from '../components/Cards.jsx';
import Icon from '../components/Icon.jsx';
import { byId, facilityById, PHOTO_COUNT } from '../data/properties.js';
import { fmtRange, guestsText, plural, nightsOf } from '../lib/format.js';

const REVIEWS = [
  { who: 'Priya', text: 'Spotless room, quiet at night and a short walk to the river.' },
  { who: 'Marcus', text: 'Breakfast was excellent and check-in took two minutes.' },
];

export default function Details() {
  const { s, go, back, toggleSaved, showToast } = useApp();
  const p = byId(s.propertyId);
  const [open, setOpen] = useState(false);
  const offers = [
    p.breakfast && ['coffee', 'Breakfast included'],
    ...p.fac.map((id) => [facilityById[id].icon, facilityById[id].label]),
    p.freeCancel && ['calendar', 'Free cancellation on selected rooms'],
  ].filter(Boolean);
  return (
    <div className="screen has-bar">
      <Header onBack={back} title="Property Detail" right={<Favorite saved={s.saved.includes(p.id)} onToggle={() => toggleSaved(p.id, p.name)} name={p.name} />} />
      <main className="page" tabIndex={-1} data-main>
        <div className="gallery">
          <CardPhotoCarousel photos={p.photos} name={p.name} chevrons counter={PHOTO_COUNT} aspect="gallery">
            {p.tag && <span className="resultcard__tag"><Badge kind="tag">{p.tag}</Badge></span>}
          </CardPhotoCarousel>
          <div className="gallery__previews">
            <img src={p.photos[1]} alt="" />
            <button type="button" className="gallery__all" onClick={() => showToast('The full photo grid is outside this prototype.')}>
              <img src={p.photos[2]} alt="" /><span className="t-label">View all {PHOTO_COUNT} photos</span>
            </button>
          </div>
        </div>

        <div className="detail__head">
          <p className="t-caption eyebrow">{p.kind.toUpperCase()}</p>
          <h2 className="t-headline">{p.name}</h2>
          <p className="t-body muted">{p.area} · London · {p.distance} km from center</p>
          <button type="button" className="datesum" aria-expanded={open} onClick={() => setOpen(!open)}>
            <Icon name="calendar" size="control" />
            <span className="datesum__text"><span className="t-label">{fmtRange(s.checkIn, s.checkOut)} · {plural(nightsOf(s), 'night')}</span><span className="t-caption">{guestsText(s)}</span></span>
            <Icon name="down" />
          </button>
          {open && <div className="datesum__more"><Button variant="secondary" onClick={() => go('where')}>Change dates or guests</Button></div>}
        </div>

        <section className="block"><h2 className="t-title">What this place offers</h2>
          <ul className="offers">{offers.map(([ic, t]) => <li key={t}><Icon name={ic} size="control" /><span className="t-body">{t}</span></li>)}</ul>
        </section>

        <section className="block"><h2 className="t-title">Guest reviews</h2>
          <div className="reviewhead"><Badge kind="rating">{p.rating}</Badge><p className="t-body">Excellent · {p.reviews.toLocaleString('en-US')} reviews</p></div>
          {REVIEWS.map((r) => <blockquote key={r.who} className="review"><p className="t-body">“{r.text}”</p><footer className="t-caption">— {r.who}</footer></blockquote>)}
        </section>

        <section className="block"><h2 className="t-title">Location and host</h2>
          <p className="t-body">{p.area}, London. {p.distance} km from the center.</p>
          <p className="t-caption muted">Hosted by the {p.name} team. Replies within an hour.</p>
        </section>

        <section className="block"><h2 className="t-title">Policies and booking</h2>
          <dl className="policies">
            <div><dt>Check-in</dt><dd>From 15:00</dd></div>
            <div><dt>Check-out</dt><dd>Until 11:00</dd></div>
            <div><dt>Cancellation</dt><dd>{p.freeCancel ? 'Free until 3 days before check-in on selected rooms' : 'Non-refundable'}</dd></div>
          </dl>
        </section>
      </main>
      <div className="stepfooter"><Button block onClick={() => { go('rooms'); }}>Choose your room</Button></div>
    </div>
  );
}
