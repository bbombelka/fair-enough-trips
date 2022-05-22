import { useEffect, useState } from "react";

export const useVisibleVerticalThreshold = () => {
  const [visibleVerticalThreshold, setVisibleVerticalThreshold] = useState(0);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      setVisibleVerticalThreshold(window.scrollY + window.innerHeight);
    });
  }, []);

  return visibleVerticalThreshold;
};
