import React, { useState, useEffect, useRef } from "react";
import "./Map.css";
import Footer from "./Footer";

//this API doesnt need a key use the link below to get the information
// the documentation is in this link https://leafletjs.com/examples/quick-start/


export default function Map() {
  const mapRef = useRef(null);

  useEffect(() => {
    // Create map instance after Leaflet is loaded
    const initMap = () => {
      if (!mapRef.current) {
        const laCoords = [34.052235, -118.243683];
        
        mapRef.current = L.map('map').setView(laCoords, 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
        
        L.marker(laCoords)
          .addTo(mapRef.current)
          .bindPopup('Los Angeles, CA')
          .openPopup();
      }
    };
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);
  
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div className="map-container">
        <div id="map"></div>
      </div>
      <Footer />
    </div>

  );
}