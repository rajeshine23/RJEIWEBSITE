export default function imageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  const isProd = process.env.NODE_ENV === "production";
  const isCustomDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN === "true";
  const basePath = isProd && !isCustomDomain ? "/RJEIWEBSITE" : "";
  const cleanSrc = src.startsWith("/") ? src : `/${src}`;

  // If cleanSrc already has the basePath, avoid duplicating it
  if (basePath && cleanSrc.startsWith(basePath)) {
    return cleanSrc;
  }

  return `${basePath}${cleanSrc}`;
}
