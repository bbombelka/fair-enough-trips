import React, { FC, SVGProps } from "react";
import styles from "styles/Error.module.css";
import { Error as ErrorIcon } from "components/icons/Icons";

export const Error: FC<{ message: string } & SVGProps<SVGSVGElement>> = ({
  message,
  ...props
}) => {
  return (
    <div className={styles.container}>
      <div className={styles["center-box"]}>
        <ErrorIcon {...props} />
        <span>{message}</span>
      </div>
    </div>
  );
};
