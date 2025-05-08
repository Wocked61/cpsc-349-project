import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/App':
        return 'TimeZones';
      case '/Map':
        return 'Map';
      case '/Convert':
        return 'Convert Time';
      default:
        return 'Home';
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="weather_logo2.png" alt="logo" />
          <h1>Regional Cloud - {getPageTitle()}</h1>
        </Link>
      </div>
      <button
        className="toggle_btn"
        onClick={toggleMenu}
        aria-label="Toggle Navigation"
      >
        ☰
      </button>
      <ul className={`menu ${menuOpen ? "open" : ""}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/App">TimeZones</Link></li>
        <li><Link to="/Map">Map</Link></li>
        <li><Link to="/Convert">Convert Time</Link></li>
      </ul>
    </header>
  );
}

export default Header;