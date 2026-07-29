import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ALLBASE — Portfolio, Projects & Tools",
    short_name: "ALLBASE",
    description: "Portofolio, proyek, dan web tools milik Ilal Ilhamdi.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7FAFF",
    theme_color: "#2563EB",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
