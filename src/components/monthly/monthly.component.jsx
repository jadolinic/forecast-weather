import React from "react";
import "./monthly.styles.css";
import DailyWeather from "../daily/daily.component";
import Hourly from "../hourly/hourly.component";

const Monthly = ({
  monthly,
  location,
  handleHourlyForDay,
  hourlyDataSet,
  formatDate,
  dayIndex,
  toggleRefreshGraph,
}) => {

  const handleDaySelect = (index) => {
    if (index === dayIndex) {
      toggleRefreshGraph(); 
    } else {
      handleHourlyForDay(index);
    }
  };

  return (
    <>
      <h1>17 Day Forecast</h1>

      <div>
        <div className="weekly-weather">
          {typeof monthly.daily !== "undefined" &&
            [...Array(17)].map((_, index) => {
              const maxTemperature = monthly.daily.temperature_2m_max[index];
              const minTemperature = monthly.daily.temperature_2m_min[index];
              const time = monthly.daily.time[index];


              if (
                maxTemperature !== undefined &&
                minTemperature !== undefined &&
                time !== undefined
              ) {
                return (
                  <DailyWeather
                    key={index}
                    index={index}
                    maxTemperature={maxTemperature}
                    minTemperature={minTemperature}
                    time={time}
                    weatherCode={monthly.daily.weathercode[index]}
                    handleHourlyForDay={handleDaySelect}
                    weatherData={monthly}
                  />
                );
              }

              return null;
            })}
        </div>
      </div>
      <h1>Hourly Forecast</h1>
          <div className="hourly-weather">
            <Hourly
              weatherData={monthly}
              hourlySeriesData={hourlyDataSet.data}
              date={hourlyDataSet.date}
              formatDate={formatDate}
              dayIndex={dayIndex}
            />
          </div>
    </>
  );
};

export default Monthly;
