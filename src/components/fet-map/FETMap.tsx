"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TableData } from "components/table-data/TableData";
import { FC, useState, useEffect } from "react";
import styles from "styles/Map.module.css";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { MapIframe } from "./MapIframe";
import { faMap } from "@fortawesome/free-regular-svg-icons";
import { Modal } from "components/modal/Modal";
import dynamic from "next/dynamic";
import { LandscapeOnly } from "components/support/landscape-only/LandscapeOnly";
import { FETMapProps } from "./FETMap.types";

const GpxChart = dynamic(() => import("components/gpx-chart/GpxChart"), { ssr: false });

export const FETMap: FC<FETMapProps> = ({ post, controlDisplayLinks: { displayGpxChart, gpxDownloadLink, topoDownloadLink } = {} }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showMapIframe, setShowMapIframe] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const postId = post.parentId ? `${post.parentId}/${post.id}` : `${post.id}`;

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
            <GpxChart id={postId} />
          </LandscapeOnly>
        </Modal>
      )}
      <div className={styles.container}>
        {showMapIframe ? <MapIframe iframeUrl={post.iframeUrl} /> : null}
        <TableData post={post} />
      </div>
      {gpxDownloadLink && (
        <a className={styles.link} href={gpxDownloadLink}>
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
          <span>Show elevation profile</span>
        </a>
      )}
      {topoDownloadLink && (
        <a className={styles.link} href={topoDownloadLink} target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faMap} className={styles.icon} />
          <span>Topo</span>
        </a>
      )}
    </>
  );
};
