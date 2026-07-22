import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async headers() {
    return [
      // Private asset library — force download, no search engine indexing
      {
        source: "/019826d5-72e3-74d5-a7d5-8d52f2c3d7c9/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Content-Disposition", value: "attachment" },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/favicon.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
