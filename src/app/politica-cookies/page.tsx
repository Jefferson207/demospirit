import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Politica de Cookies",
  description: "Politica de cookies y consentimiento de Spirit Qosqo Travel."
};

const cookieItems = [
  {
    title: "Que son las cookies",
    text: "Las cookies son pequenos archivos que permiten recordar preferencias, mantener funcionalidades tecnicas y medir el uso de la web para mejorar la experiencia del usuario."
  },
  {
    title: "Tipos de cookies",
    text: "Usamos cookies tecnicas necesarias para la operacion del sitio y cookies de analitica solo cuando el usuario acepta el aviso de consentimiento. No usamos cookies para vender datos personales."
  },
  {
    title: "Consentimiento",
    text: "El usuario puede aceptar el uso de cookies desde el banner visible en la web. La decision se almacena localmente en el navegador y puede eliminarse borrando los datos del sitio."
  },
  {
    title: "Gestion",
    text: "Puedes bloquear o eliminar cookies desde la configuracion de tu navegador. Algunas funciones, como recordar preferencias, podrian dejar de operar correctamente."
  },
  {
    title: "Contacto",
    text: `Para consultas sobre cookies o privacidad escribe a ${company.email}.`
  }
];

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Privacidad"
      title="Politica de Cookies"
      description="Explicamos que cookies usamos, para que sirven y como puedes administrarlas."
    >
      <div className="not-prose grid gap-4">
        {cookieItems.map((item, index) => (
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
