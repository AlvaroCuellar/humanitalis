import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "humanitalis.com" }],
        destination: "https://www.humanitalis.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
