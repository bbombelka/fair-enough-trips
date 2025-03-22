import clsx from "clsx";
import { LogoCursor } from "components/icons/Icons";
import React, { FC, useEffect, useState } from "react";
import styles from "styles/Loader.module.css";

interface LoaderProps {
  loadingHeading: string;
  isLoading: boolean;
  hasExternalBorder?: boolean;
  hasInternalBorder?: boolean;
  fullscreen?: boolean;
  isImage?: boolean;
}

export const Loader: FC<LoaderProps> = ({ loadingHeading, fullscreen, isLoading, hasExternalBorder, hasInternalBorder, isImage }) => {
  const [isHidden, setHidden] = useState(false);
  const containerClass = clsx(
    styles.container,
    fullscreen && styles.fullscreen,
    !isLoading && styles.loaded,
    isHidden && styles.hidden,
    hasExternalBorder && styles["border"]
  );

  useEffect(() => {
    const timeout = isImage ? 2000 : 0;
    if (isLoading) {
      setTimeout(() => setHidden(false), timeout);
    } else {
      setTimeout(() => setHidden(true), timeout);
    }
  }, [isLoading]);

  return (
    <div className={containerClass}>
      <div className={clsx(styles["center-box"], hasInternalBorder && styles["border"])}>
        <LogoCursor className={styles.loader} width={72} height={72} />
        <span className={styles["loader-heading"]}>{loadingHeading} . . .</span>
      </div>
    </div>
  );
};
