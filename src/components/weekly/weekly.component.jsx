import React from "react";
import "./weekly.styles.css";
import DailyWeather from "../daily/daily.component";
import Hourly from "../hourly/hourly.component";


const WeeklyWeather = ({
  location,
  handleHourlyForDay,
  hourlyDataSet,
  formatDate,
  dayIndex,
  toggleRefreshGraph,
}) => {
  const handleDaySelect = (index) => {
    if (index === dayIndex) {
      toggleRefreshGraph(); // Toggle refreshGraph state to trigger graph refresh
    } else {
      handleHourlyForDay(index);
    }
  };

  return (
    <>
      <h1>7 Day Forecast</h1>
      <div className="weekly-weather">
        {typeof location.daily !== "undefined" &&
          [...Array(7)].map((_, index) => (
            <DailyWeather
              key={index}
              index={index}
              maxTemperature={location.daily.temperature_2m_max[index]}
              minTemperature={location.daily.temperature_2m_min[index]}
              time={location.daily.time[index]}
              weatherCode={location.daily.weathercode[index]}
              handleHourlyForDay={handleDaySelect}
              weatherData={location}
            />
          ))}
      </div>
      <h1>Hourly Forecast</h1>
      <div className="hourly-weather">
        <Hourly
          weatherData={location}
          hourlySeriesData={hourlyDataSet.data}
          date={hourlyDataSet.date}
          formatDate={formatDate}
          dayIndex={dayIndex}
        />
      </div>
    </>
  );
};

export default WeeklyWeather;
