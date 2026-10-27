import { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data/catalogue";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const settings = getSiteSettings();
  const baseUrl = settings.siteUrl || "https://rajishine.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
