import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description: "Respuestas frecuentes sobre reservas, pagos, tours, cancelaciones y seguridad de Spirit Qosqo Travel."
};

const faqs = [
  ["Como reservo un tour?", "Selecciona el tour, fecha, viajeros y datos del pasajero en el formulario de reserva. Luego confirmamos disponibilidad, tarifa final y forma de pago por WhatsApp o correo."],
  ["La reserva queda confirmada al enviar el formulario?", "No. El formulario registra una solicitud. La reserva queda confirmada cuando recibes confirmación escrita y voucher luego del pago acordado."],
  ["Que medios de pago aceptan?", "Yape, Plin, transferencia bancaria y transferencia interbancaria a cuentas verificadas de la empresa, siempre despues de confirmar disponibilidad."],
  ["Puedo reprogramar mi tour?", "Si, sujeto a disponibilidad, políticas del proveedor y posibles diferencias tarifarias o penalidades si ya existen tickets emitidos."],
  ["Que pasa si hay huelgas o cierre de rutas?", "Priorizamos la seguridad y coordinamos alternativas, reprogramaciones o soluciones segun las condiciones y políticas de proveedores."],
  ["Necesito seguro de viaje?", "Lo recomendamos especialmente para rutas de altura, aventura o itinerarios con traslados. Algunos servicios no incluyen seguro personal."],
  ["Como protegen mis datos?", "Usamos los datos solo para consulta, reserva, pago, coordinacion y atención. No solicitamos claves bancarias ni datos completos de tarjeta por chats."],
  ["Donde puedo presentar un reclamo?", "Puedes usar la página Libro de Reclamaciones disponible en el footer y en esta web."]
];

export default function FaqPage() {
  return (
    <LegalPage
      eyebrow="Soporte al viajero"
      title="Preguntas Frecuentes"
      description="Información clara para reservar con seguridad antes de viajar a Cusco."
    >
      <div className="not-prose grid gap-4">
        {faqs.map(([question, answer]) => (
          <article key={question} className="rounded-lg border border-black/10 bg-white p-5">
            <h2 className="text-lg font-bold text-obsidian">{question}</h2>
            <p className="mt-2 leading-7 text-charcoal/70">{answer}</p>
          </article>
        ))}
      </div>
    </LegalPage>
  );
}
