import type { MetadataRoute } from "next";
import { languages, siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const alternates = {
    languages: {
      es: `${siteConfig.siteUrl}/es`,
      en: `${siteConfig.siteUrl}/en`,
      "x-default": `${siteConfig.siteUrl}/es`,
    },
  };

  return languages.map((lang) => ({
    url: `${siteConfig.siteUrl}/${lang}`,
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates,
  }));
}
