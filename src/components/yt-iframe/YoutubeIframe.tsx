import React from "react";
import styles from "styles/YoutubeIframe.module.css";
import postImagesStyles from "styles/PostImages.module.css";

export const YoutubeIframe = ({ src, description }: { src: string; description: string }) => {
  return (
    <div className={styles["container"]}>
      <iframe
        src={src}
        className={styles["yt-iframe"]}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
      <span className={postImagesStyles.caption}>{description}</span>
    </div>
  );
};
