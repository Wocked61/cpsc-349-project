import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className='footer-content'>
                    <p className="footer-text"></p>
                </div>

                <div className="footer-content">
                    <p className="footer-text">Group 6</p>
                    <p className="footer-text">Dylan Phan</p>
                    <p className="footer-text">Tony Dinh</p>
                    <p className="footer-text">Derek Castanon</p>
                    <p className="footer-text">Powered by OpenWeatherMap, TimeZoneDB, Leaflet APIs</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;