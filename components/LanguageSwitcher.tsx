"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/config";

export function LanguageSwitcher({ lang, className = "", onNavigate }: { lang: Lang; className?: string; onNavigate?: () => void }) {
  const router = useRouter();
  function preserveSection(event: MouseEvent<HTMLAnchorElement>, destination: Lang) {
    onNavigate?.();
    if (window.location.hash) {
      event.preventDefault();
      router.push(`/${destination}${window.location.hash}`);
    }
  }
  return (
    <div className={`language-switcher ${className}`} aria-label={lang === "es" ? "Selector de idioma" : "Language selector"}>
      <Link href="/es" hrefLang="es" aria-current={lang === "es" ? "page" : undefined} onClick={(event) => preserveSection(event, "es")}>ES</Link>
      <span aria-hidden="true">/</span>
      <Link href="/en" hrefLang="en" aria-current={lang === "en" ? "page" : undefined} onClick={(event) => preserveSection(event, "en")}>EN</Link>
    </div>
  );
}
