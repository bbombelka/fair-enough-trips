import { Activities, Countries, Regions } from "enums/categories";
import { Document, WithId } from "mongodb";
import { CodedCategory, DateClass } from "types/PostPage.types";

export const parseDate = (date: DateClass) => {
  const seasons = {
    1: "Spring",
    2: "Summer",
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

export const removeSelectedProps = <T>(
  doc: WithId<Document>,
  unserializableProps: string[],
) => {
  return Object.fromEntries(
    Object.entries(doc).filter(([key]) => !unserializableProps.includes(key)),
  ) as T;
};

export const mapCategories = ({ activity, region, country }: CodedCategory) => {
  const activities = activity.map(
    (actCode) => Activities[actCode as keyof typeof Activities],
  );
  const regions = region.map(
    (regionCode) => Regions[regionCode as keyof typeof Regions],
  );
  const countries = country.map(
    (countryCode) => Countries[countryCode as keyof typeof Countries],
  );

  return { activities, regions, countries };
};

export const parse = <T>(dbData: T) => JSON.parse(JSON.stringify(dbData)) as T;
