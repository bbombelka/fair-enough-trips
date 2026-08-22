"use client";

import { PropsWithChildren, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GlobalContextController } from "context/global/GlobalContextController";
import { useSetGlobalStyleProperties } from "hooks/useSetGlobalStyleProperties";
import { useServiceWorker } from "hooks/useServiceWorker";

export function Providers({ children }: PropsWithChildren<{}>) {
  const pathname = usePathname();

  useSetGlobalStyleProperties();
  useServiceWorker();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <GlobalContextController>{children}</GlobalContextController>;
}
