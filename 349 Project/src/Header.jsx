import React, { useState, useEffect } from 'react';
import './Header.css';

function Header() {
  const [currentPage, setCurrentPage] = useState('Home');

  useEffect(() => {
    const path = window.location.pathname;
    switch (path) {
      case '/':
        setCurrentPage('Home');
        break;
      case '/App':
        setCurrentPage('TimeZones');
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

  return (
    <header>
      <h1>Regional Cloud - {currentPage}</h1>
      <nav>
        <ul>
          <li><a onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Home</a></li>
          <li><a onClick={() => navigate('/App')} style={{cursor: 'pointer'}}>TimeZones</a></li>
          <li><a onClick={() => navigate('/Map')} style={{cursor: 'pointer'}}>Map</a></li>
          <li><a onClick={() => navigate('/Convert')} style={{cursor: 'pointer'}}>Convert Time</a></li>
        </ul>
      </nav>
      <hr />
    </header>
  );
}

export default Header;