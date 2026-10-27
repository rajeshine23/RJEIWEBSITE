import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  // Static export ready and fully compatible with static hosting / GitHub Pages
  basePath,
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
