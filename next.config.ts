import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
