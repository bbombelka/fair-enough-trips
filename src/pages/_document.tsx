import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preload" href="./fonts/lato-v24-latin-regular" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="./fonts/lato-v24-latin-700" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
