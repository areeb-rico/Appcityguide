import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/User/Home/home";
import Splash from './pages/User/splash/Splash';
import MapsDirections from './pages/User/Map&directions/MapsDirections';
import Register from './pages/User/Register/Register';
import Login from './pages/User/Login/Login';
import AttractionListing from './pages/User/Attraction_listings/AttractionListing';
import SearchResult from './pages/User/Search_results/SearchResult';
import AdminDashboard from './pages/Admin_dash/adminDashboard';
import ProfilePreference from './pages/User_dash/ProfilePreference';


function App() {
  return (
    <>

    <Routes>
     <Route path="/" element={<Home/>}/>
        <Route path="/test" element={<ProfilePreference/>}/>
      <Route path="/listing" element={<AttractionListing/>}/>
       <Route path="/Login" element={<Login/>}/>
        <Route path="/maps" element={<MapsDirections/>}/>
         <Route path="/register" element={<Register/>}/>
         <Route path="/Splash" element={<Splash />}/>
         <Route path="/searchres" element={<SearchResult />}/>
         <Route path="/admindash" element={<AdminDashboard />}/>
      </Routes>
   
   </>
  );
}

export default App;
