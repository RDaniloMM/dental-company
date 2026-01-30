import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dental-company-tacna.com";
  const currentDate = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
