import React, { FC } from "react";
import { RouteSchemePoint } from "../RouteScheme.types";
import styles from "styles/StepperTooltipContent.module.css";
import { formatTimeElapsed } from "../RouteScheme.utils";
import { useScrollForOutOfViewport } from "hooks/useScrollForOutOfViewport";

export const RouteSchemeGraphTooltipPointContent: FC<{ point: RouteSchemePoint }> = ({ point }) => {
  const { distance, altitude, images, type, paragraphs, name, timeElapsed, elevationGain } = point;
  const ref = useScrollForOutOfViewport();

  return (
    <div ref={ref} className={styles["container"]}>
      <h1 className={styles["title"]}>{name}</h1>
      <ul className={styles["content-list"]}>
        <li className={styles["content-list-item"]}>
          <span>Type of place</span>
          <span className={`${styles["value"]} ${styles["capitalize"]}`}>{type}</span>
        </li>
        <hr />
        <li className={styles["content-list-item"]}>
          <span>Distance from start:</span>
          <span className={styles["value"]}>{(distance / 1000).toFixed(2)} km</span>
        </li>
        <li className={styles["content-list-item"]}>
          <span>Altitude: </span>
          <span className={styles["value"]}>{altitude.toFixed(1)} m</span>
        </li>
        <li className={styles["content-list-item"]}>
          <span>Time elapsed:</span>
          <span className={styles["value"]}>{formatTimeElapsed(timeElapsed)}</span>
        </li>
        <li className={styles["content-list-item"]}>
          <span>Elevation gain</span>
          <span className={styles["value"]}>{`${elevationGain} m`}</span>
        </li>
        {Boolean(images?.length || paragraphs?.length) && <hr />}
        {Boolean(images?.length) && (
          <li className={styles["content-list-item"]}>
            <span>Images of place</span>
            <span>
              {images?.map((image) => {
                return (
                  <a href={`#${image}`} key={image}>
                    <img className={styles["content-list-image"]} src="/image.svg" width={16} height={16} />
                  </a>
                );
              })}
            </span>
          </li>
        )}
        {Boolean(paragraphs?.length) && (
          <li className={styles["content-list-item"]}>
            <span>Read more</span>
            <span>
              {paragraphs?.map((paragraphNum) => {
                return (
                  <a href={`#paragraph-overview-paragraph-${paragraphNum}`} key={paragraphNum}>
                    <img className={styles["content-list-image"]} src="/paragraph.svg" width={16} height={16} />
                  </a>
                );
              })}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};
