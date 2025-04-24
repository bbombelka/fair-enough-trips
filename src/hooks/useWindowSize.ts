import { useIsMounted } from "./useIsMounted";
import { checkWindowSize } from "./checkWindowSize";

export const useWindowSize = () => {
  const isMounted = useIsMounted();

  return checkWindowSize({ isEnabled: isMounted });
};
