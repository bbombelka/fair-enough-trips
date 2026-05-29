"use client";

import { useState } from "react";
import { checkWindowSize } from "./checkWindowSize";
import { useIsMounted } from "./useIsMounted";
import Config from "Config";

import { useMainImagePathProps } from "./useMainImagePath.types";

export const useMainImagePath = ({ isMainPostCard, id }: useMainImagePathProps) => {
  const isMounted = useIsMounted();
  const { isMobile } = checkWindowSize({ isEnabled: isMounted });
  const [isError, setError] = useState(false);

  const getSourceImagePath = () => {
    if (!id) return "";
    let filename = "";
    if (!isMainPostCard && !isError) {
      filename = "thumb_";
    } else if (isMainPostCard && isMobile && !isError) {
      filename = "mobile-";
    }

    return `/content/posts/${id}/${filename}main.${Config.DEFAULT_IMAGE_EXTENSION}`;
  };

  return { src: getSourceImagePath(), setError };
};
