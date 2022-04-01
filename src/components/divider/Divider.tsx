import React, { FC } from "react";
import styles from "styles/Divider.module.css";

export const Divider: FC<{ title?: string }> = ({ title }) => {
  return <div className={styles.divider}>{title}</div>;
};
