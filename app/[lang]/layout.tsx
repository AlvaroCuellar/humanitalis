import { notFound } from "next/navigation";
import { isLang, languages } from "@/lib/config";

export function generateStaticParams() { return languages.map((lang) => ({ lang })); }

export default async function LanguageLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return <div lang={lang}>{children}</div>;
}
