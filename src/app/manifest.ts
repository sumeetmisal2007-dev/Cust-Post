import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cust-Post — Space-Aware Composting Assistant",
    short_name: "Cust-Post",
    description:
      "Plan and manage small-scale household composting suited to your real balcony, terrace, and waste constraints.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F3E9",
    theme_color: "#224734",
    orientation: "portrait",
    categories: ["utilities", "lifestyle", "education"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
