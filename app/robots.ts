import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://IVA.co.za";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
