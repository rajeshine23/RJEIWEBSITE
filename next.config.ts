import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export ready and fully compatible with static hosting / Vercel
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true, // Ideal for static export & local image hosting without external image optimization service dependencies
  },
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
