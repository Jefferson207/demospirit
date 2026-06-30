import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CalendarDays, HeartHandshake, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { buttonVariants } from "@/components/ui/button";
import { company, whatsappReservationUrl } from "@/lib/company";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conoce a Spirit Qosqo Travel, agencia de viajes y turismo en Cusco con guias certificados, soporte directo y experiencias responsables."
};

const guideImage = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tourists_Machu_Picchu_4302.jpg?width=1600";
const cuscoImage = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Plaza_de_Armas_de_Cuzco.jpg";
const machuImage = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Machu_Picchu%2C_Peru.jpg?width=1600";

const navItems = [
  ["Inicio", "/#inicio"],
  ["Tours", "/#tours"],
  ["Galeria", "/#galeria"],
  ["Contacto", "/#contacto"]
];

const companyStats = [
  ["15+", "años"],
  ["7", "tours"],
  ["24/7", "soporte"]
];

const pillars = [
  ["Mision", "Diseñar experiencias seguras y claras que conecten al viajero con la cultura viva del Cusco."],
  ["Vision", "Ser una agencia digital confiable para viajeros que buscan servicio responsable y atencion cercana."],
  ["Experiencia", "Operacion local, coordinacion por canales digitales y acompañamiento antes, durante y despues del tour."]
];

const values = [
  ["Guias certificados", "Interpretacion cultural clara y trato cercano.", BadgeCheck],
  ["Atencion personalizada", "Tours familiares, privados y grupos pequeños.", HeartHandshake],
  ["Seguridad", "Coordinacion permanente, movilidad turistica y rutas verificadas.", ShieldCheck],
  ["Turismo responsable", "Experiencias que valoran cultura, naturaleza y comunidad.", Sparkles]
];

export default function AboutPage() {
  return (
    <main className="bg-white text-obsidian">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/#inicio" aria-label="Spirit Qosqo Travel" className="shrink-0">
            <span className="hidden sm:block"><BrandLogo /></span>
            <span className="sm:hidden"><BrandLogo compact /></span>
          </Link>
          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map(([label, href]) => (
              <Link key={label} href={href} className="rounded-full px-3 py-2 text-sm font-bold text-charcoal/70 transition hover:bg-gold/12 hover:text-obsidian">
                {label}
              </Link>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/#contacto" className={cn(buttonVariants({ variant: "default", size: "sm" }), "hidden sm:inline-flex")}>
              Contacto
            </Link>
            <a href={whatsappReservationUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-11 place-items-center rounded-full bg-emerald text-white transition hover:bg-emerald/90">
              <MessageCircle className="size-5" />
            </a>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-obsidian px-4 py-20 text-white md:py-28">
        <Image src={machuImage} alt="Machu Picchu en Cusco" fill priority sizes="100vw" className="object-cover opacity-38" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/78 to-obsidian/36" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold-soft">Nosotros</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-normal leading-[1.08] md:text-6xl">
            Viajar con calma, cultura y precision.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/76 md:text-lg">
            Creamos experiencias en Cusco con guias certificados, atencion personalizada y rutas pensadas para disfrutar sin prisa.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/#tours" className={cn(buttonVariants({ variant: "gold", size: "lg" }), "luxury-button")}>
              <CalendarDays className="size-5" />
              Ver tours
            </Link>
            <a href={whatsappReservationUrl} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              <MessageCircle className="size-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">{company.tradeName}</p>
            <h2 className="mt-5 max-w-xl font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">
              Operacion local para experiencias claras y bien cuidadas.
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-charcoal/68 md:text-base">
              Somos una agencia de viajes y turismo en Cusco enfocada en experiencias culturales, naturaleza, aventura y servicios personalizados por canales digitales.
            </p>
            <div className="mt-8 grid max-w-md grid-cols-3 border-y border-black/10 py-5">
              {companyStats.map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl leading-none text-obsidian">{value}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-charcoal/48">{label}</p>
                </div>
              ))}
            </div>
            <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-lg lg:max-w-xl">
              <div className="image-skeleton absolute inset-0" />
              <Image src={guideImage} alt="Guia turistico con viajeros en Cusco" fill loading="lazy" sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map(([title, text]) => (
              <div key={title} className="border border-gold/18 bg-gold/8 p-5 sm:col-span-2 lg:col-span-1">
                <h3 className="text-base font-bold text-obsidian">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-charcoal/64">{text}</p>
              </div>
            ))}
            {values.map(([title, text, Icon]) => {
              const ValueIcon = Icon as typeof BadgeCheck;
              return (
                <div key={title as string} className="border border-black/8 bg-white p-5">
                  <div className="mb-4 grid size-9 place-items-center rounded-full bg-gold/12 text-gold">
                    <ValueIcon className="size-4" />
                  </div>
                  <h3 className="text-base font-bold text-obsidian">{title as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/64">{text as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F6F0] px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Compromiso</p>
            <h2 className="mt-5 max-w-2xl font-display text-3xl font-normal leading-[1.2] text-obsidian md:text-4xl">
              Turismo responsable desde la planificacion hasta el retorno.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-charcoal/68 md:text-base">
              Coordinamos horarios, recojos, recomendaciones y confirmaciones con informacion clara. Priorizamos seguridad, puntualidad, respeto cultural y asistencia directa durante cada experiencia.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-charcoal/72 sm:grid-cols-2">
              <p className="rounded-lg bg-white p-4">Rutas verificadas y movilidad turistica.</p>
              <p className="rounded-lg bg-white p-4">Guias profesionales para viajeros nacionales e internacionales.</p>
              <p className="rounded-lg bg-white p-4">Atencion por WhatsApp y correo antes de confirmar la reserva.</p>
              <p className="rounded-lg bg-white p-4">Cumplimiento de politicas comerciales, privacidad y prevencion ESNNA.</p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <div className="image-skeleton absolute inset-0" />
            <Image src={cuscoImage} alt="Centro historico del Cusco" fill loading="lazy" sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>
    </main>
  );
}
