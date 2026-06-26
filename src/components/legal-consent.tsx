"use client";

import Link from "next/link";

const consentText =
  "Debe aceptar la Politica de Privacidad, la Politica de Proteccion de Datos Personales y los Terminos y Condiciones para continuar.";

export function LegalConsent({
  checked,
  error,
  onChange
}: {
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div>
      <label className="flex items-start gap-3 rounded-lg border border-black/10 bg-white p-3 text-sm font-semibold leading-6 text-charcoal/78 sm:p-4">
        <input
          type="checkbox"
          className="mt-1"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-required="true"
          aria-describedby={error ? "legal-consent-error" : undefined}
        />
        <span>
          Acepto la{" "}
          <Link href="/politica-privacidad" target="_blank" className="text-obsidian underline underline-offset-4">
            Politica de Privacidad
          </Link>
          , la{" "}
          <Link href="/politica-proteccion-datos-personales" target="_blank" className="text-obsidian underline underline-offset-4">
            Politica de Proteccion de Datos Personales
          </Link>{" "}
          y los{" "}
          <Link href="/terminos-y-condiciones" target="_blank" className="text-obsidian underline underline-offset-4">
            Terminos y Condiciones
          </Link>
          .
        </span>
      </label>
      {error && (
        <p id="legal-consent-error" role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export { consentText };
