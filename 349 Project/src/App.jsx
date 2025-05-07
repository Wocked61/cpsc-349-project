import React, { useEffect, useState } from "react";
import "./App.css";
import Footer from "./Footer";

const App = () => {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(5);
  const [weatherData, setWeatherData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [backgroundClass, setBackgroundClass] = useState("default-bg");

  useEffect(() => {
    if (geo) {
      handleCurrentLocation();
    } else if (inputCity) {
      fetchWeather(inputCity, days);
    } else {
      fetchWeather("Los Angeles", 5);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(window._clockInterval);
    };
  }, []);

  useEffect(() => {
    if (weatherData) {
      setBackgroundByWeather(
        weatherData.list[0].weather[0].main,
        weatherData.list[0].main.temp,
        weatherData.list[0].weather[0].icon
      );
    }
  }, [weatherData]);

  // Function to set background class based on weather condition
  const setBackgroundByWeather = (condition, temperature, icon) => {
    const isNight = icon.includes("n");

    if (isNight) {
      setBackgroundClass("night-bg");
      return;
    }

    if (
      condition.toLowerCase().includes("rain") ||
      condition.toLowerCase().includes("drizzle")
    ) {
      setBackgroundClass("rainy-bg");
      return;
    }

    if (
      condition.toLowerCase().includes("clear") ||
      condition.toLowerCase().includes("sun")
    ) {
      if (temperature > 28) {
        // Temperature threshold for "hot" in Celsius
        setBackgroundClass("hot-bg");
      } else {
        setBackgroundClass("sunny-bg");
      }
      return;
    }

    if (
      condition.toLowerCase().includes("cloud") ||
      condition.toLowerCase().includes("overcast")
    ) {
      setBackgroundClass("cloudy-bg");
      return;
    }

    if (condition.toLowerCase().includes("snow")) {
      setBackgroundClass("snow-bg");
      return;
    }

    // Default background
    setBackgroundClass("default-bg");
  };

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
      startClock(data.zoneName);
    } catch (err) {
      console.error("Time API error", err);
      setTimeData(null);
    }
  };

  const startClock = (zoneName) => {
    clearInterval(window._clockInterval);
    window._clockInterval = setInterval(() => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: zoneName,
      }).format(now);
      setLocalTime(formatted);
    }, 1000);
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

  const query = new URLSearchParams(window.location.search);
  const inputCity = query.get("city");
  const geo = query.get("geo") === "true";

  return (
    <div className={`App ${backgroundClass}`}>
      <div className="center-wrapper">
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
              <button
                className="search"
                onClick={() => fetchWeather(city, days)}
              >
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
                <div className="info-box">Local Time: {localTime}</div>
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
      </div>
      <Footer />
    </div>
  );
};

export default App;