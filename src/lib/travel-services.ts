export type ServiceTag = "Más vendido" | "Popular" | "Oferta" | "Nuevo";
export type ServiceType = "tour" | "paquete" | "hotel" | "alimentación";

export type ItineraryStep = {
  titulo: string;
  descripcion: string;
};

export type TravelService = {
  nombre: string;
  slug: string;
  categoria: string;
  etiqueta: ServiceTag;
  descripcionCorta: string;
  descripcionCompleta: string;
  duracion: string;
  dificultad: string;
  precio: number | null;
  moneda: "PEN" | "USD";
  precioTexto: string;
  reservas: number;
  rating: number;
  incluye: string[];
  noIncluye: string[];
  queLlevar: string[];
  recomendaciones: string[];
  itinerario: ItineraryStep[];
  imagenPrincipal: string;
  galeria: string[];
  mapaUrl: string;
  horariosDisponibles: string[];
  tipoServicio: ServiceType;
  preguntasFrecuentes: string[];
  nochesHotel?: number;
  categoriaHotel?: "2 estrellas" | "3 estrellas" | "4 estrellas" | "5 estrellas";
  precioNeto?: number;
  comisionAgencia?: string;
  tarifaVentaSugerida?: string;
  serviciosIncluidos?: string[];
};

export const serviceImages = {
  hero: "https://upload.wikimedia.org/wikipedia/commons/4/43/Peru_Machu_Picchu_Sunrise.jpg",
  machu: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Machu_Picchu%2C_Peru.jpg?width=1600",
  sacred: "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Sacred_Valley%2C_Peru-2_%288445855270%29.jpg?width=1600",
  rainbow: "https://upload.wikimedia.org/wikipedia/commons/3/35/Cusco_Rainbow_Mountain.jpg",
  humantay: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Laguna_Humantay.jpg",
  cusco: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Plaza_de_Armas_de_Cuzco.jpg",
  moray: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Peru_-_Cusco_Sacred_Valley_%26_Incan_Ruins_050_-_Moray_%286948768452%29.jpg?width=1600",
  guide: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tourists_Machu_Picchu_4302.jpg?width=1600"
};

const defaultItinerary: ItineraryStep[] = [
  { titulo: "Recojo y bienvenida", descripcion: "Coordinacion previa y punto de encuentro confirmado." },
  { titulo: "Ruta guiada", descripcion: "Servicio acompañado por guia o coordinador segun programa." },
  { titulo: "Tiempo para fotografias", descripcion: "Paradas escenicas y espacios para disfrutar la experiencia." },
  { titulo: "Retorno coordinado", descripcion: "Finalizacion del servicio segun horario confirmado." }
];

