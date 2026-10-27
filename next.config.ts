import type { NextConfig } from "next";

// When building for GitHub Pages repo domain (rajeshine23.github.io/RJEIWEBSITE), use /RJEIWEBSITE
// In local development or when a custom domain is active, use root ""
const isProd = process.env.NODE_ENV === "production";
const isCustomDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN === "true";
const basePath = isProd && !isCustomDomain ? "/RJEIWEBSITE" : "";

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
