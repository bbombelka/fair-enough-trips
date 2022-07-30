import clsx from "clsx";
import { LogoCursor } from "components/logo/Logo";
import React, { FC } from "react";
import styles from "styles/Loader.module.css";

export const Loader: FC<{ loadingHeading: string; fullscreen?: boolean }> = ({
  loadingHeading,
  fullscreen,
}) => {
  const containerClass = clsx(
    styles.container,
    fullscreen && styles.fullscreen,
  );

  return (
    <div className={containerClass}>
      <div className={styles["center-box"]}>
        <LogoCursor className={styles.loader} width={72} height={72} />
        <span className={styles["loader-heading"]}>{loadingHeading} . . .</span>
      </div>
    </div>
  );
};
