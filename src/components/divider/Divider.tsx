import React, { FC } from "react";
import styles from "styles/Divider.module.css";

export const Divider: FC<{ title?: string }> = ({ title }) => {
  return (
    <div id={title} className={styles.divider}>
      {title}
    </div>
  );
};
