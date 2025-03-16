/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async headers() {
    return [
      {
        source: "/:path*.(jpg|jpeg|png|gif|webp|avif|svg|ico)", // Matches all routes. Adjust if needed.
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, immutable", // 1 year cache for static assets
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
