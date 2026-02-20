import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Railway: covers /storage/**, /images/**, semua path
        protocol: "https",
        hostname: "wisatakerinci-backend-production.up.railway.app",
      },
      {
        // Railway via http (backend kadang return http)
        protocol: "http",
        hostname: "wisatakerinci-backend-production.up.railway.app",
      },
      {
        // Unsplash — dipakai di beberapa data destinasi
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Picsum — dipakai seeder sebagai placeholder
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        // Cloudinary — penyimpanan foto upload user/admin
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Development lokal
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
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