export const travelServices: TravelService[] = [
  {
    nombre: "City Tour Clásico + Templo de la Luna + Zona X",
    slug: "city-tour-clasico-templo-luna-zona-x",
    categoria: "Cultura",
    etiqueta: "Más vendido",
    descripcionCorta: "Experiencia cultural y familiar por los espacios más representativos de Cusco.",
    descripcionCompleta: "Una experiencia cultural y familiar por los espacios más representativos de Cusco, con extensión de aventura hacia el Templo de la Luna y Zona X.",
    duracion: "Medio día",
    dificultad: "Fácil",
    precio: null,
    moneda: "PEN",
    precioTexto: "Consultar",
    reservas: 120,
    rating: 5,
    incluye: ["Transporte turístico", "Guía profesional", "Caballos", "Templo de la Luna", "Zona X", "City Tour clásico"],
    noIncluye: ["Boleto turístico", "Alimentación", "Gastos personales"],
    queLlevar: ["Casaca ligera", "Agua", "Protector solar", "Cámara"],
    recomendaciones: ["Ideal para aclimatarse", "Apto para familias", "Reservar con 24 horas de anticipación"],
    itinerario: defaultItinerary,
    imagenPrincipal: serviceImages.cusco,
    galeria: [serviceImages.cusco, serviceImages.machu, serviceImages.sacred],
    mapaUrl: `https://www.google.com/maps?q=${encodeURIComponent("City Tour Cusco Peru")}&output=embed`,
    horariosDisponibles: ["Mañana", "Tarde"],
    tipoServicio: "tour",
    preguntasFrecuentes: ["Confirmamos disponibilidad antes del pago.", "Apto para familias.", "Se recomienda iniciar este tour durante la aclimatación."]
  },
  {
    nombre: "Valle Sagrado",
    slug: "valle-sagrado",
    categoria: "Cultura",
    etiqueta: "Popular",
    descripcionCorta: "Ruta panorámica por pueblos, mercados y centros arqueológicos incas.",
    descripcionCompleta: "Ruta panorámica por pueblos, mercados y centros arqueológicos incas del Valle Sagrado, ideal para conectar cultura, paisajes y tradición local.",
    duracion: "Full day",
    dificultad: "Moderado",
    precio: 95,
    moneda: "PEN",
    precioTexto: "Desde S/ 95",
    reservas: 157,
    rating: 5,
    incluye: ["Pisac", "Ollantaytambo", "Chinchero", "Transporte", "Guía bilingüe"],
    noIncluye: ["Boleto turístico", "Almuerzo buffet", "Propinas"],
    queLlevar: ["Zapatillas cómodas", "Sombrero", "Efectivo", "Documento"],
    recomendaciones: ["Salida temprano", "Excelente para fotografía", "Combina bien con tren a Machu Picchu"],
    itinerario: defaultItinerary,
    imagenPrincipal: serviceImages.sacred,
    galeria: [serviceImages.sacred, serviceImages.moray, serviceImages.cusco],
    mapaUrl: `https://www.google.com/maps?q=${encodeURIComponent("Valle Sagrado Cusco Peru")}&output=embed`,
    horariosDisponibles: ["Full Day"],
    tipoServicio: "tour",
    preguntasFrecuentes: ["El boleto turístico no está incluido.", "Puede combinarse con pernocte en Ollantaytambo.", "La salida se confirma por WhatsApp."]
  },
  {
    nombre: "Montaña de Colores",
    slug: "montana-de-colores",
    categoria: "Aventura",
    etiqueta: "Oferta",
    descripcionCorta: "Aventura de altura hacia uno de los paisajes más icónicos del Perú.",
    descripcionCompleta: "Aventura de altura hacia uno de los paisajes más icónicos del Perú, con asistencia durante la caminata y coordinación permanente.",
    duracion: "Full day",
    dificultad: "Exigente",
    precio: 120,
    moneda: "PEN",
    precioTexto: "Desde S/ 120",
    reservas: 194,
    rating: 5,
    incluye: ["Transporte", "Desayuno", "Almuerzo", "Guía de montaña"],
    noIncluye: ["Entrada", "Caballo opcional", "Bebidas"],
    queLlevar: ["Ropa abrigadora", "Guantes", "Agua", "Snacks"],
    recomendaciones: ["Buena aclimatación previa", "No recomendado para problemas cardíacos", "Usar bloqueador"],
    itinerario: defaultItinerary,
    imagenPrincipal: serviceImages.rainbow,
    galeria: [serviceImages.rainbow, serviceImages.humantay, serviceImages.sacred],
    mapaUrl: `https://www.google.com/maps?q=${encodeURIComponent("Montaña de Colores Cusco Peru")}&output=embed`,
    horariosDisponibles: ["Full Day"],
    tipoServicio: "tour",
    preguntasFrecuentes: ["Requiere buena aclimatación.", "Hay opción de caballo según disponibilidad local.", "La ruta puede variar por clima."]
  },
  {
    nombre: "Laguna Humantay",
    slug: "laguna-humantay",
    categoria: "Aventura",
    etiqueta: "Oferta",
    descripcionCorta: "Caminata hacia una laguna turquesa al pie de nevados sagrados.",
    descripcionCompleta: "Caminata hacia una laguna turquesa al pie de nevados sagrados, con paisajes de alta montaña y asistencia durante la ruta.",
    duracion: "Full day",
    dificultad: "Exigente",
    precio: 115,
    moneda: "PEN",
    precioTexto: "Desde S/ 115",
    reservas: 231,
    rating: 5,
    incluye: ["Recojo", "Transporte", "Desayuno", "Almuerzo", "Asistencia"],
    noIncluye: ["Entrada", "Caballo opcional", "Seguro personal"],
    queLlevar: ["Poncho", "Bastón", "Agua", "Ropa térmica"],
    recomendaciones: ["Aclimatarse en Cusco", "Llevar efectivo", "Dormir bien la noche anterior"],
    itinerario: defaultItinerary,
    imagenPrincipal: serviceImages.humantay,
    galeria: [serviceImages.humantay, serviceImages.rainbow, serviceImages.machu],
    mapaUrl: `https://www.google.com/maps?q=${encodeURIComponent("Laguna Humantay Peru")}&output=embed`,
    horariosDisponibles: ["Full Day"],
    tipoServicio: "tour",
    preguntasFrecuentes: ["La caminata es de altura.", "Se recomienda llevar bastón.", "El ingreso se paga en destino."]
  },
  {
    nombre: "Machu Picchu Full Day",
    slug: "machu-picchu-full-day",
    categoria: "Premium",
    etiqueta: "Popular",
    descripcionCorta: "Visita completa a la ciudadela inca con coordinación de tren, buses y guía.",
    descripcionCompleta: "Visita completa a la ciudadela inca con coordinación de tren, buses, entrada y guía certificado, sujeto a disponibilidad de circuitos.",
    duracion: "Full day",
    dificultad: "Moderado",
    precio: null,
    moneda: "PEN",
    precioTexto: "Consultar",
    reservas: 268,
    rating: 5,
    incluye: ["Tren turístico", "Bus Consettur", "Entrada", "Guía certificado"],
    noIncluye: ["Almuerzo", "Upgrade de tren", "Gastos personales"],
    queLlevar: ["Pasaporte", "Impermeable", "Zapatillas", "Agua"],
    recomendaciones: ["Reservar con anticipación", "Enviar datos exactos", "Elegir circuito según disponibilidad"],
    itinerario: defaultItinerary,
    imagenPrincipal: serviceImages.machu,
    galeria: [serviceImages.machu, serviceImages.hero, serviceImages.sacred],
    mapaUrl: `https://www.google.com/maps?q=${encodeURIComponent("Machu Picchu Peru")}&output=embed`,
    horariosDisponibles: ["Full Day"],
    tipoServicio: "tour",
    preguntasFrecuentes: ["La entrada es nominativa.", "Los horarios dependen de tren y circuito.", "Reservar con anticipación mejora disponibilidad."]
  },
  {
    nombre: "Maras y Moray",
    slug: "maras-y-moray",
    categoria: "Cultura",
    etiqueta: "Nuevo",
    descripcionCorta: "Circuito cultural por terrazas circulares incas y salineras tradicionales.",
    descripcionCompleta: "Circuito cultural por terrazas circulares incas y salineras tradicionales rodeadas de montañas, ideal para medio día.",
    duracion: "Medio día",
    dificultad: "Fácil",
    precio: 70,
    moneda: "PEN",
    precioTexto: "Desde S/ 70",
    reservas: 305,
    rating: 5,
    incluye: ["Salineras", "Centro arqueológico", "Transporte", "Guía"],
    noIncluye: ["Entradas", "Alimentación", "Compras"],
    queLlevar: ["Lentes de sol", "Sombrero", "Cámara", "Efectivo"],
    recomendaciones: ["Perfecto para medio día", "Puede combinarse con cuatrimotos", "Apto para familias"],
    itinerario: defaultItinerary,
    imagenPrincipal: serviceImages.moray,
    galeria: [serviceImages.moray, serviceImages.sacred, serviceImages.cusco],
    mapaUrl: `https://www.google.com/maps?q=${encodeURIComponent("Maras Moray Cusco Peru")}&output=embed`,
    horariosDisponibles: ["Mañana", "Tarde"],
    tipoServicio: "tour",
    preguntasFrecuentes: ["Las entradas se pagan aparte.", "Puede combinarse con cuatrimotos.", "Es apto para familias."]
  },
  {
    nombre: "Cusco + Machu Picchu 4 días / 3 noches",
    slug: "cusco-machu-picchu-4-dias-3-noches",
    categoria: "Paquete turístico",
    etiqueta: "Más vendido",
    descripcionCorta: "Paquete completo con hotel, traslados, tren, buses, entrada, guía y desayunos.",
    descripcionCompleta: "Paquete turístico de 4 días y 3 noches para conocer Cusco y Machu Picchu con servicios coordinados, hotel por categoría y asistencia antes y durante el viaje.",
    duracion: "4 días / 3 noches",
    dificultad: "Moderado",
    precio: null,
    moneda: "USD",
    precioTexto: "Desde USD 550",
    reservas: 342,
    rating: 5,
    incluye: ["Recepción en aeropuerto", "Traslados IN/OUT", "03 noches de hotel", "City Tour Cusco", "Valle Sagrado", "Tren Expedition", "Bus Consettur", "Entrada a Machu Picchu", "Guía profesional", "Desayunos"],
    noIncluye: ["Vuelos", "Almuerzos no indicados", "Cenas", "Gastos personales", "Propinas"],
    queLlevar: ["Documento o pasaporte", "Ropa cómoda", "Casaca ligera", "Efectivo", "Protector solar"],
    recomendaciones: ["Reservar con anticipación", "Enviar datos exactos de pasajeros", "Confirmar categoría de hotel antes del pago"],
    itinerario: [
      { titulo: "Día 1", descripcion: "Recepción, traslado al hotel y City Tour Cusco." },
      { titulo: "Día 2", descripcion: "Tour Valle Sagrado y conexión hacia ruta de Machu Picchu." },
      { titulo: "Día 3", descripcion: "Visita guiada a Machu Picchu y retorno coordinado." },
      { titulo: "Día 4", descripcion: "Desayuno, check-out y traslado de salida." }
    ],
    imagenPrincipal: serviceImages.machu,
    galeria: [serviceImages.machu, serviceImages.cusco, serviceImages.sacred],
    mapaUrl: `https://www.google.com/maps?q=${encodeURIComponent("Cusco Machu Picchu Peru")}&output=embed`,
    horariosDisponibles: ["Según disponibilidad"],
    tipoServicio: "paquete",
    preguntasFrecuentes: ["La tarifa depende de categoría hotelera.", "No incluye vuelos.", "La entrada a Machu Picchu se confirma según disponibilidad."],
    nochesHotel: 3,
    categoriaHotel: "3 estrellas",
    precioNeto: 480,
    comisionAgencia: "10%, 15% o 20% según acuerdo comercial",
    tarifaVentaSugerida: "USD 620 - 680",
    serviciosIncluidos: ["Recepción", "Traslados", "Hotel", "Tren", "Bus", "Entrada", "Guía", "Desayunos"]
  }
];
