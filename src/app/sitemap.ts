import type { MetadataRoute } from "next";

import { pains } from "@/lib/pains";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    ...pains.map((pain) => ({
      url: `${site.url}/${pain.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
