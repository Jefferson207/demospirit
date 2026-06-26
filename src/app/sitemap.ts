import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/politica-privacidad",
    "/politica-proteccion-datos-personales",
    "/politica-proteccion-datos",
    "/terminos-y-condiciones",
    "/medios-de-pago",
    "/libro-de-reclamaciones",
    "/preguntas-frecuentes",
    "/politica-cookies"
  ];

  return routes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: route ? 0.8 : 1
    }));
}
