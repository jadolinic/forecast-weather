import React from "react";
import "./daily.styles.css";

const DailyWeather = ({ minTemperature, maxTemperature, time, index, weatherCode, handleHourlyForDay,  }) => {

  const WeatherCodeLibrary = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzel: dense ",
    56: "Freezing drizzle: light",
    57: "Freezing drizzle: dense",
    61: "Rain: slight",
    63: "Rain: moderate",
    65: "Rain: heavy",
    66: "Freezing rain: light",
    67: "Freezing rain: heavy",
    71: "Snow fall: slight",
    73: "Snow fall: moderate",
    75: "Snow fall: heavy",
    77: "Snow grains",
    80: "Rain showers: slight",
    81: "Rain showers: moderate",
    82: "Rain showers: violent",
    85: "Snow showers: slight",
    86: "Snow showers: heavy",
    95: "Thunderstorm: slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };

  const description = WeatherCodeLibrary[weatherCode];
  
  return (
    <div className="daily" key={index} onClick={() => handleHourlyForDay(index)} >
      <h2>Max {maxTemperature}°C</h2>
      <p>Min {minTemperature}°C</p>
      <p><strong>{description}</strong></p>
      {time && <p>{time.split('-').reverse().join('.')}</p>}
    </div>
  );
};

export default DailyWeather;
