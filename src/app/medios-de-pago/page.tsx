import type { Metadata } from "next";
import { Building2, CheckCircle2, Landmark, MessageCircle, ShieldCheck, Smartphone } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { company, whatsappReservationUrl } from "@/lib/company";

export const metadata: Metadata = {
  title: "Medios de Pago",
  description: "Medios de pago aceptados por Spirit Qosqo Travel: Yape, Plin, transferencia bancaria e interbancaria."
};

const paymentMethods = [
  {
    title: "Yape",
    icon: Smartphone,
    logo: "yape",
    details: ["Pago movil previa confirmación de disponibilidad.", "Enviar captura o constancia para validar la reserva."],
    fields: [
      ["Numero Yape", "Por completar"],
      ["Titular", company.legalName],
      ["QR", "Por completar"]
    ]
  },
  {
    title: "Plin",
    icon: Smartphone,
    logo: "plin",
    details: ["Disponible para pagos coordinados con el asesor.", "La reserva se confirma despues de verificar el abono."],
    fields: [
      ["Numero Plin", "Por completar"],
      ["Titular", company.legalName],
      ["QR", "Por completar"]
    ]
  },
  {
    title: "Transferencia bancaria BCP",
    icon: Landmark,
    logo: "bcp",
    details: ["Pago a cuenta bancaria verificada.", "Indica nombre del pasajero y tour en la constancia."],
    fields: [
      ["Banco", "Por completar"],
      ["Tipo de cuenta", "Por completar"],
      ["Numero de cuenta", "Por completar"],
      ["Titular", company.legalName]
    ]
  },
  {
    title: "Transferencia interbancaria",
    icon: Building2,
    logo: "cci",
    details: ["Disponible mediante código de cuenta interbancario (CCI).", "Considera los tiempos de validación del banco."],
    fields: [
      ["Banco", "Por completar"],
      ["CCI", "Por completar"],
      ["Moneda", "Soles"],
      ["Titular", company.legalName]
    ]
  }
];

function PaymentLogo({ type }: { type: string }) {
  if (type === "plin") {
    return (
      <div className="flex h-24 w-full max-w-[190px] items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#5AA9E6] to-[#62D0C9] shadow-sm">
        <div className="flex size-20 items-center justify-center rounded-[42%] bg-white text-3xl font-black lowercase tracking-tight text-[#67B7E1]">
          plin
        </div>
      </div>
    );
  }

  if (type === "yape") {
    return (
      <div className="flex h-24 w-full max-w-[190px] items-center justify-center rounded-lg bg-[#742196] shadow-sm">
        <div className="grid place-items-center text-white">
          <span className="rounded-full bg-[#12C7B8] px-3 py-1 text-sm font-black text-[#742196]">S/</span>
          <span className="mt-1 font-display text-4xl font-normal lowercase leading-none">yape</span>
        </div>
      </div>
    );
  }

  if (type === "bcp") {
    return (
      <div className="flex h-24 w-full max-w-[190px] items-center justify-center rounded-lg bg-[#063B82] shadow-sm">
        <div className="flex items-center gap-2 text-4xl font-black italic text-white">
          <span className="text-[#FF6A13]">›</span>
          BCP
          <span className="text-[#FF6A13]">›</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-24 w-full max-w-[190px] items-center justify-center rounded-lg bg-gold text-3xl font-black tracking-tight text-obsidian shadow-sm">
      CCI
    </div>
  );
}

export default function PaymentMethodsPage() {
  return (
    <LegalPage
      eyebrow="Pagos verificados"
      title="Medios de Pago"
      description="Para proteger tu reserva, los pagos se realizan solo despues de confirmar disponibilidad, precio final y datos del servicio. No contamos con pasarela de pago en la web."
    >
      <div className="not-prose grid gap-5">
        <div className="rounded-lg border border-gold/20 bg-gold/10 p-5">
          <div className="flex gap-4">
            <ShieldCheck className="mt-1 size-7 shrink-0 text-gold" />
            <div>
              <h2 className="text-xl font-bold text-obsidian">Importante antes de pagar</h2>
              <p className="mt-2 leading-7 text-charcoal/72">
                Verifica que los datos de pago sean enviados desde nuestros canales oficiales. No solicitamos claves, token bancario, datos completos de tarjeta ni códigos personales.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {paymentMethods.map(({ title, icon: Icon, details, fields, logo }) => (
            <article key={title} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:border-gold/30 sm:p-6">
              <div className="mb-5 grid gap-4 sm:grid-cols-[190px_1fr] sm:items-center">
                <PaymentLogo type={logo} />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-full bg-gold/12 text-gold">
                      <Icon className="size-5" />
                    </span>
                    <h2 className="text-xl font-extrabold text-obsidian">{title}</h2>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-charcoal/62">Datos oficiales para completar antes de publicar.</p>
                </div>
              </div>
              <div className="mb-5 grid gap-2 rounded-lg bg-[#F8F6F0] p-4">
                {fields.map(([label, value]) => (
                  <div key={label} className="grid gap-1 border-b border-black/8 py-2 last:border-b-0 sm:grid-cols-[140px_1fr]">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-charcoal/46">{label}</span>
                    <span className="text-sm font-bold text-obsidian">{value}</span>
                  </div>
                ))}
              </div>
              <ul className="grid gap-3">
                {details.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-charcoal/72">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-bold text-obsidian">Datos comerciales para validar pagos</h2>
          <div className="mt-4 grid gap-3 text-sm text-charcoal/72 sm:grid-cols-2">
            <p><span className="font-bold text-obsidian">Razón social:</span> {company.legalName}</p>
            <p><span className="font-bold text-obsidian">Nombre comercial:</span> {company.tradeName}</p>
            <p><span className="font-bold text-obsidian">RUC:</span> {company.ruc}</p>
            <p><span className="font-bold text-obsidian">Correo:</span> {company.email}</p>
          </div>
          <a href={whatsappReservationUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald/90">
            <MessageCircle className="size-5" />
            Solicitar datos de pago por WhatsApp
          </a>
        </div>
      </div>
    </LegalPage>
  );
}
