import React, { PropsWithChildren } from "react";
import styles from "styles/LandscapeOnly.module.css";

export const LandscapeOnly = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className={styles["landscape-only-container"]}>
      <h1 className={styles["portrait-only"]}>To see the content rotate your device to landscape mode</h1>
      <img className={styles["icon"]} src="/rotate.svg" alt="Image suggesting to rotate the device" />
      <div className={styles["landscape-only"]}>{children}</div>
    </div>
  );
};
