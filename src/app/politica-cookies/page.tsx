import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Politica de Cookies",
  description: "Politica de cookies y consentimiento de Spirit Qosqo Travel."
};

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Privacidad"
      title="Politica de Cookies"
      description="Explicamos que cookies usamos, para que sirven y como puedes administrarlas."
    >
      <h2>Que son las cookies</h2>
      <p>Las cookies son pequenos archivos que permiten recordar preferencias, mantener funcionalidades tecnicas y medir el uso de la web para mejorar la experiencia del usuario.</p>

      <h2>Tipos de cookies</h2>
      <p>Usamos cookies tecnicas necesarias para la operacion del sitio y cookies de analitica solo cuando el usuario acepta el aviso de consentimiento. No usamos cookies para vender datos personales.</p>

      <h2>Consentimiento</h2>
      <p>El usuario puede aceptar el uso de cookies desde el banner visible en la web. La decision se almacena localmente en el navegador y puede eliminarse borrando los datos del sitio.</p>

      <h2>Gestion</h2>
      <p>Puedes bloquear o eliminar cookies desde la configuracion de tu navegador. Algunas funciones, como recordar preferencias, podrian dejar de operar correctamente.</p>

      <h2>Contacto</h2>
      <p>Para consultas sobre cookies o privacidad escribe a {company.email}.</p>
    </LegalPage>
  );
}
