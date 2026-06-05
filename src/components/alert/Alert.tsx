import React, { FC } from "react";
import styles from "styles/Error.module.css";
import { AlertProps } from "./Alert.types";

export const Alert: FC<AlertProps> = ({ message, className = "", children }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles["center-box"]}>
        {children}
        <span>{message}</span>
      </div>
    </div>
  );
};
