import React, { useEffect, useState } from "react";
import "./App.css";
import Footer from "./Footer";

const App = () => {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(5);
  const [weatherData, setWeatherData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchWeather("Los Angeles", 5);
  }, []);

  const fetchWeather = async (location, forecastDays) => {
    const apiKey = "9c1bcf57b8d6f8fb40fbd283fd3dd3c1";
    let url = "";
    if (/^\d{5}$/.test(location)) {
      url = `https://api.openweathermap.org/data/2.5/forecast?zip=${location},US&appid=${apiKey}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod !== "200") {
        alert("City or ZIP not found. Please try again.");
        return;
      }
      setWeatherData(data);
      fetchTime(data.city.coord.lat, data.city.coord.lon);
    } catch (err) {
      console.error(err);
      alert("Network error or invalid response.");
    }
  };

  const fetchTime = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=XS97K4NT1RCB&format=json&by=position&lat=${lat}&lng=${lon}`
      );
      const data = await res.json();
      setTimeData(data);
    } catch (err) {
      console.error("Time API error", err);
      setTimeData(null);
    }
  };

  const getIconLabel = (code) => (code.includes("d") ? "☀️" : "🌙");

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
        );
        const data = await res.json();
        fetchWeather(data.city, days);
      });
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="App">
      <header className="navbar">
        <div className="logo">
          <a href="/">
            <img src="weather_logo2.png" alt="logo" />
            <h1>Weather Dashboard</h1>
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
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/">Map</a>
          </li>
          <li>
            <a href="/">News</a>
          </li>
          <li>
            <a href="/">Careers</a>
          </li>
          <li>
            <a href="/">Contact</a>
          </li>
          <li>
            <a href="/">About Us</a>
          </li>
        </ul>
      </header>

      <main className="dashboard-layout">
        <div className="left-panel">
          <div className="search-area">
            <label>
              <strong>Enter a City Name or Zip Code</strong>
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="E.g., New York, London, 90210"
            />
            <label>
              <strong>Select Forecast Days</strong>
            </label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={5}>5 Days</option>
              <option value={7}>7 Days</option>
            </select>
            <button className="search" onClick={() => fetchWeather(city, days)}>
              Search
            </button>
            <hr />
            <button
              className="current-location"
              onClick={handleCurrentLocation}
            >
              Use Current Location
            </button>
          </div>
          {timeData && (
            <>
              <div className="info-box">Local Time: {timeData.formatted}</div>
              <div className="info-box">Timezone: {timeData.zoneName}</div>
            </>
          )}
        </div>

        <div className="right-panel">
          {weatherData && (
            <>
              <div className="weather-card">
                <h3>Today</h3>
                <div>
                  <div className="bold">{weatherData.city.name}</div>
                  <div>Temperature: {weatherData.list[0].main.temp}°C</div>
                  <div>Wind: {weatherData.list[0].wind.speed} M/S</div>
                  <div>Humidity: {weatherData.list[0].main.humidity}%</div>
                </div>
                <div>
                  {weatherData.list[0].weather[0].description}{" "}
                  {getIconLabel(weatherData.list[0].weather[0].icon)}
                  <br />
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                    alt="icon"
                  />
                </div>
              </div>

              <h2>Forecast</h2>
              <div className="forecast">
                {Array.from(
                  { length: days - 1 },
                  (_, i) => weatherData.list[(i + 1) * 8]
                ).map((forecast, idx) =>
                  forecast ? (
                    <div className="forecast-day" key={idx}>
                      <div>({forecast.dt_txt.split(" ")[0]})</div>
                      <div>
                        {forecast.weather[0].description}{" "}
                        {getIconLabel(forecast.weather[0].icon)}
                      </div>
                      <img
                        src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                        alt="icon"
                      />
                      <div>Temp: {forecast.main.temp}°C</div>
                      <div>Wind: {forecast.wind.speed} M/S</div>
                      <div>Humidity: {forecast.main.humidity}%</div>
                    </div>
                  ) : null
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <footer>
        <div className="footer-contact">Contact Us</div>
        <div className="footer-icons">
          <a href="#" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="Email">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
        <div className="footer-credit">
          Powered by OpenWeatherMap and TimeZoneDB APIs
        </div>
        <Footer />   
      </footer>
    </div>
  );
};

export default App;
