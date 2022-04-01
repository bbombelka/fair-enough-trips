import { DateClass } from "pages/posts/[id]";

export const parseDate = (date: DateClass) => {
  const seasons = {
    1: "Spring",
    2: "Summber",
    3: "Autumn",
    4: "Winter",
  };
  const period = {
    1: "early",
    2: "mid",
    3: "late",
  };

  const month = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
  };

  return `${seasons[date.season as keyof typeof seasons]} (${
    period[date.period as keyof typeof period]
  } ${month[date.month as keyof typeof month]} ${date.year})`;
};
