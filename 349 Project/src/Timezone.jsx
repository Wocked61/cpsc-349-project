
// import React, { useState, useEffect } from "react";
// import "./Timezone.css";
// import Header from './Header.jsx';
// import Footer from './Footer.jsx';

// const API_KEY = "XS97K4NT1RCB"
// const BASE_URL = "http://api.timezonedb.com/v2.1"

// const API_URLS = {
//   list: `${BASE_URL}/list-time-zone?key=${API_KEY}&format=json`,
//   get: `${BASE_URL}/get-time-zone?key=${API_KEY}&format=json`,
//   convert: `${BASE_URL}/convert-time-zone?key=${API_KEY}&format=json`
// }

// function Timezone() {
//   const [time, setTime] = useState(0)

//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await fetch(API_URLS.get)
//       result.json().then(json => {
//         setTime(json.time)
//       })
//     }
//     fetchData();
//   }, []);

//   return (
//     <div className="app">
//       <Header />    
//       <main>
//         <p>Click the button to get your timezone and weather.</p>
//         <button id="get-timezone-weather" className="btn">
//           Get Timezone and Weather
//         </button>
//         <div id="results" className="results-container"></div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default Timezone;