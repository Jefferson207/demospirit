import { company } from "@/lib/company";
import { travelServices } from "@/lib/travel-services";

export type AdminStatus = "Activo" | "Inactivo" | "Pendiente" | "Confirmada" | "Cancelada" | "Finalizada";

export type AdminReservation = {
  id: string;
  code: string;
  clientName: string;
  clientLastName: string;
  email: string;
  whatsapp: string;
  country: string;
  tour: string;
  packageName: string;
  date: string;
  adults: number;
  children: number;
  babies: number;
  hotel: string;
  extras: string[];
  basePrice: number;
  extrasPrice: number;
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  status: AdminStatus;
  method: "WhatsApp" | "Pago online";
  observations: string;
  history: string[];
  createdAt: string;
};

export type AdminContent = {
  tours: Array<Record<string, unknown>>;
  packages: Array<Record<string, unknown>>;
  hotels: Array<Record<string, unknown>>;
  reservations: AdminReservation[];
  clients: Array<Record<string, unknown>>;
  extras: Array<Record<string, unknown>>;
  categories: Array<Record<string, unknown>>;
  paymentMethods: Array<Record<string, unknown>>;
  settings: Record<string, unknown>;
  users: Array<Record<string, unknown>>;
};

export const adminFieldLabels: Record<string, string> = {
  name: "Nombre",
  slug: "Slug",
  category: "Categorí­a",
  destination: "Destino",
  duration: "Duracion",
  difficulty: "Dificultad",
  type: "Tipo",
  basePriceUsd: "Precio base USD",
  offerPriceUsd: "Precio oferta USD",
  shortDescription: "Descripcion corta",
  description: "Descripcion completa",
  mainImage: "Imagen principal",
  gallery: "Galeria",
  video: "Video",
  includes: "Servicios incluidos",
  excludes: "Servicios no incluidos",
  bring: "Que llevar",
  mapUrl: "Mapa",
  itinerary: "Itinerario",
  faqs: "Preguntas frecuentes",
  policies: "PolÃ­ticas",
  status: "Estado",
  order: "Orden",
  metaTitle: "Meta title",
  metaDescription: "Meta description",
  hotelCategories: "s de hotel",
  toursIncluded: "Tours incluidos",
  extras: "Extras",
  city: "Ciudad",
  nightlyPriceUsd: "Precio por noche",
  services: "Servicios",
  address: "DirecciÃ³n",
  priceUsd: "Precio USD",
  code: "CÃ³digo",
  clientName: "Cliente",
  whatsapp: "WhatsApp",
  total: "Total",
  role: "Rol",
  permissions: "Permisos",
  logo: "Logo",
  details: "Indicaciones",
  fieldRows: "Datos de pago",
  holder: "Titular",
  qr: "QR"
};

export const adminSchemas: Record<string, string[]> = {
  tours: [
    "name", "slug", "category", "destination", "duration", "difficulty", "type", "basePriceUsd", "offerPriceUsd",
    "shortDescription", "description", "mainImage", "gallery", "video", "includes", "excludes", "bring", "mapUrl",
    "itinerary", "faqs", "policies", "status", "order", "metaTitle", "metaDescription"
  ],
  packages: [
    "name", "duration", "description", "basePriceUsd", "hotelCategories", "toursIncluded", "includes", "itinerary",
    "gallery", "mainImage", "video", "status", "metaTitle", "metaDescription", "hotels", "tours", "extras"
  ],
  hotels: ["name", "category", "city", "nightlyPriceUsd", "description", "services", "address", "mapUrl", "gallery", "mainImage", "status"],
  extras: ["name", "description", "priceUsd", "mainImage", "status"],
  categories: ["name", "slug", "description", "status", "order"],
  paymentMethods: ["name", "logo", "description", "fieldRows", "details", "status", "order"],
  clients: ["name", "lastName", "email", "whatsapp", "country", "reservationsCount", "totalSpent", "history"],
  users: ["name", "email", "role", "permissions", "status"]
};

