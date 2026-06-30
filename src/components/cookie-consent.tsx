"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const storageKey = "spirit-qosqo-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!window.localStorage.getItem(storageKey));
  }, []);

  const savePreference = (value: "accepted" | "necessary") => {
    window.localStorage.setItem(storageKey, value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[95] mx-auto max-w-4xl rounded-lg border border-black/10 bg-white p-4 shadow-premium sm:bottom-5 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-start">
        <div className="grid size-10 place-items-center rounded-full bg-gold/12 text-gold">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <h2 className="font-bold text-obsidian">Privacidad y cookies</h2>
          <p className="mt-1 text-sm leading-6 text-charcoal/68">
            Usamos cookies técnicas y, con tu consentimiento, cookies de analítica para mejorar la experiencia de reserva. Puedes revisar nuestra política de cookies y protección de datos.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold">
            <Link href="/politica-cookies" className="text-obsidian underline-offset-4 hover:underline">Política de cookies</Link>
            <Link href="/politica-proteccion-datos-personales" className="text-obsidian underline-offset-4 hover:underline">Datos personales</Link>
          </div>
        </div>
        <div className="flex gap-2 sm:justify-end">
          <Button onClick={() => savePreference("accepted")} variant="gold" size="sm">Aceptar</Button>
          <Button onClick={() => savePreference("necessary")} variant="ghost" size="sm">Solo necesarias</Button>
          <Button aria-label="Cerrar aviso de cookies" onClick={() => savePreference("necessary")} variant="ghost" size="icon" className="size-10">
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
