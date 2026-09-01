import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { DocumentProcessVisual } from "@/components/DocumentProcessVisual";
import type { Dictionary } from "@/content/dictionaries";
import { featureFlags, siteConfig, type Lang } from "@/lib/config";

export function Hero({ lang, dictionary: d }: { lang: Lang; dictionary: Dictionary }) {
  return (
    <section id="home" className="hero section-anchor">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{d.hero.eyebrow}</p>
          <h1>{d.hero.title}</h1>
          <p className="hero-intro">{d.hero.body}</p>
          <div className="hero-actions">
            <Link className="button hero-quote" href={`/${lang}/contact`}>{d.contact.emailAction}<ArrowIcon direction="external" /></Link>
            <div className="hero-secondary-actions">
              <Link className="text-link" href={`/${lang}#capabilities`}>{d.hero.primary}<ArrowIcon direction="down" /></Link>
              {featureFlags.featuredProject && <a className="text-link" href={siteConfig.demoUrl} target="_blank" rel="noreferrer">{d.hero.secondary}<ArrowIcon direction="external" /></a>}
            </div>
          </div>
        </div>
        <DocumentProcessVisual label={d.hero.visualLabel} />
      </div>
      <div className="hero-index" aria-hidden="true"><span>H</span><span>AI / CH</span><span>2026</span></div>
    </section>
  );
}
