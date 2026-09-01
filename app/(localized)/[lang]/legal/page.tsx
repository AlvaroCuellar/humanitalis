import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { Logo } from "@/components/Logo";
import { dictionaries } from "@/content/dictionaries";
import { isLang, siteConfig } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params; if (!isLang(lang)) return {};
  return { title: `${dictionaries[lang].legal.title} — HUMANITALIS`, robots: { index: false, follow: true }, alternates: { canonical: `${siteConfig.siteUrl}/${lang}/legal` } };
}
export default async function LegalPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (!isLang(lang)) notFound(); const d = dictionaries[lang];
  return <main className="legal-page"><div className="container legal-shell"><Link href={`/${lang}`}><Logo lang={lang} className="legal-logo" /></Link><p className="eyebrow">HUMANITALIS / LEGAL</p><h1>{d.legal.title}</h1><p className="legal-intro">{d.legal.intro}</p>{d.legal.sections.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}<Link className="text-link" href={`/${lang}`}><ArrowIcon direction="back" />{d.back}</Link></div></main>;
}
