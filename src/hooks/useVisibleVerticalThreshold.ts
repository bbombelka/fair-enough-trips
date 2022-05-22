import { useEffect, useState } from "react";

export const useVisibleVerticalThreshold = () => {
  const [visibleVerticalThreshold, setVisibleVerticalThreshold] = useState(0);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      console.log(window.scrollY + window.innerHeight);
      setVisibleVerticalThreshold(window.scrollY + window.innerHeight);
    });
  }, []);

  return visibleVerticalThreshold;
};
