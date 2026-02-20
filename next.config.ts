import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wisatakerinci-backend-production.up.railway.app",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  // Fix Turbopack resolving 'tailwindcss' from wrong parent directory
  turbopack: {
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss"),
    },
  },
};

export default nextConfig;
