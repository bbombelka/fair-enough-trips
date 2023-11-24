import { useEffect, useState, useCallback } from "react";

const ADJUST_THRESHOLD_PX = 0;

export const useVisibleVerticalThreshold = ({
  adjustThresholdPx = ADJUST_THRESHOLD_PX,
}: {
  adjustThresholdPx: number;
}) => {
  const [visibleVerticalThreshold, setVisibleVerticalThreshold] = useState<
    number | null
  >(null);

  const onScroll = useCallback(() => {
    setVisibleVerticalThreshold(
      window.scrollY + window.innerHeight + adjustThresholdPx
    );
  }, []);

  const removeScrollListener = () =>
    document.removeEventListener("scroll", onScroll);

  useEffect(() => {
    setVisibleVerticalThreshold(window.innerHeight);

    document.addEventListener("scroll", onScroll);

    return () => {
      removeScrollListener();
    };
  }, []);

  return { visibleVerticalThreshold, removeScrollListener };
};
