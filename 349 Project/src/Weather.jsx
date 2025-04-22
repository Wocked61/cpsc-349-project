

//===========================================================================
import React, { useState } from "react";
import "./App.css";

const apiKey = "9c1bcf57b8d6f8fb40fbd283fd3dd3c1";
const timeApiKey = "XS97K4NT1RCB";

export default function App() {
  const [location, setLocation] = useState("");
  const [days, setDays] = useState(5);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [timeInfo, setTimeInfo] = useState({});

  const handleSearch = () => {
    if (!location) return;
    fetchWeather(location, days);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await res.json();
        fetchWeather(data.city, days);
      });
    }
  };

  const fetchWeather = async (location, days) => {
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
      setWeather({
        city: data.city.name,
        date: data.list[0].dt_txt.split(" ")[0],
        temp: data.list[0].main.temp,
        wind: data.list[0].wind.speed,
        humidity: data.list[0].main.humidity,
        desc: data.list[0].weather[0].description,
      });

      const forecastData = [];
      for (let i = 1; i < days; i++) {
        const forecast = data.list[i * 8];
        if (forecast) {
          forecastData.push({
            date: forecast.dt_txt.split(" ")[0],
            temp: forecast.main.temp,
            wind: forecast.wind.speed,
            humidity: forecast.main.humidity,
          });
        }
      }
      setForecast(forecastData);
      fetchTime(data.city.coord.lat, data.city.coord.lon);
    } catch (err) {
      console.error(err);
      alert("Network error or invalid response.");
    }
  };

  const fetchTime = async (lat, lon) => {
    const res = await fetch(
      `https://api.timezonedb.com/v2.1/get-time-zone?key=${timeApiKey}&format=json&by=position&lat=${lat}&lng=${lon}`
    );
    const data = await res.json();
    setTimeInfo({
      time: data.formatted || "Time not available",
      zone: data.zoneName || "Timezone not available",
    });
  };

  return (
    <div>
      <div className="header">Weather Dashboard</div>
      <div className="container">
        <div className="search-area">
          <label>
            <strong>Enter a City Name or Zip Code</strong>
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="E.g., New York, London, 90210"
          />
          <label>
            <strong>Select Forecast Days</strong>
          </label>
          <select value={days} onChange={(e) => setDays(e.target.value)}>
            <option value={5}>5 Days</option>
            <option value={6}>6 Days</option>
            <option value={7}>7 Days</option>
          </select>
          <button className="search" onClick={handleSearch}>
            Search
          </button>
          <hr />
          <button className="current-location" onClick={getCurrentLocation}>
            Use Current Location
          </button>
        </div>

        <div className="info-box">Local Time: {timeInfo.time}</div>
        <div className="info-box">Timezone: {timeInfo.zone}</div>

        {weather && (
          <div className="weather-card">
            <div>
              <div className="bold">
                {weather.city} ({weather.date})
              </div>
              <div>Temperature: {weather.temp}°C</div>
              <div>Wind: {weather.wind} M/S</div>
              <div>Humidity: {weather.humidity}%</div>
            </div>
            <div>{weather.desc}</div>
          </div>
        )}

        <h2 style={{ marginLeft: "20px" }}>Forecast</h2>
        <div className="forecast">
          {forecast.map((day, i) => (
            <div key={i} className="forecast-day">
              <div>({day.date})</div>
              <div>Temp: {day.temp}°C</div>
              <div>Wind: {day.wind} M/S</div>
              <div>Humidity: {day.humidity}%</div>
            </div>
          ))}
        </div>
        <div id="api-note">Powered by OpenWeatherMap and TimeZoneDB APIs</div>
      </div>
    </div>
  );
}
