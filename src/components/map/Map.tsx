import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableData } from "components/table-data/TableData";
import Config from "Config";
import { FC, useEffect, useState } from "react";
import styles from "styles/Map.module.css";
import { FullPost } from "types/PostPage.types";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { Loader } from "components/loader/Loader";
import clsx from "clsx";
import { Status } from "enums/statuses";
import { Error } from "components/error/Error"

type MapProps = {
  post: FullPost;
};

export const Map: FC<MapProps> = ({ post }) => {
  const [status, setStatus] = useState<Status>(Status.LOADING);
  const [hideLoaderOverlay, setHideLoaderOverlay] = useState(false)
  
  useEffect(()=> {
    setTimeout(() => {
      setStatus(status => status === Status.LOADED ?  Status.LOADED : Status.ERROR)
    }, Config.EXTERNAL_MAP_TIMEOUT)
  }, [])

  useEffect(()=> {
    if(status===Status.LOADED) {
      setTimeout(()=> {
        setHideLoaderOverlay(true)
      }, 2000)
    }
  }, [status])

  return (
    <>
      <div className={styles.container}>
      {!hideLoaderOverlay && <div className={clsx(styles["map-overlay"], styles.map)}><Loader isLoading={status === Status.LOADING} loadingHeading={"Map is loading"} /></div>}
      {status === Status.ERROR ? <div className={clsx(styles["map-overlay"], styles.map)}><Error width={96} height={96} message="Something went wrong with loading the map. Try to refresh the page." /></div> : <></>}
        <iframe
          onLoad={() => setStatus(Status.LOADED)}
          onError={()=> setStatus(Status.ERROR)}
          className={styles.map}
          frameBorder="0"
          scrolling="no"
          src={post.iframeUrl}
        />
        <TableData post={post} />
      </div>
      <a
        className={styles.link}
        href={`/${post.id}/track.${Config.COMPRESSED_FILE_EXTENSION}`}
      >
        <FontAwesomeIcon icon={faDownload} className={styles.icon} />
        <span>Download gps track</span>
      </a>
    </>
  );
};
