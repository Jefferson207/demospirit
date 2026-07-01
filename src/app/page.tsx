"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Compass,
  Gauge,
  HeartHandshake,
  Landmark,
  MapPin,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  Mountain,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Train,
  X
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { EsnnaPosterModal } from "@/components/esnna-poster-modal";
import { LegalConsent, consentText } from "@/components/legal-consent";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { company, whatsappReservationUrl } from "@/lib/company";
import type { Tariff } from "@/lib/tariff";
import { travelServices, type TravelService } from "@/lib/travel-services";
import { cn } from "@/lib/utils";

type DisplayService = TravelService & {
  title: string;
  image: string;
  duration: string;
  difficulty: string;
  price: string;
  badge: string;
  schedule: string;
  description: string;
  includes: string[];
  excludes: string[];
  bring: string[];
  recommendations: string[];
  gallery: string[];
};

type Booking = {
  tour: string;
  date: string;
  adults: number;
  children: number;
  babies: number;
  seniors: number;
  hotelCategory: string;
  selectedHotel: string;
  extras: string[];
  name: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  hotel: string;
  schedule: string;
  service: string;
  message: string;
  comments: string;
  totalEstimate: number;
  policies: boolean;
  dataConsent: boolean;
};

type CreatedReservation = {
  code: string;
};

type PaymentSummaryMethod = {
  title: string;
  fields: [string, string][];
};

type HotelOption = {
  id: string;
  name: string;
  category: string;
  city: string;
  price: number;
  description: string;
  services: string[];
  address: string;
  image: string;
};

const whatsappNumber = company.whatsappNumber;
const whatsappUrl = whatsappReservationUrl;
const navItems = [
  ["Inicio", "#inicio"],
  ["Nosotros", "/nosotros"],
  ["Tours", "#tours"],
  ["Galería", "#galeria"],
  ["Contacto", "#contacto"]
];

const images = {
  hero: "https://upload.wikimedia.org/wikipedia/commons/4/43/Peru_Machu_Picchu_Sunrise.jpg",
  machu: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Machu_Picchu%2C_Peru.jpg?width=1600",
  sacred: "https://commons.wikimedia.org/wiki/Special:Redirect/file/The_Sacred_Valley%2C_Peru-2_%288445855270%29.jpg?width=1600",
  rainbow: "https://upload.wikimedia.org/wikipedia/commons/3/35/Cusco_Rainbow_Mountain.jpg",
  humantay: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Laguna_Humantay.jpg",
  cusco: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Plaza_de_Armas_de_Cuzco.jpg",
  moray: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Peru_-_Cusco_Sacred_Valley_%26_Incan_Ruins_050_-_Moray_%286948768452%29.jpg?width=1600",
  atv: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Peru_-_Cusco_Sacred_Valley_%26_Incan_Ruins_050_-_Moray_%286948768452%29.jpg?width=1600",
  guide: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tourists_Machu_Picchu_4302.jpg?width=1600"
};

const heroVideo = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Machu-Pichu_%28video_2011%29.webm";

function isServiceActive(service: TravelService) {
  return !("activo" in service) || service.activo !== false;
}

function toDisplayService(service: TravelService): DisplayService {
  return {
  ...service,
  title: service.nombre,
  image: service.imagenPrincipal,
  duration: service.duracion,
  difficulty: service.dificultad,
  price: service.precioTexto,
  badge: service.etiqueta,
  schedule: service.horariosDisponibles.join(", "),
  description: service.descripcionCompleta,
  includes: service.incluye,
  excludes: service.noIncluye,
  bring: service.queLlevar,
  recommendations: service.recomendaciones,
  gallery: service.galeria
  };
}

