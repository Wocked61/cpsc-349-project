import React from 'react';
import './Header.css';

function Header() {
  return (
    <header>
      <h1>Regional Cloud</h1>
      <nav>
        <ul>
          <li><a href="#Home">Home</a></li>
          <li><a href="#AllTimeZones">TimeZones</a></li>
          <li><a href="#ConvertTime">Convert Time</a></li>
        </ul>
      </nav>
      <hr></hr>
    </header>
  );
}

export default Header;