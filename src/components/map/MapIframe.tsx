import React, { FC, useEffect, useState } from "react";
import { Error } from "components/error/Error";
import { Loader } from "components/loader/Loader";
import clsx from "clsx";
import { Status } from "enums/statuses";
import styles from "styles/MapIframe.module.css";
import Config from "Config";

type MapIframeProps = {
  iframeUrl: string;
};

export const MapIframe: FC<MapIframeProps> = ({ iframeUrl }) => {
  const [status, setStatus] = useState<Status>(Status.LOADING);
  const [hideLoaderOverlay, setHideLoaderOverlay] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setStatus((status) =>
        status === Status.LOADED ? Status.LOADED : Status.ERROR
      );
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
          <Loader
            isLoading={status === Status.LOADING}
            loadingHeading={"Map is loading"}
            hasInternalBorder
          />
        </div>
      )}
      {status === Status.ERROR ? (
        <div className={clsx(styles["map-overlay"], styles.map)}>
          <Error
            width={96}
            height={96}
            message="Something went wrong with loading the map. Try to refresh the page."
          />
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
