import React, { useRef, useState, useEffect } from "react";
import WeeklyWeather from "./components/weekly/weekly.component";
import Map from "./components/map/map.component.jsx";
import Monthly from "./components/monthly/monthly.component";
import "./App.css";

const App = () => {
  const [location, setLocation] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [coordinates, setCoordinates] = useState(undefined);
  const [name, setName] = useState("");
  const [showComponent, setShowComponent] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [hourlyDataSet, setHourlyDataSet] = useState({
    data: [],
    date: new Date(),
  });
  const [dayIndex, setDayIndex] = useState(0);

  const [refreshGraph, setRefreshGraph] = useState(false);

  const toggleRefreshGraph = () => {
    setRefreshGraph((prevState) => !prevState);
  };

  const updateHourlyComponent = (index) => {
    if (dayIndex === index) {
      toggleRefreshGraph();
    } else {
      setDayIndex(dayIndex);
    }
  };

  useEffect(() => {
    toggleRefreshGraph(); // Toggle refreshGraph state whenever dayIndex changes
  }, [dayIndex]);

  const prepAndSetHourlyData = (monthly) => {
    let start = 0;
    let end = 24;

    for (let i = 0; i <= 16; i++) {
      const fullTimesOneDay = monthly.hourly.time.slice(start, end);

      const tempsOneDay = monthly.hourly.temperature_2m.slice(start, end);

      const tIndexDay = fullTimesOneDay.map((time, index) => {
        const name = formatDate(new Date(time), "DD.MM. HH:mm");
        const y = tempsOneDay[index];
        return { name, y };
      });
      start += 24;
      end += 24;

      hourlyDataSet.data.push(tIndexDay);
    }
  };

  const handleDaySelection = (index) => {
    setDayIndex(index);
  };

  const inputRef = useRef(null);

  const toggleComponent = () => {
    setShowComponent(!showComponent);
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${value}`)
      .then((response) => response.json())
      .then((data) => {
        const { latitude, longitude, name } = data.results[0];
        setCoordinates({ lat: latitude, long: longitude });
        setName(name);
      })
      .catch((error) => {
        console.log("Error fetching location data:", error);
      });
  };

  const getWeather = (e) => {
    if (e.key === "Enter") {
      if (coordinates && coordinates.lat && coordinates.long) {
        const firstApiCall = fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.long}&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`
        ).then((response) => response.json());

        const today = new Date();
        const todayF = formatDate(today, "YYYY-MM-DD");
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + 15);
        const todayF_30 = formatDate(futureDate, "YYYY-MM-DD");
        console.error(
          "Max Weather forecast for the https://open-meteo.com/v1/forecast API is 16 days in the future. Per default, only 7 days are returned. Up to 16 days of forecast are possible"
        );

        const secondApiCall = fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.long}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&start_date=${todayF}&end_date=${todayF_30}&timezone=auto`
        ).then((response) => response.json());

        Promise.all([firstApiCall, secondApiCall])
          .then(([location, monthly]) => {
            setLocation(location);
            setMonthly(monthly);
            prepAndSetHourlyData(monthly);
            setDataLoaded(true);
            inputRef.current.value = "";
          })
          .catch((error) => {
            console.log("Error fetching data:", error);
          });
      }
    }
  };

  const formatDate = (date, format) => {
    let monthPreFormat = date.getMonth() + 1;
    if (monthPreFormat < 10) monthPreFormat = "0" + monthPreFormat;

    let hourPreFormat = date.getHours();
    if (hourPreFormat < 10) hourPreFormat = "0" + hourPreFormat;

    let dayPreFormat = date.getDate();
    if (dayPreFormat < 10) dayPreFormat = "0" + dayPreFormat;

    const formattedDate = format
      .replace("YYYY", date.getFullYear())
      .replace("MM", monthPreFormat)
      .replace("DD", dayPreFormat)
      .replace("HH", hourPreFormat)
      .replace("mm", date.getMinutes() + "0");
    return formattedDate;
  };

  return (
    <div className="App">
      <div className="search">
        <h1>Weather Forecast</h1>
        <input
          type="text"
          placeholder="Search city..."
          ref={inputRef}
          onChange={handleInputChange}
          onKeyDown={getWeather}
        />
      </div>
      {dataLoaded && (
        <>
          <div className="info">
            <div className="coordinates">
              <h1>{name}</h1>
              {coordinates && (
                <>
                  <h3>Latitude: {coordinates.lat}</h3>
                  <h3>Longitude: {coordinates.long}</h3>
                </>
              )}
            </div>
            <Map coordinates={coordinates} />
          </div>

          <div className="button-change">
            <button onClick={toggleComponent} className="button-17">
              Toggle Weather
            </button>
            {showComponent ? (
              <WeeklyWeather
                hourlyDataSet={hourlyDataSet}
                formatDate={formatDate}
                dayIndex={dayIndex}
                location={location}
                updateHourlyComponent={updateHourlyComponent}
                toggleRefreshGraph={toggleRefreshGraph}
                handleHourlyForDay={handleDaySelection}
              />
            ) : (
              <Monthly
                monthly={monthly}
                hourlyDataSet={hourlyDataSet}
                formatDate={formatDate}
                dayIndex={dayIndex}
                //location={location}
                updateHourlyComponent={updateHourlyComponent}
                toggleRefreshGraph={toggleRefreshGraph}
                handleHourlyForDay={handleDaySelection}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
