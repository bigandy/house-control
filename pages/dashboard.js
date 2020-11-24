import { useState, useEffect } from "react";

import Head from "next/head";
import styles from "../styles/Home.module.css";

const Clock = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  return (
    <div>
      {hours}:{minutes}
    </div>
  );
};

const Temperature = () => {
  const [degrees, setDegrees] = useState(0);
  return (
    <div>
      Tempearture: {degrees}
      <sup>&deg;</sup>C
    </div>
  );
};

const DateOfMonth = () => {
  const [date, setDate] = useState(24);

  return <div>{date}</div>;
};

const Month = () => {
  const [month, setMonth] = useState("November");

  return <div>{month}</div>;
};

const Year = () => {
  const [year, setYear] = useState(2020);

  return <div>{year}</div>;
};

const DayOfWeek = () => {
  const [day, setDay] = useState("Tuesday");

  return <div>{day}</div>;
};

const Season = () => {
  const [season, setSeason] = useState("Autumn");

  return <div>{season}</div>;
};

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DayOfWeek />
      <DateOfMonth />
      <Month />
      <Year />
      <Season />
      <Clock />
      <Temperature />
    </div>
  );
}
