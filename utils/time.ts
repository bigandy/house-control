export const getTimeValues = () => {
  const d = new Date();
  const currentHour = d.getHours();
  const currentMinute = d.getMinutes();
  const currentMonth = d.getUTCMonth() + 1;
  const currentYear = d.getUTCFullYear();
  const currentDay = d.getUTCDay();
  const currentDate = d.getUTCDate();

  return {
    currentHour,
    currentMinute,
    currentDay,
    currentMonth,
    currentYear,
    currentDate,
  };
};

export const getDayFromDayNumber = (dayNumber) => {
  switch (dayNumber) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
};

export const getMonthNameFromMonthNumber = (monthNumber) => {
  switch (monthNumber) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
  }
};