export const defaultAdminContent: AdminContent = {
  tours: travelServices
    .filter((item) => item.tipoServicio === "tour")
    .map((item, index) => ({
      id: item.slug,
      name: item.nombre,
      slug: item.slug,
      category: item.categoria,
      destination: item.categoria.includes("Machu") ? "Machu Picchu" : "Cusco",
      duration: item.duracion,
      difficulty: item.dificultad,
      type: "Compartido",
      basePriceUsd: item.precio ?? 0,
      offerPriceUsd: "",
      shortDescription: item.descripcionCorta,
      description: item.descripcionCompleta,
      mainImage: item.imagenPrincipal,
      gallery: item.galeria.join("\n"),
      video: "",
      includes: item.incluye.join("\n"),
      excludes: item.noIncluye.join("\n"),
      bring: item.queLlevar.join("\n"),
      mapUrl: item.mapaUrl,
      itinerary: item.itinerario.map((step) => `${step.titulo}: ${step.descripcion}`).join("\n"),
      faqs: item.preguntasFrecuentes.join("\n"),
      policies: "Sujeto a disponibilidad y condiciones del proveedor.",
      status: "Activo",
      order: index + 1,
      metaTitle: item.nombre,
      metaDescription: item.descripcionCorta
    })),
  packages: travelServices
    .filter((item) => item.tipoServicio === "paquete")
    .map((item) => ({
      id: item.slug,
      name: item.nombre,
      duration: item.duracion,
      description: item.descripcionCompleta,
      basePriceUsd: item.precioNeto ?? 0,
      hotelCategories: "2 estrellas\n3 estrellas\n4 estrellas\n5 estrellas",
      toursIncluded: item.incluye.join("\n"),
      includes: item.serviciosIncluidos?.join("\n") ?? item.incluye.join("\n"),
      itinerary: item.itinerario.map((step) => `${step.titulo}: ${step.descripcion}`).join("\n"),
      gallery: item.galeria.join("\n"),
      mainImage: item.imagenPrincipal,
      video: "",
      status: "Activo",
      metaTitle: item.nombre,
      metaDescription: item.descripcionCorta,
      hotels: "Hoteles por categoria",
      tours: "City Tour Cusco\nValle Sagrado\nMachu Picchu",
      extras: "Tren Vistadome\nGuÃ­a privado\nSeguro"
    })),
  hotels: [
    { id: "hotel-prisma", name: "Hotel Prisma Cusco", category: "2 estrellas", city: "Cusco", nightlyPriceUsd: 18, description: "Hotel economico.", services: "Desayuno\nWiFi", address: "Cusco", mapUrl: "", gallery: "", mainImage: "", status: "Activo" },
    { id: "sonesta-cusco", name: "Sonesta Hotel Cusco", category: "4 estrellas", city: "Cusco", nightlyPriceUsd: 80, description: "Hotel primera.", services: "Desayuno\nRestaurante\nWiFi", address: "Cusco", mapUrl: "", gallery: "", mainImage: "", status: "Activo" }
  ],
  reservations: [],
  clients: [],
  extras: [
    { id: "almuerzo-buffet", name: "Almuerzo buffet", description: "Almuerzo turÃ­stico.", priceUsd: 20, mainImage: "", status: "Activo" },
    { id: "caballo", name: "Caballo", description: "Caballo de apoyo segun ruta.", priceUsd: 25, mainImage: "", status: "Activo" },
    { id: "tren-vistadome", name: "Tren Vistadome", description: "Upgrade de tren.", priceUsd: 75, mainImage: "", status: "Activo" },
    { id: "guÃ­a-privado", name: "GuÃ­a privado", description: "GuÃ­a exclusivo.", priceUsd: 80, mainImage: "", status: "Activo" }
  ],
  categories: [
    { id: "tours", name: "Tours", slug: "tours", description: "Tours clÃ¡sicos", status: "Activo", order: 1 },
    { id: "paquetes", name: "Paquetes", slug: "paquetes", description: "Paquetes turÃ­sticos", status: "Activo", order: 2 },
    { id: "aventura", name: "Aventura", slug: "aventura", description: "Experiencias de aventura", status: "Activo", order: 3 },
    { id: "premium", name: "Premium", slug: "premium", description: "Servicios premium", status: "Activo", order: 4 }
  ],
  paymentMethods: [
    {
      id: "yape",
      name: "Yape",
      logo: "yape",
      description: "Pago movil previa confirmacion de disponibilidad.",
      fieldRows: `Numero Yape: Por completar
Titular: ${company.legalName}
QR: Por completar`,
      details: "Enviar captura o constancia para validar la reserva.\nLa reserva se confirma despues de verificar el abono.",
      status: "Activo",
      order: 1
    },
    {
      id: "plin",
      name: "Plin",
      logo: "plin",
      description: "Disponible para pagos coordinados con el asesor.",
      fieldRows: `Numero Plin: Por completar
Titular: ${company.legalName}
QR: Por completar`,
      details: "Enviar captura o constancia para validar la reserva.\nLa reserva se confirma despues de verificar el abono.",
      status: "Activo",
      order: 2
    },
    {
      id: "bcp",
      name: "Transferencia bancaria BCP",
      logo: "bcp",
      description: "Pago a cuenta bancaria verificada.",
      fieldRows: `Banco: Por completar
Tipo de cuenta: Por completar
Numero de cuenta: Por completar
Titular: ${company.legalName}`,
      details: "Indica nombre del pasajero y tour en la constancia.\nLa validacion se realiza por canales oficiales.",
      status: "Activo",
      order: 3
    },
    {
      id: "cci",
      name: "Transferencia interbancaria",
      logo: "cci",
      description: "Disponible mediante codigo de cuenta interbancario.",
      fieldRows: `Banco: Por completar
CCI: Por completar
Moneda: Soles
Titular: ${company.legalName}`,
      details: "Considera los tiempos de validacion del banco.\nEnviar constancia para confirmar la reserva.",
      status: "Activo",
      order: 4
    }
  ],
  settings: {
    whatsapp: company.whatsapp,
    email: company.email,
    facebook: company.facebook,
    instagram: company.instagram,
    currency: "USD",
    igv: 0,
    googleMaps: company.contactAddress,
    apiKeys: "",
    logo: "/logo-spirit-qosqo.png",
    favicon: "/icon.png",
    contactInfo: `${company.legalName} - RUC ${company.ruc}`,
    seoTitle: "Spirit Qosqo Travel",
    seoDescription: "Agencia de viajes y turismo en Cusco."
  },
  users: [
    { id: "admin", name: "Administrador", email: company.email, role: "Administrador", permissions: "Todos", status: "Activo" },
    { id: "ventas", name: "Ventas", email: "ventas@spiritqosqotravel.com", role: "Ventas", permissions: "Reservas, Clientes", status: "Activo" }
  ]
};
