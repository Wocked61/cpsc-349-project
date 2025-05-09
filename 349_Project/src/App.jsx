import React, { useEffect, useState } from "react";
import "./App.css";
import Footer from "./Footer";
import Map from "./Map";

const App = () => {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(5);
  const [weatherData, setWeatherData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [localTime, setLocalTime] = useState("");
  const [backgroundClass, setBackgroundClass] = useState("default-bg");
  const [currentLocation, setCurrentLocation] = useState({ lat: 34.0522, lon: -118.2437, name: "Los Angeles", temp: 75, description: "clear sky", icon: "01d" });
  const [searchHistory, setSearchHistory] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const inputCity = query.get("city");
    const geo = query.get("geo") === "true";
    
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
      if (temperature > 82) {
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

    setBackgroundClass("default-bg");
  };

  const fetchWeather = async (location, forecastDays) => {
    const apiKey = "9c1bcf57b8d6f8fb40fbd283fd3dd3c1";
    let url = "";
    if (/^\d{5}$/.test(location)) {
      url = `https://api.openweathermap.org/data/2.5/forecast?zip=${location},US&appid=${apiKey}&units=imperial`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=imperial`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod !== "200") {
        alert("City or ZIP not found. Please try again.");
        return false;
      }
      setWeatherData(data);
      
      const newLocation = {
        lat: data.city.coord.lat,
        lon: data.city.coord.lon,
        name: data.city.name,
        temp: data.list[0].main.temp,
        description: data.list[0].weather[0].description,
        icon: data.list[0].weather[0].icon
      };
      
      setCurrentLocation(newLocation);
      setCity("");
      
      setSearchHistory(prevHistory => {
        const locationExists = prevHistory.some(item => 
          item.name === newLocation.name
        );
        
        if (!locationExists) {
          if (prevHistory.length >= 5) {
            return [...prevHistory.slice(1), newLocation];
          }
          return [...prevHistory, newLocation];
        }
      
        return prevHistory;
      });
      
      await fetchTime(data.city.coord.lat, data.city.coord.lon);
      return true; 
    } catch (err) {
      console.error(err);
      alert("Network error or invalid response.");
      return false; 
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
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
            );
            const data = await res.json();
            
            if (data && data.city) {
              fetchWeather(data.city, days);
            } else {
              fetchWeatherByCoords(coords.latitude, coords.longitude);
            }
          } catch (error) {
            console.error("Error in reverse geocoding:", error);
            fetchWeatherByCoords(coords.latitude, coords.longitude);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to get your location. Please make sure location services are enabled in your browser.");
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    const apiKey = "9c1bcf57b8d6f8fb40fbd283fd3dd3c1";
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.cod !== "200") {
        alert("Unable to get weather for your location. Please try searching by city name.");
        return false;
      }
      
      setWeatherData(data);
      
      const newLocation = {
        lat: data.city.coord.lat,
        lon: data.city.coord.lon,
        name: data.city.name,
        temp: data.list[0].main.temp,
        description: data.list[0].weather[0].description,
        icon: data.list[0].weather[0].icon
      };
      
      setCurrentLocation(newLocation);
      setCity("");
      
      setSearchHistory(prevHistory => {
        const locationExists = prevHistory.some(item => 
          item.name === newLocation.name
        );
        
        if (!locationExists) {
          if (prevHistory.length >= 5) {
            return [...prevHistory.slice(1), newLocation];
          }
          return [...prevHistory, newLocation];
        }
      
        return prevHistory;
      });
      
      await fetchTime(data.city.coord.lat, data.city.coord.lon);
      return true;
    } catch (err) {
      console.error("Error fetching weather by coordinates:", err);
      alert("Network error or invalid response.");
      return false;
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className={`App ${backgroundClass}`}>
      <div className="center-wrapper">
        <main className="dashboard-layout">
          <div className="left-panel">
            <div className="search-area">
              <label>
                <p className="white">Enter a City Name or Zip Code</p>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="E.g., New York, London, 90210"
              />
              <label>
                <p className="white">Select Forecast Days</p>
              </label>
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
              <hr />
              <button 
                className="toggle-map" 
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? "Hide Map" : "Show Map"}
              </button>
              
              {searchHistory.length > 0 && (
                <div className="search-history">
                  <hr />
                  <h4>Recent Searches</h4>
                  <div className="history-items">
                    {searchHistory.map((location, index) => (
                      <div 
                        key={index} 
                        className="history-item"
                        onClick={() => fetchWeather(location.name, days)}
                      >
                        {location.name} ({location.temp.toFixed(1)}°F)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {timeData && (
              <>
                <div className="info-box">Local Time: {localTime}</div>
                <div className="info-box">Timezone: {timeData.zoneName}</div>
              </>
            )}
          </div>

          <div className="right-panel">
            {showMap ? (
              <Map currentLocation={currentLocation} searchHistory={searchHistory} />
            ) : (
              weatherData && (
                <>
                  <div className="weather-card">
                    <h3>Today</h3>
                    <div>
                      <div className="bold">{weatherData.city.name}</div>
                      <div>Temperature: {weatherData.list[0].main.temp} °F</div>
                      <div>Wind: {weatherData.list[0].wind.speed} MPH</div>
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

                  <h2 className="white">Forecast</h2>
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
                          <div>Temp: {forecast.main.temp} °F</div>
                          <div>Wind: {forecast.wind.speed} MPH</div>
                          <div>Humidity: {forecast.main.humidity}%</div>
                        </div>
                      ) : null
                    )}
                  </div>
                </>
              )
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;