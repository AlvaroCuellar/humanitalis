import Image from "next/image";

type LogoProps = { variant?: "lockup" | "mark"; inverse?: boolean; lang?: "es" | "en"; className?: string };

export function Logo({ variant = "lockup", inverse = false, lang = "es", className = "" }: LogoProps) {
  const src = variant === "mark"
    ? `/brand/humanitalis-mark${inverse ? "-light" : ""}.svg`
    : "/brand/humanitalis-lockup-master.svg";
  return (
    <Image
      className={className}
      src={src}
      alt={variant === "mark" ? "HUMANITALIS" : `HUMANITALIS — ${lang === "es" ? "Inteligencia artificial para recuperar, estudiar y conservar el patrimonio cultural" : "Artificial intelligence to recover, study and preserve cultural heritage"}`}
      width={variant === "mark" ? 55 : 284}
      height={variant === "mark" ? 58 : 63}
      priority
    />
  );
}
