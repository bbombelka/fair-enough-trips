import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableData } from "components/table-data/TableData";
import Config from "Config";
import { FC, useState, useEffect } from "react";
import styles from "styles/Map.module.css";
import { FullPost } from "types/PostPage.types";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { MapIframe } from "./MapIframe";
import { faMap } from "@fortawesome/free-regular-svg-icons";

type MapProps = {
  post: FullPost;
};

export const Map: FC<MapProps> = ({ post }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showMapIframe, setShowMapIframe] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setShowMapIframe(window.innerWidth > 720);
    }
  }, [isMounted]);

  return (
    <>
      <div className={styles.container}>
        {showMapIframe ? <MapIframe iframeUrl={post.iframeUrl} /> : null}
        <TableData post={post} />
      </div>
      <a
        className={styles.link}
        href={`/${post.id}/track.${Config.COMPRESSED_FILE_EXTENSION}`}
      >
        <FontAwesomeIcon icon={faDownload} className={styles.icon} />
        <span>Download gps track</span>
      </a>
      <a
        className={`${styles.link} ${styles["hide-map-link"]}`}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setShowMapIframe((v) => !v);
        }}
      >
        <FontAwesomeIcon icon={faMap} className={styles.icon} />
        <span>{showMapIframe ? "Hide the map" : "Show the map"} </span>
      </a>
    </>
  );
};
