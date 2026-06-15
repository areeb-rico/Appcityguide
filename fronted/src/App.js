import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';

import Home               from "./pages/User/Home/home";
import Splash             from './pages/User/splash/Splash';
import AttractionListing  from './pages/User/Attraction_listings/AttractionListing';
import SearchResult       from './pages/User/Search_results/SearchResult';
import MapsDirections     from './pages/User/Map&directions/MapsDirections';

import Login              from './pages/User/Login/Login';
import Register           from './pages/User/Register/Register';
import ForgotPassword     from './pages/User/ForgotPassword/ForgotPassword';

import ProfilePreference  from './pages/User_dash/ProfilePreference';
import Writereviews       from './pages/User_dash/Writereviews.js';

import AdminDashboard     from './pages/Admin_dash/adminDashboard.js';

import { AdminGuard, UserGuard, GuestGuard } from './components/AuthGuard';

function App() {
  return (
    <Routes>

      {/* ── PUBLIC ─ anyone can view ─────────────────────── */}
      <Route path="/"          element={<Home />} />
      <Route path="/Splash"    element={<Splash />} />
      <Route path="/listing"   element={<AttractionListing />} />
      <Route path="/searchres" element={<SearchResult />} />
      <Route path="/maps"      element={<MapsDirections />} />

      {/* ── GUEST ONLY ─ redirect away if already logged in ─ */}
      <Route path="/Login"           element={<GuestGuard><Login /></GuestGuard>} />
      <Route path="/register"        element={<GuestGuard><Register /></GuestGuard>} />
      <Route path="/forgot-password" element={<GuestGuard><ForgotPassword /></GuestGuard>} />

      {/* ── USER ONLY ─ logged-in non-admin users ───────── */}
      <Route path="/reviews"     element={<UserGuard><Writereviews /></UserGuard>} />
      <Route path="/profilepref" element={<UserGuard><ProfilePreference /></UserGuard>} />

      {/* ── ADMIN ONLY ──────────────────────────────────── */}
      <Route path="/admindash" element={<AdminGuard><AdminDashboard /></AdminGuard>} />

    </Routes>
  );
}

export default App;
