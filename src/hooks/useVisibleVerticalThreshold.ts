import { useEffect, useState } from "react";

export const useVisibleVerticalThreshold = () => {
  const [visibleVerticalThreshold, setVisibleVerticalThreshold] = useState<
    number | null
  >(null);

  useEffect(() => {
    setVisibleVerticalThreshold(window.innerHeight);
    document.addEventListener("scroll", () => {
      setVisibleVerticalThreshold(window.scrollY + window.innerHeight);
    });
  }, []);

  return visibleVerticalThreshold;
};
