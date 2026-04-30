import Config from "Config";
import { FC, useContext, useState } from "react";
import { FETImage } from "components/fet-image/FETImage";
import styles from "styles/PostImages.module.css";
import { PostImage, PostVideo } from "types/PostPage.types";
import { useBucketSourcePath } from "hooks/useBucketSourcePath";
import { YoutubeIframe } from "components/yt-iframe/YoutubeIframe";

import { Modal } from "components/modal/Modal";
import Slider, { Settings } from "react-slick";

import { useWindowSize } from "hooks/useWindowSize";
import { useGlobalContext } from "hooks/useGlobalContext";

type PostImagesProps = {
  id: string;
  images: PostImage[];
  videos: PostVideo[];
  hdImagesToDisplay: Array<string | undefined>;
};

export const PostImages: FC<PostImagesProps> = ({ id, images, hdImagesToDisplay, videos }) => {
  const isProd = process.env.NODE_ENV === "production";

  const copy = (e: any) => {
    navigator.clipboard.writeText(`"${e.currentTarget.innerText}"`);
  };
  const { showModal, setOpenModal, currentImage, setCurrentImage } = useGlobalContext();

  // const [startIndex, setImageIndex] = useState(0);
  const { isMobile } = useWindowSize();

  const openVisualModal = (currentImage: string) => {
    setCurrentImage(currentImage);
    setOpenModal(true);
  };

  const currentImageIndex = images.findIndex((image) => image.filename === currentImage);

  const slickSettings: Settings = {
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3.5,
    slidesToScroll: isMobile ? 1 : 2,
    initialSlide: currentImageIndex === -1 ? 0 : currentImageIndex,
    lazyLoad: "ondemand",
  };

  const slickSettingsModal: Settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: currentImageIndex === -1 ? 0 : currentImageIndex,
    lazyLoad: "ondemand",
  };

  const videosSlickSettings = { ...slickSettings, slidesToShow: 1, slidesToScroll: 1 };

  const slickImages = images.map(({ filename, desc, isVertical }, index) => {
    const width = isVertical ? Config.IMAGE_STRETCH_S : Config.IMAGE_STRETCH_L;
    const height = isVertical ? Config.IMAGE_STRETCH_M : Config.IMAGE_STRETCH_M;
    const { src } = useBucketSourcePath({ id, filename, hdImagesToDisplay });

    return (
      <div id="post-images" key={index} className={styles.images} style={{ maxWidth: width }} onClick={() => openVisualModal(filename)}>
        <div className={styles["slick-image-container"]}>
          <FETImage
            id={filename}
            className={styles.image}
            src={src}
            alt={desc}
            quality="100"
            width={width}
            height={height}
            sizes="50vw"
            unoptimized
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  });

  const modalSlickImages = images.map(({ filename, desc, isVertical }, imageId) => {
    const width = isVertical ? Config.IMAGE_STRETCH_S : Config.IMAGE_STRETCH_L;
    const height = isVertical ? Config.IMAGE_STRETCH_M : Config.IMAGE_STRETCH_M;
    const { src, hdImageSrc } = useBucketSourcePath({ id, filename, hdImagesToDisplay });

    return (
      <div key={imageId} className={styles.images}>
        <a href={hdImageSrc} target="_blank" rel="noopener noreferrer">
          <FETImage id={filename} src={src} alt={desc} quality="100" width={width} height={height} sizes="50vw" unoptimized className={styles["image"]} />
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
      <div className={styles["slick-container"]}>
        <Slider {...slickSettings}>{slickImages}</Slider>
      </div>
      <div className={styles["slick-container"]}>
        <Slider {...videosSlickSettings}>
          {videos?.map(({ src, desc }) => (
            <YoutubeIframe key={src} src={src} description={desc} />
          ))}
        </Slider>
      </div>
      {showModal && (
        <Modal className="image-modal" closeModalCallback={() => setOpenModal(false)}>
          <div className={styles["slick-container-modal"]}>
            <Slider {...slickSettingsModal}>{modalSlickImages}</Slider>
          </div>
        </Modal>
      )}
    </div>
  );
};
