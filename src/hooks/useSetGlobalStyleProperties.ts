import { useEffect } from "react";
import { NAVBAR_HEIGHT } from "styles/variables/navbar-constants";

export const useSetGlobalStyleProperties = () => {
  useEffect(() => {
    window.document.body.style.setProperty(
      "--navbar-height",
      `${NAVBAR_HEIGHT}px`
    );
  }, []);
};
