import React, { FC, SVGProps } from "react";
import styles from "styles/Error.module.css";

export const Alert: FC<{ message: string; className?: string } & SVGProps<SVGSVGElement>> = ({ message, className = "", children, ...props }) => {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles["center-box"]}>
        {children}
        <span>{message}</span>
      </div>
    </div>
  );
};
