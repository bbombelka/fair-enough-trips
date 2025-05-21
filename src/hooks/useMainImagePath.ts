import { useState } from "react";
import { checkWindowSize } from "./checkWindowSize";
import { useIsMounted } from "./useIsMounted";
import Config from "Config";

type Props = {
  isMainPostCard: boolean;
  id: string;
};

export const useMainImagePath = ({ isMainPostCard, id }: Props) => {
  const isMounted = useIsMounted();
  const { isMobile } = checkWindowSize({ isEnabled: isMounted });
  const [isError, setError] = useState(false);

  const getSourceImagePath = () => {
    let filename = "";
    if (isMobile && !isMainPostCard && !isError) {
      filename = "thumb_";
    } else if (isMainPostCard && isMobile && !isError) {
      filename = "mobile-";
    }

    return `/${id}/${filename}main.${Config.DEFAULT_IMAGE_EXTENSION}`;
  };

  return { src: getSourceImagePath(), setError };
};
