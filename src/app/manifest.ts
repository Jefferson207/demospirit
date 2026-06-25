import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Spirit Qosqo Travel",
    short_name: "Spirit Qosqo",
    description:
      "Agencia de viajes en Cusco especializada en Machu Picchu, Valle Sagrado, Montana de Colores, Laguna Humantay y experiencias premium.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F8F6F0",
    theme_color: "#080806",
    lang: "es-PE",
    categories: ["travel", "tourism"],
    icons: [
      {
        src: "/logo-spirit-qosqo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/logo-spirit-qosqo.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
