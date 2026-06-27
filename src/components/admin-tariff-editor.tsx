"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, RotateCcw, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { defaultTariff, tariffStorageKey, type Tariff } from "@/lib/tariff";

function pretty(data: Tariff) {
  return JSON.stringify(data, null, 2);
}

export function AdminTariffEditor() {
  const [json, setJson] = useState(pretty(defaultTariff));
  const [message, setMessage] = useState("");
  const parsed = useMemo(() => {
    try {
      return JSON.parse(json) as Tariff;
    } catch {
      return null;
    }
  }, [json]);

  useEffect(() => {
    const saved = window.localStorage.getItem(tariffStorageKey);
    if (saved) setJson(saved);
  }, []);

  const save = () => {
    if (!parsed) {
      setMessage("El JSON no es valido. Revisa comas, llaves y comillas.");
      return;
    }
    window.localStorage.setItem(tariffStorageKey, pretty(parsed));
    setJson(pretty(parsed));
    setMessage("Tarifario guardado en este navegador. Revisa /tarifario para ver los cambios.");
  };

  const reset = () => {
    window.localStorage.removeItem(tariffStorageKey);
    setJson(pretty(defaultTariff));
    setMessage("Tarifario restaurado a la version base.");
  };

  const exportJson = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tarifario-spirit-qosqo.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    setJson(text);
    setMessage("Archivo cargado. Revisa y presiona Guardar cambios.");
  };

  return (
    <div className="not-prose grid gap-5">
      <div className="rounded-lg border border-gold/20 bg-gold/10 p-5 text-sm leading-7 text-charcoal/72">
        <strong className="text-obsidian">Modo administrable local:</strong> los cambios se guardan en este navegador y se pueden exportar como JSON. Para que varios usuarios administren el tarifario en produccion, esta estructura debe conectarse a un CMS, base de datos o panel con autenticacion.
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="gold" onClick={save}>
          <Save className="size-4" />
          Guardar cambios
        </Button>
        <Button type="button" variant="default" onClick={exportJson}>
          <Download className="size-4" />
          Exportar JSON
        </Button>
        <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-obsidian px-6 text-sm font-semibold text-ivory shadow-sm transition hover:-translate-y-0.5 hover:bg-charcoal">
          <Upload className="size-4" />
          Importar JSON
          <input type="file" accept="application/json" className="sr-only" onChange={(event) => importJson(event.target.files?.[0])} />
        </label>
        <Button type="button" variant="ghost" onClick={reset}>
          <RotateCcw className="size-4" />
          Restaurar base
        </Button>
      </div>

      {message && <p className="rounded-lg bg-white p-4 text-sm font-bold text-obsidian shadow-sm">{message}</p>}

      <Textarea
        value={json}
        onChange={(event) => setJson(event.target.value)}
        className="min-h-[620px] font-mono text-xs leading-6"
        spellCheck={false}
      />
    </div>
  );
}
