import { NAVBAR_HEIGHT } from "styles/variables/navbar-constants";

const DIVIDER_HEIGHT = 26; // this is combined size of divider line height and bottom border. Change css accordingly if needed !
export const useSetDividerTop = (order: number, isMobile: boolean) => {
  if (!isMobile || !order) {
    return;
  }

  const topValue = NAVBAR_HEIGHT + (order - 1) * DIVIDER_HEIGHT;
  const style = topValue ? { top: `${topValue}px` } : undefined;

  return style;
};
