import type { ReactNode } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { company, whatsappReservationUrl } from "@/lib/company";

const mainNav = [
  ["Inicio", "/#inicio"],
  ["Nosotros", "/#nosotros"],
  ["Tours", "/#tours"],
  ["Galeria", "/#galeria"],
  ["Testimonios", "/#testimonios"],
  ["Contacto", "/#contacto"]
];

const legalNav = [
  ["Medios de Pago", "/medios-de-pago"],
  ["Terminos", "/terminos-y-condiciones"],
  ["Datos Personales", "/politica-proteccion-datos-personales"],
  ["Reclamaciones", "/libro-de-reclamaciones"]
];

export function LegalPage({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-[#F8F6F0] text-obsidian">
      <header className="sticky top-0 z-40 border-b border-black/8 bg-white/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="Volver al inicio" className="shrink-0">
              <span className="hidden sm:block">
                <BrandLogo />
              </span>
              <span className="sm:hidden">
                <BrandLogo compact />
              </span>
            </Link>
            <div className="hidden items-center gap-2 lg:flex">
              {mainNav.map(([label, href]) => (
                <Link key={label} href={href} className="rounded-full px-3 py-2 text-sm font-bold text-charcoal/70 transition hover:bg-gold/12 hover:text-obsidian">
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link href="/#contacto" className="hidden rounded-full bg-obsidian px-5 py-3 text-sm font-bold text-white transition hover:bg-charcoal sm:inline-flex">
                Contacto
              </Link>
              <a href={whatsappReservationUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid size-11 place-items-center rounded-full bg-emerald text-white transition hover:bg-emerald/90">
                <MessageCircle className="size-5" />
              </a>
            </div>
          </div>
          <nav aria-label="Navegacion legal" className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:justify-end">
            {[...mainNav, ...legalNav].map(([label, href]) => (
              <Link key={`${label}-${href}`} href={href} className="shrink-0 rounded-full border border-black/10 bg-[#F8F6F0] px-3 py-2 text-xs font-bold text-charcoal/70 transition hover:border-gold/30 hover:bg-gold/10 hover:text-obsidian lg:hidden">
                {label}
              </Link>
            ))}
            {legalNav.map(([label, href]) => (
              <Link key={`${label}-${href}-desktop`} href={href} className="hidden shrink-0 rounded-full border border-black/10 bg-[#F8F6F0] px-3 py-2 text-xs font-bold text-charcoal/70 transition hover:border-gold/30 hover:bg-gold/10 hover:text-obsidian lg:inline-flex">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <section className="px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
          <h1 className="mt-5 font-display text-4xl font-normal leading-tight md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-charcoal/70">{description}</p>
          <div className="mt-8 grid gap-2 rounded-lg border border-black/10 bg-white p-5 text-sm text-charcoal/72 sm:grid-cols-2">
            <p><span className="font-bold text-obsidian">Razon social:</span> {company.legalName}</p>
            <p><span className="font-bold text-obsidian">Nombre comercial:</span> {company.tradeName}</p>
            <p><span className="font-bold text-obsidian">RUC:</span> {company.ruc}</p>
            <p><span className="font-bold text-obsidian">Correo:</span> {company.email}</p>
          </div>
          <div className="prose prose-neutral mt-10 max-w-none prose-headings:font-display prose-headings:font-normal prose-p:leading-8 prose-a:text-obsidian prose-a:font-bold">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
