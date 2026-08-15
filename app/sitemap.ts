import type { MetadataRoute } from "next";
import { languages, siteConfig } from "@/lib/config";
export default function sitemap(): MetadataRoute.Sitemap { return languages.flatMap((lang) => ["", "/legal", "/privacy"].map((path) => ({ url: `${siteConfig.siteUrl}/${lang}${path}`, lastModified: new Date(), changeFrequency: path ? "yearly" as const : "monthly" as const, priority: path ? .3 : 1, alternates: !path ? { languages: { es: `${siteConfig.siteUrl}/es`, en: `${siteConfig.siteUrl}/en` } } : undefined }))); }
