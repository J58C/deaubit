import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  serverExternalPackages: ["geoip-lite"],

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;