import React, { useEffect, useState } from "react";
import { checkWindowSize } from "./checkWindowSize";
import { useIsMounted } from "./useIsMounted";
import Config from "Config";

type Props = {
  isMainPostCard: boolean;
  id: string;
};

export const useSourceImagePath = ({ isMainPostCard, id }: Props) => {
  const isMounted = useIsMounted();
  const { isMobile } = checkWindowSize({ isEnabled: isMounted });
  const [isError, setError] = useState(false);

  const getSourceImagePath = () => `/${id}/${isMobile && !isMainPostCard && !isError ? "thumb_" : ""}main.${Config.DEFAULT_IMAGE_EXTENSION}`;

  return { src: getSourceImagePath(), setError };
};
