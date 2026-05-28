import React, { FC } from "react";
import styles from "styles/Cell.module.css";
import { CellProps } from "./Cell.types";

export const Cell: FC<CellProps> = ({ label, value, children }) => {
  return (
    <tr>
      <th className={styles.label}>{label}</th>
      <td className={styles.value}>
        {value}
        {children}
      </td>
    </tr>
  );
};
