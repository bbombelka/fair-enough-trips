import React, { FC, useEffect, useState } from "react";
import { Alert } from "components/alert/Alert";
import { Loader } from "components/loader/Loader";
import clsx from "clsx";
import { Status } from "enums/statuses";
import styles from "styles/MapIframe.module.css";
import Config from "Config";
import { Error as ErrorIcon } from "components/icons/Icons";

type MapIframeProps = {
  iframeUrl: string;
};

export const MapIframe: FC<MapIframeProps> = ({ iframeUrl }) => {
  const [status, setStatus] = useState<Status>(Status.LOADING);
  const [hideLoaderOverlay, setHideLoaderOverlay] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStatus((status) => (status === Status.LOADED ? Status.LOADED : Status.ERROR));
    }, Config.EXTERNAL_MAP_TIMEOUT);
  }, []);

  useEffect(() => {
    if (status === Status.LOADED) {
      setTimeout(() => {
        setHideLoaderOverlay(true);
      }, 2000);
    }
  }, [status]);

  return (
    <div className={styles.container}>
      {!hideLoaderOverlay && (
        <div className={clsx(styles["map-overlay"], styles.map)}>
          <Loader isLoading={status === Status.LOADING} loadingHeading={"Map is loading"} hasInternalBorder />
        </div>
      )}
      {status === Status.ERROR ? (
        <div className={clsx(styles["map-overlay"], styles.map)}>
          <Alert message="Something went wrong with loading the map. Try to refresh the page.">
            <ErrorIcon width={96} height={96} />
          </Alert>
        </div>
      ) : (
        <></>
      )}
      <iframe
        onLoad={() => setStatus(Status.LOADED)}
        onError={() => setStatus(Status.ERROR)}
        className={styles.map}
        frameBorder="0"
        scrolling="no"
        src={iframeUrl}
      />
    </div>
  );
};
