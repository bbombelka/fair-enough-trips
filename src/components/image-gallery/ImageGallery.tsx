"use client";

import React, { FC } from "react";
import Config from "Config";
import { FETImage } from "components/fet-image/FETImage";
import styles from "styles/ImageGallery.module.css";
import { YoutubeIframe } from "components/yt-iframe/YoutubeIframe";
import { Modal } from "components/modal/Modal";
import Slider from "react-slick";
import { useGlobalContext } from "hooks/useGlobalContext";
import { useSlickSettings } from "hooks/useSlickSettings";
import { PostImage, PostVideo } from "types/common.types";

export interface ImageGalleryProps {
  id: string;
  galleryId?: string;
  images: PostImage[];
  videos?: PostVideo[];
  getImageSourcePath: ({ id, filename }: { id: string; filename: string }) => { src: string; thumbSrc: string };
}

export const ImageGallery: FC<ImageGalleryProps> = ({
  id,
  galleryId,
  images,
  videos,
  getImageSourcePath,
}) => {
  const isProd = process.env.NODE_ENV === "production";

  const copy = (e: any) => {
    navigator.clipboard.writeText(`"${e.currentTarget.innerText}"`);
  };
  const { showModal, setOpenModal, currentImage, setCurrentImage } = useGlobalContext();

  const activeGalleryId = galleryId || id;
  const isModalOpen = showModal === true || showModal === activeGalleryId;

  const openVisualModal = (currentImage: string) => {
    setCurrentImage(currentImage);
    setOpenModal(activeGalleryId);
  };

  const currentImageIndex = images.findIndex((image) => image.filename === currentImage);

  const { slickSettings, slickSettingsModal, videosSlickSettings } = useSlickSettings({ currentImageIndex });

  const slickImages = images.map(({ filename, desc, isVertical }, index) => {
    const width = isVertical ? Config.IMAGE_STRETCH_S : Config.IMAGE_STRETCH_L;
    const height = isVertical ? Config.IMAGE_STRETCH_M : Config.IMAGE_STRETCH_M;
    const { thumbSrc } = getImageSourcePath({ id, filename });

    return (
      <div id="post-images" key={index} className={styles.images} style={{ maxWidth: width }} onClick={() => openVisualModal(filename)}>
        <div className={styles["slick-image-container"]}>
          <FETImage
            id={filename}
            className={styles.image}
            src={thumbSrc}
            alt={desc}
            quality="100"
            width={width}
            height={height}
            sizes="50vw"
            unoptimized
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  });

  const modalSlickImages = images.map(({ filename, desc, isVertical }, imageId) => {
    const width = isVertical ? Config.IMAGE_STRETCH_S : Config.IMAGE_STRETCH_L;
    const height = isVertical ? Config.IMAGE_STRETCH_M : Config.IMAGE_STRETCH_M;
    const { src } = getImageSourcePath({ id, filename });

    return (
      <div key={imageId} className={styles.images}>
        <a href={src} target="_blank" rel="noopener noreferrer">
          <FETImage
            id={filename}
            src={src}
            alt={desc}
            quality="100"
            width={width}
            height={height}
            sizes="50vw"
            unoptimized
            crossOrigin="anonymous"
            className={`${styles.image} ${styles["image-with-caption"]}`}
          />
        </a>
        {!isProd && (
          <span className={styles.caption} onClick={copy}>
            {filename}
          </span>
        )}
        <span className={styles.caption}>{desc}</span>
      </div>
    );
  });

  return (
    <div id="post-images">
      <div className={`post-images-slick ${styles["slick-container"]}`}>
        <Slider {...slickSettings}>{slickImages}</Slider>
      </div>
      {videos && videos.length > 0 && (
        <div className={styles["slick-container"]}>
          <Slider {...videosSlickSettings}>
            {videos.map(({ src, desc }) => (
              <YoutubeIframe key={src} src={src} description={desc} />
            ))}
          </Slider>
        </div>
      )}
      {isModalOpen && (
        <Modal className="image-modal" closeModalCallback={() => setOpenModal(false)}>
          <div className={styles["slick-container-modal"]}>
            <Slider {...slickSettingsModal}>{modalSlickImages}</Slider>
          </div>
        </Modal>
      )}
    </div>
  );
};
