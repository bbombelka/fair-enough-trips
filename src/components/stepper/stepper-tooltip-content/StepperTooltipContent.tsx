import React, { FC } from "react";
import { DistanceGraphPoint } from "../Stepper.types";
import styles from "styles/StepperTooltipContent.module.css";

type StepperTooltipContentProps = {
  point: DistanceGraphPoint;
};

export const StepperTooltipContent: FC<StepperTooltipContentProps> = ({ point: { distance, altitude, images, type, paragraphs, name } }) => {
  return (
    <div className={styles["container"]}>
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
          <span className={styles["value"]}>here will be data</span>
        </li>
        <li className={styles["content-list-item"]}>
          <span>Elevation gain</span>
          <span className={styles["value"]}>data here</span>
        </li>
        <hr />
        {Boolean(images.length) && (
          <li className={styles["content-list-item"]}>
            <span>Images of place</span>
            <span>
              {images.map((image) => {
                return (
                  <a href={`#${image}`} key={image}>
                    <img className={styles["content-list-image"]} src="/image.svg" width={16} height={16} />
                  </a>
                );
              })}
            </span>
          </li>
        )}
        {Boolean(paragraphs.length) && (
          <li className={styles["content-list-item"]}>
            <span>Mentioned in</span>
            <span>
              {paragraphs.map((paragraphNum) => {
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
