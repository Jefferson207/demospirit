import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
  description: "Politica de privacidad de Spirit Qosqo Travel para usuarios de sus canales digitales."
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacidad"
      title="Politica de Privacidad"
      description="Informacion general sobre privacidad, comunicaciones, cookies y uso responsable de los datos entregados en nuestros canales digitales."
    >
      <h2>Alcance</h2>
      <p>Esta politica aplica al uso del sitio web, formularios, WhatsApp, correo electronico y redes sociales administradas por {company.tradeName}.</p>

      <h2>Uso de informacion</h2>
      <p>La informacion recibida se usa para responder consultas, gestionar reservas, prestar servicios turisticos, enviar confirmaciones, atender solicitudes y mejorar la experiencia digital del usuario.</p>

      <h2>Cookies</h2>
      <p>Usamos cookies tecnicas y, con consentimiento, cookies de analitica. Puedes revisar el detalle en la <Link href="/politica-cookies">Politica de Cookies</Link>.</p>

      <h2>Datos personales</h2>
      <p>El tratamiento detallado de datos personales, derechos ARCO, transferencias y medidas de seguridad se encuentra en la <Link href="/politica-proteccion-datos-personales">Politica de Proteccion de Datos Personales</Link>.</p>

      <h2>Contacto</h2>
      <p>Para consultas de privacidad escribe a {company.email} o comunicate al {company.phone}.</p>
    </LegalPage>
  );
}
