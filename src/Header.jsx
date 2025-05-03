import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from './weather_logo2.png';

function Header() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    switch (path) {
      case '/':
        setCurrentPage('Home');
        break;
      case '/App':
        setCurrentPage('City Details');
        break;
      case '/Map':
        setCurrentPage('Map');
        break;
      case '/Convert':
        setCurrentPage('Convert Time');
        break;
      default:
        setCurrentPage('Home');
    }
  }, []);

  const navigate = (path) => {
    window.location.href = path;
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="navbar">
      <div className="logo">
        <a onClick={() => navigate('/')}>
          <img src={logo} alt="logo" />
          <h1>Regional Cloud - {currentPage}</h1>
        </a>
      </div>
      <button
        className="toggle_btn"
        onClick={toggleMenu}
        aria-label="Toggle Navigation"
      >
        ☰
      </button>
      <ul className={`menu ${menuOpen ? "open" : ""}`}>
        <li><a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</a></li>
        <li><a onClick={() => navigate('/App')} style={{ cursor: 'pointer' }}>City Details</a></li>
        <li><a onClick={() => navigate('/Map')} style={{ cursor: 'pointer' }}>Map</a></li>
        <li><a onClick={() => navigate('/Convert')} style={{ cursor: 'pointer' }}>Convert Time</a></li>
      </ul>
    </header>
  );
}

export default Header;
