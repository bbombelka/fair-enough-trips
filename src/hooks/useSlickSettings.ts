import React from "react";
import { Settings } from "react-slick";
import { useWindowSize } from "./useWindowSize";

export const useSlickSettings = ({ currentImageIndex }: { currentImageIndex: number }) => {
  const { isMobile } = useWindowSize();

  const slickSettings: Settings = {
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1 : 2,
    slidesToScroll: isMobile ? 1 : 2,
    initialSlide: currentImageIndex === -1 ? 0 : currentImageIndex,
    lazyLoad: "ondemand",
    vertical: !isMobile,
    verticalSwiping: !isMobile,
    rows: 1,
    slidesPerRow: isMobile ? 1 : 4,
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

  return { slickSettings, slickSettingsModal, videosSlickSettings };
};
