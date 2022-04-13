import React, { FC } from "react";
import styles from "styles/Cell.module.css";

type CellProps = {
  label: string;
  value?: string | number;
};

export const Cell: FC<CellProps> = ({ label, value, children }) => {
  return (
    <div className={styles.cell}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {value}
        {children}
      </span>
    </div>
  );
};
