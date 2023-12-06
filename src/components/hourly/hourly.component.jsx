import React from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import "./hourly.styles.css";
import { useState, useEffect } from "react";

const Hourly = ({ date, hourlySeriesData, dayIndex, formatDate }) => {
  const [data, setData] = useState(hourlySeriesData[dayIndex]);
  useEffect(() => {
    setData(hourlySeriesData[dayIndex]);
  }, [hourlySeriesData, dayIndex]);

 
  let seriesArray = [
    {
      name: "Temperature °C ",
      data: data,
    },
  ];

  let plotLineObject = {
    color: "red", 
    width: 1, 
    value: new Date().getHours() + "." + new Date().getMinutes(), 
    zIndex: 5, 
  };
 /*  let now = new Date();
  let endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  if (now >= endOfDay) {
    plotLineObject = {};
  } */

  let options = {
    title: {
      text: "Temperature for the next 24 hours",
    },
    xAxis: {
      plotLines: [plotLineObject],
      tickLength: 10,
      tickWidth: 1,
      tickColor: "black",
      tickmarkPlacement: "on",
      title: {
        text: "Time (hours)",
      },
      categories: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
    },
    yAxis: {
      title: {
        text: "Temperature (°C)",
      },
    },
    series: seriesArray,
  };

  return (
    <div className="charts">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Hourly;
