import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://atlas-ai.app";

  return [
    {
      url: base,
      priority: 1,
    },
    {
      url: `${base}/pricing`,
    },
    {
      url: `${base}/about`,
    },
    {
      url: `${base}/contact`,
    },
    {
      url: `${base}/privacy`,
    },
    {
      url: `${base}/terms`,
    },
  ];
}