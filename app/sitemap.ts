import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const routes = ["", "/menu", "/about", "/gallery", "/checkout", "/cart", "/login"];
  return routes.map((r) => ({ url: `${siteUrl}${r}`, lastModified: new Date() }));
}
