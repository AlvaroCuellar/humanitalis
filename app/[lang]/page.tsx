import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About, Capabilities, ContactCTA, FeaturedProject, Methodology, Principles, Team } from "@/components/Sections";
import { Footer } from "@/components/Footer";
import { dictionaries } from "@/content/dictionaries";
import { isLang, siteConfig, type Lang } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) return {};
  const d = dictionaries[rawLang];
  const url = `${siteConfig.siteUrl}/${rawLang}`;
  return {
    title: d.meta.title, description: d.meta.description,
    alternates: { canonical: url, languages: { "es": `${siteConfig.siteUrl}/es`, "en": `${siteConfig.siteUrl}/en`, "x-default": `${siteConfig.siteUrl}/es` } },
    openGraph: { title: d.meta.title, description: d.meta.description, url, siteName: "HUMANITALIS", locale: d.locale, type: "website", images: [{ url: `${siteConfig.siteUrl}/opengraph-image`, width: 1200, height: 630, alt: d.meta.title }] },
    twitter: { card: "summary_large_image", title: d.meta.title, description: d.meta.description, images: [`${siteConfig.siteUrl}/opengraph-image`] },
  };
}

export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang: Lang = rawLang;
  const d = dictionaries[lang];
  const jsonLd = { "@context": "https://schema.org", "@type": "Organization", name: "HUMANITALIS", url: `${siteConfig.siteUrl}/${lang}`, description: d.descriptor, founder: { "@type": "Person", name: siteConfig.founder, url: siteConfig.founderUrl }, areaServed: "International", knowsAbout: ["Artificial intelligence", "Cultural heritage", "Digital humanities", "Handwritten text recognition", "Computational text analysis"] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><Header lang={lang} dictionary={d} /><main><Hero lang={lang} dictionary={d} /><Capabilities dictionary={d} /><Methodology dictionary={d} /><FeaturedProject dictionary={d} /><About dictionary={d} /><Team dictionary={d} /><Principles dictionary={d} /><ContactCTA dictionary={d} /></main><Footer lang={lang} dictionary={d} /></>;
}
