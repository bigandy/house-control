export const getTimeValues = () => {
  var d = new Date();
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
    case 7:
      return "Sunday";
  }
};

export const getSeasonFromMonthNumber = (currentMonthNumber) => {
  switch (currentMonthNumber) {
    case 1:
    case 2:
    case 3:
      return "Winter";
    case 4:
    case 5:
    case 6:
      return "Spring";
    case 7:
    case 8:
    case 9:
      return "Summer";
    case 10:
    case 11:
    case 12:
      return "Autumn";
  }
};
