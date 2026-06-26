import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Politica de Proteccion de Datos Personales",
  description: "Politica de tratamiento de datos personales de Spirit Qosqo Travel conforme a la Ley N. 29733."
};

export default function DataProtectionPage() {
  return (
    <LegalPage
      eyebrow="Ley N. 29733"
      title="Politica de Proteccion de Datos Personales"
      description="Informamos como recolectamos, usamos, conservamos y protegemos los datos personales recibidos por nuestra web, WhatsApp, correo y formularios de reserva."
    >
      <h2>Responsable del tratamiento</h2>
      <p>{company.legalName}, con nombre comercial {company.tradeName}, es responsable del tratamiento de los datos personales que el usuario proporcione para consultas, reservas, pagos, atencion posventa y cumplimiento de obligaciones legales.</p>

      <h2>Datos que solicitamos</h2>
      <p>Podemos solicitar nombres, documento de identidad o pasaporte cuando corresponda, correo, telefono, WhatsApp, pais de origen, hotel o punto de recojo, datos de viajeros, preferencias de idioma, mensajes de consulta y comprobantes de pago.</p>

      <h2>Finalidades</h2>
      <p>Usamos los datos para atender consultas, verificar disponibilidad, gestionar reservas, emitir vouchers, coordinar servicios turisticos, procesar pagos seguros, cumplir obligaciones tributarias y comerciales, responder reclamos y enviar comunicaciones relacionadas con el servicio contratado.</p>

      <h2>Base de consentimiento</h2>
      <p>El usuario autoriza el tratamiento al enviar formularios, iniciar conversaciones por WhatsApp, aceptar politicas durante la reserva o contratar un servicio. El consentimiento puede ser revocado sin afectar obligaciones pendientes derivadas de servicios ya contratados.</p>

      <h2>Transferencias necesarias</h2>
      <p>Cuando sea necesario para prestar el servicio, podremos compartir datos estrictamente requeridos con guias, operadores, empresas de transporte, hospedajes, proveedores de tickets, entidades financieras o autoridades competentes. No vendemos bases de datos.</p>

      <h2>Seguridad</h2>
      <p>Aplicamos medidas razonables de confidencialidad, control de accesos, uso de canales HTTPS, cuentas de pago verificadas y minimizacion de datos. No solicitamos claves bancarias, token de seguridad ni datos completos de tarjetas por WhatsApp o correo.</p>

      <h2>Derechos ARCO</h2>
      <p>El titular puede ejercer sus derechos de acceso, rectificacion, cancelacion y oposicion escribiendo a {company.email} con el asunto &quot;Derechos ARCO&quot;, adjuntando identificacion y detalle de su solicitud.</p>

      <h2>Conservacion</h2>
      <p>Los datos se conservan durante el tiempo necesario para prestar el servicio, atender reclamos, cumplir obligaciones legales y mantener respaldo administrativo. Luego se eliminan o anonimizan segun corresponda.</p>
    </LegalPage>
  );
}
