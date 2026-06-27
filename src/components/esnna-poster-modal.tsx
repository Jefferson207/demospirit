"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

export function EsnnaPosterModal({ variant = "link" }: { variant?: "link" | "button" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          variant === "button"
            ? buttonVariants({ variant: "default", size: "lg" })
            : "text-left text-white/68 transition hover:text-white"
        )}
      >
        {variant === "button" && <ExternalLink className="size-5" />}
        Afiche ESNNA MINCETUR
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/82 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label="Afiche ESNNA MINCETUR">
          <div className="mx-auto max-w-5xl">
            <div className="mb-3 flex items-center justify-between gap-4 rounded-lg bg-white px-4 py-3 shadow-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Prevencion ESNNA</p>
                <h2 className="text-base font-extrabold text-obsidian sm:text-lg">Afiche ESNNA MINCETUR</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar afiche ESNNA"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-black/5 text-obsidian transition hover:bg-black/10"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <Image
                src="/esnna.png"
                alt="Afiche ESNNA de prevencion contra la explotacion sexual de niñas, niños y adolescentes"
                width={1240}
                height={1500}
                className="h-auto w-full object-contain"
                sizes="(min-width: 1024px) 960px, 100vw"
                priority
              />
            </div>

            <div className="mt-3 flex flex-wrap justify-end gap-3">
              <a
                href={company.esnnaPosterUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-obsidian transition hover:bg-gold/90"
              >
                <ExternalLink className="size-4" />
                Ver fuente MINCETUR
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full bg-gold px-5 py-3 text-sm font-bold text-obsidian transition hover:bg-gold-soft"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
