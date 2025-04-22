import React from 'react';
import './Header.css';

function Header() {
  return (
    <header>
      <h1>Regional Cloud</h1>
      <nav>
        <ul>
          <li><a href="#Home">Home</a></li>
          <li><a href="#App">TimeZones</a></li>
          <li><a href="#Map">Map</a></li>
          <li><a href="#Convert">Convert Time</a></li>
        </ul>
      </nav>
      <hr></hr>
    </header>
  );
}

export default Header;