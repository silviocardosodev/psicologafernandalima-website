import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (~30% lighter than WebP on photos), WebP fallback.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
