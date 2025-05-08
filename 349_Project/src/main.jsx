import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home.jsx';
import App from './App.jsx';
import Map from './Map.jsx';
import Convert from './Convert.jsx';
import Header from './Header.jsx';
import './index.css';

function MainApp() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/App" element={<App />} />
        <Route path="/Map" element={<Map />} />
        <Route path="/Convert" element={<Convert />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);