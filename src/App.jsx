import { useEffect } from 'react';
import { AppProvider, useApp } from './lib/store.jsx';
import { Toast } from './components/Layout.jsx';
import Home from './screens/Home.jsx';
import { Where, When, Who } from './screens/SearchSteps.jsx';
import Results from './screens/Results.jsx';
import Filters from './screens/Filters.jsx';
import Details from './screens/Details.jsx';
import Rooms from './screens/Rooms.jsx';
import Review from './screens/Review.jsx';
import Payment from './screens/Payment.jsx';
import Confirmed from './screens/Confirmed.jsx';
import { Wishlist, Compare } from './screens/Wishlist.jsx';
import Profile, { ProfileDetail } from './screens/Profile.jsx';

const SCREENS = { home: Home, where: Where, when: When, who: Who, results: Results, filters: Filters, details: Details, rooms: Rooms, review: Review, payment: Payment, confirmed: Confirmed, wishlist: Wishlist, compare: Compare, profile: Profile, profileDetail: ProfileDetail };

function Router() {
  const { s } = useApp();
  const Screen = SCREENS[s.screen] ?? Home;
  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.querySelector('[data-main]')?.focus({ preventScroll: true });
  }, [s.screen]);
  return (
    <div className="app">
      <div className="viewport" key={s.screen}><Screen /></div>
      <Toast />
    </div>
  );
}

export default function App() {
  return <AppProvider><a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.querySelector('[data-main]')?.focus(); }}>Skip to content</a><Router /></AppProvider>;
}
