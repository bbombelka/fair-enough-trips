import { Divider } from "components/divider/Divider";
import Config from "Config";
import React, { FC, useRef, useState } from "react";
import { FETImage } from "components/fet-image/FETImage";
import styles from "styles/PostImages.module.css";
import { PostImage, PostVideo } from "types/PostPage.types";
import { useBucketSourcePath } from "hooks/useBucketSourcePath";
import { YoutubeIframe } from "components/yt-iframe/YoutubeIframe";
import ImageGallery, { ImageGalleryRef } from "react-image-gallery";

import "react-image-gallery/styles/image-gallery.css";
import { Modal } from "components/modal/Modal";
import Slider, { Settings } from "react-slick";

type PostImagesProps = {
  id: string;
  images: PostImage[];
  videos: PostVideo[];
  order?: number;
  hdImagesToDisplay: Array<string | undefined>;
};

export const PostImages: FC<PostImagesProps> = ({ id, images, order, hdImagesToDisplay, videos }) => {
  const isProd = process.env.NODE_ENV === "production";
  const galleryRef = useRef<ImageGalleryRef>(null);
  const copy = (e: any) => {
    navigator.clipboard.writeText(`"${e.currentTarget.innerText}"`);
  };
  const [showModal, setShowModal] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const openVisualModal = (index: number) => {
    setStartIndex(index);
    setShowModal(true);
  };

  const slickSettings: Settings = {
    infinite: false,
    // nextArrow: true,
    speed: 500,

    slidesToShow: 3.5,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 4, slidesToScroll: 3 },
      },
      // {
      //   breakpoint: 1024,
      //   settings: { slidesToShow: 3, slidesToScroll: 2 },
      // },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
    ],
  };

  const slickSettingsModal: Settings = {
    infinite: false,
    // nextArrow: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: startIndex,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
    ],
  };

  const galleryImages = images.map(({ filename, desc, isVertical }, imageId) => {
    const width = isVertical ? Config.IMAGE_STRETCH_S : Config.IMAGE_STRETCH_L;
    const height = isVertical ? Config.IMAGE_STRETCH_M : Config.IMAGE_STRETCH_M;
    const { src, hdImageSrc } = useBucketSourcePath({ id, filename, hdImagesToDisplay });

    return {
      original: src,
      thumbnail: src,
      renderThumbInner: (item: any) => {
        return (
          <div className="image-gallery-thumbnail-inner">
            <img
              src={item.thumbnail}
              alt={item.thumbnailAlt || "thumbnail"}
              loading="lazy" // <--- This prevents off-screen thumbnails from downloading!
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        );
      },
      description: desc,
      renderItem: (item: any) => (
        <div key={imageId} style={{ maxWidth: width, margin: "0 auto" }} className={styles.images}>
          <a href={hdImageSrc} target="_blank" rel="noopener noreferrer">
            <FETImage id={filename} className={styles.image} src={src} alt={desc} quality="100" width={width} height={height} sizes="50vw" unoptimized />
          </a>
          {!isProd && (
            <span className={styles.caption} onClick={copy}>
              {filename}
            </span>
          )}
          <span className={styles.caption}>{desc}</span>
        </div>
      ),
    };
  });

  const galleryImages2 = images.map(({ filename, desc, isVertical }, imageId) => {
    const width = isVertical ? Config.IMAGE_STRETCH_S : Config.IMAGE_STRETCH_L;
    const height = isVertical ? Config.IMAGE_STRETCH_M : Config.IMAGE_STRETCH_M;
    const { src, hdImageSrc } = useBucketSourcePath({ id, filename, hdImagesToDisplay });

    return (
      <div key={imageId} className={styles.images} style={{ margin: "0 auto" }}>
        <a href={hdImageSrc} target="_blank" rel="noopener noreferrer">
          <FETImage
            id={filename}
            src={src}
            alt={desc}
            quality="100"
            width={width}
            height={height}
            sizes="50vw"
            unoptimized
            enableLoader={false}
            className={styles["image"]}
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
    <div>
      <Divider title="Visual" order={order} stickyScrollToElementId="post-images" />
      <div id="post-images" style={{ maxWidth: "1200px" }}>
        {/* <div style={{ display: "flex", overflowX: "auto", gap: "8px", paddingBottom: "12px" }}>
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className="image-gallery-thumbnail-inner"
              onClick={() => openVisualModal(index)}
              style={{ cursor: "pointer", flexShrink: 0, width: "200px", height: "133px" }}
            >
              <img
                src={img.thumbnail}
                alt={img.description || `Thumbnail ${index}`}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>
          ))}
        </div> */}

        {/* React Slick Version */}
        <div style={{ marginTop: "40px", width: "100%", display: "block" }}>
          <Slider {...slickSettings}>
            {galleryImages.map((img, index) => (
              <div key={index} onClick={() => openVisualModal(index)}>
                <div style={{ padding: "0 12px", cursor: "pointer", height: "300px" }}>
                  <img
                    src={img.thumbnail}
                    alt={img.description || `Thumbnail ${index}`}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {showModal && (
          <Modal className="image-modal" closeModalCallback={() => setShowModal(false)}>
            <div style={{ maxWidth: "1066px", height: "auto" }}>
              <Slider {...slickSettingsModal}>{galleryImages2}</Slider>
            </div>
          </Modal>
        )}

        {/* {showModal && (
          <Modal closeModalCallback={() => setShowModal(false)} title="Images"> */}
        {/* <ImageGallery
          ref={galleryRef}
          items={galleryImages}
          lazyLoad={true}
          startIndex={startIndex}
          onClick={() => galleryRef.current?.toggleFullScreen()}
          onBeforeSlide={() => galleryRef.current?.toggleFullScreen()}
          showThumbnails={true}
          showPlayButton={false}
          infinite={false}
          // showFullscreenButton={true} // Acts as your lightbox
          // slideDuration={450}
          showIndex
        /> */}
        {/* </Modal> */}
        {/* )} */}
      </div>
    </div>
  );
};
