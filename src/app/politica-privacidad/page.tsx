import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { company } from "@/lib/company";

export const metadata: Metadata = {
  title: "Politica de Privacidad",
  description: "Politica de privacidad de Spirit Qosqo Travel para usuarios de sus canales digitales."
};

const privacyItems = [
  {
    title: "Alcance",
    content: (
      <p>
        Esta politica aplica al uso del sitio web, formularios, WhatsApp, correo electronico y redes sociales administradas por {company.tradeName}.
      </p>
    )
  },
  {
    title: "Uso de informacion",
    content: (
      <p>
        La informacion recibida se usa para responder consultas, gestionar reservas, prestar servicios turisticos, enviar confirmaciones, atender solicitudes y mejorar la experiencia digital del usuario.
      </p>
    )
  },
  {
    title: "Cookies",
    content: (
      <p>
        Usamos cookies tecnicas y, con consentimiento, cookies de analitica. Puedes revisar el detalle en la{" "}
        <Link href="/politica-cookies" className="font-bold text-obsidian underline underline-offset-4">
          Politica de Cookies
        </Link>
        .
      </p>
    )
  },
  {
    title: "Datos personales",
    content: (
      <p>
        El tratamiento detallado de datos personales, derechos ARCO, transferencias y medidas de seguridad se encuentra en la{" "}
        <Link href="/politica-proteccion-datos-personales" className="font-bold text-obsidian underline underline-offset-4">
          Politica de Proteccion de Datos Personales
        </Link>
        .
      </p>
    )
  },
  {
    title: "Contacto",
    content: (
      <p>
        Para consultas de privacidad escribe a <span className="font-bold text-obsidian">{company.email}</span> o comunicate al <span className="font-bold text-obsidian">{company.phone}</span>.
      </p>
    )
  }
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacidad"
      title="Politica de Privacidad"
      description="Informacion general sobre privacidad, comunicaciones, cookies y uso responsable de los datos entregados en nuestros canales digitales."
    >
      <div className="not-prose grid gap-4">
        {privacyItems.map((item, index) => (
          <article key={item.title} className="rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:border-gold/30 sm:p-6">
            <div className="flex gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold/12 text-sm font-bold text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-lg font-extrabold leading-snug text-obsidian sm:text-xl">{item.title}</h2>
                <div className="mt-3 text-[15px] font-medium leading-8 text-charcoal/72">{item.content}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </LegalPage>
  );
}
