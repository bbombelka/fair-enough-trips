import React from "react";
import styles from "styles/LandscapeOnly.module.css";
import { LandscapeOnlyProps } from "./LandscapeOnly.types";

export const LandscapeOnly = ({ children }: LandscapeOnlyProps) => {
  return (
    <div className={styles["landscape-only-container"]}>
      <h1 className={styles["portrait-only"]}>To see the content rotate your device to landscape mode</h1>
      <img className={styles["icon"]} src="/assets/rotate.svg" alt="Image suggesting to rotate the device" />
      <div className={styles["landscape-only"]}>{children}</div>
    </div>
  );
};
