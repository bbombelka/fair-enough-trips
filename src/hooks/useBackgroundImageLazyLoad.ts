import { RefObject, useEffect, useState } from "react";
import { useVisibleVerticalThreshold } from "./useVisibleVerticalThreshold";

type UseBackgroundImageLazyLoadProps = {
  isMainCard: boolean;
  cardRef: RefObject<HTMLDivElement>;
};

export const useBackgroundImageLazyLoad = ({
  isMainCard,
  cardRef,
}: UseBackgroundImageLazyLoadProps) => {
  const [verticalOffset, setVerticalOffset] = useState(0);
  const visibleVerticalThreshold = useVisibleVerticalThreshold();
  const [isAnimationTriggered, triggerAnimation] = useState(false);
  const [isImageLoaded, setImageLoaded] = useState(isMainCard);

  useEffect(() => {
    if (isMainCard) {
      cardRef.current?.setAttribute("id", "main-post-card");
      return triggerAnimation(true);
    }

    if (cardRef.current) {
      const { y, height } = cardRef.current.getBoundingClientRect();
      setVerticalOffset(y + height);
    }
  }, []);

  useEffect(() => {
    if (isMainCard) {
      return;
    }

    if (visibleVerticalThreshold !== null) {
      if (visibleVerticalThreshold + window.innerHeight / 2 > verticalOffset) {
        setImageLoaded(true);
      }

      if (visibleVerticalThreshold > verticalOffset && !isAnimationTriggered) {
        triggerAnimation(true);
      }
    }
  }, [visibleVerticalThreshold]);

  return { isAnimationTriggered, isImageLoaded };
};
