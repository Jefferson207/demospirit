"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Facebook,
  Gauge,
  Globe2,
  HeartHandshake,
  Instagram,
  Landmark,
  MapPin,
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Tour = {
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
  seniors: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  hotel: string;
  schedule: string;
  service: string;
  message: string;
  policies: boolean;
};

const whatsappNumber = "51982214529";
const whatsappText = "Hola, deseo información sobre sus tours en Cusco.";
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
const navItems = ["Inicio", "Nosotros", "Tours", "Galería", "Testimonios", "Contacto"];

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

const tours: Tour[] = [
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
    includes: ["Salineras", "Centro arqueológico", "Transporte", "Guía"],
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

const testimonials = [
  {
    name: "Camila R.",
    country: "Chile",
    text: "La organización fue impecable. Nos sentimos acompañados desde el primer mensaje hasta el retorno al hotel.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Michael T.",
    country: "Estados Unidos",
    text: "Great guides, premium service and a beautiful pace for our family trip through Cusco.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"
  },
  {
    name: "Lucia M.",
    country: "Perú",
    text: "El City Tour con caballos fue distinto a todo. Muy seguro, puntual y con guías atentos.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};

const initialBooking: Booking = {
  tour: tours[0].title,
  date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
  adults: 2,
  children: 0,
  seniors: 0,
  name: "",
  email: "",
  phone: "",
  country: "",
  language: "Español",
  hotel: "",
  schedule: "Mañana",
  service: "Compartido",
  message: "",
  policies: false
};

function sectionId(item: string) {
  return item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(0);
  const [toast, setToast] = useState("");
  const [booking, setBooking] = useState<Booking>(initialBooking);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 140]);
  const heroScale = useTransform(scrollY, [0, 800], [1.06, 1.16]);
  const mountainY = useTransform(scrollY, [0, 800], [0, -86]);
  const totalTravelers = booking.adults + booking.children + booking.seniors;
  const activeTestimonial = testimonials[testimonialIndex];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(
      () => setTestimonialIndex((current) => (current + 1) % testimonials.length),
      5200
    );
    return () => window.clearInterval(timer);
  }, []);

  const progress = ((bookingStep + 1) / 6) * 100;
  const canContinue = useMemo(() => {
    if (bookingStep === 0) return Boolean(booking.tour);
    if (bookingStep === 1) return Boolean(booking.date);
    if (bookingStep === 2) return totalTravelers > 0;
    if (bookingStep === 3) return Boolean(booking.name && booking.email && booking.phone);
    if (bookingStep === 4) return booking.policies;
    return true;
  }, [booking, bookingStep, totalTravelers]);

  const updateTraveler = (key: "adults" | "children" | "seniors", delta: number) => {
    setBooking((current) => ({
      ...current,
      [key]: Math.max(key === "adults" ? 1 : 0, current[key] + delta)
    }));
  };

  const sendReservation = () => {
    const text = `Hola, deseo reservar un tour con Spirit Qosqo Travel.

Tour: ${booking.tour}
Fecha: ${booking.date}
Adultos: ${booking.adults}
Niños: ${booking.children}
Adultos mayores: ${booking.seniors}
Total de viajeros: ${totalTravelers}
Tipo de servicio: ${booking.service}
Horario: ${booking.schedule}
Nombre: ${booking.name}
Correo: ${booking.email}
WhatsApp: ${booking.phone}
País: ${booking.country}
Hotel: ${booking.hotel}
Mensaje: ${booking.message}

Quedo atento a la confirmación de disponibilidad y precio.`;

    setToast("Reserva lista para enviar por WhatsApp");
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
    window.setTimeout(() => setToast(""), 2600);
  };

  const openBooking = (tourTitle?: string) => {
    if (tourTitle) {
      setBooking((current) => ({ ...current, tour: tourTitle }));
    }
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
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${sectionId(item)}`}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm font-medium transition",
                  scrolled ? "text-charcoal/78 hover:bg-gold/12 hover:text-obsidian" : "text-white/78 hover:bg-white/14 hover:text-white"
                )}
              >
                {item}
              </a>
            ))}
          </div>
          <button onClick={() => openBooking()} className={cn(buttonVariants({ variant: "gold", size: "sm" }), "luxury-button hidden lg:inline-flex")}>
            <CalendarDays className="size-4" />
            Reservar experiencia
          </button>
          <Button
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
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
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`#${sectionId(item)}`}
                    className="flex min-h-12 items-center justify-between rounded-xl px-4 text-sm font-bold text-charcoal transition hover:bg-gold/12 active:bg-gold/18"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
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
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0">
          <video
            className="absolute inset-0 size-full object-cover"
            poster={images.hero}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={heroVideo} type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/90 via-obsidian/58 to-obsidian/12" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/82 via-obsidian/12 to-obsidian/46" />
          <div className="absolute inset-0 bg-black/16" />
        </motion.div>
        <div className="gold-particles pointer-events-none absolute inset-0 overflow-hidden opacity-16" />
        <div className="fog-layer pointer-events-none absolute bottom-4 left-[-10%] h-44 w-[120%] opacity-16" />
        <motion.div style={{ y: mountainY }} className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-[linear-gradient(135deg,transparent_0_18%,rgba(201,154,58,.22)_18%_20%,transparent_20%_38%,rgba(255,255,255,.12)_38%_40%,transparent_40%)] opacity-50" />
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

      <section id="nosotros" className="relative bg-white px-4 py-24 md:py-28">
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Nosotros</p>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">Viajar con calma, cultura y precisión.</h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-charcoal/68 md:text-base">
              Creamos experiencias en Cusco con guías certificados, atención personalizada y rutas pensadas para disfrutar sin prisa.
            </p>
            <div className="mt-8 grid max-w-md grid-cols-3 border-y border-black/10 py-5">
              {[
                ["15+", "años"],
                ["7", "tours"],
                ["24/7", "soporte"]
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl leading-none text-obsidian">{value}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/48">{label}</p>
                </div>
              ))}
            </div>
            <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-lg lg:max-w-xl">
              <div className="image-skeleton absolute inset-0" />
              <Image src={images.guide} alt="Guía turístico con viajeros en Cusco" fill loading="lazy" sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Guías certificados", "Interpretación cultural clara y trato cercano.", BadgeCheck],
              ["Atención personalizada", "Tours familiares, privados y grupos pequeños.", HeartHandshake],
              ["Seguridad", "Coordinación permanente, movilidad turística y rutas verificadas.", ShieldCheck],
              ["Turismo responsable", "Experiencias que valoran cultura, naturaleza y comunidad.", Sparkles]
            ].map(([title, text, Icon], index) => {
              const CardIcon = Icon as typeof BadgeCheck;
              return (
                <motion.div key={title as string} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="border border-black/8 bg-white p-5">
                  <div className="mb-4 grid size-9 place-items-center rounded-full bg-gold/12 text-gold">
                    <CardIcon className="size-4" />
                  </div>
                  <h3 className="text-base font-bold text-obsidian">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/64">{text as string}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="tours" className="relative overflow-hidden bg-[#F8F6F0] px-4 py-32">
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Tours destacados</p>
              <h2 className="mt-5 max-w-2xl font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">Experiencias esenciales en Cusco.</h2>
            </div>
            <button onClick={() => openBooking()} className={cn(buttonVariants({ variant: "default", size: "lg" }), "luxury-button")}>
              <CalendarDays className="size-5" />
              Reservar experiencia
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {tours.map((tour, index) => (
              <motion.article key={tour.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.04 }}>
                <Card className="group h-full overflow-hidden border-black/5 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-sm">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="image-skeleton absolute inset-0" />
                    <Image src={tour.image} alt={tour.title} fill loading={index < 2 ? "eager" : "lazy"} sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/86 px-3 py-1.5 text-xs font-bold text-obsidian backdrop-blur-md">{tour.badge}</div>
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3 text-xs font-semibold text-charcoal/60">
                      <span className="flex items-center gap-1 text-gold">
                        {Array.from({ length: 5 }).map((_, star) => <Star key={star} className="size-3.5 fill-current" />)}
                      </span>
                      <span>{120 + index * 37} reservas</span>
                    </div>
                    <h3 className="min-h-12 text-lg font-semibold leading-snug text-obsidian">{tour.title}</h3>
                    <div className="mt-4 flex items-center gap-4 text-sm text-charcoal/62">
                      <span className="inline-flex items-center gap-1.5"><Clock className="size-4 text-gold" />{tour.duration}</span>
                      <span className="inline-flex items-center gap-1.5"><Gauge className="size-4 text-charcoal/46" />{tour.difficulty}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-black/8 pt-4">
                      <span className="text-sm font-bold text-obsidian">{tour.price}</span>
                      <button className="text-sm font-bold text-obsidian underline-offset-4 hover:underline" onClick={() => setSelectedTour(tour)}>
                        Ver experiencia
                      </button>
                    </div>
                    <div className="mt-4">
                      <Button variant="gold" size="sm" className="luxury-button w-full" onClick={() => openBooking(tour.title)}>Reservar</Button>
                    </div>
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

      <section id="testimonios" className="bg-white px-4 py-32">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Testimonios</p>
            <h2 className="mt-5 font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">Recuerdos reales.</h2>
          </div>
          <Card className="border-black/10 bg-[#F8F6F0] p-8 shadow-none">
            <div className="flex items-center gap-1 text-gold">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-5 fill-current" />)}</div>
            <p className="mt-6 text-xl font-medium leading-9 text-obsidian">&ldquo;{activeTestimonial.text}&rdquo;</p>
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image src={activeTestimonial.image} alt={activeTestimonial.name} width={64} height={64} className="rounded-full object-cover" />
                <div><p className="font-bold text-obsidian">{activeTestimonial.name}</p><p className="text-sm text-charcoal/64">{activeTestimonial.country}</p></div>
              </div>
              <div className="flex gap-2">
                <Button aria-label="Testimonio anterior" size="icon" variant="ghost" onClick={() => setTestimonialIndex((testimonialIndex - 1 + testimonials.length) % testimonials.length)}><ChevronLeft className="size-5" /></Button>
                <Button aria-label="Testimonio siguiente" size="icon" variant="ghost" onClick={() => setTestimonialIndex((testimonialIndex + 1) % testimonials.length)}><ChevronRight className="size-5" /></Button>
              </div>
            </div>
          </Card>
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
          </div>
          <div className="space-y-6">
            <Card className="border-black/10 bg-white p-6 shadow-none">
              <h3 className="font-display text-2xl font-normal leading-tight text-obsidian">Contacto directo</h3>
              <div className="mt-6 space-y-4 text-charcoal/72">
                <p className="flex gap-3"><MapPin className="mt-1 size-5 shrink-0 text-gold" />Cusco, Urb. Kennedy A, Calle Los Brillantes B-41</p>
                <p className="flex gap-3"><MessageCircle className="mt-1 size-5 shrink-0 text-gold" />+51 982 214 529</p>
                <p className="flex gap-3"><Globe2 className="mt-1 size-5 shrink-0 text-gold" />reservas@spiritqosqotravel.com</p>
              </div>
            </Card>
            <div className="map-frame overflow-hidden rounded-lg">
              <iframe title="Ubicación de Spirit Qosqo Travel" src="https://www.google.com/maps?q=Urb.%20Kennedy%20A%20Calle%20Los%20Brillantes%20B-41%20Cusco%20Perú&output=embed" width="100%" height="360" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
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

      <footer className="bg-obsidian px-4 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr]">
          <div>
            <BrandLogo inverse />
            <p className="mt-5 max-w-md leading-7 text-white/68">Agencia de turismo en Cusco para viajeros que buscan cultura, naturaleza, aventura y atención exclusiva.</p>
            <div className="mt-5 flex gap-3">
              <a aria-label="Facebook" href="#" className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/18"><Facebook className="size-5" /></a>
              <a aria-label="Instagram" href="#" className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/18"><Instagram className="size-5" /></a>
            </div>
          </div>
          <div><h3 className="font-bold text-gold-soft">Enlaces</h3><div className="mt-4 grid gap-2">{navItems.map((item) => <a key={item} href={`#${sectionId(item)}`} className="text-white/68 hover:text-white">{item}</a>)}</div></div>
          <div><h3 className="font-bold text-gold-soft">Tours</h3><div className="mt-4 grid gap-2">{tours.slice(0, 5).map((tour) => <a key={tour.title} href="#tours" className="text-white/68 hover:text-white">{tour.title}</a>)}</div></div>
          <div><h3 className="font-bold text-gold-soft">Contacto</h3><p className="mt-4 text-white/68">Cusco, Urb. Kennedy A, Calle Los Brillantes B-41</p><p className="mt-2 text-white/68">+51 982 214 529</p><p className="mt-2 text-white/68">reservas@spiritqosqotravel.com</p><p className="mt-4 text-white/44">Políticas de reserva · Privacidad · Términos</p></div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/54">© {new Date().getFullYear()} Spirit Qosqo Travel. Todos los derechos reservados.</div>
      </footer>

      {bookingOpen && (
        <div className="fixed inset-0 z-[85] flex h-dvh flex-col overflow-hidden bg-[#F8F6F0]">
          <div className="shrink-0 border-b border-black/10 bg-white/92 px-3 py-2 backdrop-blur-xl sm:px-4 sm:py-3">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <BrandLogo compact />
              <div className="flex items-center gap-3">
                <span className="hidden text-sm font-bold text-charcoal/60 sm:block">Reserva guiada</span>
                <Button aria-label="Cerrar reserva" size="icon" variant="ghost" onClick={() => setBookingOpen(false)}>
                  <X className="size-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mx-auto w-full max-w-7xl flex-1 overflow-y-auto px-0 py-0 sm:px-4 sm:py-4 md:py-8">
            <Card className="min-h-full overflow-hidden rounded-none border-x-0 border-y border-black/5 sm:min-h-0 sm:rounded-lg sm:border">
              <div className="h-2 bg-black/5"><motion.div className="h-full bg-gold" animate={{ width: `${progress}%` }} /></div>
              <div className="grid min-w-0 lg:min-h-[680px] lg:grid-cols-[0.34fr_0.66fr]">
                <aside className="min-w-0 bg-obsidian p-3 text-white sm:p-6 md:p-8">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-soft sm:text-sm sm:tracking-[0.28em]">Spirit Qosqo Travel</p>
                  <h2 className="mt-2 font-display text-xl font-normal leading-tight sm:mt-4 sm:text-3xl">Reserva tu experiencia</h2>
                  <div className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1 lg:mt-10 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
                    {["Tour", "Fecha", "Viajeros", "Datos", "Preferencias", "Resumen"].map((step, index) => (
                      <button
                        key={step}
                        onClick={() => setBookingStep(index)}
                        className={cn(
                          "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold transition lg:w-full lg:shrink lg:gap-3 lg:px-4 lg:py-3",
                          bookingStep === index ? "bg-white text-obsidian" : "bg-white/8 text-white/72 hover:bg-white/12"
                        )}
                      >
                        <span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold", index < bookingStep ? "bg-emerald text-white" : "bg-gold text-obsidian")}>{index < bookingStep ? <Check className="size-4" /> : index + 1}</span>
                        <span className={cn(index === bookingStep ? "inline" : "hidden sm:inline lg:inline")}>{step}</span>
                      </button>
                    ))}
                  </div>
                </aside>
                <div className="min-w-0 p-4 pb-24 sm:p-6 sm:pb-24 md:p-10 lg:pb-10">
                  <motion.div key={bookingStep} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="lg:min-h-[500px]">
                    {bookingStep === 0 && (
                      <div>
                        <h3 className="text-xl font-semibold leading-snug text-obsidian sm:text-2xl">Selecciona tu tour</h3>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:mt-6">
                          {tours.map((tour) => (
                            <button key={tour.title} onClick={() => setBooking((current) => ({ ...current, tour: tour.title }))} className={cn("relative grid grid-cols-[72px_1fr] items-center gap-3 overflow-hidden rounded-lg border p-2 text-left transition hover:-translate-y-1 sm:block sm:p-3", booking.tour === tour.title ? "border-gold bg-gold/10" : "border-black/10 bg-white")}>
                              <div className="relative h-16 overflow-hidden rounded-md sm:h-28"><Image src={tour.image} alt={tour.title} fill sizes="(min-width: 640px) 50vw, 72px" className="object-cover" /></div>
                              <p className="pr-8 text-sm font-bold leading-snug text-obsidian sm:mt-3 sm:pr-0 sm:text-base">{tour.title}</p>
                              {booking.tour === tour.title && <span className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-emerald text-white"><Check className="size-4" /></span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {bookingStep === 1 && (
                      <div>
                        <h3 className="text-xl font-semibold leading-snug text-obsidian sm:text-2xl">Selecciona fecha</h3>
                        <p className="mt-2 text-sm text-charcoal/68">Elige una fecha tentativa. Confirmaremos disponibilidad por WhatsApp.</p>
                        <Input className="mt-5 max-w-sm" type="date" value={booking.date} onChange={(event) => setBooking((current) => ({ ...current, date: event.target.value }))} />
                        <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                          {[3, 5, 7, 10].map((days) => {
                            const date = new Date(Date.now() + 86400000 * days).toISOString().slice(0, 10);
                            return <Button key={date} variant={booking.date === date ? "gold" : "default"} onClick={() => setBooking((current) => ({ ...current, date }))}>{date}</Button>;
                          })}
                        </div>
                      </div>
                    )}
                    {bookingStep === 2 && (
                      <div>
                        <h3 className="text-xl font-semibold leading-snug text-obsidian sm:text-2xl">Viajeros</h3>
                        <div className="mt-5 max-w-xl space-y-3">
                          {[
                            ["adults", "Adultos"],
                            ["children", "Niños"],
                            ["seniors", "Adultos mayores"]
                          ].map(([key, label]) => (
                            <div key={key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-black/10 bg-white p-3 sm:gap-3 sm:p-5">
                              <span className="min-w-0 text-sm font-bold leading-snug text-obsidian sm:text-base">{label}</span>
                              <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
                                <Button className="size-9 sm:size-11" size="icon" variant="ghost" onClick={() => updateTraveler(key as "adults" | "children" | "seniors", -1)}><Minus className="size-4" /></Button>
                                <span className="w-6 text-center text-lg font-bold sm:w-8 sm:text-xl">{booking[key as "adults" | "children" | "seniors"]}</span>
                                <Button className="size-9 sm:size-11" size="icon" variant="gold" onClick={() => updateTraveler(key as "adults" | "children" | "seniors", 1)}><Plus className="size-4" /></Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 rounded-lg bg-gold/10 p-4 text-lg font-bold text-obsidian sm:p-5 sm:text-xl">Total: {totalTravelers} viajeros</div>
                      </div>
                    )}
                    {bookingStep === 3 && (
                      <div>
                        <h3 className="text-xl font-semibold leading-snug text-obsidian sm:text-2xl">Datos personales</h3>
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          <Input placeholder="Nombre completo" value={booking.name} onChange={(e) => setBooking((c) => ({ ...c, name: e.target.value }))} />
                          <Input placeholder="Correo" type="email" value={booking.email} onChange={(e) => setBooking((c) => ({ ...c, email: e.target.value }))} />
                          <Input placeholder="WhatsApp" value={booking.phone} onChange={(e) => setBooking((c) => ({ ...c, phone: e.target.value }))} />
                          <Input placeholder="País de origen" value={booking.country} onChange={(e) => setBooking((c) => ({ ...c, country: e.target.value }))} />
                          <Input placeholder="Idioma" value={booking.language} onChange={(e) => setBooking((c) => ({ ...c, language: e.target.value }))} />
                          <Input placeholder="Hotel o punto de recojo" value={booking.hotel} onChange={(e) => setBooking((c) => ({ ...c, hotel: e.target.value }))} />
                        </div>
                      </div>
                    )}
                    {bookingStep === 4 && (
                      <div>
                        <h3 className="text-xl font-semibold leading-snug text-obsidian sm:text-2xl">Preferencias</h3>
                        <div className="mt-5 grid gap-4 sm:gap-6">
                          <div><p className="mb-3 font-bold">Horario</p><div className="flex flex-wrap gap-3">{["Mañana", "Tarde", "Full Day"].map((value) => <Button key={value} variant={booking.schedule === value ? "gold" : "default"} onClick={() => setBooking((c) => ({ ...c, schedule: value }))}>{value}</Button>)}</div></div>
                          <div><p className="mb-3 font-bold">Tipo de servicio</p><div className="flex flex-wrap gap-3">{["Compartido", "Privado"].map((value) => <Button key={value} variant={booking.service === value ? "gold" : "default"} onClick={() => setBooking((c) => ({ ...c, service: value }))}>{value}</Button>)}</div></div>
                          <Textarea placeholder="Mensaje adicional" value={booking.message} onChange={(e) => setBooking((c) => ({ ...c, message: e.target.value }))} />
                          <label className="flex items-start gap-3 rounded-lg border border-black/10 p-3 text-sm font-semibold leading-6 sm:p-4"><input className="mt-1" type="checkbox" checked={booking.policies} onChange={(e) => setBooking((c) => ({ ...c, policies: e.target.checked }))} /> Acepto políticas de reserva y contacto por WhatsApp</label>
                        </div>
                      </div>
                    )}
                    {bookingStep === 5 && (
                      <div>
                        <h3 className="text-xl font-semibold leading-snug text-obsidian sm:text-2xl">Resumen</h3>
                        <div className="mt-5 grid gap-2 rounded-lg bg-[#F8F6F0] p-4 text-sm sm:gap-3 sm:p-6">
                          {[
                            ["Tour", booking.tour],
                            ["Fecha", booking.date],
                            ["Adultos", booking.adults],
                            ["Niños", booking.children],
                            ["Adultos mayores", booking.seniors],
                            ["Total", `${totalTravelers} viajeros`],
                            ["Servicio", booking.service],
                            ["Horario", booking.schedule],
                            ["Hotel", booking.hotel],
                            ["Nombre", booking.name],
                            ["WhatsApp", booking.phone],
                            ["Correo", booking.email],
                            ["Mensaje", booking.message || "Sin mensaje adicional"]
                          ].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-black/8 py-2"><span className="shrink-0 font-bold text-charcoal/70">{label}</span><span className="text-right text-obsidian">{value}</span></div>)}
                        </div>
                        <Button className="luxury-button mt-6 w-full" size="lg" variant="gold" onClick={sendReservation}><MessageCircle className="size-5" />Enviar Reserva</Button>
                      </div>
                    )}
                  </motion.div>
                  <div className="fixed inset-x-0 bottom-0 z-20 flex justify-between border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur-xl lg:static lg:mt-10 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-0">
                    <Button variant="ghost" disabled={bookingStep === 0} onClick={() => setBookingStep((step) => Math.max(0, step - 1))}>Volver</Button>
                    {bookingStep < 5 && <Button variant="gold" disabled={!canContinue} onClick={() => setBookingStep((step) => Math.min(5, step + 1))}>Continuar</Button>}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {selectedTour && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/78 p-4 backdrop-blur-sm" onClick={() => setSelectedTour(null)}>
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="mx-auto my-8 max-w-5xl overflow-hidden rounded-lg bg-white shadow-sm" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-80">
              <Image src={selectedTour.image} alt={selectedTour.title} fill sizes="100vw" className="object-cover" />
              <button aria-label="Cerrar detalles" className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-white text-obsidian" onClick={() => setSelectedTour(null)}><X className="size-5" /></button>
            </div>
            <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-gold">{selectedTour.badge}</p>
                <h3 className="mt-3 max-w-2xl font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">{selectedTour.title}</h3>
                <p className="mt-5 text-sm leading-8 text-charcoal/70 md:text-base">{selectedTour.description}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <span className="rounded-lg bg-gold/10 p-4 font-bold"><Clock className="mb-2 size-5 text-gold" />{selectedTour.duration}</span>
                  <span className="rounded-lg bg-black/5 p-4 font-bold"><Gauge className="mb-2 size-5 text-charcoal/62" />{selectedTour.difficulty}</span>
                  <span className="rounded-lg bg-gold/12 p-4 font-bold"><CalendarDays className="mb-2 size-5 text-gold" />{selectedTour.schedule}</span>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {selectedTour.gallery.map((src) => <div key={src} className="relative h-28 overflow-hidden rounded-lg"><Image src={src} alt={selectedTour.title} fill sizes="33vw" className="object-cover" /></div>)}
                </div>
                <div className="map-frame mt-6 overflow-hidden rounded-lg border border-black/10">
                  <iframe
                    title={`Mapa de ${selectedTour.title}`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${selectedTour.title} Cusco Perú`)}&output=embed`}
                    width="100%"
                    height="260"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="mt-6">
                  <h4 className="font-bold text-obsidian">Itinerario</h4>
                  <div className="mt-3 grid gap-3">
                    {["Recojo y bienvenida", "Ruta guiada con paradas escénicas", "Tiempo para fotografías", "Retorno coordinado"].map((item, index) => (
                      <div key={item} className="flex gap-3 rounded-lg bg-[#F8F6F0] p-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-obsidian text-xs font-bold text-gold-soft">{index + 1}</span>
                        <span className="font-semibold text-charcoal/76">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-lg bg-obsidian p-5 text-white"><p className="text-sm text-white/58">Precio</p><p className="font-display text-2xl font-normal leading-tight text-gold-soft">{selectedTour.price}</p></div>
                <ListBlock title="Incluye" items={selectedTour.includes} />
                <ListBlock title="No incluye" items={selectedTour.excludes} />
                <ListBlock title="Qué llevar" items={selectedTour.bring} />
                <ListBlock title="Recomendaciones" items={selectedTour.recommendations} />
                <div>
                  <h4 className="font-bold text-obsidian">Preguntas frecuentes</h4>
                  <div className="mt-3 space-y-2">
                    {["Confirmamos disponibilidad antes del pago.", "Podemos adaptar horarios para servicio privado.", "La dificultad se explica antes de confirmar."].map((item) => (
                      <p key={item} className="rounded-lg bg-black/5 p-3 text-sm text-charcoal/70">{item}</p>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-gold/20 bg-gold/10 p-4">
                  <div className="flex gap-1 text-gold">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="size-4 fill-current" />)}</div>
                  <p className="mt-3 text-sm font-semibold text-charcoal/76">&ldquo;Experiencia puntual, guía atento y paisajes increíbles.&rdquo;</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-gold">Viajero verificado</p>
                </div>
                <Button onClick={() => { openBooking(selectedTour.title); setSelectedTour(null); }} variant="gold" size="lg" className="luxury-button w-full">Reservar</Button>
              </div>
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
