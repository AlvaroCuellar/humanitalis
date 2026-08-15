"use client";

import { type MouseEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Dictionary } from "@/content/dictionaries";
import type { Lang } from "@/lib/config";

export function Header({ lang, dictionary: d }: { lang: Lang; dictionary: Dictionary }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      if (previouslyFocused === menuButton) menuButton?.focus();
    };
  }, [open]);
  const links = [
    ["capabilities", d.nav.capabilities], ["methodology", d.nav.methodology],
    ["project", d.nav.project], ["about", d.nav.about], ["team", d.nav.team],
  ];
  function returnToTop(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    setOpen(false);
    window.history.replaceState(null, "", `/${lang}#home`);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  return (
    <header className={`site-header ${open ? "menu-open" : ""}`}>
      <div className="container header-inner">
        <Link href={`/${lang}#home`} className="brand-link" aria-label={`${d.nav.home} — HUMANITALIS`} onClick={returnToTop}>
          <Logo lang={lang} className="header-logo" />
        </Link>
        <nav id="main-navigation" className={`main-nav ${open ? "is-open" : ""}`} aria-label={lang === "es" ? "Navegación principal" : "Main navigation"}>
          <div className="mobile-nav-top">
            <Logo variant="mark" className="mobile-mark" />
            <button ref={closeButtonRef} type="button" className="menu-close" onClick={() => setOpen(false)} aria-label={d.nav.close}>
              <span /><span />
            </button>
          </div>
          <div className="nav-links">
            {links.map(([id, label]) => <Link key={id} href={`/${lang}#${id}`} onClick={() => setOpen(false)}>{label}</Link>)}
          </div>
          <LanguageSwitcher lang={lang} className="mobile-language" onNavigate={() => setOpen(false)} />
          <Link className="button button-small nav-contact" href={`/${lang}#contact`} onClick={() => setOpen(false)}>{d.nav.contact}</Link>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher lang={lang} />
          <Link className="button button-small" href={`/${lang}#contact`}>{d.nav.contact}</Link>
          <button ref={menuButtonRef} type="button" className="menu-toggle" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="main-navigation" aria-label={d.nav.menu}>
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
