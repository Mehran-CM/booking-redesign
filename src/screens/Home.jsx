import { useApp, CLEAR_FILTERS } from '../lib/store.jsx';
import { BottomNav, Button, Badge, Section } from '../components/Layout.jsx';
import { Chip } from '../components/Controls.jsx';
import { IconButton } from '../components/Button.jsx';
import { HScroll, Banner, PropertyTile, IdeaCard, TypeTile } from '../components/Tiles.jsx';
import Icon from '../components/Icon.jsx';
import { byId, properties, images } from '../data/properties.js';
import { fmtDay, fmtRange, guestsText, money, nightsOf, stayTotal } from '../lib/format.js';

const tabs = [
  { id: 'stays', label: 'Stays', icon: 'bed' },
  { id: 'flights', label: 'Flights', icon: 'plane' },
  { id: 'cars', label: 'Car rental', icon: 'car' },
  { id: 'attractions', label: 'Attractions', icon: 'ticket' },
];

const types = [
  { id: 'Hotel', title: 'Hotels', icon: 'bed' },
  { id: 'Apartment', title: 'Apartments', icon: 'home' },
  { id: 'Entire home', title: 'Entire homes', icon: 'key' },
  { id: 'Guest house', title: 'Guest houses', icon: 'users' },
  { id: 'Private room', title: 'Private rooms', icon: 'bed' },
  { id: 'Hostel', title: 'Hostels', icon: 'users' },
];

function SummaryRow({ icon, label, value, onClick }) {
  return (
    <button type="button" className="summaryrow" onClick={onClick}>
      <span className="summaryrow__icon"><Icon name={icon} size="control" /></span>
      <span className="summaryrow__text">
        <span className="t-caption">{label}</span>
        <span className="t-label">{value}</span>
      </span>
    </button>
  );
}

