import "styles/global.css";
import type { AppProps } from "next/app";
import { useSetGlobalStyleProperties } from "hooks/useSetGlobalStyleProperties";
import { useServiceWorker } from "hooks/useServiceWorker";

function MyApp({ Component, pageProps }: AppProps) {
  useSetGlobalStyleProperties();
  useServiceWorker();

  return <Component {...pageProps} />;
}

export default MyApp;
