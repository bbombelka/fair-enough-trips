import { Settings } from "react-slick";
import { useWindowSize } from "./useWindowSize";

export const useSlickSettings = ({ currentImageIndex }: { currentImageIndex: number }) => {
  const { isMobile } = useWindowSize();

  const commonSettings: Settings = {
    infinite: false,
    speed: 500,
    initialSlide: currentImageIndex === -1 ? 0 : currentImageIndex,
    lazyLoad: "ondemand",
  };

  const slickSettingsDesktop: Settings = {
    ...commonSettings,
    slidesToShow: 2,
    slidesToScroll: 2,
    vertical: true,
    verticalSwiping: true,
    rows: 1,
    slidesPerRow: 4,
  };

  const slickSettingsMobile: Settings = {
    ...commonSettings,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const slickSettingsModal: Settings = {
    ...commonSettings,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const videosSlickSettings = { slidesToShow: 1, slidesToScroll: 1 };

  return { slickSettings: isMobile ? slickSettingsMobile : slickSettingsDesktop, slickSettingsModal, videosSlickSettings, slickSettingsMobile };
};
