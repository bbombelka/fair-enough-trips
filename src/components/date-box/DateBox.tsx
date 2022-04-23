import clsx from "clsx";
import React, { FC } from "react";
import styles from "styles/DateBox.module.css";

type DateBoxProps = {
  postDate: string;
  isMain: boolean;
  isTop: boolean;
};

export const DateBox: FC<DateBoxProps> = ({ postDate, isMain, isTop }) => {
  const [month, day, year] = new Date(postDate)
    .toDateString()
    .split(" ")
    .filter((_, i) => i > 0);

  const dateBoxClass = clsx(
    styles["date-box"],
    isMain && styles["main"],
    isTop && styles["is-bottom"],
  );

  const dayClass = clsx(
    styles["date-unit"],
    styles["day"],
    isMain && styles["main"],
  );

  const monthClass = clsx(
    styles["date-unit"],
    styles["month"],
    isMain && styles["main"],
  );

  const yearClass = clsx(
    styles["date-unit"],
    styles["year"],
    isMain && styles["main"],
  );

  return (
    <div className={dateBoxClass}>
      <span className={dayClass}>{day}</span>
      <span className={monthClass}>{month}</span>
      <span className={yearClass}>{year}</span>
    </div>
  );
};
