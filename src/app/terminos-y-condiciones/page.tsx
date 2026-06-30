import type { Metadata } from "next";
import Image from "next/image";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Políticas de compra, pago, cancelacion, reprogramacion y reembolso de Spirit Qosqo Travel."
};

const terms = [
  {
    title: "Políticas de compra",
    text: `Toda reserva queda sujeta a disponibilidad de cupos, accesos, horarios, transporte, condiciones climaticas y confirmación expresa de ${company.tradeName}. La cotizacion se considera vigente solo por el plazo indicado por el asesor.`
  },
  {
    title: "Formas de pago",
    text: "Aceptamos pagos por Yape, Plin, transferencia bancaria y transferencia interbancaria a cuentas verificadas de la empresa. Los datos de pago se comparten solo despues de confirmar disponibilidad y deben coincidir con la razon social o titular autorizado informado por la agencia."
  },
  {
    title: "Confirmación de reserva",
    text: "La reserva se confirma cuando el usuario envia datos completos, acepta estas políticas, realiza el pago acordado y recibe voucher o confirmación escrita por correo o WhatsApp."
  },
  {
    title: "Cancelaciónes",
    text: "Las cancelaciones deben solicitarse por escrito. Servicios con entradas nominativas, trenes, buses, permisos, boletos de Machu Picchu o proveedores con políticas no reembolsables pueden generar penalidades o no admitir devolucion."
  },
  {
    title: "Reprogramaciones",
    text: "Las reprogramaciones se atienden segun disponibilidad y políticas del proveedor. Pueden aplicar diferencias tarifarias, penalidades o costos administrativos si ya existian reservas, tickets o cupos emitidos."
  },
  {
    title: "Reembolsos",
    text: "Cuando corresponda, el reembolso se procesa por el mismo medio de pago o medio acordado, descontando penalidades verificables, comisiones bancarias, costos ya ejecutados y cargos de terceros no recuperables."
  },
  {
    title: "Responsabilidad del pasajero",
    text: "El pasajero debe proporcionar datos reales, revisar su voucher, portar documentos vigentes, cumplir horarios, informar condiciones medicas relevantes, seguir instrucciones del guía y respetar normas de seguridad, patrimonio cultural y areas naturales."
  },
  {
    title: "Responsabilidad de la agencia",
    text: "La agencia organiza y coordina servicios turísticos con diligencia profesional, informa condiciones esenciales, brinda asistencia por canales publicados y gestiona proveedores adecuados para la experiencia contratada."
  },
  {
    title: "Fuerza mayor",
    text: "Eventos fuera de control razonable, como cierres de vias, huelgas, restricciones oficiales, emergencias sanitarias, desastres naturales, condiciones climaticas, conflictos sociales o disposiciones de autoridades, pueden modificar, suspender o cancelar servicios. En esos casos se priorizara la seguridad del pasajero y se buscara una alternativa viable."
  }
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Condiciones comerciales"
      title="Términos y Condiciones"
      description="Estas condiciones regulan las consultas, reservas y contratacion de tours ofrecidos por nuestros canales digitales."
    >
      <div className="not-prose grid gap-4">
        {terms.map((term, index) => (
          <article key={term.title} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:border-gold/30 sm:p-6">
            <div className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/12 text-sm font-bold text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-lg font-extrabold leading-snug text-obsidian sm:text-xl">
                  {term.title}
                </h2>
                <p className="mt-3 text-[15px] font-medium leading-8 text-charcoal/72">
                  {term.text}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="not-prose mt-12 rounded-lg border border-gold/20 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-gold">Prevencion ESNNA</p>
          <h2 className="mt-2 font-display text-2xl font-normal leading-tight text-obsidian">
            Afiche de prevención contra la explotacion sexual de niñas, niños y adolescentes
          </h2>
        </div>
        <div className="overflow-hidden rounded-lg border border-black/8 bg-[#F8F6F0]">
          <Image
            src="/esnna.png"
            alt="Afiche ESNNA de prevención contra la explotacion sexual de niñas, niños y adolescentes"
            width={1240}
            height={1500}
            className="h-auto w-full object-contain"
            sizes="(min-width: 1024px) 768px, 100vw"
          />
        </div>
      </div>
    </LegalPage>
  );
}
