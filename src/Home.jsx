import React, { useEffect, useState } from "react";
import "./Home.css";
import Footer from "./Footer";

function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [la, setLa] = useState({ temp: "", time: "", icon: "" });
  const [ny, setNy] = useState({ temp: "", time: "", icon: "" });

  useEffect(() => {
    const apiKey = "9c1bcf57b8d6f8fb40fbd283fd3dd3c1";

    const fetchCityData = async (city, setter) => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        const timeData = await fetch(
          `https://api.timezonedb.com/v2.1/get-time-zone?key=XS97K4NT1RCB&format=json&by=position&lat=${data.coord.lat}&lng=${data.coord.lon}`
        ).then(res => res.json());

        const currentTime = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: timeData.zoneName,
        }).format(new Date());

        setter({
          temp: data.main.temp.toFixed(1),
          icon: data.weather[0].icon,
          time: currentTime,
        });
      } catch (err) {
        console.error("Failed to fetch data for", city);
      }
    };

    fetchCityData("Los Angeles", setLa);
    fetchCityData("New York", setNy);
  }, []);

  const handleSearch = () => {
    if (searchInput.trim()) {
      window.location.href = `/App?city=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  const handleGeo = () => {
    window.location.href = `/App?geo=true`;
  };

  return (
    <div className="Home">
      <main>
        <div className="main-content-row">
          <div className="weather-box">
            <h3>Los Angeles</h3>
            <img src={`https://openweathermap.org/img/wn/${la.icon}@2x.png`} alt="Weather icon" />
            <p>{la.temp} °C</p>
            <p>Time: {la.time}</p>
          </div>

          <div className="center-search">
            <h1>Regional Cloud</h1>
            <p className="home-intro">Check your local weather and time like these popular cities using our simple dashboard.</p>
            <p className="home-intro">Click to view more detailed info about weather and time for your favorite cities below!</p>

            <div className="search-section">
              <input
                type="text"
                className="search-bar"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter a city or ZIP code..."
              />
              <button className="search-btn" onClick={handleSearch}>Search</button>
              <div className="divider-line"></div>
              <button className="location-btn" onClick={handleGeo}>Use My Location</button>
            </div>
          </div>

          <div className="weather-box">
            <h3>New York</h3>
            <img src={`https://openweathermap.org/img/wn/${ny.icon}@2x.png`} alt="Weather icon" />
            <p>{ny.temp} °C</p>
            <p>Time: {ny.time}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
