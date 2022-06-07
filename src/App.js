import './App.css';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import "mapbox-gl/dist/mapbox-gl.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Map from "./pages/map/Map"
import Test from "./pages/test/Test"
import Login from './pages/login/Login';
import Tokens from './pages/tokens/Tokens';

import { useEffect } from "react";




function App() {
  // useEffect(() => {
  //   const setSafeHeight = () =>
  //     document.documentElement.style.setProperty(
  //       "--safe-height",
  //       window.innerHeight + "px"
  //     );
  //   window.addEventListener("resize", setSafeHeight);
  //   setSafeHeight();
  //   return () => window.removeEventListener("resize", setSafeHeight);
  // }, []);


  return (
    <main id="App">
      <Router>
        <Routes>
          <Route path="/map" element={<Map/>} />
          <Route path="/tokens" element={<Tokens/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/*" element={<Test/>} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;

// import React, { useRef, useEffect, useState } from 'react';
// import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

// mapboxgl.accessToken = 'pk.eyJ1IjoiYnJhZGVuNTAiLCJhIjoiY2t6dDNxN2NjNzk1NjJ1cGh6a3ZncHQzZyJ9.XwqDAeftLqXH1KMDc3QMaA';

// export default function App() {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const [lng, setLng] = useState(-70.9);
//   const [lat, setLat] = useState(42.35);
//   const [zoom, setZoom] = useState(9);

//   useEffect(() => {
//     if (map.current) return; // initialize map only once
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/streets-v11',
//       center: [lng, lat],
//       zoom: zoom
//     });
//   });

//   useEffect(() => {
//     if (!map.current) return; // wait for map to initialize
//     map.current.on('move', () => {
//       setLng(map.current.getCenter().lng.toFixed(4));
//       setLat(map.current.getCenter().lat.toFixed(4));
//       setZoom(map.current.getZoom().toFixed(2));
//     });
//   });

//   return (
//     <div>
//       <div className="sidebar">
//         Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
//       </div>
//       <div ref={mapContainer} className="map-container" />
//     </div>
//   );
// }


