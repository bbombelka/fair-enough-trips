import clsx from "clsx";
import React, { FC, useEffect, useRef } from "react";
import styles from "styles/Cell.module.css";

type CellProps = {
  label: string;
  value?: string | number;
  isLeft?: boolean;
};

export const Cell: FC<CellProps> = ({ label, value, children, isLeft }) => {
  const cellClass = clsx(styles.cell, isLeft ? styles.left : styles.right);

  return (
    <div className={cellClass}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {value}
        {children}
      </span>
    </div>
  );
};
