import React from "react";
import Footer from "./Footer";
import "./Convert.css";

function Convert() {
    const [timeZone, setTimeZone] = React.useState("America/New_York");
    const [dateTime, setDateTime] = React.useState("");
    const [convertedTime, setConvertedTime] = React.useState("");
    
    const handleConvert = () => {
        const date = new Date(dateTime);
        const options = { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit" };
        const formatter = new Intl.DateTimeFormat([], options);
        setConvertedTime(formatter.format(date));
    };
    
    return (
        <div className="convert-container">
        <main className="content">
            <h1>Convert Time</h1>
            <label>
                Select Time Zone:
                <select value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
                    <option value="America/New_York">New York (EST)</option>
                    <option value="America/Los_Angeles">Los Angeles (PST)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
            </label>
            <br />
            <label>
                Enter Date and Time:
                <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
            </label>
            <br />
            <button onClick={handleConvert}>Convert</button>
            {convertedTime && (
                <div className="converted-time">
                    Converted Time: {convertedTime}
                </div>
            )}
        </main>
        <Footer />
    </div>
);
    }

    export default Convert;