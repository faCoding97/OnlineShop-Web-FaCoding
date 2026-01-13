import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://IVA.co.za";

  const routes = ["", "/about", "/services", "/gallery", "/blog"];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
