import React, { useState, useEffect, useRef } from "react";
import "./Map.css";
import Footer from "./Footer";

export default function Map({ searchLocation }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  
  const defaultCoords = [34.052235, -118.243683];

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) {
        mapRef.current = L.map('map').setView(defaultCoords, 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
        
        markerRef.current = L.marker(defaultCoords)
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

  useEffect(() => {
    if (mapRef.current && searchLocation && searchLocation.lat && searchLocation.lon) {
      // Remove previous marker
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }
      
      const newCoords = [searchLocation.lat, searchLocation.lon];
      markerRef.current = L.marker(newCoords)
        .addTo(mapRef.current)
        .bindPopup(searchLocation.name || 'Searched Location')
        .openPopup();
      
      mapRef.current.setView(newCoords, 10);
    }
  }, [searchLocation]);

  return (
    <div>
      <div className="map-container">
        <div id="map"></div>
      </div>
      <Footer />
    </div>
  );
}