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

  const timeZones = {
    "America/New_York": { label: "New York (EST/EDT)", offset: -240 },
    "America/Los_Angeles": { label: "Los Angeles (PST/PDT)", offset: -420 },
    "America/Chicago": { label: "Chicago (CST/CDT)", offset: -300 },
    "America/Denver": { label: "Denver (MST/MDT)", offset: -360 },
    "America/Phoenix": { label: "Phoenix (MST, no DST)", offset: -420 },
    "America/Anchorage": { label: "Anchorage (AKST/AKDT)", offset: -480 },
    "America/Honolulu": { label: "Honolulu (HST)", offset: -600 },
    "America/Toronto": { label: "Toronto (EST/EDT)", offset: -240 },
    "America/Vancouver": { label: "Vancouver (PST/PDT)", offset: -420 },
    "America/Mexico_City": { label: "Mexico City (CST/CDT)", offset: -300 },
    "Europe/London": { label: "London (GMT/BST)", offset: 60 },
    "Europe/Paris": { label: "Paris (CET/CEST)", offset: 120 },
    "Europe/Berlin": { label: "Berlin (CET/CEST)", offset: 120 },
    "Europe/Rome": { label: "Rome (CET/CEST)", offset: 120 },
    "Europe/Madrid": { label: "Madrid (CET/CEST)", offset: 120 },
    "Asia/Tokyo": { label: "Tokyo (JST)", offset: 540 },
    "Asia/Shanghai": { label: "Shanghai (CST)", offset: 480 },
    "Asia/Singapore": { label: "Singapore (SGT)", offset: 480 },
    "Asia/Dubai": { label: "Dubai (GST)", offset: 240 },
    "Asia/Seoul": { label: "Seoul (KST)", offset: 540 },
    "Asia/Kolkata": { label: "New Delhi (IST)", offset: 330 },
    "Australia/Sydney": { label: "Sydney (AEST/AEDT)", offset: 600 },
    "Australia/Perth": { label: "Perth (AWST)", offset: 480 },
    "Pacific/Auckland": { label: "Auckland (NZST/NZDT)", offset: 720 }
  };

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

    const fromOffset = timeZones[fromZone].offset;
    const toOffset = timeZones[toZone].offset;
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
              {Object.entries(timeZones).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <span className="inline-label">to</span>
            <select value={toZone} onChange={(e) => setToZone(e.target.value)}>
              {Object.entries(timeZones).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
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