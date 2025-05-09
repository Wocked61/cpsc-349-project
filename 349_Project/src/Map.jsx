import React, { useState, useEffect, useRef } from "react";
import "./Map.css";

export default function Map({ currentLocation, searchHistory }) {
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const mapInitializedRef = useRef(false);
  
  const defaultCoords = [34.052235, -118.243683];

  useEffect(() => {
    const initMap = () => {
      if (!window.L) {
        console.error("Leaflet is not loaded!");
        return;
      }
      
      if (!mapRef.current) {
        const startCoords = currentLocation && currentLocation.lat && currentLocation.lon ? 
          [currentLocation.lat, currentLocation.lon] : defaultCoords;
        
        mapRef.current = L.map('map').setView(startCoords, 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapRef.current);
        
        mapInitializedRef.current = true;
      }
    };

    if (!window.L) {
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
    } else {
      initMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        mapInitializedRef.current = false;
      }
    };
  }, []);
  useEffect(() => {
    if (!mapInitializedRef.current || !window.L) return;
    
    if (mapRef.current && currentLocation && currentLocation.lat && currentLocation.lon) {
      const coords = [currentLocation.lat, currentLocation.lon];
      
      if (markersRef.current[currentLocation.name]) {
        mapRef.current.removeLayer(markersRef.current[currentLocation.name]);
      }
      
      const currentLocationIcon = L.divIcon({
        className: 'current-location-marker',
        html: `<div class="pulse-marker"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      markersRef.current[currentLocation.name] = L.marker(coords, {
        icon: currentLocationIcon,
        zIndexOffset: 1000 
      })
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
    if (!mapInitializedRef.current || !window.L) return;
    
    if (mapRef.current && searchHistory.length > 0) {
      Object.keys(markersRef.current).forEach(key => {
        if (key !== currentLocation?.name) {
          mapRef.current.removeLayer(markersRef.current[key]);
          delete markersRef.current[key];
        }
      });
      
      searchHistory.forEach(location => {
        const coords = [location.lat, location.lon];
        
        if (location.name === currentLocation?.name) {
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
  }, [searchHistory, currentLocation]);

  return (
    <div>
      <div className="map-container">
        <div id="map"></div>
      </div>
    </div>
  );
}