import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { dictionaries } from "@/content/dictionaries";
import { isLang, siteConfig, type Lang } from "@/lib/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const d = dictionaries[lang].contactPage;
  const url = `${siteConfig.siteUrl}/${lang}/contact`;
  return {
    title: d.metaTitle,
    description: d.metaDescription,
    alternates: {
      canonical: url,
      languages: { es: `${siteConfig.siteUrl}/es/contact`, en: `${siteConfig.siteUrl}/en/contact`, "x-default": `${siteConfig.siteUrl}/es/contact` },
    },
    robots: { index: true, follow: true },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang: Lang = rawLang;
  const d = dictionaries[lang];

  return (
    <>
      <Header lang={lang} nav={d.nav} />
      <main className="contact-page">
        <section className="contact-page-hero">
          <div className="container contact-page-intro">
            <div>
              <p className="eyebrow">{d.contactPage.eyebrow}</p>
              <h1>{d.contactPage.title}</h1>
              <p>{d.contactPage.intro}</p>
              <Link className="text-link" href={`/${lang}`}><span className="icon-arrow-back" aria-hidden="true" />{d.contactPage.back}</Link>
            </div>
            <aside>
              <span aria-hidden="true">H / 01</span>
              <h2>{d.contactPage.noteTitle}</h2>
              <p>{d.contactPage.noteBody}</p>
            </aside>
          </div>
        </section>
        <section className="contact-form-section">
          <div className="container"><ContactForm lang={lang} dictionary={d.contactPage} /></div>
        </section>
      </main>
      <Footer lang={lang} dictionary={d} />
    </>
  );
}
