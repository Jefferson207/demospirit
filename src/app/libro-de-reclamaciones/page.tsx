"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, Send } from "lucide-react";
import { LegalConsent, consentText } from "@/components/legal-consent";
import { LegalPage } from "@/components/legal-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/lib/company";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-obsidian">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Section({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="font-display text-2xl font-normal leading-tight text-obsidian">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-charcoal/64">{description}</p>}
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function makeClaimCode() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `LR-${stamp}-${random}`;
}

export default function ComplaintsBookPage() {
  const [legalConsent, setLegalConsent] = useState(false);
  const [legalConsentError, setLegalConsentError] = useState("");
  const [claimCode, setClaimCode] = useState("");

  const establishment = useMemo(
    () => [
      ["Nombre comercial", company.tradeName],
      ["Razon social", company.legalName],
      ["RUC", company.ruc],
      ["Direccion fiscal", company.contactAddress],
      ["Telefono", company.phone],
      ["Correo", company.email]
    ],
    []
  );

  const sendClaim = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!legalConsent) {
      setLegalConsentError(consentText);
      return;
    }

    setClaimCode(makeClaimCode());
    setLegalConsentError("");
    event.currentTarget.reset();
    setLegalConsent(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <LegalPage
      eyebrow="Atencion al consumidor"
      title="Libro de Reclamaciones"
      description="Registra reclamos o quejas vinculados con nuestros servicios turisticos. La informacion enviada sera atendida por nuestros canales oficiales dentro del plazo establecido por la normativa peruana."
    >
      {claimCode && (
        <div className="not-prose mb-8 rounded-lg border border-emerald/20 bg-emerald/10 p-5">
          <div className="flex gap-4">
            <CheckCircle2 className="mt-1 size-7 shrink-0 text-emerald" />
            <div>
              <h2 className="text-xl font-bold text-obsidian">Tu reclamo fue registrado correctamente.</h2>
              <p className="mt-2 leading-7 text-charcoal/72">Te responderemos dentro del plazo establecido por la normativa peruana.</p>
              <p className="mt-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-obsidian shadow-sm">Codigo de reclamo: {claimCode}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={sendClaim} className="not-prose mt-8 grid gap-6">
        <Section title="1. Datos del establecimiento" description="Informacion de la agencia responsable de atender el reclamo o queja.">
          <div className="grid gap-3">
            {establishment.map(([label, value]) => (
              <div key={label} className="grid gap-1 rounded-lg bg-[#F8F6F0] px-4 py-3 sm:grid-cols-[210px_1fr] sm:items-center">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-charcoal/48">{label}</span>
                <span className="text-sm font-semibold text-obsidian">{value}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="2. Datos del reclamo" description="Completa los datos del consumidor que presenta la comunicacion.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Fecha y hora del incidente">
              <Input required name="Fecha y hora del incidente" type="datetime-local" />
            </Field>
            <Field label="Nombre completo del consumidor">
              <Input required name="Nombre completo del consumidor" placeholder="Nombres y apellidos" />
            </Field>
            <Field label="Tipo de documento">
              <select required name="Tipo de documento" className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-charcoal shadow-sm outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15">
                <option value="">Seleccionar</option>
                <option>DNI</option>
                <option>RUC</option>
                <option>Pasaporte</option>
                <option>Carnet de Extranjeria</option>
              </select>
            </Field>
            <Field label="Numero de documento">
              <Input required name="Numero de documento" placeholder="Numero de documento" />
            </Field>
            <Field label="Domicilio fiscal o direccion">
              <Input required name="Domicilio fiscal o direccion" placeholder="Direccion del consumidor" />
            </Field>
            <Field label="Correo electronico">
              <Input required name="Correo electronico" type="email" placeholder="correo@dominio.com" />
            </Field>
            <Field label="Celular">
              <Input required name="Celular" type="tel" placeholder="+51 999 999 999" />
            </Field>
          </div>
        </Section>

        <Section title="3. Datos del servicio contratado" description="Ayudanos a identificar la reserva o servicio relacionado.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre del servicio o producto contratado">
              <Input required name="Nombre del servicio o producto contratado" placeholder="Ej. Machu Picchu Full Day" />
            </Field>
            <Field label="Fecha del servicio">
              <Input required name="Fecha del servicio" type="date" />
            </Field>
            <Field label="Monto reclamado">
              <Input required name="Monto reclamado" inputMode="decimal" placeholder="Ej. S/ 250.00" />
            </Field>
            <Field label="Numero de reserva o comprobante (opcional)">
              <Input name="Numero de reserva o comprobante" placeholder="Codigo, boleta o comprobante" />
            </Field>
          </div>
        </Section>

        <Section title="4. Detalle de la reclamacion" description="Describe con claridad lo ocurrido y el pedido concreto.">
          <div className="grid gap-4">
            <Field label="Tipo">
              <select required name="Tipo" className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-charcoal shadow-sm outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15">
                <option>Reclamo</option>
                <option>Queja</option>
              </select>
            </Field>
            <Field label="Detalle de incidencia">
              <Textarea required name="Detalle de incidencia" placeholder="Describe los hechos, fecha, personas involucradas y cualquier informacion relevante." className="min-h-36" />
            </Field>
            <Field label="Pedido concreto del consumidor">
              <Textarea required name="Pedido concreto del consumidor" placeholder="Indica la solucion solicitada." className="min-h-28" />
            </Field>
          </div>
        </Section>

        <Section title="5. Consentimiento obligatorio">
          <LegalConsent
            checked={legalConsent}
            error={legalConsentError}
            onChange={(checked) => {
              setLegalConsent(checked);
              setLegalConsentError("");
            }}
          />
          <Button type="submit" variant="gold" size="lg" className="w-full sm:w-fit">
            <Send className="size-5" />
            Enviar reclamo o queja
          </Button>
        </Section>

        <div className="rounded-lg border border-gold/20 bg-gold/10 p-5 text-sm leading-7 text-charcoal/72">
          <ClipboardList className="mb-3 size-6 text-gold" />
          La constancia generada en esta pagina confirma el registro digital de tu comunicacion. Conserva el codigo de reclamo para seguimiento.
        </div>
      </form>
    </LegalPage>
  );
}
