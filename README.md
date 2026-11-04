# Booking redesign — web happy flow

React + Vite build of the redesigned Booking.com mobile flow (English, LTR, Latin digits, € prices).
Source: Figma file `ewVZ0cjX5zwgo6gKyiHPNh`, **prototype** page, plus `DESIGN.md`, `tokens.json`, `components.md`.

```bash
npm install
npm run dev          # http://localhost:5188
npm run lint:tokens  # fails on raw hex / rgb() / px outside the generated token file
```

## Main flow
Home → Where to → When → Who's coming → Search results (loading · error · map expanded · full map · save/undo) →
Filters → Property details → Select room → Review reservation → Payment (blank-field errors · pending · bank failure) → Booking confirmed.
Supporting: Wishlist (empty · select · remove + undo) → Compare stays (differences only), Profile (+ personal details, payment methods, security, notifications, language, currency, help).

## Beyond the Figma frames
Built from the same tokens and components, not from Figma frames:
- **Home:** horizontal rows (recent searches, deals and loyalty banners, seasonal ideas, recently viewed, stay types, offers).
- **Search results:** map-first like Airbnb. The map is sticky; the list sheet slides over it as you scroll, pins highlight for the card in view, tapping a pin opens a preview card, and a floating Map pill returns you to the map. Sort sheet and a chip row with every quick filter.
- **Filters:** all groups — sort, popular, type, price, review score, size, stars, meals and payment, 14 facilities, distance. 10 stays so every filter changes the list.

## Try the edge states
- Blank payment fields: press **Pay** with empty expiry/CVC → field errors only.
- Bank failure: use a card number ending `0002` (e.g. `4000 0000 0000 0002`) → failed state, input preserved.
- Offline: go offline in DevTools while on Search results → error state with **Try again**.
- Non-refundable room: pick *King Room with View* → full amount charged now.

## Structure
- `src/tokens/tokens.json` → `scripts/gen-tokens.mjs` → `src/styles/tokens.css` (generated; the only place with raw values).
- `src/components/` one file per shared component (Button, Badge, Chip, Favorite, Radio, Checkbox, Stepper, Field, Header, BottomNav, PriceBar, PriceDetails, ResultCard, CardPhotoCarousel, StaySummary, MapPin, Notice, Toast).
- `src/screens/` one file per screen; `src/lib/store.jsx` holds booking state and history-based navigation.

## Known gaps / assumptions
- `flows.md` and `motion.md` are unfilled templates, so states come from the Figma prototype page.
- Only Harbor House has Figma copy; the two other stays and all room data besides Harbor House are invented to keep totals consistent (cards, pins and pricing use one calculation).
- Price filter starts unrestricted (€0–€1,000); Figma's €80–€250 would hide every €612 result.
- Extra stays, deals, FAQ and profile copy are invented placeholders.
- Photos are exported from Figma at 1× and repeat across stays; gallery shows "1 / 12" over three images.
- Not built: sign-in/verification screens, "View all photos" grid, a full Trips screen (trips show in Profile), other languages/currencies.
- Contrast, zoom/reflow and screen-reader behaviour have not been audited.
