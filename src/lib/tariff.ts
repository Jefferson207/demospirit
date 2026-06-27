export type Tariff = {
  updatedAt: string;
  currency: string;
  classicTours: Array<{
    tour: string;
    duration: string;
    includes: string;
    netPrice: string;
  }>;
  packages: Array<{
    name: string;
    hotelCategory: string;
    netPrice: string;
    commission10: string;
    commission15: string;
    commission20: string;
    suggestedPrice: string;
  }>;
  hotels: Array<{
    category: string;
    hotels: string[];
    priceRange: string;
  }>;
  feed: Array<{
    service: string;
    includes: string;
  }>;
  reservationPolicies: string[];
  cancellationPolicies: Array<{
    period: string;
    charge: string;
  }>;
};

export const tariffStorageKey = "spirit-qosqo-tariff-data";

export const defaultTariff: Tariff = {
  updatedAt: "2026",
  currency: "USD",
  classicTours: [
    { tour: "City Tour Cusco", duration: "Medio dia", includes: "Transporte, guia profesional, entradas.", netPrice: "15" },
    { tour: "Valle Sagrado VIP", duration: "Dia completo", includes: "Transporte, guia, almuerzo buffet, entradas.", netPrice: "35" },
    { tour: "Maras & Moray", duration: "Medio dia", includes: "Transporte, guia profesional, entrada.", netPrice: "20" },
    { tour: "Montana 7 Colores", duration: "Dia completo", includes: "Transporte, desayuno, almuerzo, guia.", netPrice: "25" },
    { tour: "Laguna Humantay", duration: "Dia completo", includes: "Transporte, desayuno, almuerzo, guia.", netPrice: "30" },
    { tour: "Machu Picchu", duration: "Full Day", includes: "Tren, bus, entrada, guia, traslados.", netPrice: "300" },
    { tour: "Valle Sagrado + Machu Picchu 2D/1N", duration: "2 dias / 1 noche", includes: "Tren, hotel, entradas, guia, almuerzos.", netPrice: "380" },
    { tour: "Camino Inca Corto", duration: "2 dias / 1 noche", includes: "Entradas, guia, transporte, hotel, tren.", netPrice: "450" },
    { tour: "Salkantay Trek", duration: "4 dias / 3 noches", includes: "Alimentacion, campamento, guia, entradas.", netPrice: "350" },
    { tour: "Cusco Clasico", duration: "4 dias / 3 noches", includes: "Tours, hotel, traslados, entradas.", netPrice: "425" },
    { tour: "Cusco Completo", duration: "5 dias / 4 noches", includes: "Tours, hotel, traslados, entrada Machu Picchu.", netPrice: "525" }
  ],
  packages: [
    { name: "Cusco + Machu Picchu 4 dias / 3 noches", hotelCategory: "2 estrellas", netPrice: "425", commission10: "42.50", commission15: "63.75", commission20: "85.00", suggestedPrice: "550 - 600" },
    { name: "Cusco + Machu Picchu 4 dias / 3 noches", hotelCategory: "3 estrellas", netPrice: "480", commission10: "48.00", commission15: "72.00", commission20: "96.00", suggestedPrice: "620 - 680" },
    { name: "Cusco + Machu Picchu 4 dias / 3 noches", hotelCategory: "4 estrellas", netPrice: "650", commission10: "65.00", commission15: "97.50", commission20: "130.00", suggestedPrice: "850 - 950" },
    { name: "Cusco + Machu Picchu 4 dias / 3 noches", hotelCategory: "5 estrellas", netPrice: "1,100", commission10: "110.00", commission15: "165.00", commission20: "220.00", suggestedPrice: "1,400 - 1,800" }
  ],
  hotels: [
    { category: "Economica 2 estrellas", hotels: ["Hotel Prisma Cusco", "Hotel Inkarri Cusco", "Hospedaje El Triunfo"], priceRange: "18 - 30" },
    { category: "Turista Superior 3 estrellas", hotels: ["Hotel San Agustin Internacional", "Suenos del Inka Hotel", "Tierra Viva Cusco Centro", "Maytaq Wasin Boutique Hotel"], priceRange: "35 - 70" },
    { category: "Primera 4 estrellas", hotels: ["Sonesta Hotel Cusco", "Costa del Sol Wyndham Cusco", "Novotel Cusco"], priceRange: "80 - 140" },
    { category: "Lujo 5 estrellas", hotels: ["JW Marriott El Convento Cusco", "Palacio del Inka", "Belmond Hotel Monasterio"], priceRange: "180 - 500" }
  ],
  feed: [
    { service: "Desayuno", includes: "En todos los hoteles y tours que lo indiquen." },
    { service: "Almuerzo", includes: "Buffet turistico en Valle Sagrado. Almuerzo box en hikes y trekking." },
    { service: "Cena", includes: "No incluida en programas regulares, salvo indicacion." },
    { service: "Dietas especiales", includes: "Vegetariana, vegana, sin gluten, otras. Solicitar con anticipacion." },
    { service: "Bebidas", includes: "No incluidas, salvo indicado en el programa." }
  ],
  reservationPolicies: [
    "Para confirmar una reserva se requiere nombres completos, numero de pasaporte o documento y pago inicial acordado.",
    "Reservas de ultima hora sujetas a disponibilidad.",
    "Los precios estan sujetos a cambios sin previo aviso.",
    "Tarifas validas hasta el 31 de diciembre del 2026."
  ],
  cancellationPolicies: [
    { period: "Mas de 30 dias", charge: "Sin penalidad, se retiene 10% por gastos administrativos." },
    { period: "29 a 15 dias", charge: "50% del total del servicio." },
    { period: "14 a 7 dias", charge: "75% del total del servicio." },
    { period: "Menos de 7 dias o No Show", charge: "100% del total del servicio." }
  ]
};
