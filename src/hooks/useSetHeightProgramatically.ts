import { useEffect, useRef } from "react";

const NAVBAR_HEIGHT_PX = 60;

export const useSetHeightProgramatically = <T extends HTMLElement>(options: {
  enabled: boolean;
}) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current && options.enabled) {
      ref.current.style.height = `${window.innerHeight - NAVBAR_HEIGHT_PX}px`;
    }
  }, []);

  return ref;
};
