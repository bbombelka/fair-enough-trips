"use client";

import { PropsWithChildren } from "react";
import { GlobalContextController } from "context/global/GlobalContextController";
import { useSetGlobalStyleProperties } from "hooks/useSetGlobalStyleProperties";
import { useServiceWorker } from "hooks/useServiceWorker";

export function Providers({ children }: PropsWithChildren<{}>) {
  useSetGlobalStyleProperties();
  useServiceWorker();

  return <GlobalContextController>{children}</GlobalContextController>;
}
