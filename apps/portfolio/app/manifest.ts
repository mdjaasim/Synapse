import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PROJECT SYNAPSE",
    short_name: "SYNAPSE",
    description: "Mohamed Jaasim — interactive portfolio experience",
    start_url: "/",
    display: "standalone",
    background_color: "#02030a",
    theme_color: "#02030a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
