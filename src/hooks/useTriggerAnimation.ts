import { RefObject, useEffect, useState } from "react";
import { useVisibleVerticalThreshold } from "./useVisibleVerticalThreshold";

type useTriggerAnimationProps = {
  isMainCard: boolean;
  cardRef: RefObject<HTMLDivElement>;
};

export const useTriggerAnimation = ({
  isMainCard,
  cardRef,
}: useTriggerAnimationProps) => {
  const [verticalOffset, setVerticalOffset] = useState(0);
  const [isAnimationTriggered, triggerAnimation] = useState(false);
  const { visibleVerticalThreshold, removeScrollListener } =
    useVisibleVerticalThreshold({
      adjustThresholdPx: 100,
    });

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

    if (
      visibleVerticalThreshold !== null &&
      visibleVerticalThreshold > verticalOffset
    ) {
      triggerAnimation(true);
    }
  }, [visibleVerticalThreshold]);

  useEffect(() => {
    if (isAnimationTriggered) {
      removeScrollListener();
    }
  }, [isAnimationTriggered]);

  return { isAnimationTriggered };
};
