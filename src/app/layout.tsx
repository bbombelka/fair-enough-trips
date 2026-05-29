import { Metadata, Viewport } from "next";
import { Providers } from "./Providers";
import "styles/global.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata: Metadata = {
  title: "Fair Enough Trips",
  description: "Mountain blog covering hiking trails, climbing routes and via-ferrata across Europe.",
  icons: {
    apple: "/assets/icons/apple-touch-icon.png",
    icon: [
      { url: "/assets/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  manifest: "/assets/icons/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/lato-v24-latin-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/lato-v24-latin-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
