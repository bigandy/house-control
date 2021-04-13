import { useState, useEffect, Fragment } from "react";

import Head from "next/head";
import styles from "./styles.module.scss";

import DefaultLayout from "layouts/default";

import useInterval from "hooks/useInterval";

import {
  getTimeValues,
  getDayFromDayNumber,
  getMonthNameFromMonthNumber,
} from "utils/time";

import getSeasonFromYear from "utils/getSeasonFromYear";

const Clock = ({ minutes, hours }) => {
  const isPm = hours > 12;

  return (
    <div>
      {hours > 12 ? hours - 12 : hours}:{String(minutes).padStart(2, "0")}{" "}
      {isPm ? "pm" : "am"}
    </div>
  );
};

const Temperature = ({ temperature, type = "in" }) => {
  return (
    <div>
      <div>Temp. {type}:</div>
      {temperature && (
        <Fragment>
          {temperature.toFixed(1)}
          <sup>&deg;</sup>C
        </Fragment>
      )}
    </div>
  );
};

const DateOfMonth = ({ date }) => {
  return <div>{date}</div>;
};

const Month = ({ month }) => {
  const monthName = getMonthNameFromMonthNumber(month);
  return <div>{monthName}</div>;
};

const Year = ({ year }) => {
  return <div>{year}</div>;
};

const DayOfWeek = ({ day }) => {
  return <div>{getDayFromDayNumber(day)}</div>;
};

const Season = ({ season }) => {
  return <div>{season}</div>;
};

export default function Dashboard() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [year, setYear] = useState(0);
  const [day, setDay] = useState(0);
  const [month, setMonth] = useState(0);
  const [season, setSeason] = useState("");
  const [date, setDate] = useState(0);
  const [temperatureInside, setTemperatureInside] = useState(0);
  const [temperatureOutside, setTemperatureOutside] = useState(0);

  useEffect(() => {
    const {
      currentHour,
      currentMinute,
      currentYear,
      currentDay,
      currentMonth,
      currentDate,
    } = getTimeValues();

    const currentSeason = getSeasonFromYear(currentYear);

    setHours(currentHour);
    setMinutes(currentMinute);
    setYear(currentYear);
    setDay(currentDay);
    setMonth(currentMonth);
    setSeason(currentSeason);
    setDate(currentDate);
  }, []);

  const getOutsideTemperature = async () => {
    try {
      const result = await fetch("/api/weather/get-weather")
        .then((response) => response.json())
        .then((json) => json.result);

      setTemperatureOutside(result.temp.value);
    } catch (e) {
      console.error(e);
    }
  };

  const getInsideTemperature = async () => {
    try {
      const { temperature } = await fetch("/api/weather/get-pi-sensor")
        .then((response) => response.json())
        .catch((e) => console.error(e));

      setTemperatureInside(temperature);
    } catch (e) {
      console.error("error in getInsideTemperature", e);
      const { sensor_data } = await fetch("/api/hasura/get-weather?number=1")
        .then((response) => response.json())
        .catch((e) => console.error("error in getting weather from api"));
      setTemperatureInside(sensor_data[0]?.temperature);
    }
  };

  useEffect(() => {
    const getOutsideTemp = async () => await getOutsideTemperature();
    getOutsideTemp();
  }, []);

  useEffect(() => {
    const getInsideTemp = async () => await getInsideTemperature();
    getInsideTemp();
  }, []);

  useInterval(() => {
    const { currentHour, currentMinute } = getTimeValues();
    setHours(currentHour);
    setMinutes(currentMinute);
  }, 1000);

  useInterval(async () => {
    const { currentYear, currentDay, currentMonth } = getTimeValues();
    setMonth(currentMonth);
    setDay(currentDay);
    setYear(currentYear);
  }, 3000);

  // Every 3 minutes, call Weather API to get the outside weather.
  useInterval(async () => {
    // GET THE TEMPERATURE FROM THE API
    await getOutsideTemperature();

    await getInsideTemperature();
  }, 1000 * 3 * 60);

  return (
    <DefaultLayout title="">
      <div className={styles.container}>
        <Temperature temperature={temperatureInside} />
        <Temperature temperature={temperatureOutside} type="out" />
        
        <Clock hours={hours} minutes={minutes} />
        <DayOfWeek day={day} />
        <DateOfMonth date={date} />
        <Month month={month} />
        <Year year={year} />
        <Season season={season} />
        
      </div>
    </DefaultLayout>
  );
}
