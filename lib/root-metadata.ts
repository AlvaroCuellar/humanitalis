import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  applicationName: "HUMANITALIS",
  creator: "HUMANITALIS",
  publisher: "HUMANITALIS",
  icons: {
    icon: [{ url: "/brand/favicon.svg?v=2", type: "image/svg+xml", sizes: "any" }],
    shortcut: ["/brand/favicon.svg?v=2"],
    apple: "/brand/humanitalis-mark.svg",
  },
  manifest: "/manifest.webmanifest",
};
