import { useEffect, useRef } from "react";

export const useScrollForOutOfViewport = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function isInViewport(element: HTMLDivElement) {
      const rect = element.getBoundingClientRect();
      return rect.top >= 0;
    }

    if (ref?.current && !isInViewport(ref?.current)) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return ref;
};
