import React, { useEffect, useState } from "react";
import "./Home.css";
import Footer from "./Footer";

function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [la, setLa] = useState({ temp: "", tempF: "", time: "", icon: "" });
  const [ny, setNy] = useState({ temp: "", tempF: "", time: "", icon: "" });
  const [searchedCity, setSearchedCity] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  
  const backgroundImages = [
    "https://images.pexels.com/photos/186980/pexels-photo-186980.jpeg?cs=srgb&dl=pexels-tahir-shaw-50609-186980.jpg&fm=jpg",
    "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1755683/pexels-photo-1755683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2114014/pexels-photo-2114014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1431822/pexels-photo-1431822.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundIndex((prevIndex) => 
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId); 
  }, []);

  const fetchCityData = async (city, setter) => {
    const apiKey = "9c1bcf57b8d6f8fb40fbd283fd3dd3c1";
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
      );
      const data = await res.json();

      if (data.cod && data.cod !== 200) {
        console.error("API error:", data.message);
        return null;
      }

      const timeData = await fetch(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=XS97K4NT1RCB&format=json&by=position&lat=${data.coord.lat}&lng=${data.coord.lon}`
      ).then(res => res.json());

      const currentTime = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: timeData.zoneName,
      }).format(new Date());

      const cityData = {
        name: data.name,
        temp: ((data.main.temp - 32) * 5/9).toFixed(1),
        tempF: data.main.temp.toFixed(1),
        icon: data.weather[0].icon,
        time: currentTime,
      };
      
      if (setter) {
        setter(cityData);
      }
      
      return cityData;
    } catch (err) {
      console.error("Failed to fetch data for", city);
      return null;
    }
  };

  useEffect(() => {
    fetchCityData("Los Angeles", setLa);
    fetchCityData("New York", setNy);
  }, []);

  const handleSearch = async () => {
    if (searchInput.trim()) {
      const cityData = await fetchCityData(searchInput.trim());
      if (cityData) {
        setSearchedCity(cityData);
      }
    }
  };

  const handleGeo = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const apiKey = "9c1bcf57b8d6f8fb40fbd283fd3dd3c1";
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`
            );
            const data = await res.json();
            
            if (data.cod === 200) {
              const timeData = await fetch(
                `https://api.timezonedb.com/v2.1/get-time-zone?key=XS97K4NT1RCB&format=json&by=position&lat=${latitude}&lng=${longitude}`
              ).then(res => res.json());

              const currentTime = new Intl.DateTimeFormat("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: timeData.zoneName,
              }).format(new Date());

              const cityData = {
                name: data.name,
                temp: ((data.main.temp - 32) * 5/9).toFixed(1),
                tempF: data.main.temp.toFixed(1),
                icon: data.weather[0].icon,
                time: currentTime,
              };
              
              setUserLocation(cityData);
            }
          } catch (error) {
            console.error("Error getting weather for location:", error);
            alert("Unable to get weather data for your location.");
          }
          
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please make sure location services are enabled in your browser.");
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('lat') && params.has('lon')) {
      const lat = params.get('lat');
      const lon = params.get('lon');
    } 
    else if (params.has('city')) {
      const city = params.get('city');
    }
  }, []);

  return (
    <div className="home-container blurred-bg"
      style={{
        backgroundImage: `linear-gradient(rgba(135, 206, 235, 0.3), rgba(135, 206, 235, 0.3)), url('${backgroundImages[backgroundIndex]}')`,
        backgroundSize: "100%",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        maxHeight: "30vh",
        transition: "background-image 1s ease-in-out"
      }}>
      <main className="content">
        <div className="main-content-row">
          <div className="weather-box">
            <h3>{searchedCity ? searchedCity.name : "Los Angeles"}</h3>
            <img 
              src={`https://openweathermap.org/img/wn/${searchedCity ? searchedCity.icon : la.icon}@2x.png`} 
              alt="Weather icon" 
            />
            <p>{searchedCity ? searchedCity.tempF : la.tempF} °F</p>
            <p>Time: {searchedCity ? searchedCity.time : la.time}</p>
          </div>

          <div className="center-search">
            <h4>Regional Cloud</h4>
            <p className="home-intro">Check your local weather and time like these popular cities using our simple dashboard.</p>
            <p className="home-intro">Click to view more detailed info about weather and time for your favorite cities below!</p>

            <div className="search-section">
              <input
                type="text"
                className="search-bar"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter a city or ZIP code..."
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="button-group">
                <button className="search-btn" onClick={handleSearch}>Search</button>
                <button className="location-btn" onClick={handleGeo}>Use My Location</button>
              </div>
              <div className="divider-line"></div>
            </div>
          </div>

          <div className="weather-box">
            <h3>{userLocation ? userLocation.name : "New York"}</h3>
            <img 
              src={`https://openweathermap.org/img/wn/${userLocation ? userLocation.icon : ny.icon}@2x.png`} 
              alt="Weather icon" 
            />
            <p>{userLocation ? userLocation.tempF : ny.tempF} °F</p>
            <p>Time: {userLocation ? userLocation.time : ny.time}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;