export default function Home() {
  const { s, go, showToast, openProperty, searchWith } = useApp();
  const nights = nightsOf(s);
  const trips = [
    s.booking && { p: s.booking.property, dates: fmtRange(s.booking.checkIn, s.booking.checkOut), total: s.booking.quote.total, area: `${s.booking.property.area}, London`, fresh: true },
    { p: byId('harbor'), dates: 'Dec 11 – Dec 13', total: 284, area: 'South Bank, London' },
  ].filter(Boolean);
  const trip = trips[0];

  const recentSearches = [
    { title: s.destination, text: `${fmtRange(s.checkIn, s.checkOut)} · ${guestsText(s)}`, run: () => go('results') },
    { title: 'Greater London', text: 'Nov 5–8 · 1 adult · 1 room', run: () => searchWith({ destination: 'Greater London', destinationFull: 'Greater London, UK', adults: 1 }, { ...CLEAR_FILTERS, price: s.filters.price }) },
    { title: 'City of London', text: 'Dec 11–13 · 2 adults · 1 room', run: () => searchWith({ destination: 'City of London', destinationFull: 'City of London, UK', checkIn: new Date(2027, 11, 11), checkOut: new Date(2027, 11, 13) }, { ...CLEAR_FILTERS, price: s.filters.price }) },
  ];

  const ideas = [
    { title: 'Family stays', text: 'Family rooms and space to spread out', image: images.king, preset: { fac: ['family'] } },
    { title: 'Pet-friendly', text: 'Bring the whole crew', image: images.a, preset: { fac: ['pets'] } },
    { title: 'Spa and pool weekends', text: 'Switch off for a night or two', image: images.main, preset: { fac: ['pool'] } },
    { title: 'Great value', text: 'Total under €400', image: images.b, preset: { price: [0, 400] } },
  ];

  const recent = s.recent.map(byId);

  return (
    <div className="screen has-nav">
      <header className="homehead">
        <span className="t-title brand">Booking.com</span>
        <div className="homehead__icons">
          <IconButton tone="plain" icon="chat" label="Messages" onClick={() => showToast('Messages are outside the booking flow.')} />
          <IconButton tone="plain" icon="bell" label="Notifications" onClick={() => showToast('No new notifications.')} />
        </div>
      </header>
      <main className="page page--home" tabIndex={-1} data-main>
        <h1 className="sr-only">Find your next stay</h1>
        <div className="scrollrow" role="tablist" aria-label="What are you booking?">
          {tabs.map((t) => (
            <Chip key={t.id} icon={t.icon} selected={t.id === 'stays'} tone="brand" className="chip--pill"
              onClick={() => t.id !== 'stays' && showToast(`${t.label} isn't part of this prototype.`)}>{t.label}</Chip>
          ))}
        </div>

        <section className="searchcard" aria-label="Search stays">
          <SummaryRow icon="pin" label="Destination" value={s.destinationFull} onClick={() => go('where')} />
          <SummaryRow icon="calendar" label="Dates" value={`${fmtDay(s.checkIn)} – ${fmtDay(s.checkOut)}`} onClick={() => go('where')} />
          <SummaryRow icon="users" label="Guests" value={guestsText(s)} onClick={() => go('where')} />
          <Button block onClick={() => go('where')}>Search stays</Button>
        </section>

        <Section title="Your upcoming trip" sub={`${trip.p.name} is ready for you.`}>
          <button type="button" className="tripcard" onClick={() => go('profile')}>
            <img className="tripcard__img" src={trip.p.thumb} alt="" />
            <span className="tripcard__body">
              <span className="staysummary__top"><span className="t-label">{trip.p.name}</span><Badge kind="rating">{trip.p.rating}</Badge></span>
              <span className="t-caption">{trip.area}</span>
              <span className="t-label">{trip.dates}</span>
              <span className="t-label">{money(trip.total)} total</span>
            </span>
          </button>
        </Section>

        {s.searchKey > 0 && (
          <Section title="Continue your search">
            <HScroll label="Recent searches">
              {recentSearches.map((r) => (
                <button key={r.title} type="button" role="listitem" className="continue continue--card" onClick={r.run}>
                  <Icon name="search" size="control" />
                  <span className="continue__text"><span className="t-label">{r.title}</span><span className="t-caption">{r.text}</span></span>
                </button>
              ))}
            </HScroll>
          </Section>
        )}

        <Section title="Deals and loyalty">
          <HScroll label="Deals and loyalty">
            <Banner tone="brand" badge="Genius" title="You’re Genius Level 1" text="Save 10% or more at thousands of stays." cta="See your perks" onClick={() => go('profile')} />
            <Banner tone="sun" title="Late escape deals" text="Save on stays booked for this weekend." cta="Find deals" onClick={() => searchWith({}, { price: [0, 400] })} />
            <Banner tone="success" title="Free cancellation" text="Plans change. Book with flexibility." cta="Show flexible stays" onClick={() => searchWith({}, { freeCancel: true })} />
            <Banner tone="soft" title="Earn cashback" text="Collect rewards on every completed stay." cta="How it works" onClick={() => showToast('Rewards are outside the booking flow.')} />
          </HScroll>
        </Section>

        <Section title="Seasonal suggestions" sub="Ideas for your next trip to London.">
          <HScroll label="Seasonal suggestions">
            {ideas.map((i) => <IdeaCard key={i.title} image={i.image} title={i.title} text={i.text} onClick={() => searchWith({}, i.preset)} />)}
          </HScroll>
        </Section>

        <Section title="Recently viewed">
          <HScroll label="Recently viewed stays">
            {recent.map((p) => <PropertyTile key={p.id} property={p} total={stayTotal(p, nights)} nights={nights} onOpen={() => openProperty(p.id)} />)}
          </HScroll>
        </Section>

        <Section title="Browse by stay type">
          <HScroll label="Stay types">
            {types.map((t) => (
              <TypeTile key={t.id} icon={t.icon} title={t.title} count={properties.filter((p) => p.kind === t.id).length}
                onClick={() => searchWith({}, { types: [t.id] })} />
            ))}
          </HScroll>
        </Section>

        <Section title="Offers">
          <HScroll label="Offers">
            <Banner wide tone="soft" badge="Genius" title="Save 15% on your next stay" text="Book before the end of the month and stay any time this year." cta="Show offers" onClick={() => searchWith({}, { price: [0, 500] })} />
            <Banner wide tone="brand" title="Book direct and pay later" text="Reserve now and pay at the property with no prepayment." cta="Show stays" onClick={() => searchWith({}, { noPrepay: true })} />
          </HScroll>
        </Section>
      </main>
      <BottomNav active="home" />
    </div>
  );
}
