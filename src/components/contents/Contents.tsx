import React from "react";
import styles from "styles/Contents.module.css";

export const Contents = () => {
  return (
    <div className={styles.contents}>
      <ul className={styles["contents-list"]}>
        <li>
          <a href="#Description">Description</a>
        </li>
        <li>
          <a href="#General">General</a>
        </li>
        <li>
          <a href="#Trip conditions">Trip conditions</a>
        </li>
        <li>
          <a href="#Other">Other information</a>
        </li>
        <li>
          <a href="#Visual">Visual</a>
        </li>
      </ul>
    </div>
  );
};
