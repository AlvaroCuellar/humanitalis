import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About, Capabilities, ContactCTA, FeaturedProject, Methodology, Principles, Team } from "@/components/Sections";
import { Footer } from "@/components/Footer";
import { dictionaries } from "@/content/dictionaries";
import { featureFlags, isLang, siteConfig, type Lang } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) return {};
  const d = dictionaries[rawLang];
  const url = `${siteConfig.siteUrl}/${rawLang}`;
  const socialImage = `${url}/social-image`;
  return {
    title: d.meta.title, description: d.meta.description,
    alternates: { canonical: url, languages: { "es": `${siteConfig.siteUrl}/es`, "en": `${siteConfig.siteUrl}/en`, "x-default": `${siteConfig.siteUrl}/es` } },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { title: d.meta.title, description: d.meta.description, url, siteName: "HUMANITALIS", locale: d.locale, alternateLocale: rawLang === "es" ? ["en_GB"] : ["es_ES"], type: "website", images: [{ url: socialImage, width: 1200, height: 630, alt: d.meta.title }] },
    twitter: { card: "summary_large_image", title: d.meta.title, description: d.meta.description, images: [{ url: socialImage, alt: d.meta.title }] },
  };
}

export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang: Lang = rawLang;
  const d = dictionaries[lang];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.siteUrl}/#organization`,
        name: siteConfig.name,
        url: siteConfig.siteUrl,
        logo: { "@type": "ImageObject", url: `${siteConfig.siteUrl}/brand/humanitalis-mark.svg` },
        description: d.descriptor,
        founder: { "@type": "Person", name: siteConfig.founder, url: siteConfig.founderUrl },
        areaServed: "International",
        knowsAbout: ["Artificial intelligence", "Cultural heritage", "Digital humanities", "Handwritten text recognition", "Computational text analysis"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.name,
        inLanguage: ["es", "en"],
        publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${siteConfig.siteUrl}/${lang}#webpage`,
        url: `${siteConfig.siteUrl}/${lang}`,
        name: d.meta.title,
        description: d.meta.description,
        inLanguage: lang,
        isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
        about: { "@id": `${siteConfig.siteUrl}/#organization` },
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} /><Header lang={lang} nav={d.nav} /><main><Hero lang={lang} dictionary={d} /><Capabilities dictionary={d} /><Methodology dictionary={d} />{featureFlags.featuredProject && <FeaturedProject dictionary={d} />}<About dictionary={d} /><Team dictionary={d} /><Principles dictionary={d} /><ContactCTA dictionary={d} /></main><Footer lang={lang} dictionary={d} /></>;
}
