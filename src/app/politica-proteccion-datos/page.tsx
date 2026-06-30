import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Política de Protección de Datos Personales",
  description: "Política de tratamiento de datos personales de Spirit Qosqo Travel conforme a la Ley N. 29733."
};

const dataPolicyItems = [
  {
    title: "Responsable del tratamiento",
    text: `${company.legalName}, con nombre comercial ${company.tradeName}, es responsable del tratamiento de los datos personales que el usuario proporcione para consultas, reservas, pagos, atención posventa y cumplimiento de obligaciones legales.`
  },
  {
    title: "Datos que solicitamos",
    text: "Podemos solicitar nombres, documento de identidad o pasaporte cuando corresponda, correo, teléfono, WhatsApp, pais de origen, hotel o punto de recojo, datos de viajeros, preferencias de idioma, mensajes de consulta y comprobantes de pago."
  },
  {
    title: "Finalidades",
    text: "Usamos los datos para atender consultas, verificar disponibilidad, gestionar reservas, emitir vouchers, coordinar servicios turísticos, procesar pagos por medios verificados, cumplir obligaciones tributarias y comerciales, responder reclamos y enviar comunicaciones relacionadas con el servicio contratado."
  },
  {
    title: "Base de consentimiento",
    text: "El usuario autoriza el tratamiento al enviar formularios, iniciar conversaciones por WhatsApp, aceptar políticas durante la reserva o contratar un servicio. El consentimiento puede ser revocado sin afectar obligaciones pendientes derivadas de servicios ya contratados."
  },
  {
    title: "Transferencias necesarias",
    text: "Cuando sea necesario para prestar el servicio, podremos compartir datos estrictamente requeridos con guías, operadores, empresas de transporte, hospedajes, proveedores de tickets, entidades financieras o autoridades competentes. No vendemos bases de datos."
  },
  {
    title: "Seguridad",
    text: "Aplicamos medidas razonables de confidencialidad, control de accesos, uso de canales HTTPS, cuentas de pago verificadas y minimizacion de datos. No solicitamos claves bancarias, token de seguridad ni datos completos de tarjetas por WhatsApp o correo."
  },
  {
    title: "Derechos ARCO",
    text: `El titular puede ejercer sus derechos de acceso, rectificacion, cancelacion y oposicion escribiendo a ${company.email} con el asunto "Derechos ARCO", adjuntando identificacion y detalle de su solicitud.`
  },
  {
    title: "Conservacion",
    text: "Los datos se conservan durante el tiempo necesario para prestar el servicio, atender reclamos, cumplir obligaciones legales y mantener respaldo administrativo. Luego se eliminan o anonimizan segun corresponda."
  }
];

export default function DataProtectionPage() {
  return (
    <LegalPage
      eyebrow="Ley N. 29733"
      title="Política de Protección de Datos Personales"
      description="Informamos como recolectamos, usamos, conservamos y protegemos los datos personales recibidos por nuestra web, WhatsApp, correo y formularios de reserva."
    >
      <div className="not-prose grid gap-4">
        {dataPolicyItems.map((item, index) => (
          <article key={item.title} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:border-gold/30 sm:p-6">
            <div className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/12 text-sm font-bold text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-lg font-extrabold leading-snug text-obsidian sm:text-xl">{item.title}</h2>
                <p className="mt-3 text-[15px] font-medium leading-8 text-charcoal/72">{item.text}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </LegalPage>
  );
}
