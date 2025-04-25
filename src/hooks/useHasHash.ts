import { useIsMounted } from "hooks/useIsMounted";
import { useEffect, useState } from "react";

export function useHasHash() {
  const isMounted = useIsMounted();
  const [hasHash, setHasHash] = useState(false);

  useEffect(() => {
    if (!isMounted) return;

    window.addEventListener("hashchange", (e: HashChangeEvent) => {
      setHasHash(e.newURL.includes("#"));
    });
  }, [isMounted]);

  return hasHash;
}
