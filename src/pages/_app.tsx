import "styles/global.css";
import type { AppProps } from "next/app";
import { useSetGlobalStyleProperties } from "hooks/useSetGlobalStyleProperties";
import { useServiceWorker } from "hooks/useServiceWorker";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MyApp({ Component, pageProps }: AppProps) {
  useSetGlobalStyleProperties();
  useServiceWorker();

  return <Component {...pageProps} />;
}

export default MyApp;
