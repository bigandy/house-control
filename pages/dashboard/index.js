import { useState, useEffect, Fragment } from "react";

import Head from "next/head";
import styles from "./styles.module.scss";

import DefaultLayout from "layouts/Default";

import useInterval from "hooks/useInterval";

import {
  getTimeValues,
  getDayFromDayNumber,
  getSeasonFromMonthNumber,
  getMonthNameFromMonthNumber,
} from "utils/time";

const Clock = ({ minutes, hours }) => {
  return (
    <div>
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
    </div>
  );
};

const Temperature = ({ temperature, type = "inside" }) => {
  const [degrees, setDegrees] = useState(0);
  return (
    <div>
      Temperature {type}: {temperature}
      <sup>&deg;</sup>C
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
  const [season, setSeason] = useState(0);
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

    const currentSeason = getSeasonFromMonthNumber(currentMonth);

    setHours(currentHour);
    setMinutes(currentMinute);
    setYear(currentYear);
    setDay(currentDay);
    setMonth(currentMonth);
    setSeason(currentSeason);
    setDate(currentDate);
  }, []);

  useEffect(async () => {
    const result = await fetch("/api/weather/get-weather");
    console.log(result);
  }, []);

  // useInterval(() => {
  //   const { currentHour, currentMinute } = getTimeValues();
  //   setHours(currentHour);
  //   setMinutes(currentMinute);
  // }, 1000);

  // useInterval(() => {
  //   const { currentYear, currentDay, currentMonth } = getTimeValues();
  //   setMonth(currentMonth);
  //   setDay(currentDay);
  //   setYear(currentYear);
  // }, 3000);

  // Every 30 minutes, call Weather API to get the outside weather.
  useInterval(() => {
    // GET THE TEMPERATURE FROM THE API
    const outsideTemperature = 0;
    setTemperatureOutside(outsideTemperature);
  }, 1000 * 30 * 60);

  return (
    <DefaultLayout>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className={styles.container}>
        <DayOfWeek day={day} />
        <DateOfMonth date={date} />
        <Month month={month} />
        <Year year={year} />
        <Season season={season} />
        <Clock hours={hours} minutes={minutes} />
        <Temperature temperature={temperatureInside} />
        <Temperature temperature={temperatureOutside} type="outside" />
      </div>
    </DefaultLayout>
  );
}
