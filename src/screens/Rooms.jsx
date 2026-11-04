import { useApp, currentQuote } from '../lib/store.jsx';
import { Badge, Button, Header, PriceBar } from '../components/Layout.jsx';
import { Radio, Checkbox } from '../components/Controls.jsx';
import { StaySummary } from '../components/Cards.jsx';
import { fmtRange, fmtShort, addDays, money, plural, roomQuote, nightsOf, adultsText } from '../lib/format.js';

export default function Rooms() {
  const { s, set, go, back } = useApp();
  const q = currentQuote(s);
  const p = q.property;
  const nights = nightsOf(s);
  const cancelBy = fmtShort(addDays(s.checkIn, -3));
  return (
    <div className="screen has-bar">
      <Header onBack={back} title={p.name} />
      <main className="page page--stack" tabIndex={-1} data-main>
        <StaySummary property={p} rating line1={`${p.area}, London`} line2={`${fmtRange(s.checkIn, s.checkOut)} · ${plural(nights, 'night')} · ${adultsText(s)}`} />
        <div>
          <h2 className="t-title">{plural(p.rooms.length, 'room option')} available</h2>
          <p className="t-caption">Prices include all mandatory charges. Pick one room to continue.</p>
        </div>
        <div role="radiogroup" aria-label="Room options" className="rooms">
          {p.rooms.map((r) => {
            const rq = roomQuote(p, r, nights);
            const sel = r.id === s.roomId;
            return (
              <div key={r.id} className={`roomcard ${sel ? 'is-selected' : ''}`}>
                <img className="roomcard__img" src={r.photo} alt="" />
                <div className="roomcard__body">
                  <h3 className="t-title">{r.name}</h3>
                  <p className="t-caption">{r.bed} · Sleeps {r.sleeps}</p>
                  <div className="badges">
                    {p.breakfast && <Badge kind="breakfast">Breakfast included</Badge>}
                    {r.refundable ? <Badge kind="cancellation">Free cancellation until {cancelBy}</Badge> : <Badge kind="nonrefundable">Non-refundable</Badge>}
                  </div>
                  <p className="t-caption">{r.refundable ? `Pay ${money(rq.payNow)} now · ${money(rq.atProperty)} at property` : 'Full amount payable now'}</p>
                  <div className="roomcard__price">
                    <span className="t-caption">{money(rq.nightly)} per night × {nights}</span>
                    <span className="t-headline">{money(rq.total)} total</span>
                  </div>
                </div>
                <Radio name="room" value={r.id} checked={sel} onChange={(v) => set({ roomId: v })} title={sel ? 'Selected room' : 'Select this room'} className="roomcard__radio" />
              </div>
            );
          })}
        </div>
        <section>
          <h2 className="t-title">Optional extras</h2>
          <Checkbox className="extra" checked={s.transfer} onChange={(v) => set({ transfer: v })} title="Airport transfer" sub="One way · optional extra" right="+€45" />
        </section>
      </main>
      <PriceBar total={`${money(q.total)} total`} sub={`${plural(nights, 'night')} · incl. taxes & fees${s.transfer ? ' · transfer billed separately' : ''}`}
        action={<Button onClick={() => go('review')}>Continue</Button>} />
    </div>
  );
}
