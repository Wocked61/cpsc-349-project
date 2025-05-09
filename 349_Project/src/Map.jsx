import React, { useState, useEffect, useRef } from "react";
import "./Map.css";
import Footer from "./Footer";

export default function Map({ currentLocation, searchHistory }) {
  const mapRef = useRef(null);
  const markersRef = useRef({});
  
  const defaultCoords = [34.052235, -118.243683];

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) {
        mapRef.current = L.map('map').setView(defaultCoords, 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
        
        // Add default marker for Los Angeles
        markersRef.current["Los Angeles"] = L.marker(defaultCoords)
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
    if (mapRef.current && currentLocation && currentLocation.lat && currentLocation.lon) {
      const coords = [currentLocation.lat, currentLocation.lon];
      
      if (markersRef.current[currentLocation.name]) {
        mapRef.current.removeLayer(markersRef.current[currentLocation.name]);
      }
      
      markersRef.current[currentLocation.name] = L.marker(coords)
        .addTo(mapRef.current)
        .bindPopup(`
          <strong>${currentLocation.name}</strong><br>
          ${currentLocation.temp.toFixed(1)}°F - ${currentLocation.description}
          <img src="https://openweathermap.org/img/wn/${currentLocation.icon}.png" alt="weather icon">
        `)
        .openPopup();
      
      mapRef.current.setView(coords, 10);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (mapRef.current && searchHistory.length > 0) {
      searchHistory.forEach(location => {
        const coords = [location.lat, location.lon];
        
        if (markersRef.current[location.name]) {
          return;
        }
        
        markersRef.current[location.name] = L.marker(coords)
          .addTo(mapRef.current)
          .bindPopup(`
            <strong>${location.name}</strong><br>
            ${location.temp.toFixed(1)}°F - ${location.description}
            <img src="https://openweathermap.org/img/wn/${location.icon}.png" alt="weather icon">
          `);
      });
      
      if (searchHistory.length > 1) {
        const bounds = [];
        searchHistory.forEach(location => {
          bounds.push([location.lat, location.lon]);
        });
        
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [searchHistory]);

  return (
    <div>
      <div className="map-container">
        <div id="map"></div>
      </div>
    </div>
  );
}