import React, { useState } from "react";
import "./Convert.css";
import Footer from "./Footer";

function Convert() {
  const [fromZone, setFromZone] = useState("America/New_York");
  const [toZone, setToZone] = useState("America/Los_Angeles");
  const [dateOnly, setDateOnly] = useState("");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [amOrPm, setAmOrPm] = useState("AM");
  const [use24Hour, setUse24Hour] = useState(false);
  const [convertedTime, setConvertedTime] = useState("");

  const handleConvert = () => {
    if (!dateOnly || hour === "" || minute === "") {
      alert("Please provide valid date and time.");
      return;
    }

    let adjustedHour = parseInt(hour, 10);
    let adjustedMinute = parseInt(minute, 10);

    if (
      isNaN(adjustedHour) || isNaN(adjustedMinute) ||
      adjustedHour < 0 || adjustedHour > (use24Hour ? 23 : 12) ||
      adjustedMinute < 0 || adjustedMinute > 59
    ) {
      alert("Invalid time input.");
      return;
    }

    // Adjust for AM/PM if needed
    if (!use24Hour) {
      if (amOrPm === "PM" && adjustedHour < 12) adjustedHour += 12;
      if (amOrPm === "AM" && adjustedHour === 12) adjustedHour = 0;
    }

    // Time zone offset map (in minutes)
    const timeZoneOffsets = {
      "America/New_York": -240,       // UTC-4 (EDT)
      "America/Los_Angeles": -420,    // UTC-7 (PDT)
      "Europe/London": 60,            // UTC+1 (BST)
      "Asia/Tokyo": 540               // UTC+9
    };

    const fromOffset = timeZoneOffsets[fromZone];
    const toOffset = timeZoneOffsets[toZone];
    const offsetDiff = toOffset - fromOffset; // in minutes

    const inputDate = new Date(`${dateOnly}T${String(adjustedHour).padStart(2, "0")}:${String(adjustedMinute).padStart(2, "0")}:00`);
    const convertedDate = new Date(inputDate.getTime() + offsetDiff * 60000);

    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: !use24Hour,
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    };

    const formatted = convertedDate.toLocaleString("en-US", options);
    setConvertedTime(formatted);
  };


  return (
    <>
      <div className="convert-container">
        <h1>Convert Time</h1>

        <div className="timezone-section">
          <h2>Select Time Zone</h2>
          <div className="timezone-row inline-dropdowns">
            <span className="inline-label">Convert</span>
            <select value={fromZone} onChange={(e) => setFromZone(e.target.value)}>
              <option value="America/New_York">New York (EST)</option>
              <option value="America/Los_Angeles">Los Angeles (PST)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
            <span className="inline-label">to</span>
            <select value={toZone} onChange={(e) => setToZone(e.target.value)}>
              <option value="America/New_York">New York (EST)</option>
              <option value="America/Los_Angeles">Los Angeles (PST)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
        </div>

        <div className="datetime-inputs">
          <div className="date-box">
            <label htmlFor="date">Select Date:</label>
            <input
              id="date"
              type="date"
              value={dateOnly}
              onChange={(e) => setDateOnly(e.target.value)}
            />
          </div>

          <div className="time-box">
            <label htmlFor="time">Select Time:</label>
            <input
              type="number"
              min={use24Hour ? 0 : 1}
              max={use24Hour ? 23 : 12}
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="HH"
            />
            :
            <input
              type="number"
              min="0"
              max="59"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              placeholder="MM"
           />

            {!use24Hour && (
              <select
                value={amOrPm}
                onChange={(e) => setAmOrPm(e.target.value)}
                className="ampm-select"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            )}
          </div>
        </div>

        <div className="toggle-row">
          <div className="toggle">
            <label>
              <input
                type="checkbox"
                checked={use24Hour}
                onChange={(e) => setUse24Hour(e.target.checked)}
              />
              Use 24-Hour Time
            </label>
          </div>
        </div>

        <button onClick={handleConvert}>Convert</button>

        {convertedTime && (
          <div className="converted-time">
            <strong>Converted Time:</strong> {convertedTime}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Convert;
