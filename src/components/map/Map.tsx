import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableData } from "components/table-data/TableData";
import Config from "Config";
import { FC, useState, useEffect } from "react";
import styles from "styles/Map.module.css";
import { ControlDisplayLinks, FullPost } from "types/PostPage.types";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { MapIframe } from "./MapIframe";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import { Modal } from "components/modal/Modal";
import dynamic from "next/dynamic";
import { LandscapeOnly } from "components/support/landscape-only/LandscapeOnly";

type MapProps = {
  post: FullPost;
  controlDisplayLinks: ControlDisplayLinks;
};

const GpxChart = dynamic(() => import("components/gpx-chart/GpxChart"), { ssr: false });

export const Map: FC<MapProps> = ({ post, controlDisplayLinks: { displayGpxChart, displayGpxDownload } = {} }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showMapIframe, setShowMapIframe] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
      {showModal && (
        <Modal title={post.title} closeModalCallback={() => setShowModal(false)}>
          <LandscapeOnly>
            <GpxChart id={post.id} />
          </LandscapeOnly>
        </Modal>
      )}
      <div className={styles.container}>
        {showMapIframe ? <MapIframe iframeUrl={post.iframeUrl} /> : null}
        <TableData post={post} />
      </div>
      {displayGpxDownload && (
        <a className={styles.link} href={`/${post.id}/track.${Config.COMPRESSED_FILE_EXTENSION}`}>
          <FontAwesomeIcon icon={faDownload} className={styles.icon} />
          <span>Download gps track</span>
        </a>
      )}

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
      {displayGpxChart && (
        <a
          className={styles.link}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setShowModal((v) => !v);
          }}
        >
          <FontAwesomeIcon icon={faMap} className={styles.icon} />
          <span>Show track graph </span>
        </a>
      )}
    </>
  );
};
