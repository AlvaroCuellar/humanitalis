import Link from "next/link";
import { ArrowIcon } from "@/components/ArrowIcon";
import { Logo } from "@/components/Logo";
import type { Dictionary } from "@/content/dictionaries";
import { featureFlags, siteConfig, type Lang } from "@/lib/config";

export function Footer({ lang, dictionary: d }: { lang: Lang; dictionary: Dictionary }) {
  return (
    <footer className="footer"><div className="container">
      <div className="footer-main"><div><Logo lang={lang} inverse className="footer-logo" /><p>{d.descriptor}</p></div><nav aria-label={lang === "es" ? "Navegación secundaria" : "Secondary navigation"}><Link href={`/${lang}#capabilities`}>{d.nav.capabilities}</Link><Link href={`/${lang}#methodology`}>{d.nav.methodology}</Link>{featureFlags.featuredProject && <Link href={`/${lang}#project`}>{d.nav.project}</Link>}<Link href={`/${lang}#about`}>{d.nav.about}</Link><Link href={`/${lang}#team`}>{d.nav.team}</Link></nav><nav aria-label={lang === "es" ? "Información" : "Information"}><a href={siteConfig.founderUrl} target="_blank" rel="noreferrer">{d.footer.founder}<ArrowIcon direction="external" /></a><Link href={`/${lang}/legal`}>{d.footer.legal}</Link><Link href={`/${lang}/privacy`}>{d.footer.privacy}</Link></nav></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} HUMANITALIS. {d.footer.rights}</span><span>AI / CULTURAL HERITAGE</span></div>
    </div></footer>
  );
}
