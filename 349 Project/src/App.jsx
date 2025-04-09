import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

key = "key=&format=json"

urlList = "http://api.timezonedb.com/v2.1/list-time-zone?";

urlGet = "http://api.timezonedb.com/v2.1/get-time-zone?";

urlConvert = "http://api.timezonedb.com/v2.1/convert-time-zone?";



function App() {
  const [time, setTime] = useState(0)

    useEffect(() => {
      const fetchData = async () => {
        const result = await fetch(URL)
        result.json.then(json=> {
          setTime(json.time)
        })
      }
      fetchData();
        console.log(data)
      },[]);
    }
export default App
