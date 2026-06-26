import type { Metadata } from "next";
import { CalendarDays, Database, LockKeyhole, Scale, ShieldCheck, UserCheck } from "lucide-react";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Politica de Proteccion de Datos Personales",
  description: "Politica profesional de proteccion de datos personales de Spirit Qosqo Travel conforme a la Ley N. 29733 y su Reglamento."
};

const sections = [
  {
    icon: UserCheck,
    title: "Responsable del tratamiento",
    text: `${company.legalName}, RUC: ${company.ruc}, correo: ${company.email}, telefono: ${company.phone}, con domicilio de contacto en ${company.contactAddress}.`
  },
  {
    icon: Database,
    title: "Datos personales que recopilamos",
    text: "Nombres y apellidos, documento de identidad o pasaporte cuando corresponda, correo, telefono, WhatsApp, pais, idioma, hotel o punto de recojo, datos de pasajeros, preferencias de viaje, mensajes de consulta y constancias de pago."
  },
  {
    icon: Scale,
    title: "Base legal",
    text: "Tratamos los datos conforme a la Ley N. 29733, Ley de Proteccion de Datos Personales, su Reglamento y el consentimiento otorgado por el usuario al enviar formularios, reservar o contratar servicios."
  },
  {
    icon: LockKeyhole,
    title: "Medidas de seguridad",
    text: "Aplicamos minimizacion de datos, acceso restringido, canales HTTPS, verificacion de cuentas de pago, gestion confidencial de comunicaciones y prohibicion de solicitar claves bancarias o datos completos de tarjeta por chats."
  }
];

export default function PersonalDataProtectionPage() {
  return (
    <LegalPage
      eyebrow="Ley N. 29733"
      title="Politica de Proteccion de Datos Personales"
      description="Esta politica informa de forma clara como Spirit Qosqo Travel recopila, usa, conserva, transfiere y protege los datos personales recibidos por su pagina web, WhatsApp, correo electronico, formularios y canales digitales."
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

      <h2>Introduccion</h2>
      <p>La privacidad del viajero es prioritaria. Esta politica se aplica a toda persona que entregue datos personales a {company.tradeName} mediante formularios web, WhatsApp, correo electronico, redes sociales, llamadas o cualquier canal digital administrado por la agencia.</p>

      <h2>Finalidad del tratamiento</h2>
      <p>Usamos los datos para atender consultas, verificar disponibilidad, elaborar cotizaciones, gestionar reservas, emitir vouchers, coordinar recojos, operar tours, procesar pagos, cumplir obligaciones administrativas, tributarias y de atencion al consumidor, responder reclamos y brindar soporte antes, durante y despues del servicio.</p>

      <h2>Conservacion de los datos</h2>
      <p>Conservamos los datos solo durante el tiempo necesario para cumplir las finalidades indicadas, atender responsabilidades contractuales, reclamos, requerimientos de autoridades y obligaciones legales aplicables. Luego los eliminamos, bloqueamos o anonimizamos de acuerdo con criterios internos de seguridad.</p>

      <h2>Transferencia de datos</h2>
      <p>Cuando sea necesario para prestar el servicio, podremos compartir datos estrictamente indispensables con hoteles, operadores turisticos, guias, transportistas, proveedores de tickets, empresas ferroviarias, entidades financieras o autoridades competentes. Estas transferencias se realizan bajo criterios de necesidad, proporcionalidad y confidencialidad.</p>

      <h2>Derechos ARCO</h2>
      <p>El titular de los datos puede ejercer sus derechos de Acceso, Rectificacion, Cancelacion y Oposicion. Tambien puede solicitar informacion sobre el uso de sus datos, actualizar informacion inexacta, pedir la supresion cuando corresponda u oponerse al tratamiento para finalidades no necesarias.</p>

      <h2>Procedimiento para ejercer derechos ARCO</h2>
      <p>Para ejercer estos derechos, envia una solicitud al correo {company.email} con el asunto &quot;Derechos ARCO&quot;. La solicitud debe incluir nombres completos, documento de identidad, derecho que desea ejercer, descripcion clara del pedido y un medio de contacto para la respuesta. Atenderemos la solicitud dentro del plazo legal aplicable.</p>

      <h2>Correo de contacto</h2>
      <p>Para consultas sobre privacidad, tratamiento de datos personales o derechos ARCO, escribe a {company.email} o comunicate al {company.phone}.</p>

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
