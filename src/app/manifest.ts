import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    orientation: "portrait-primary",
    icons: [
      {
        src: siteConfig.logo,
        sizes: "any",
        type: siteConfig.logoMimeType,
        purpose: "any",
      },
      {
        src: siteConfig.logo,
        sizes: "any",
        type: siteConfig.logoMimeType,
        purpose: "maskable",
      },
    ],
  };
}
