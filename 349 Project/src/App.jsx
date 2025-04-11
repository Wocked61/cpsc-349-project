

import Header from './Header.jsx'
import Footer from './Footer.jsx'

// const API_KEY = "XS97K4NT1RCB"
// const BASE_URL = "http://api.timezonedb.com/v2.1"

// const API_URLS = {
//   list: `${BASE_URL}/list-time-zone?key=${API_KEY}&format=json`,
//   get: `${BASE_URL}/get-time-zone?key=${API_KEY}&format=json`,
//   convert: `${BASE_URL}/convert-time-zone?key=${API_KEY}&format=json`
// }



function App() {
  // const [time, setTime] = useState(0)

    // useEffect(() => {
    //   const fetchData = async () => {
    //     const result = await fetch(URL)
    //     result.json.then(json=> {
    //       setTime(json.time)
    //     })
    //   }
    //   fetchData();
    //     console.log(data)
    //   },[]);

  // return(
  //   // <div className="app">
  //   <>
  //     <Header />    
  //     <Footer />
  //   </>

  //   //   <main>
  //   //     <p>Click the button to get your timezone and weather.</p>
  //   //     <button id="get-timezone-weather" className="btn">
  //   //       Get Timezone and Weather
  //   //     </button>
  //   //     <div id="results" className="results-container"></div>
  //   //   </main>
  //   //   <Footer />
  //   // </div>
  // );
return(
  <>
  <Header />
  <main>
    <h2>Welcome to the Timezone/Weather App</h2>
    <p>Use the navigation above to explore features.</p>
  </main>
  <Footer />
</>
);
    }


export default App
