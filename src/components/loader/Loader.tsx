import clsx from "clsx";
import { LogoCursor } from "components/icons/Icons";
import React, { FC, useEffect, useState } from "react";
import styles from "styles/Loader.module.css";

export const Loader: FC<{ loadingHeading: string; fullscreen?: boolean, isLoading: boolean }> = ({
  loadingHeading,
  fullscreen,
  isLoading
}) => {
  const [isHidden, setHidden] = useState(false)
  const containerClass = clsx(
    styles.container,
    fullscreen && styles.fullscreen,
    !isLoading && styles.loaded,
    isHidden && styles.hidden,
  );

  useEffect(()=> {
    if(!isLoading) {
      setTimeout(()=> setHidden(true), 2000)
    }

  }, [isLoading])

  return (
    <div className={containerClass}>
      <div className={styles["center-box"]}>
        <LogoCursor className={styles.loader} width={72} height={72} />
        <span className={styles["loader-heading"]}>{loadingHeading} . . .</span>
      </div>
    </div>
  );
};
