import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zingwangwa Street Foods",
    short_name: "Zingwangwa",
    description: "Good Food. Great Vibes. Order street food from Zingwangwa Market.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#BF4C00",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
