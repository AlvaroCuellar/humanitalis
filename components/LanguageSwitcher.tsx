"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Lang } from "@/lib/config";

export function LanguageSwitcher({ lang, className = "", onNavigate }: { lang: Lang; className?: string; onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const localizedPath = (destination: Lang) => pathname.replace(/^\/(es|en)(?=\/|$)/, `/${destination}`) || `/${destination}`;
  function preserveSection(event: MouseEvent<HTMLAnchorElement>, destination: Lang) {
    onNavigate?.();
    if (window.location.hash) {
      event.preventDefault();
      router.push(`${localizedPath(destination)}${window.location.hash}`);
    }
  }
  return (
    <div className={`language-switcher ${className}`} aria-label={lang === "es" ? "Selector de idioma" : "Language selector"}>
      <Link href={localizedPath("es")} hrefLang="es" aria-current={lang === "es" ? "page" : undefined} onClick={(event) => preserveSection(event, "es")}>ES</Link>
      <span aria-hidden="true">/</span>
      <Link href={localizedPath("en")} hrefLang="en" aria-current={lang === "en" ? "page" : undefined} onClick={(event) => preserveSection(event, "en")}>EN</Link>
    </div>
  );
}
