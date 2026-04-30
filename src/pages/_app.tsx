import "styles/global.css";
import type { AppProps } from "next/app";
import { useSetGlobalStyleProperties } from "hooks/useSetGlobalStyleProperties";
import { useServiceWorker } from "hooks/useServiceWorker";
import Head from "next/head";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GlobalContextController } from "context/global/GlobalContextController";

function MyApp({ Component, pageProps }: AppProps) {
  useSetGlobalStyleProperties();
  useServiceWorker();

  return (
    <GlobalContextController>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </GlobalContextController>
  );
}

export default MyApp;
