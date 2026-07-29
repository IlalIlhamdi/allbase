import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/network-converter",
        destination: "/tools/network-converter/",
        permanent: true,
      },
      {
        source: "/network-converter/",
        destination: "/tools/network-converter/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
