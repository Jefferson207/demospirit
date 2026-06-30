import type { Metadata } from "next";
import { CalendarDays, Database, LockKeyhole, Scale, ShieldCheck, UserCheck } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Política de Protección de Datos Personales",
  description: "Política profesional de protección de datos personales de Spirit Qosqo Travel conforme a la Ley N. 29733 y su Reglamento."
};

const sections = [
  {
    icon: UserCheck,
    title: "Responsable del tratamiento",
    text: `${company.legalName}, RUC: ${company.ruc}, correo: ${company.email}, teléfono: ${company.phone}, con domicilio de contacto en ${company.contactAddress}.`
  },
  {
    icon: Database,
    title: "Datos personales que recopilamos",
    text: "Nombres y apellidos, documento de identidad o pasaporte cuando corresponda, correo, teléfono, WhatsApp, pais, idioma, hotel o punto de recojo, datos de pasajeros, preferencias de viaje, mensajes de consulta y constancias de pago."
  },
  {
    icon: Scale,
    title: "Base legal",
    text: "Tratamos los datos conforme a la Ley N. 29733, Ley de Protección de Datos Personales, su Reglamento y el consentimiento otorgado por el usuario al enviar formularios, reservar o contratar servicios."
  },
  {
    icon: LockKeyhole,
    title: "Medidas de seguridad",
    text: "Aplicamos minimizacion de datos, acceso restringido, canales HTTPS, verificacion de cuentas de pago, gestion confidencial de comunicaciones y prohibicion de solicitar claves bancarias o datos completos de tarjeta por chats."
  }
];

const policyBlocks = [
  {
    title: "Introduccion",
    text: `La privacidad del viajero es prioritaria. Esta politica se aplica a toda persona que entregue datos personales a ${company.tradeName} mediante formularios web, WhatsApp, correo electrónico, redes sociales, llamadas o cualquier canal digital administrado por la agencia.`
  },
  {
    title: "Finalidad del tratamiento",
    text: "Usamos los datos para atender consultas, verificar disponibilidad, elaborar cotizaciones, gestionar reservas, emitir vouchers, coordinar recojos, operar tours, procesar pagos, cumplir obligaciones administrativas, tributarias y de atención al consumidor, responder reclamos y brindar soporte antes, durante y despues del servicio."
  },
  {
    title: "Conservacion de los datos",
    text: "Conservamos los datos solo durante el tiempo necesario para cumplir las finalidades indicadas, atender responsabilidades contractuales, reclamos, requerimientos de autoridades y obligaciones legales aplicables. Luego los eliminamos, bloqueamos o anonimizamos de acuerdo con criterios internos de seguridad."
  },
  {
    title: "Transferencia de datos",
    text: "Cuando sea necesario para prestar el servicio, podremos compartir datos estrictamente indispensables con hoteles, operadores turísticos, guías, transportistas, proveedores de tickets, empresas ferroviarias, entidades financieras o autoridades competentes. Estas transferencias se realizan bajo criterios de necesidad, proporcionalidad y confidencialidad."
  },
  {
    title: "Derechos ARCO",
    text: "El titular de los datos puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición. También puede solicitar información sobre el uso de sus datos, actualizar información inexacta, pedir la supresión cuando corresponda u oponerse al tratamiento para finalidades no necesarias."
  },
  {
    title: "Procedimiento para ejercer derechos ARCO",
    text: `Para ejercer estos derechos, envia una solicitud al correo ${company.email} con el asunto "Derechos ARCO". La solicitud debe incluir nombres completos, documento de identidad, derecho que desea ejercer, descripcion clara del pedido y un medio de contacto para la respuesta. Atenderemos la solicitud dentro del plazo legal aplicable.`
  },
  {
    title: "Correo de contacto",
    text: `Para consultas sobre privacidad, tratamiento de datos personales o derechos ARCO, escribe a ${company.email} o comunícate al ${company.phone}.`
  }
];

export default function PersonalDataProtectionPage() {
  return (
    <LegalPage
      eyebrow="Ley N. 29733"
      title="Política de Protección de Datos Personales"
      description="Esta política informa de forma clara como Spirit Qosqo Travel recopila, usa, conserva, transfiere y protege los datos personales recibidos por su página web, WhatsApp, correo electrónico, formularios y canales digitales."
    >
      <div className="not-prose grid gap-4 md:grid-cols-2">
        {sections.map(({ icon: Icon, title, text }) => (
          <article key={title} className="rounded-lg border border-black/10 bg-white p-5">
            <div className="mb-4 grid size-10 place-items-center rounded-full bg-gold/12 text-gold">
              <Icon className="size-5" />
            </div>
            <h2 className="text-lg font-bold text-obsidian">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-charcoal/70">{text}</p>
          </article>
        ))}
      </div>

      <div className="not-prose mt-6 grid gap-4">
        {policyBlocks.map((block, index) => (
          <article key={block.title} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:border-gold/30 sm:p-6">
            <div className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/12 text-sm font-bold text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-lg font-extrabold leading-snug text-obsidian sm:text-xl">{block.title}</h2>
                <p className="mt-3 text-[15px] font-medium leading-8 text-charcoal/72">{block.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="not-prose mt-8 grid gap-4 rounded-lg border border-gold/20 bg-gold/10 p-5 md:grid-cols-[auto_1fr] md:items-center">
        <CalendarDays className="size-8 text-gold" />
        <div>
          <h2 className="text-lg font-bold text-obsidian">Fecha de ultima actualizacion</h2>
          <p className="mt-1 text-sm leading-6 text-charcoal/70">26 de junio de 2026.</p>
        </div>
      </div>

      <div className="not-prose mt-6 rounded-lg border border-emerald/20 bg-emerald/10 p-5">
        <ShieldCheck className="mb-3 size-6 text-emerald" />
        <p className="text-sm font-semibold leading-7 text-charcoal/76">Nunca solicitamos claves bancarias, token de seguridad ni datos completos de tarjeta por WhatsApp, correo o redes sociales. Los pagos se coordinan mediante Yape, Plin o transferencias a cuentas verificadas.</p>
      </div>
    </LegalPage>
  );
}
