import type { MetadataRoute } from "next";

import { getPublicProperties } from "@/lib/properties";
import { regionSlugs } from "@/lib/regions";
import { getPublicSiteUrl } from "@/lib/site-urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPublicProperties();
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      changeFrequency: "weekly",
      lastModified: now,
      priority: 1,
      url: getPublicSiteUrl("/"),
    },
    {
      changeFrequency: "daily",
      lastModified: now,
      priority: 0.9,
      url: getPublicSiteUrl("/properties"),
    },
    {
      changeFrequency: "monthly",
      lastModified: now,
      priority: 0.6,
      url: getPublicSiteUrl("/guides/buying"),
    },
    {
      changeFrequency: "monthly",
      lastModified: now,
      priority: 0.6,
      url: getPublicSiteUrl("/about"),
    },
    {
      changeFrequency: "monthly",
      lastModified: now,
      priority: 0.7,
      url: getPublicSiteUrl("/contact"),
    },
    {
      changeFrequency: "monthly",
      lastModified: now,
      priority: 0.8,
      url: getPublicSiteUrl("/sell-or-rent"),
    },
  ];
  const regionRoutes: MetadataRoute.Sitemap = regionSlugs.map((slug) => ({
    changeFrequency: "monthly",
    lastModified: now,
    priority: 0.75,
    url: getPublicSiteUrl(`/regions/${slug}`),
  }));
  const propertyRoutes: MetadataRoute.Sitemap = properties.map((property) => ({
    changeFrequency: "daily",
    lastModified: new Date(property.updatedAt),
    priority: property.featured ? 0.85 : 0.7,
    url: getPublicSiteUrl(`/properties/${property.slug}`),
  }));

  return [...staticRoutes, ...regionRoutes, ...propertyRoutes];
}
