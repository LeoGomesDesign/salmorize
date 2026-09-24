
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Salmorize",
    short_name: "Salmorize",
    description: "Aprenda e memorize os Salmos.",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F1E7",
    theme_color: "#F8F1E7",

    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
