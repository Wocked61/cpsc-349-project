import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Weather.jsx';
import './index.css';
import Timezone from './Timezone.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home />
    <Weather />
    <Timezone />
    <Map />
  </React.StrictMode>
);