function packageTariffToDisplayService(item: Tariff["packages"][number], index: number): DisplayService {
  const name = `${item.name} - ${item.hotelCategory}`;
  const suggestedPrice = item.suggestedPrice ? `Desde USD ${item.suggestedPrice}` : "Consultar";

  return toDisplayService({
    nombre: name,
    slug: `paquete-${slugify(name)}-${index}`,
    categoria: "Paquete turístico",
    etiqueta: index === 0 ? "Más vendido" : "Popular",
    descripcionCorta: `Programa ${item.name} con hotel categoría ${item.hotelCategory}.`,
    descripcionCompleta: `Paquete turístico ${item.name} con tarifa referencial para hotel ${item.hotelCategory}. La disponibilidad, categoría exacta de hotel, trenes, entradas y horarios se confirman antes de la reserva.`,
    duracion: item.name.match(/\d+\s*d[ií]as?\s*\/\s*\d+\s*noches?/i)?.[0] ?? "Consultar",
    dificultad: "Moderado",
    precio: Number(String(item.netPrice).replace(/,/g, "")) || null,
    moneda: "USD",
    precioTexto: suggestedPrice,
    reservas: 0,
    rating: 5,
    incluye: ["Recepción en aeropuerto", "Traslados", "Hotel", "Tren", "Bus", "Entrada", "Guía", "Desayunos"],
    noIncluye: ["Vuelos", "Almuerzos no indicados", "Cenas", "Gastos personales", "Propinas"],
    queLlevar: ["Documento o pasaporte", "Ropa cómoda", "Casaca ligera", "Efectivo", "Protector solar"],
    recomendaciones: ["Reservar con anticipación", "Confirmar categoría hotelera", "Enviar datos exactos de pasajeros"],
    itinerario: [
      { titulo: "Coordinación", descripcion: "Confirmación de fechas, categoría hotelera y disponibilidad." },
      { titulo: "Servicios incluidos", descripcion: "Ejecución del paquete según programa confirmado." },
      { titulo: "Asistencia", descripcion: "Acompañamiento y soporte durante el viaje." }
    ],
    imagenPrincipal: images.machu,
    galeria: [images.machu, images.cusco, images.sacred],
    mapaUrl: `https://www.google.com/maps?q=${encodeURIComponent("Cusco Machu Picchu Peru")}&output=embed`,
    horariosDisponibles: ["Según disponibilidad"],
    tipoServicio: "paquete",
    preguntasFrecuentes: ["La tarifa depende de la categoría hotelera.", "No incluye vuelos.", "La disponibilidad se confirma antes del pago."],
    nochesHotel: Number(item.name.match(/(\d+)\s*noches?/i)?.[1]) || undefined,
    categoriaHotel: item.hotelCategory as TravelService["categoriaHotel"],
    precioNeto: Number(String(item.netPrice).replace(/,/g, "")) || undefined,
    comisionAgencia: `10%: ${item.commission10} / 15%: ${item.commission15} / 20%: ${item.commission20}`,
    tarifaVentaSugerida: `USD ${item.suggestedPrice}`,
    serviciosIncluidos: ["Recepción", "Traslados", "Hotel", "Tren", "Bus", "Entrada", "Guía", "Desayunos"]
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mergeServicesWithPackageTariff(services: TravelService[], tariff?: Tariff) {
  const displayServices = services.filter(isServiceActive).map(toDisplayService);
  const packageRows = tariff?.packages
    ?.filter((item) => item.active !== false)
    .map(packageTariffToDisplayService) ?? [];
  const bySlug = new Map<string, DisplayService>();

  [...displayServices, ...packageRows].forEach((service) => bySlug.set(service.slug, service));
  return Array.from(bySlug.values());
}

const fallbackTours: DisplayService[] = mergeServicesWithPackageTariff(travelServices);
const allToursFilter = "Todos";
const detailExtras = [
  { id: "almuerzo-buffet", label: "Almuerzo Buffet", price: 20 },
  { id: "caballo", label: "Caballo", price: 25 },
  { id: "tren-vistadome", label: "Tren Vistadome", price: 75 },
  { id: "guía-privado", label: "Guía Privado", price: 80 },
  { id: "transporte-vip", label: "Transporte VIP", price: 35 }
];
const bookingExtras = [
  { id: "transporte", label: "Transporte", price: 35 },
  { id: "tren", label: "Tren", price: 75 },
  { id: "guía", label: "Guía", price: 80 },
  { id: "seguro", label: "Seguro", price: 15 },
  { id: "almuerzo", label: "Almuerzo", price: 20 },
  { id: "cena", label: "Cena", price: 25 }
];
function getTourFilters(items: DisplayService[]) {
  const typeFilters = [
    items.some((item) => item.tipoServicio === "tour") ? "Tours" : "",
    items.some((item) => item.tipoServicio === "paquete") ? "Paquetes" : ""
  ].filter(Boolean);
  const categoryFilters = Array.from(new Set(items.map((item) => item.categoria).filter(Boolean)));

  return [allToursFilter, ...typeFilters, ...categoryFilters];
}

function matchesTourFilter(item: DisplayService, filter: string) {
  if (filter === allToursFilter) return true;
  if (filter === "Tours") return item.tipoServicio === "tour";
  if (filter === "Paquetes") return item.tipoServicio === "paquete";
  return item.categoria === filter;
}

function normalizeText(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getTravelType(item: DisplayService) {
  return item.tipoServicio === "paquete" || normalizeText(item.nombre).includes("privado") ? "Privado" : "Compartido";
}

function getNumericPrice(item: DisplayService) {
  if (typeof item.precio === "number") return item.precio;
  const match = item.precioTexto.match(/[\d,.]+/);
  return match ? Number(match[0].replace(/,/g, "")) : null;
}

function formatExperiencePrice(item: DisplayService) {
  const price = getNumericPrice(item);
  return price ? `Desde USD ${price} por persona` : "Consultar precio";
}

function getPackageNights(item?: DisplayService | null) {
  if (!item || item.tipoServicio !== "paquete") return 0;

  const source = [
    item.duracion,
    item.duration,
    item.nombre,
    item.title,
    item.descripcionCorta,
    item.descripcionCompleta,
    item.description
  ].filter(Boolean).join(" ");
  const match = source.match(/(\d+)\s*noches?/i);
  const nights = match ? Number(match[1]) : 1;

  return Number.isFinite(nights) && nights > 0 ? nights : 1;
}

function sortExperience(a: DisplayService, b: DisplayService) {
  const score = (item: DisplayService) => {
    const tag = normalizeText(String(item.etiqueta));
    if (tag.includes("vendido")) return 0;
    if (tag.includes("premium")) return 1;
    if (tag.includes("oferta") || tag.includes("promo")) return 2;
    return 3;
  };

  return score(a) - score(b) || b.reservas - a.reservas;
}

const experiencePillars = [
  {
    title: "Aventuras",
    text: "Montañas, lagunas y rutas andinas con asistencia cercana.",
    image: images.rainbow,
    icon: Mountain
  },
  {
    title: "Cultura",
    text: "Templos, plazas y relatos incas explicados por guías locales.",
    image: images.cusco,
    icon: Landmark
  },
  {
    title: "Machu Picchu",
    text: "La experiencia icónica del Cusco con coordinación clara de inicio a fin.",
    image: images.machu,
    icon: Train
  }
];

/*
const legacyTours = [
  {
    title: "City Tour Clásico + Templo de la Luna + Zona X",
    image: images.cusco,
    duration: "Medio día",
    difficulty: "Fácil",
    price: "Consultar",
    badge: "Más vendido",
    schedule: "Mañana o tarde",
    description: "Una experiencia cultural y familiar por los espacios más representativos de Cusco, con una extensión de aventura hacia el Templo de la Luna y Zona X.",
    includes: ["Transporte turístico", "Guía profesional", "Caballos", "Templo de la Luna", "Zona X", "City Tour clásico"],
    excludes: ["Boleto turístico", "Alimentación", "Gastos personales"],
    bring: ["Casaca ligera", "Agua", "Protector solar", "Cámara"],
    recommendations: ["Ideal para aclimatarse", "Apto para familias", "Reservar con 24 horas de anticipación"],
    gallery: [images.cusco, images.machu, images.sacred]
  },
  {
    title: "Valle Sagrado",
    image: images.sacred,
    duration: "Full day",
    difficulty: "Moderado",
    price: "Desde S/ 95",
    badge: "Popular",
    schedule: "Full Day",
    description: "Ruta panorámica por pueblos, mercados y centros arqueológicos incas del Valle Sagrado.",
    includes: ["Pisac", "Ollantaytambo", "Chinchero", "Transporte", "Guía bilingüe"],
    excludes: ["Boleto turístico", "Almuerzo buffet", "Propinas"],
    bring: ["Zapatillas cómodas", "Sombrero", "Efectivo", "Documento"],
    recommendations: ["Salida temprano", "Excelente para fotografía", "Combina bien con tren a Machu Picchu"],
    gallery: [images.sacred, images.moray, images.cusco]
  },
  {
    title: "Montaña de Colores",
    image: images.rainbow,
    duration: "Full day",
    difficulty: "Exigente",
    price: "Desde S/ 120",
    badge: "Oferta",
    schedule: "Full Day",
    description: "Aventura de altura hacia uno de los paisajes más icónicos del Perú, con asistencia durante la caminata.",
    includes: ["Transporte", "Desayuno", "Almuerzo", "Guía de montaña"],
    excludes: ["Entrada", "Caballo opcional", "Bebidas"],
    bring: ["Ropa abrigadora", "Guantes", "Agua", "Snacks"],
    recommendations: ["Buena aclimatación previa", "No recomendado para problemas cardíacos", "Usar bloqueador"],
    gallery: [images.rainbow, images.humantay, images.sacred]
  },
  {
    title: "Laguna Humantay",
    image: images.humantay,
    duration: "Full day",
    difficulty: "Exigente",
    price: "Desde S/ 115",
    badge: "Aventura",
    schedule: "Full Day",
    description: "Caminata hacia una laguna turquesa al pie de nevados sagrados, con paisajes de alta montaña.",
    includes: ["Recojo", "Transporte", "Desayuno", "Almuerzo", "Asistencia"],
    excludes: ["Entrada", "Caballo opcional", "Seguro personal"],
    bring: ["Poncho", "Bastón", "Agua", "Ropa térmica"],
    recommendations: ["Aclimatarse en Cusco", "Llevar efectivo", "Dormir bien la noche anterior"],
    gallery: [images.humantay, images.rainbow, images.machu]
  },
  {
    title: "Machu Picchu Full Day",
    image: images.machu,
    duration: "Full day",
    difficulty: "Moderado",
    price: "Editable",
    badge: "Premium",
    schedule: "Full Day",
    description: "Visita completa a la ciudadela inca con coordinación de tren, buses, entrada y guía certificado.",
    includes: ["Tren turístico", "Bus Consettur", "Entrada", "Guía certificado"],
    excludes: ["Almuerzo", "Upgrade de tren", "Gastos personales"],
    bring: ["Pasaporte", "Impermeable", "Zapatillas", "Agua"],
    recommendations: ["Reservar con anticipación", "Enviar datos exactos", "Elegir circuito según disponibilidad"],
    gallery: [images.machu, images.hero, images.sacred]
  },
  {
    title: "Maras y Moray",
    image: images.moray,
    duration: "Medio día",
    difficulty: "Fácil",
    price: "Desde S/ 70",
    badge: "Nuevo",
    schedule: "Mañana o tarde",
    description: "Circuito cultural por terrazas circulares incas y salineras tradicionales rodeadas de montañas.",
    includes: ["Salineras", "Centro arqueol?gico", "Transporte", "Guía"],
    excludes: ["Entradas", "Alimentación", "Compras"],
    bring: ["Lentes de sol", "Sombrero", "Cámara", "Efectivo"],
    recommendations: ["Perfecto para medio día", "Puede combinarse con cuatrimotos", "Apto para familias"],
    gallery: [images.moray, images.sacred, images.atv]
  },
  {
    title: "Cuatrimotos",
    image: images.atv,
    duration: "Medio día",
    difficulty: "Aventura",
    price: "Desde S/ 100",
    badge: "Popular",
    schedule: "Mañana o tarde",
    description: "Ruta de adrenalina por paisajes andinos con instructor, equipos y paradas escénicas.",
    includes: ["ATV", "Casco", "Instructor", "Ruta escénica"],
    excludes: ["Entradas", "Alimentación", "Seguro personal"],
    bring: ["Ropa cómoda", "Cortaviento", "Documento", "Bloqueador"],
    recommendations: ["Seguir indicaciones del instructor", "No requiere experiencia previa", "Ideal para grupos"],
    gallery: [images.atv, images.moray, images.sacred]
  }
];

*/
const reasons = [
  { icon: Award, title: "Experiencia", text: "Rutas curadas con criterio local y logística puntual." },
  { icon: ShieldCheck, title: "Seguridad", text: "Operación responsable y asistencia en cada salida." },
  { icon: BadgeCheck, title: "Guías certificados", text: "Profesionales preparados para familias y grupos privados." },
  { icon: Sparkles, title: "Precios competitivos", text: "Experiencias premium con tarifas claras y flexibles." },
  { icon: HeartHandshake, title: "Atención personalizada", text: "Itinerarios según ritmo, edad e intereses." },
  { icon: Phone, title: "Asistencia permanente", text: "Soporte directo por WhatsApp antes y durante el tour." }
];

const gallery = [
  { src: images.hero, alt: "Machu Picchu al amanecer" },
  { src: images.sacred, alt: "Valle Sagrado de los Incas" },
  { src: images.rainbow, alt: "Montaña de 7 Colores" },
  { src: images.humantay, alt: "Laguna Humantay" },
  { src: images.cusco, alt: "Plaza de Armas del Cusco" },
  { src: images.machu, alt: "Ciudadela de Machu Picchu" },
  { src: images.moray, alt: "Maras y Moray" }
];

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};

const initialBooking: Booking = {
  tour: fallbackTours[0].nombre,
  date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
  adults: 2,
  children: 0,
  babies: 0,
  seniors: 0,
  hotelCategory: "3 estrellas",
  selectedHotel: "",
  extras: [],
  name: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  language: "Español",
  hotel: "",
  schedule: "Mañana",
  service: "Compartido",
  message: "",
  comments: "",
  totalEstimate: 0,
  policies: false,
  dataConsent: false
};

function Counter({ value, suffix, label }: { value: string; suffix?: string; label: string }) {
  return (
    <motion.div variants={fadeUp} className="border-l border-white/20 pl-5">
      <div className="font-display text-xl font-normal leading-relaxed text-white md:text-2xl">
        {value}
        {suffix}
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/58">{label}</p>
    </motion.div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-bold text-obsidian">{title}</h4>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-charcoal/70">
            <Check className="mt-0.5 size-4 shrink-0 text-gold" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TourFilterButtons({ filters, value, onChange }: { filters: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onChange(filter)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition",
            value === filter
              ? "border-obsidian bg-obsidian text-gold-soft shadow-sm"
              : "border-black/10 bg-white text-charcoal/72 hover:border-gold/40 hover:bg-gold/12 hover:text-obsidian"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

function IncludedPreview({ items }: { items: string[] }) {
  const visible = items.slice(0, 4);
  const remaining = Math.max(0, items.length - visible.length);

  return (
    <div className="mt-4 grid gap-2">
      {visible.map((item) => (
        <span key={item} className="flex items-center gap-2 text-sm font-semibold text-charcoal/68">
          <Check className="size-4 shrink-0 text-gold" />
          {item}
        </span>
      ))}
      {remaining > 0 && <span className="text-sm font-bold text-gold">+{remaining} servicios más</span>}
    </div>
  );
}

function CounterInput({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (value: number) => void }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-3">
      <p className="text-sm font-bold text-obsidian">{label}</p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Button type="button" size="icon" variant="ghost" className="size-9" onClick={() => onChange(Math.max(min, value - 1))}>
          <Minus className="size-4" />
        </Button>
        <span className="text-lg font-black text-obsidian">{value}</span>
        <Button type="button" size="icon" variant="gold" className="size-9" onClick={() => onChange(value + 1)}>
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tours, setTours] = useState<DisplayService[]>(fallbackTours);
  const [hotels, setHotels] = useState<HotelOption[]>([]);
  const [bookingTourFilter, setBookingTourFilter] = useState(allToursFilter);
  const [selectedTour, setSelectedTour] = useState<DisplayService | null>(null);
  const [detailImage, setDetailImage] = useState("");
  const [detailDate, setDetailDate] = useState(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10));
  const [detailAdults, setDetailAdults] = useState(2);
  const [detailChildren, setDetailChildren] = useState(0);
  const [detailHotelCategory, setDetailHotelCategory] = useState("3 estrellas");
  const [detailHotel, setDetailHotel] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(0);
  const [toast, setToast] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [generatedReservation, setGeneratedReservation] = useState<CreatedReservation | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummaryMethod[]>([]);
  const [bookingConsentError, setBookingConsentError] = useState("");
  const [contactConsent, setContactConsent] = useState(false);
  const [contactConsentError, setContactConsentError] = useState("");
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const paidTravelers = booking.adults + booking.children;
  const totalTravelers = booking.adults + booking.children + booking.babies;
  const tourFilters = useMemo(() => getTourFilters(tours), [tours]);
  const displayedTours = useMemo(() => [...tours].sort(sortExperience), [tours]);
  const bookingFilteredTours = useMemo(() => tours.filter((tour) => matchesTourFilter(tour, bookingTourFilter)), [bookingTourFilter, tours]);
  const bookingSelectedTour = useMemo(() => tours.find((tour) => tour.nombre === booking.tour) ?? tours[0] ?? fallbackTours[0], [booking.tour, tours]);
  const bookingBasePrice = bookingSelectedTour ? getNumericPrice(bookingSelectedTour) ?? 0 : 0;
  const bookingSelectedExtras = bookingExtras.filter((extra) => booking.extras.includes(extra.id));
  const bookingExtrasTotal = bookingSelectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const hotelCategories = useMemo(() => Array.from(new Set(hotels.map((hotel) => hotel.category).filter(Boolean))), [hotels]);
  const bookingHotelOptions = useMemo(() => hotels.filter((hotel) => hotel.category === booking.hotelCategory), [booking.hotelCategory, hotels]);
  const bookingSelectedHotel = bookingHotelOptions.find((hotel) => hotel.name === booking.selectedHotel);
  const bookingHotelNights = getPackageNights(bookingSelectedTour);
  const bookingHotelPrice = bookingSelectedTour?.tipoServicio === "paquete" ? Number(bookingSelectedHotel?.price ?? 0) * bookingHotelNights : 0;
  const bookingSubtotal = bookingBasePrice * paidTravelers + bookingHotelPrice + bookingExtrasTotal;
  const bookingTaxes = 0;
  const bookingTotal = bookingSubtotal + bookingTaxes;
  const detailBasePrice = selectedTour ? getNumericPrice(selectedTour) ?? 0 : 0;
  const detailTravelers = detailAdults + detailChildren;
  const detailSelectedExtras = detailExtras.filter((extra) => selectedExtras.includes(extra.id));
  const detailExtrasTotal = detailSelectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const detailHotelOptions = useMemo(() => hotels.filter((hotel) => hotel.category === detailHotelCategory), [detailHotelCategory, hotels]);
  const detailSelectedHotel = detailHotelOptions.find((hotel) => hotel.name === detailHotel);
  const detailHotelNights = getPackageNights(selectedTour);
  const detailHotelPrice = selectedTour?.tipoServicio === "paquete" ? Number(detailSelectedHotel?.price ?? 0) * detailHotelNights : 0;
  const detailSubtotal = detailBasePrice * detailTravelers;
  const detailTotal = detailSubtotal + detailHotelPrice + detailExtrasTotal;
  const relatedTours = selectedTour
    ? tours.filter((tour) => tour.slug !== selectedTour.slug && (tour.categoria === selectedTour.categoria || tour.tipoServicio === selectedTour.tipoServicio)).slice(0, 3)
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const [servicesResponse, hotelsResponse] = await Promise.all([
          fetch("/api/travel-services", { cache: "no-store" }),
          fetch("/api/hotels", { cache: "no-store" })
        ]);
        const servicesPayload = (await servicesResponse.json()) as { services?: TravelService[] };
        const hotelsPayload = (await hotelsResponse.json()) as { hotels?: HotelOption[] };

        setTours(mergeServicesWithPackageTariff(servicesPayload.services ?? travelServices));
        setHotels(hotelsPayload.hotels ?? []);
      } catch {
        setTours(fallbackTours);
        setHotels([]);
      }
    };

    loadServices();
  }, []);

  useEffect(() => {
    if (!hotelCategories.length) return;

    setBooking((current) => {
      if (hotelCategories.includes(current.hotelCategory)) return current;
      return { ...current, hotelCategory: hotelCategories[0], selectedHotel: "", hotel: "" };
    });

    if (!hotelCategories.includes(detailHotelCategory)) {
      setDetailHotelCategory(hotelCategories[0]);
      setDetailHotel("");
    }
  }, [detailHotelCategory, hotelCategories]);

  useEffect(() => {
    if (!selectedTour) return;
    setDetailImage(selectedTour.image);
    setDetailDate(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10));
    setDetailAdults(2);
    setDetailChildren(0);
    setDetailHotelCategory(selectedTour.categoriaHotel ?? "3 estrellas");
    setDetailHotel("");
    setSelectedExtras([]);
  }, [selectedTour]);

  const progress = ((bookingStep + 1) / 8) * 100;
  const canContinue = useMemo(() => {
    if (bookingStep === 0) return Boolean(booking.tour);
    if (bookingStep === 1) return Boolean(booking.date);
    if (bookingStep === 2) return booking.adults + booking.children > 0;
    if (bookingStep === 3) return bookingSelectedTour?.tipoServicio !== "paquete" || Boolean(booking.selectedHotel);
    if (bookingStep === 5) return Boolean(booking.name && booking.lastName && booking.email && booking.phone && booking.country);
    if (bookingStep === 6) return booking.policies && booking.dataConsent;
    return true;
  }, [booking, bookingSelectedTour?.tipoServicio, bookingStep]);

  const updateTraveler = (key: "adults" | "children" | "babies" | "seniors", delta: number) => {
    setBooking((current) => ({
      ...current,
      [key]: Math.max(key === "adults" ? 1 : 0, current[key] + delta)
    }));
  };

  const createReservation = async (method: "WhatsApp" | "Pago ahora") => {
    const response = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: booking.name,
        clientLastName: booking.lastName,
        email: booking.email,
        whatsapp: booking.phone,
        country: booking.country,
        tour: booking.tour,
        packageName: bookingSelectedTour?.tipoServicio === "paquete" ? booking.tour : "",
        date: booking.date,
        adults: booking.adults,
        children: booking.children,
        babies: booking.babies,
        hotel: booking.selectedHotel || booking.hotel || "",
        extras: bookingSelectedExtras.map((extra) => extra.label),
        basePrice: bookingBasePrice,
        extrasPrice: bookingExtrasTotal,
        subtotal: bookingSubtotal,
        discount: 0,
        taxes: bookingTaxes,
        total: bookingTotal,
        method,
        observations: booking.comments || booking.message
      })
    });

    const payload = (await response.json()) as { ok?: boolean; reservation?: CreatedReservation; error?: string };

    if (!response.ok || !payload.ok || !payload.reservation) {
      throw new Error(payload.error ?? "No se pudo registrar la reserva.");
    }

    return payload.reservation;
  };

  const loadPaymentSummary = async () => {
    try {
      const response = await fetch("/api/payment-methods", { cache: "no-store" });
      const payload = (await response.json()) as { methods?: PaymentSummaryMethod[] };
      setPaymentSummary(payload.methods ?? []);
      return payload.methods ?? [];
    } catch {
      setPaymentSummary([]);
      return [];
    }
  };

  const sendReservation = async () => {
    if (!booking.policies || !booking.dataConsent) {
      setBookingConsentError(consentText);
      setBookingStep(6);
      return;
    }

    const text = `Hola, deseo reservar un tour con Spirit Qosqo Travel.

Tour: ${booking.tour}
Fecha: ${booking.date}
Adultos: ${booking.adults}
Niños: ${booking.children}
Bebes: ${booking.babies}
Total de viajeros: ${totalTravelers}
Hotel: ${booking.selectedHotel || booking.hotel || "No aplica"}
Categoría hotel: ${booking.hotelCategory}
Noches hotel: ${bookingHotelNights}
Extras: ${bookingSelectedExtras.map((extra) => `${extra.label} (+USD ${extra.price})`).join(", ") || "Sin extras"}
Precio base: USD ${bookingBasePrice}
Precio hotel: USD ${bookingHotelPrice}
Precio extras: USD ${bookingExtrasTotal}
Subtotal: USD ${bookingSubtotal}
Impuestos: USD ${bookingTaxes}
Total estimado: USD ${bookingTotal}
Nombre: ${booking.name}
Apellido: ${booking.lastName}
Correo: ${booking.email}
WhatsApp: ${booking.phone}
País: ${booking.country}
Comentarios: ${booking.comments || booking.message || "Sin comentarios"}

Quedo atento a la confirmación de disponibilidad y precio.`;

    try {
      setBookingSubmitting(true);
      await createReservation("WhatsApp");
    } catch (error) {
      setToast(error instanceof Error ? error.message : "No se pudo registrar la reserva.");
      window.setTimeout(() => setToast(""), 2600);
      return;
    } finally {
      setBookingSubmitting(false);
    }

    setToast("Reserva registrada y lista para enviar por WhatsApp");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
    window.setTimeout(() => setToast(""), 2600);
  };

  const handlePayNow = async () => {
    if (!booking.policies || !booking.dataConsent) {
      setBookingConsentError(consentText);
      setBookingStep(6);
      return;
    }

    try {
      setBookingSubmitting(true);
      const reservation = await createReservation("Pago ahora");
      await loadPaymentSummary();
      setGeneratedReservation(reservation);
      setBookingStep(7);
      setToast("Reserva generada correctamente.");
      window.setTimeout(() => setToast(""), 2600);
    } catch (error) {
      setToast(error instanceof Error ? error.message : "No se pudo generar la reserva.");
      window.setTimeout(() => setToast(""), 2600);
    } finally {
      setBookingSubmitting(false);
    }
  };

  const openBooking = (tourTitle?: string) => {
    if (tourTitle) {
      setBooking((current) => ({ ...current, tour: tourTitle, selectedHotel: "", hotel: "", extras: [], policies: false, dataConsent: false }));
      setBookingTourFilter(allToursFilter);
    }
    setGeneratedReservation(null);
    setPaymentSummary([]);
    setBookingStep(tourTitle ? 1 : 0);
    setBookingOpen(true);
  };

  return (
    <main className="overflow-hidden bg-[#F4F0E8]">
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5">
        <nav
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border px-3 py-2 transition-all duration-500 sm:px-4 md:px-5",
            scrolled
              ? "border-black/8 bg-white/90 shadow-sm backdrop-blur-2xl"
              : "border-white/12 bg-obsidian/42 text-white backdrop-blur-2xl"
          )}
        >
          <a href="#inicio" aria-label="Spirit Qosqo Travel" className="min-w-0 shrink-0" onClick={() => setMenuOpen(false)}>
            <span className="sm:hidden">
              <BrandLogo compact inverse={!scrolled} />
            </span>
            <span className="hidden sm:block">
              <BrandLogo inverse={!scrolled} />
            </span>
          </a>
          <div className="hidden items-center gap-4 lg:flex">
            {navItems.map(([label, href]) => (
              <a
                key={label}
                href={href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition",
                  scrolled ? "text-charcoal/78 hover:bg-gold/12 hover:text-obsidian" : "text-white/78 hover:bg-white/14 hover:text-white"
                )}
              >
                {label}
              </a>
            ))}
          </div>
          <button onClick={() => openBooking()} className={cn(buttonVariants({ variant: "gold", size: "sm" }), "luxury-button hidden lg:inline-flex")}>
            <CalendarDays className="size-4" />
            Reservar experiencia
          </button>
          <Button
            aria-label={menuOpen ? "Cerrar men?" : "Abrir men?"}
            aria-expanded={menuOpen}
            className={cn(
              "shrink-0 lg:hidden",
              !scrolled && "border-white/45 text-white hover:bg-white/18"
            )}
            size="icon"
            variant={scrolled ? "ghost" : "outline"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </nav>
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-7xl lg:hidden">
            <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/95 shadow-premium backdrop-blur-2xl">
              <div className="grid gap-1 p-2">
                {navItems.map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="flex min-h-12 items-center justify-between rounded-xl px-4 text-sm font-bold text-charcoal transition hover:bg-gold/12 active:bg-gold/18"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                    <ChevronRight className="size-4 text-gold" />
                  </a>
                ))}
              </div>
              <div className="border-t border-black/8 p-3">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    openBooking();
                  }}
                  className={cn(buttonVariants({ variant: "gold", size: "lg" }), "luxury-button w-full")}
                >
                  <CalendarDays className="size-5" />
                  Reservar experiencia
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-2 w-full bg-emerald hover:bg-emerald")}
                  onClick={() => setMenuOpen(false)}
                >
                  <MessageCircle className="size-5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <section id="inicio" className="relative min-h-screen overflow-hidden bg-obsidian pt-28 text-white">
        <motion.div className="absolute inset-0">
          <Image
            src={images.hero}
            alt="Machu Picchu al amanecer"
            fill
            priority
            sizes="100vw"
            className="object-cover md:hidden"
          />
          <video
            className="absolute inset-0 hidden size-full object-cover md:block"
            poster={images.hero}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          >
            <source src={heroVideo} type="video/webm" media="(min-width: 768px)" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/58 to-obsidian/12" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/82 via-obsidian/12 to-obsidian/46" />
          <div className="absolute inset-0 bg-black/16" />
        </motion.div>
        <div className="gold-particles pointer-events-none absolute inset-0 overflow-hidden opacity-16" />
        <div className="fog-layer pointer-events-none absolute bottom-4 left-[-10%] h-44 w-[120%] opacity-16" />
        <motion.div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(135deg,transparent_0_18%,rgba(201,154,58,.22)_18%_20%,transparent_20%_38%,rgba(255,255,255,.12)_38%_40%,transparent_40%)] opacity-50" />
        <div className="relative mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center px-4 pb-20">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }} className="max-w-3xl">
            <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
              <Compass className="size-4 text-gold-soft" />
              Cusco premium
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-balance max-w-2xl font-display text-3xl font-normal leading-[1.18] md:text-4xl lg:text-5xl">
              Descubre Cusco con una experiencia hecha a tu medida
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-10 max-w-xl text-sm leading-8 text-white/76 md:text-base">
              Tours privados y familiares con guías expertos, rutas cuidadas y asistencia directa.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-12 flex flex-col gap-4 sm:flex-row">
              <button onClick={() => openBooking()} className={cn(buttonVariants({ variant: "gold", size: "lg" }), "luxury-button")}>
                <MessageCircle className="size-5" />
                Reservar experiencia
              </button>
              <a href="#tours" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                <Mountain className="size-5" />
                Explorar tours
              </a>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-16 grid max-w-3xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Counter value="1500" suffix="+" label="Viajeros felices" />
              <Counter value="15" suffix="+" label="Años" />
              <Counter value="98" suffix="%" label="Satisfacción" />
              <Counter value="★★★★★" label="Calificación" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#F4F0E8] px-4 py-32">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">
              Vive Cusco como nunca antes
            </p>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">
              El viaje empieza antes de reservar.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {experiencePillars.map(({ title, text, image, icon: Icon }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08 }}
                className="group relative min-h-[360px] overflow-hidden rounded-lg sm:min-h-[400px]"
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/58" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/62 to-black/46" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] sm:p-6">
                  <div className="mb-4 grid size-11 place-items-center rounded-full bg-black/38 text-gold-soft backdrop-blur-md">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-display text-2xl font-normal leading-tight text-white">{title}</h3>
                  <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-white">{text}</p>
                  <a href="#tours" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-5")}>
                    Explorar
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="tours" className="relative overflow-hidden bg-[#F8F6F0] px-4 py-32">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Experiencias</p>
              <h2 className="mt-5 max-w-2xl font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">Tours y paquetes para descubrir Cusco.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-charcoal/66 md:text-base">
                Compara duración, dificultad, servicios incluidos y precio antes de elegir la experiencia ideal.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayedTours.map((tour, index) => (
              <motion.article
                key={tour.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.04 }}
              >
                <Card className="group h-full overflow-hidden border-black/5 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="image-skeleton absolute inset-0" />
                    <Image src={tour.imagenPrincipal} alt={tour.nombre} fill loading={index < 2 ? "eager" : "lazy"} sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-200 group-hover:scale-105" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1.5 text-xs font-bold text-obsidian backdrop-blur-md">{tour.etiqueta}</div>
                  </div>
                  <div className="flex flex-col p-5">
                    <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold text-charcoal/60">
                      <span className="flex items-center gap-1 text-gold">
                        {Array.from({ length: Math.max(1, Math.round(tour.rating)) }).map((_, star) => <Star key={star} className="size-3.5 fill-current" />)}
                      </span>
                      <span>{tour.reservas} reservas</span>
                    </div>
                    <h3 className="min-h-14 text-lg font-semibold leading-snug text-obsidian">{tour.nombre}</h3>
                    <div className="mt-4 grid gap-2 text-sm text-charcoal/62 sm:grid-cols-2">
                      <span className="inline-flex items-center gap-1.5"><Clock className="size-4 text-gold" />{tour.duracion}</span>
                      <span className="inline-flex items-center gap-1.5"><Gauge className="size-4 text-charcoal/46" />{tour.dificultad}</span>
                      <span className="inline-flex items-center gap-1.5"><Compass className="size-4 text-gold" />{getTravelType(tour)}</span>
                      <span className="inline-flex items-center gap-1.5"><Landmark className="size-4 text-charcoal/46" />{tour.categoria}</span>
                    </div>
                    <div className="mt-4 rounded-lg bg-obsidian p-4 text-white">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/48">Precio</p>
                      <p className="mt-1 text-xl font-black text-gold-soft">{formatExperiencePrice(tour)}</p>
                    </div>
                    <IncludedPreview items={tour.incluye} />
                    <Button
                      type="button"
                      variant="gold"
                      size="lg"
                      className="luxury-button mt-5 w-full"
                      onClick={() => setSelectedTour(tour)}
                    >
                      Ver experiencia
                    </Button>
                  </div>
                </Card>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white px-4 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Por qué elegirnos</p>
            <h2 className="mt-5 font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">Confianza sin exceso.</h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-black/8 bg-black/8 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map(({ icon: Icon, title, text }) => (
              <motion.div key={title} whileHover={{ y: -2 }} className="bg-white p-5 md:p-6">
                <Icon className="size-6 text-gold" />
                <h3 className="mt-4 text-base font-bold text-obsidian">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-charcoal/64">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F6F0] px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 rounded-lg border border-gold/24 bg-white p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">ESNNA - MINCETUR</p>
            <h2 className="mt-3 font-display text-3xl font-normal leading-tight text-obsidian">Prevenimos la explotacion sexual de niñas, niños y adolescentes.</h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-charcoal/68">
              En {company.tradeName} rechazamos y denunciamos toda forma de explotacion sexual de niñas, niños y adolescentes en viajes y turismo. Cumplimos con difundir el afiche oficial y promover turismo responsable.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <EsnnaPosterModal variant="button" />
          </div>
        </div>
      </section>

      <section id="galeria" className="bg-obsidian px-4 py-32 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold-soft">Galería</p>
          <h2 className="mt-5 max-w-xl font-display text-3xl font-normal leading-[1.2] md:text-4xl">Paisajes que se quedan contigo.</h2>
          <div className="mt-14 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[180px] md:grid-cols-4 lg:auto-rows-[170px]">
            {gallery.map((item, index) => (
              <div
                key={item.alt}
                className={cn(
                  "group relative block overflow-hidden rounded-lg text-left",
                  index === 0 && "col-span-2 row-span-2",
                  index === 2 && "row-span-2",
                  index === 4 && "col-span-2",
                  index === 6 && "col-span-2 md:col-span-1"
                )}
              >
                <div className="image-skeleton absolute inset-0" />
                <Image src={item.src} alt={item.alt} fill loading="lazy" sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent opacity-80" />
                <span className="absolute bottom-3 left-3 right-3 text-sm font-semibold leading-tight">{item.alt}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="relative overflow-hidden bg-[#F8F6F0] px-4 py-32">
        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Cómo funciona</p>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">
              Reserva simple. Viaje claro.
            </h2>
            <div className="mt-10 space-y-5">
              {[
                "Selecciona tu tour.",
                "Elige la fecha.",
                "Confirma disponibilidad.",
                "Recibe tu voucher.",
                "Disfruta la experiencia."
              ].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="flex gap-4"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-obsidian font-bold text-gold-soft">
                    {index + 1}
                  </span>
                  <div className="border-b border-black/10 pb-5">
                    <p className="text-lg font-bold text-obsidian">{step}</p>
                    <p className="mt-1 text-charcoal/62">Te acompañamos por WhatsApp hasta tener todo confirmado.</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button onClick={() => openBooking()} variant="gold" size="lg" className="luxury-button mt-10">
              <CalendarDays className="size-5" />
              Reservar experiencia
            </Button>
            <Link href="/medios-de-pago" className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-3 w-full sm:w-fit")}>
              <ShieldCheck className="size-5" />
              Ver medios de pago
            </Link>
          </div>
          <div className="space-y-6">
            <Card className="border-black/10 bg-white p-6 shadow-none">
              <h3 className="font-display text-2xl font-normal leading-tight text-obsidian">Contacto directo</h3>
              <div className="mt-6 space-y-4 text-charcoal/72">
                <p className="flex gap-3"><MapPin className="mt-1 size-5 shrink-0 text-gold" />{company.contactAddress}</p>
                <p className="flex gap-3"><Phone className="mt-1 size-5 shrink-0 text-gold" />{company.phone}</p>
                <p className="flex gap-3"><MessageCircle className="mt-1 size-5 shrink-0 text-gold" />WhatsApp: {company.whatsapp}</p>
                <p className="flex gap-3"><Mail className="mt-1 size-5 shrink-0 text-gold" />{company.email}</p>
                <p className="flex gap-3"><Clock className="mt-1 size-5 shrink-0 text-gold" />{company.openingHours}</p>
                <p className="rounded-lg bg-gold/10 p-3 text-sm font-semibold text-obsidian">{company.legalName} ? {company.ruc}</p>
              </div>
            </Card>
            <Card className="border-black/10 bg-white p-6 shadow-none">
              <h3 className="font-display text-2xl font-normal leading-tight text-obsidian">Escríbenos</h3>
              <form
                className="mt-5 grid gap-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!contactConsent) {
                    setContactConsentError(consentText);
                    return;
                  }
                  const form = new FormData(event.currentTarget);
                  const body = Array.from(form.entries()).map(([key, value]) => `${key}: ${value}`).join("%0A");
                  window.location.href = `mailto:${company.email}?subject=Consulta web - ${company.tradeName}&body=${body}`;
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input required name="Nombre" placeholder="Nombre completo" />
                  <Input required name="Correo" type="email" placeholder="Correo" />
                </div>
                <Input required name="WhatsApp" placeholder="WhatsApp" />
                <Textarea required name="Mensaje" placeholder="Cuéntanos qué tour o fecha te interesa" className="min-h-28" />
                <LegalConsent
                  checked={contactConsent}
                  error={contactConsentError}
                  onChange={(checked) => {
                    setContactConsent(checked);
                    setContactConsentError("");
                  }}
                />
                <Button type="submit" variant="gold" className="w-full">Enviar consulta</Button>
              </form>
            </Card>
            <div className="map-frame overflow-hidden rounded-lg">
              <iframe title="Ubicacion de Spirit Qosqo Travel" src={`https://www.google.com/maps?q=${encodeURIComponent(company.contactAddress)}&output=embed`} width="100%" height="360" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-obsidian px-4 py-36 text-white">
        <Image src={images.sacred} alt="Valle Sagrado" fill loading="lazy" sizes="100vw" className="object-cover opacity-48" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/88 via-obsidian/52 to-obsidian/10" />
        <div className="relative mx-auto max-w-7xl">
          <h2 className="max-w-xl font-display text-3xl font-normal leading-[1.2] md:text-4xl">¿Listo para descubrir el Imperio Inca?</h2>
          <p className="mt-8 max-w-xl text-base leading-8 text-white/72">Cusco se disfruta mejor cuando cada detalle está resuelto.</p>
          <Button onClick={() => openBooking()} variant="gold" size="lg" className="luxury-button mt-10">
            Reservar ahora
          </Button>
        </div>
      </section>

      {bookingOpen && (
        <div className="fixed inset-0 z-[85] flex h-dvh flex-col overflow-hidden bg-[#F8F6F0]">
          <div className="shrink-0 border-b border-black/10 bg-white/92 px-3 py-2 backdrop-blur-xl sm:px-4 sm:py-3">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <BrandLogo compact />
              <div className="flex items-center gap-3">
                <span className="hidden text-sm font-bold text-charcoal/60 sm:block">Reserva guíada</span>
                <Button aria-label="Cerrar reserva" size="icon" variant="ghost" onClick={() => setBookingOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto px-0 py-0 sm:px-4 sm:py-4 md:py-8">
            <Card className="min-h-full overflow-hidden rounded-none border-x-0 border-y border-black/5 sm:min-h-0 sm:rounded-lg sm:border">
              <div className="h-2 bg-black/5"><motion.div className="h-full bg-gold" animate={{ width: `${progress}%` }} /></div>
              <div className="border-b border-black/10 bg-white p-3 sm:p-4">
                <div className="flex max-w-full items-center gap-2 overflow-x-auto text-xs font-black uppercase tracking-[0.12em] text-charcoal/52">
                  {["Experiencia", "Fecha", "Viajeros", "Hotel", "Extras", "Resumen", "Confirmacion", "Reserva generada"].map((step, index) => (
                    <button key={step} type="button" disabled={index === 7 && !generatedReservation} onClick={() => setBookingStep(index)} className={cn("flex shrink-0 items-center gap-2 rounded-full px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-45", bookingStep === index ? "bg-obsidian text-gold-soft" : "bg-[#F8F6F0] hover:bg-gold/12")}>
                      <span className={cn("grid size-6 place-items-center rounded-full text-[11px]", index < bookingStep ? "bg-emerald text-white" : "bg-gold text-obsidian")}>{index < bookingStep ? <Check className="size-3.5" /> : index + 1}</span>
                      {step}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid min-w-0 lg:min-h-[680px] lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="min-w-0 p-4 pb-24 sm:p-6 sm:pb-24 md:p-8 lg:pb-8">
                  <motion.div key={bookingStep} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="lg:min-h-[520px]">
                    {bookingStep === 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Experiencia</p>
                        <h3 className="mt-2 text-2xl font-black text-obsidian">Elige tu tour o paquete</h3>
                        <div className="mt-4">
                          <TourFilterButtons filters={tourFilters} value={bookingTourFilter} onChange={setBookingTourFilter} />
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                          {bookingFilteredTours.map((tour) => (
                            <button key={tour.slug} type="button" onClick={() => setBooking((current) => ({ ...current, tour: tour.nombre }))} className={cn("relative overflow-hidden rounded-lg border bg-white p-3 text-left transition hover:-translate-y-1", booking.tour === tour.nombre ? "border-gold bg-gold/10" : "border-black/10")}>
                              <div className="relative h-32 overflow-hidden rounded-md"><Image src={tour.imagenPrincipal} alt={tour.nombre} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" /></div>
                              <p className="mt-3 text-sm font-black leading-snug text-obsidian">{tour.nombre}</p>
                              <p className="mt-1 text-xs font-semibold text-charcoal/52">{tour.categoria} · {formatExperiencePrice(tour)}</p>
                              {booking.tour === tour.nombre && <span className="absolute right-4 top-4 grid size-7 place-items-center rounded-full bg-emerald text-white"><Check className="size-4" /></span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {bookingStep === 1 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Fecha</p>
                        <h3 className="mt-2 text-2xl font-black text-obsidian">Selecciona fecha</h3>
                        <p className="mt-2 text-sm text-charcoal/68">Validaremos disponibilidad antes de confirmar la reserva.</p>
                        <Input className="mt-5 max-w-sm" type="date" min={new Date().toISOString().slice(0, 10)} value={booking.date} onChange={(event) => setBooking((current) => ({ ...current, date: event.target.value }))} />
                        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                          {[3, 5, 7, 10].map((days) => {
                            const date = new Date(Date.now() + 86400000 * days).toISOString().slice(0, 10);
                            return <Button key={date} variant={booking.date === date ? "gold" : "default"} onClick={() => setBooking((current) => ({ ...current, date }))}>{date}</Button>;
                          })}
                        </div>
                        <p className="mt-5 rounded-lg bg-emerald/10 p-4 text-sm font-bold text-emerald">Disponible para validación. La confirmación final se realiza con el asesor.</p>
                      </div>
                    )}

                    {bookingStep === 2 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Viajeros</p>
                        <h3 className="mt-2 text-2xl font-black text-obsidian">Selecciona viajeros</h3>
                        <div className="mt-5 max-w-2xl space-y-3">
                          {[
                            ["adults", "Adultos", "Precio completo"],
                            ["children", "Niños", "Precio completo"],
                            ["babies", "Bebes", "Sin costo"]
                          ].map(([key, label, helper]) => (
                            <div key={key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-black/10 bg-white p-4">
                              <span><strong className="block text-obsidian">{label}</strong><span className="text-sm text-charcoal/58">{helper}</span></span>
                              <div className="flex items-center gap-3">
                                <Button className="size-10" size="icon" variant="ghost" onClick={() => updateTraveler(key as "adults" | "children" | "babies", -1)}><Minus className="size-4" /></Button>
                                <span className="w-8 text-center text-xl font-black">{booking[key as "adults" | "children" | "babies"]}</span>
                                <Button className="size-10" size="icon" variant="gold" onClick={() => updateTraveler(key as "adults" | "children" | "babies", 1)}><Plus className="size-4" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 rounded-lg bg-gold/10 p-4 text-lg font-black text-obsidian">Subtotal actualizado: USD {bookingBasePrice * paidTravelers}</div>
                      </div>
                    )}

                    {bookingStep === 3 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Hotel</p>
                        <h3 className="mt-2 text-2xl font-black text-obsidian">Selecciona hotel</h3>
                        {bookingSelectedTour?.tipoServicio !== "paquete" ? (
                          <div className="mt-5 rounded-lg border border-black/10 bg-white p-6 text-charcoal/70">Este tour no requiere hotel. Puedes continuar al siguiente paso.</div>
                        ) : (
                          <>
                            {hotelCategories.length === 0 ? (
                              <div className="mt-5 rounded-lg border border-black/10 bg-white p-6 text-charcoal/70">No hay hoteles activos configurados en el admin.</div>
                            ) : (
                              <>
                                <div className="mt-5 flex flex-wrap gap-2">
                                  {hotelCategories.map((category) => <Button key={category} variant={booking.hotelCategory === category ? "gold" : "default"} onClick={() => setBooking((current) => ({ ...current, hotelCategory: category, selectedHotel: "", hotel: "" }))}>{category}</Button>)}
                                </div>
                                {bookingHotelOptions.length === 0 ? (
                                  <div className="mt-5 rounded-lg border border-black/10 bg-white p-6 text-charcoal/70">No hay hoteles activos para esta categoria.</div>
                                ) : (
                                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    {bookingHotelOptions.map((hotel) => (
                                      <article key={hotel.id} className={cn("overflow-hidden rounded-lg border bg-white", booking.selectedHotel === hotel.name ? "border-gold" : "border-black/10")}>
                                        <div className="relative h-36"><Image src={hotel.image || images.cusco} alt={hotel.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" unoptimized={Boolean(hotel.image)} /></div>
                                        <div className="p-4">
                                          <div className="flex items-start justify-between gap-3"><h4 className="font-black text-obsidian">{hotel.name}</h4><span className="rounded-full bg-gold/12 px-3 py-1 text-sm font-black text-obsidian">USD {hotel.price}/noche</span></div>
                                          <p className="mt-2 text-sm font-bold text-obsidian">{bookingHotelNights} noche{bookingHotelNights === 1 ? "" : "s"}: USD {bookingHotelPrice}</p>
                                          <p className="mt-2 text-sm text-charcoal/60">{hotel.city}{hotel.address ? ` - ${hotel.address}` : ""}</p>
                                          <div className="mt-3 flex flex-wrap gap-2">{hotel.services.map((service) => <span key={service} className="rounded-full bg-[#F8F6F0] px-3 py-1 text-xs font-bold text-charcoal/64">{service}</span>)}</div>
                                          <Button className="mt-4 w-full" variant={booking.selectedHotel === hotel.name ? "gold" : "default"} onClick={() => setBooking((current) => ({ ...current, selectedHotel: hotel.name, hotel: hotel.name }))}>Seleccionar</Button>
                                        </div>
                                      </article>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {bookingStep === 4 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Extras</p>
                        <h3 className="mt-2 text-2xl font-black text-obsidian">Personaliza tu viaje</h3>
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          {bookingExtras.map((extra) => (
                            <label key={extra.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-black/10 bg-white p-4 text-sm font-bold text-charcoal/76 transition hover:border-gold/40">
                              <span className="flex items-center gap-3"><input type="checkbox" checked={booking.extras.includes(extra.id)} onChange={(event) => setBooking((current) => ({ ...current, extras: event.target.checked ? [...current.extras, extra.id] : current.extras.filter((id) => id !== extra.id) }))} />{extra.label}</span>
                              <span>+USD {extra.price}</span>
                            </label>
                          ))}
                        </div>
                        <div className="mt-5 rounded-lg bg-gold/10 p-4 text-lg font-black text-obsidian">Total actualizado: USD {bookingTotal}</div>
                      </div>
                    )}

                    {bookingStep === 5 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Resumen</p>
                        <h3 className="mt-2 text-2xl font-black text-obsidian">Resumen de compra y datos</h3>
                        <div className="mt-5 grid gap-5 lg:grid-cols-2">
                          <div className="rounded-lg bg-[#F8F6F0] p-5 text-sm">
                            {[
                              ["Tour", booking.tour],
                              ["Fecha", booking.date],
                              ["Personas", `${totalTravelers} (${booking.adults} adultos, ${booking.children} niños, ${booking.babies} bebés)`],
                              ["Hotel", booking.selectedHotel || "No aplica"],
                              ["Noches hotel", bookingHotelNights ? String(bookingHotelNights) : "No aplica"],
                              ["Extras", bookingSelectedExtras.map((extra) => extra.label).join(", ") || "Sin extras"],
                              ["Precio base", `USD ${bookingBasePrice}`],
                              ["Precio hotel", `USD ${bookingHotelPrice}`],
                              ["Precio extras", `USD ${bookingExtrasTotal}`],
                              ["Subtotal", `USD ${bookingSubtotal}`],
                              ["Impuestos", `USD ${bookingTaxes}`],
                              ["Total", `USD ${bookingTotal}`]
                            ].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-black/8 py-2"><span className="font-bold text-charcoal/70">{label}</span><span className="text-right font-semibold text-obsidian">{value}</span></div>)}
                          </div>
                          <div className="grid gap-3">
                            <div className="grid gap-3 sm:grid-cols-2"><Input placeholder="Nombre" value={booking.name} onChange={(event) => setBooking((current) => ({ ...current, name: event.target.value }))} /><Input placeholder="Apellido" value={booking.lastName} onChange={(event) => setBooking((current) => ({ ...current, lastName: event.target.value }))} /></div>
                            <Input placeholder="Correo" type="email" value={booking.email} onChange={(event) => setBooking((current) => ({ ...current, email: event.target.value }))} />
                            <Input placeholder="WhatsApp" value={booking.phone} onChange={(event) => setBooking((current) => ({ ...current, phone: event.target.value }))} />
                            <Input placeholder="Pais" value={booking.country} onChange={(event) => setBooking((current) => ({ ...current, country: event.target.value }))} />
                            <Textarea placeholder="Comentarios" value={booking.comments} onChange={(event) => setBooking((current) => ({ ...current, comments: event.target.value, message: event.target.value }))} />
                          </div>
                        </div>
                      </div>
                    )}

                    {bookingStep === 6 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Confirmación</p>
                        <h3 className="mt-2 text-2xl font-black text-obsidian">Confirma tu reserva</h3>
                        <div className="mt-5 rounded-lg bg-[#F8F6F0] p-5">
                          <p className="text-sm leading-7 text-charcoal/70">Revisa los datos antes de continuar. WhatsApp se abrirá solo cuando presiones Reservar por WhatsApp.</p>
                          <p className="mt-4 text-3xl font-black text-obsidian">USD {bookingTotal}</p>
                        </div>
                        <div className="mt-5"><LegalConsent checked={booking.policies && booking.dataConsent} error={bookingConsentError} onChange={(checked) => { setBookingConsentError(""); setBooking((current) => ({ ...current, policies: checked, dataConsent: checked })); }} /></div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <Button className="luxury-button w-full" size="lg" variant="gold" disabled={bookingSubmitting} onClick={sendReservation}><MessageCircle className="size-5" />Reservar por WhatsApp</Button>
                          <Button className="w-full" size="lg" variant="default" disabled={bookingSubmitting} onClick={handlePayNow}>{bookingSubmitting ? "Generando..." : "Pagar ahora"}</Button>
                        </div>
                      </div>
                    )}

                    {bookingStep === 7 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Reserva generada</p>
                        <h3 className="mt-2 text-2xl font-black text-obsidian">Tu reserva fue creada</h3>
                        <div className="mt-5 rounded-lg border border-black/10 bg-[#F8F6F0] p-5">
                          <p className="text-sm font-bold uppercase tracking-[0.2em] text-charcoal/60">Codigo de reserva</p>
                          <p className="mt-2 text-3xl font-black text-obsidian">{generatedReservation?.code ?? "Pendiente"}</p>
                          <p className="mt-4 text-sm leading-7 text-charcoal/70">Enviamos la reserva a {company.email}. Revisa los medios de pago y conserva tu codigo.</p>
                        </div>

                        <div className="mt-5 rounded-lg border border-black/10 bg-white p-5">
                          <h4 className="text-base font-black text-obsidian">Medios de pago</h4>
                          <div className="mt-4 grid gap-3">
                            {(paymentSummary.length ? paymentSummary : [{ title: "Medios configurados", fields: [["Detalle", "Ver pagina de medios de pago"]] }]).slice(0, 4).map((method) => (
                              <div key={method.title} className="rounded-lg border border-black/10 p-4">
                                <p className="font-black text-obsidian">{method.title}</p>
                                <div className="mt-2 grid gap-1 text-sm text-charcoal/70">
                                  {method.fields.slice(0, 3).map(([label, value]) => (
                                    <div key={`${method.title}-${label}`} className="flex justify-between gap-4">
                                      <span>{label}</span>
                                      <strong className="text-right text-obsidian">{value}</strong>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 rounded-lg bg-obsidian p-5 text-white">
                          <p className="text-sm leading-7">Una vez realices el pago por cualquier medio, escribe al WhatsApp para validar tu reserva.</p>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <a className={cn(buttonVariants({ variant: "gold", size: "lg" }), "luxury-button w-full")} href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola, ya realice el pago de mi reserva ${generatedReservation?.code ?? ""}.`)}`} target="_blank">Escribir al WhatsApp</a>
                          <Link href="/medios-de-pago" className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}>Ver medios completos</Link>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <div className="fixed inset-x-0 bottom-0 z-20 flex justify-between border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur-xl lg:static lg:mt-10 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-0">
                    <Button variant="ghost" disabled={bookingStep === 0} onClick={() => setBookingStep((step) => Math.max(0, step - 1))}>Volver</Button>
                    {bookingStep < 6 && <Button variant="gold" disabled={!canContinue} onClick={() => setBookingStep((step) => Math.min(6, step + 1))}>Continuar</Button>}
                  </div>
                </div>

                <aside className="border-t border-black/10 bg-white p-5 lg:border-l lg:border-t-0">
                  <div className="lg:sticky lg:top-6">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Tu viaje</p>
                    <h3 className="mt-2 text-lg font-black text-obsidian">{booking.tour}</h3>
                    <div className="mt-4 grid gap-2 text-sm text-charcoal/70">
                      <div className="flex justify-between"><span>Fecha</span><strong>{booking.date}</strong></div>
                      <div className="flex justify-between"><span>Personas</span><strong>{totalTravelers}</strong></div>
                      <div className="flex justify-between"><span>Hotel</span><strong className="text-right">{booking.selectedHotel || "No aplica"}</strong></div>
                      <div className="flex justify-between"><span>Noches hotel</span><strong>{bookingHotelNights || "No aplica"}</strong></div>
                      <div className="flex justify-between"><span>Precio hotel</span><strong>USD {bookingHotelPrice}</strong></div>
                      <div className="flex justify-between"><span>Extras</span><strong>USD {bookingExtrasTotal}</strong></div>
                      <div className="flex justify-between border-t border-black/10 pt-3 text-lg text-obsidian"><span>Total</span><strong>USD {bookingTotal}</strong></div>
                    </div>
                  </div>
                </aside>
              </div>
            </Card>
          </div>
        </div>
      )}
      {selectedTour && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/78 p-3 backdrop-blur-sm sm:p-4" onClick={() => setSelectedTour(null)}>
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mx-auto my-6 max-w-7xl overflow-hidden rounded-lg bg-white shadow-sm" onClick={(event) => event.stopPropagation()}>
            <div className="relative border-b border-black/8 bg-[#F8F6F0] p-4 sm:p-5 md:p-6">
              <button aria-label="Cerrar detalles" className="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-full bg-white text-obsidian shadow-sm" onClick={() => setSelectedTour(null)}><X className="size-5" /></button>
              <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-black/5">
                    <Image src={detailImage || selectedTour.image} alt={selectedTour.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1.5 text-xs font-black text-obsidian backdrop-blur-md">{selectedTour.badge}</div>
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                    {[selectedTour.image, ...selectedTour.gallery].filter(Boolean).slice(0, 5).map((src) => (
                      <button key={src} type="button" onClick={() => setDetailImage(src)} className={cn("relative aspect-[4/3] overflow-hidden rounded-lg border", (detailImage || selectedTour.image) === src ? "border-gold" : "border-transparent")}>
                        <Image src={src} alt={selectedTour.title} fill sizes="120px" className="object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="self-end pr-12 lg:pr-0">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">{selectedTour.categoria}</p>
                  <h3 className="mt-3 font-display text-3xl font-normal leading-[1.15] text-obsidian md:text-4xl">{selectedTour.title}</h3>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-charcoal/62">
                    <span className="flex items-center gap-1 text-gold">{Array.from({ length: Math.max(1, Math.round(selectedTour.rating)) }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}</span>
                    <span>{selectedTour.rating}/5</span>
                    <span>{selectedTour.reservas} reservas</span>
                  </div>
                  <p className="mt-5 rounded-lg bg-obsidian p-5 text-2xl font-black text-gold-soft">{formatExperiencePrice(selectedTour)}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-5 md:p-8 lg:grid-cols-[minmax(0,1fr)_380px]">
              <div className="min-w-0 space-y-8">
                <section>
                  <h4 className="text-xl font-black text-obsidian">Descripcion</h4>
                  <p className="mt-3 text-sm leading-8 text-charcoal/70 md:text-base">{selectedTour.description}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <span className="rounded-lg bg-gold/10 p-4 font-bold"><Clock className="mb-2 size-5 text-gold" />{selectedTour.duration}</span>
                    <span className="rounded-lg bg-black/5 p-4 font-bold"><Gauge className="mb-2 size-5 text-charcoal/62" />{selectedTour.difficulty}</span>
                    <span className="rounded-lg bg-gold/12 p-4 font-bold"><CalendarDays className="mb-2 size-5 text-gold" />{selectedTour.schedule}</span>
                  </div>
                </section>

                <section className="grid gap-6 md:grid-cols-2">
                  <ListBlock title="Incluye" items={selectedTour.includes} />
                  <ListBlock title="No incluye" items={selectedTour.excludes} />
                  <ListBlock title="Que llevar" items={selectedTour.bring} />
                  <ListBlock title="Recomendaciones" items={selectedTour.recommendations} />
                </section>

                <section>
                  <h4 className="text-xl font-black text-obsidian">Mapa</h4>
                  <div className="map-frame mt-4 overflow-hidden rounded-lg border border-black/10">
                    <iframe title={`Mapa de ${selectedTour.title}`} src={selectedTour.mapaUrl} width="100%" height="300" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                </section>

                <section>
                  <h4 className="text-xl font-black text-obsidian">Itinerario</h4>
                  <div className="mt-4 grid gap-3">
                    {selectedTour.itinerario.map((item, index) => (
                      <div key={`${item.titulo}-${index}`} className="flex gap-3 rounded-lg bg-[#F8F6F0] p-4">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-obsidian text-xs font-bold text-gold-soft">{index + 1}</span>
                        <span className="font-semibold text-charcoal/76"><strong className="text-obsidian">{item.titulo}:</strong> {item.descripcion}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-xl font-black text-obsidian">Preguntas frecuentes</h4>
                  <div className="mt-4 grid gap-2">
                    {selectedTour.preguntasFrecuentes.map((item) => <p key={item} className="rounded-lg bg-black/5 p-3 text-sm text-charcoal/70">{item}</p>)}
                  </div>
                </section>

                {relatedTours.length > 0 && (
                  <section>
                    <h4 className="text-xl font-black text-obsidian">Tours relacionados</h4>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {relatedTours.map((tour) => (
                        <button key={tour.slug} type="button" onClick={() => setSelectedTour(tour)} className="overflow-hidden rounded-lg border border-black/10 bg-[#F8F6F0] text-left transition hover:-translate-y-1 hover:bg-white">
                          <div className="relative h-28"><Image src={tour.image} alt={tour.title} fill sizes="240px" className="object-cover" /></div>
                          <div className="p-3">
                            <p className="text-sm font-black leading-snug text-obsidian">{tour.title}</p>
                            <p className="mt-1 text-xs font-bold text-gold">{formatExperiencePrice(tour)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <aside className="lg:sticky lg:top-6 lg:self-start">
                <div className="rounded-lg border border-black/10 bg-white p-5 shadow-md">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Reserva</p>
                  <div className="mt-3 rounded-lg bg-obsidian p-4 text-white">
                    <p className="text-sm text-white/58">Precio</p>
                    <p className="text-2xl font-black text-gold-soft">{detailBasePrice ? `Desde USD ${detailBasePrice}` : "Consultar"}</p>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <label className="grid gap-2 text-sm font-bold text-obsidian">Seleccionar fecha<Input type="date" value={detailDate} onChange={(event) => setDetailDate(event.target.value)} /></label>
                    <div className="grid grid-cols-2 gap-3">
                      <CounterInput label="Adultos" value={detailAdults} min={1} onChange={setDetailAdults} />
                      <CounterInput label="Niños" value={detailChildren} min={0} onChange={setDetailChildren} />
                    </div>

                    {selectedTour.tipoServicio === "paquete" && (
                      <div className="rounded-lg border border-gold/20 bg-gold/10 p-4">
                        <p className="font-bold text-obsidian">Categoria de hotel</p>
                        {hotelCategories.length === 0 ? (
                          <p className="mt-3 rounded-lg bg-white p-3 text-sm text-charcoal/70">No hay hoteles activos configurados en el admin.</p>
                        ) : (
                          <>
                            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                              {hotelCategories.map((category) => (
                                <button key={category} type="button" onClick={() => { setDetailHotelCategory(category); setDetailHotel(""); }} className={cn("rounded-full px-3 py-2 text-sm font-black transition", detailHotelCategory === category ? "bg-obsidian text-gold-soft" : "bg-white text-charcoal/70")}>{category}</button>
                              ))}
                            </div>
                            <label className="mt-4 grid gap-2 text-sm font-bold text-obsidian">Hotel disponible
                              <select value={detailHotel} onChange={(event) => setDetailHotel(event.target.value)} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-charcoal outline-none">
                                <option value="">Seleccionar hotel</option>
                                {detailHotelOptions.map((hotel) => <option key={hotel.id} value={hotel.name}>{hotel.name} - USD {hotel.price}/noche</option>)}
                              </select>
                            </label>
                          </>
                        )}
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-obsidian">Servicios adicionales</p>
                      <div className="mt-3 grid gap-2">
                        {detailExtras.map((extra) => (
                          <label key={extra.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#F8F6F0] p-3 text-sm font-semibold text-charcoal/76">
                            <span className="flex items-center gap-2"><input type="checkbox" checked={selectedExtras.includes(extra.id)} onChange={(event) => setSelectedExtras((current) => event.target.checked ? [...current, extra.id] : current.filter((id) => id !== extra.id))} />{extra.label}</span>
                            <span>+{extra.price} USD</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-black/10 bg-[#F8F6F0] p-4">
                      <p className="font-bold text-obsidian">Resumen</p>
                      <div className="mt-3 grid gap-2 text-sm text-charcoal/72">
                        <div className="flex justify-between"><span>Precio base</span><strong>USD {detailBasePrice || 0}</strong></div>
                        <div className="flex justify-between"><span>Extras</span><strong>USD {detailExtrasTotal}</strong></div>
                        <div className="flex justify-between"><span>Noches hotel</span><strong>{detailHotelNights || "No aplica"}</strong></div>
                        <div className="flex justify-between"><span>Hotel</span><strong>USD {detailHotelPrice}</strong></div>
                        <div className="flex justify-between"><span>Cantidad de personas</span><strong>{detailTravelers}</strong></div>
                        <div className="flex justify-between"><span>Subtotal</span><strong>USD {detailSubtotal}</strong></div>
                        <div className="flex justify-between border-t border-black/10 pt-2 text-lg text-obsidian"><span>Total</span><strong>USD {detailTotal}</strong></div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="gold"
                      size="lg"
                      className="luxury-button w-full"
                      onClick={() => {
                        setBooking((current) => ({
                          ...current,
                          tour: selectedTour.title,
                          date: detailDate,
                          adults: detailAdults,
                          children: detailChildren,
                          babies: 0,
                          hotelCategory: detailHotelCategory,
                          selectedHotel: detailHotel,
                          hotel: detailHotel,
                          extras: selectedExtras
                            .map((id) => detailExtras.find((extra) => extra.id === id))
                            .filter(Boolean)
                            .map((extra) => {
                              if (extra?.id === "transporte-vip") return "transporte";
                              if (extra?.id === "tren-vistadome") return "tren";
                              if (extra?.id === "guía-privado") return "guía";
                              if (extra?.id === "almuerzo-buffet") return "almuerzo";
                              return extra?.id ?? "";
                            })
                            .filter(Boolean),
                          comments: `Extras: ${detailSelectedExtras.map((extra) => extra.label).join(", ") || "Sin extras"}. Total estimado: USD ${detailTotal}. Hotel: ${detailHotel || "Por definir"}.`,
                          message: `Extras: ${detailSelectedExtras.map((extra) => extra.label).join(", ") || "Sin extras"}. Total estimado: USD ${detailTotal}. Hotel: ${detailHotel || "Por definir"}.`,
                          totalEstimate: detailTotal
                        }));
                        setBookingStep(1);
                        setSelectedTour(null);
                        setBookingOpen(true);
                      }}
                    >
                      Continuar reserva
                    </Button>
                  </div>
                </div>
              </aside>
            </div>
          </motion.div>
        </div>
      )}
      {toast && <div className="fixed bottom-24 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-obsidian px-5 py-3 text-sm font-bold text-gold-soft shadow-sm">{toast}</div>}

      <a href={whatsappUrl} target="_blank" aria-label="WhatsApp" className="fixed bottom-5 right-5 z-50 grid size-16 place-items-center rounded-full bg-emerald text-white shadow-glow before:absolute before:inset-0 before:animate-ping before:rounded-full before:bg-emerald/40">
        <MessageCircle className="relative size-8" />
      </a>
    </main>
  );
}
