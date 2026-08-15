import { notFound } from "next/navigation";
import { isLang, languages } from "@/lib/config";
import { rootMetadata } from "@/lib/root-metadata";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "../../globals.css";

export const metadata = rootMetadata;

export function generateStaticParams() { return languages.map((lang) => ({ lang })); }

export default async function LanguageLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return <html lang={lang}><body>{children}</body></html>;
}
