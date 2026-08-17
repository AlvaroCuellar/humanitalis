import type { MetadataRoute } from "next";
import { languages, siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/contact", priority: 0.8 },
  ];

  return pages.flatMap(({ path, priority }) => languages.map((lang) => ({
      url: `${siteConfig.siteUrl}/${lang}${path}`,
      changeFrequency: "monthly" as const,
      priority,
      alternates: {
        languages: {
          es: `${siteConfig.siteUrl}/es${path}`,
          en: `${siteConfig.siteUrl}/en${path}`,
          "x-default": `${siteConfig.siteUrl}/es${path}`,
        },
      },
    })));
}
