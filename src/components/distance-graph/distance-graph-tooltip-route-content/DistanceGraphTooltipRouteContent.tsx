import React, { FC } from "react";
import styles from "styles/StepperTooltipContent.module.css";
import { DistanceGraphPoint } from "../DistanceGraph.types";

export const DistanceGraphTooltipRouteContent: FC<{ point: DistanceGraphPoint }> = ({ point: { path } }) => {
  return (
    <div className={styles["container"]}>
      <h1 className={styles["title"]}>{path?.name}</h1>
      <ul className={styles["content-list"]}>
        <li className={styles["content-list-item"]}>
          <span>Difficulty</span>
          <span className={`${styles["value"]} ${styles["capitalize"]}`}>{path?.difficulty}</span>
        </li>
        <hr />
        {Boolean(path?.images?.length) && (
          <li className={styles["content-list-item"]}>
            <span>Images of place</span>
            <span>
              {path?.images.map((image) => {
                return (
                  <a href={`#${image}`} key={image}>
                    <img className={styles["content-list-image"]} src="/image.svg" width={16} height={16} />
                  </a>
                );
              })}
            </span>
          </li>
        )}
        {Boolean(path?.paragraphs?.length) && (
          <li className={styles["content-list-item"]}>
            <span>Mentioned in</span>
            <span>
              {path?.paragraphs.map((paragraphNum) => {
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
