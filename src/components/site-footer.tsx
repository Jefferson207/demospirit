import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { EsnnaPosterModal } from "@/components/esnna-poster-modal";
import { company, whatsappReservationUrl } from "@/lib/company";

const quickLinks = [
  ["Inicio", "/#inicio"],
  ["Nosotros", "/nosotros"],
  ["Tours", "/#tours"],
  ["Contacto", "/#contacto"],
  ["Tarifario", "/tarifario"],
  ["Preguntas frecuentes", "/preguntas-frecuentes"],
  ["Libro de Reclamaciones", "/libro-de-reclamaciones"]
];

const legalLinks = [
  ["Política de Privacidad", "/politica-privacidad"],
  ["Política de Protección de Datos Personales", "/politica-proteccion-datos-personales"],
  ["Términos y Condiciones", "/terminos-y-condiciones"],
  ["Medios de Pago", "/medios-de-pago"],
  ["Política de Cookies", "/politica-cookies"]
];

export function SiteFooter() {
  return (
    <footer className="bg-obsidian px-4 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.75fr_0.8fr_1fr]">
        <div>
          <BrandLogo inverse />
          <p className="mt-5 max-w-md leading-7 text-white/68">
            Agencia de viajes y turismo en Cusco para experiencias culturales, naturaleza, aventura y atención personalizada por canales digitales.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-white/72">
            <p><span className="font-bold text-gold-soft">Razón social:</span> {company.legalName}</p>
            <p><span className="font-bold text-gold-soft">Nombre comercial:</span> {company.tradeName}</p>
            <p><span className="font-bold text-gold-soft">RUC:</span> {company.ruc}</p>
            <p><span className="font-bold text-gold-soft">Clasificacion:</span> {company.classification}</p>
          </div>
          <div className="mt-5 flex gap-3">
            <a aria-label="Facebook" href={company.facebook} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/18">
              <Facebook className="size-5" />
            </a>
            <a aria-label="Instagram" href={company.instagram} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white/18">
              <Instagram className="size-5" />
            </a>
            <a aria-label="WhatsApp" href={whatsappReservationUrl} target="_blank" rel="noreferrer" className="grid size-11 place-items-center rounded-full bg-emerald hover:bg-emerald/90">
              <MessageCircle className="size-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gold-soft">Enlaces</h3>
          <div className="mt-4 grid gap-2">
            {quickLinks.map(([label, href]) => (
              <a key={label} href={href} className="text-white/68 hover:text-white">{label}</a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gold-soft">Legal y seguridad</h3>
          <div className="mt-4 grid gap-2">
            {legalLinks.map(([label, href]) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="text-white/68 hover:text-white">
                {label}
              </a>
            ))}
            <EsnnaPosterModal />
          </div>
          <div className="mt-5 rounded-lg border border-gold/24 bg-white/5 p-4 text-sm leading-6 text-white/70">
            <ShieldCheck className="mb-2 size-5 text-gold-soft" />
            Publicamos información exigida para agencias digitales, prevención ESNNA, políticas comerciales y protección de datos personales.
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gold-soft">Contacto</h3>
          <div className="mt-4 grid gap-3 text-white/68">
            <p className="flex gap-3"><MapPin className="mt-1 size-5 shrink-0 text-gold-soft" />{company.contactAddress}</p>
            <p className="flex gap-3"><Phone className="mt-1 size-5 shrink-0 text-gold-soft" />{company.phone}</p>
            <p className="flex gap-3"><MessageCircle className="mt-1 size-5 shrink-0 text-gold-soft" />WhatsApp: {company.whatsapp}</p>
            <p className="flex gap-3"><Mail className="mt-1 size-5 shrink-0 text-gold-soft" />{company.email}</p>
          </div>
          <p className="mt-5 text-sm text-white/46">{company.openingHours}</p>
          <p className="mt-3 text-xs leading-5 text-white/38">{company.minceturDirectoryStatus}</p>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/54">
        &copy; {new Date().getFullYear()} {company.tradeName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
