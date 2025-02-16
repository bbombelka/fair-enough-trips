import "styles/global.css";
import type { AppProps } from "next/app";
import { useSetGlobalStyleProperties } from "hooks/useSetGlobalStyleProperties";

function MyApp({ Component, pageProps }: AppProps) {
  useSetGlobalStyleProperties();

  return <Component {...pageProps} />;
}

export default MyApp;
