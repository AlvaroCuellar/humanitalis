export const siteConfig = {
  name: "HUMANITALIS",
  founder: "Álvaro Cuéllar",
  founderUrl: "https://www.alvarocuellar.com/",
  demoUrl: "https://bne-manuscritos-siglo-de-oro.vercel.app/",
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
} as const;

export const featureFlags = {
  featuredProject: false,
} as const;

export const legalConfig = {
  legalName: "",
  taxId: "",
  registeredAddress: "",
} as const;

export type Lang = "es" | "en";
export const languages: Lang[] = ["es", "en"];

export function isLang(value: string): value is Lang {
  return languages.includes(value as Lang);
}
