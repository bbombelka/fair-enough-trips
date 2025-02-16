import { Breakpoints } from "styles/variables/breakpoints";

export const checkWindowSize = ({
  isEnabled = false,
}: {
  isEnabled: boolean;
}) => {
  if (!isEnabled) {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    };
  }

  switch (true) {
    case window.innerWidth <= Breakpoints.S:
      return {
        isMobile: true,
        isTablet: false,
        isDesktop: false,
      };
    case window.innerWidth > Breakpoints.S &&
      window.innerWidth <= Breakpoints.M:
      return {
        isMobile: false,
        isTablet: true,
        isDesktop: false,
      };
    case window.innerWidth > Breakpoints.M:
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      };
    default:
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      };
  }
};
