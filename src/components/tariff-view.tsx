"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Hotel, ShieldCheck, Soup, TableProperties } from "lucide-react";
import { defaultTariff, tariffStorageKey, type Tariff } from "@/lib/tariff";

function policyText(item: Tariff["reservationPolicies"][number]) {
  return typeof item === "string" ? item : item.text;
}

function policyIsActive(item: Tariff["reservationPolicies"][number]) {
  return typeof item === "string" ? true : item.active !== false;
}

function useTariff(initialData: Tariff) {
  const [tariff, setTariff] = useState(initialData);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/tariff", { cache: "no-store" });
        const payload = (await response.json()) as { tariff?: Tariff };
        if (payload.tariff) {
          setTariff(payload.tariff);
          return;
        }
      } catch {
        const saved = window.localStorage.getItem(tariffStorageKey);
        if (!saved) return;

        try {
          setTariff(JSON.parse(saved) as Tariff);
        } catch {
          setTariff(initialData);
        }
      }
    };

    load();
  }, [initialData]);

  return tariff;
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: typeof TableProperties; title: string; subtitle: string }) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold/12 text-gold">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="text-2xl font-extrabold leading-tight text-obsidian">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-charcoal/62">{subtitle}</p>
      </div>
    </div>
  );
}

export function TariffView({ initialData = defaultTariff }: { initialData?: Tariff }) {
  const tariff = useTariff(initialData);

  return (
    <div className="not-prose grid gap-6">
      <div className="rounded-lg border border-gold/20 bg-obsidian p-6 text-white shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.26em] text-gold-soft">Tarifario oficial</p>
        <h2 className="mt-3 font-display text-4xl font-normal leading-tight">Spirit Qosqo Travel {tariff.updatedAt}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
          Tarifas referenciales en {tariff.currency}. Los precios finales se confirman segun disponibilidad, fecha de viaje, categoria de servicio y condiciones del proveedor.
        </p>
      </div>

      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle icon={TableProperties} title="Tours clasicos" subtitle="Servicios compartidos y precios netos referenciales." />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="bg-obsidian text-left text-white">
                <th className="p-3 font-bold">Tour</th>
                <th className="p-3 font-bold">Duracion</th>
                <th className="p-3 font-bold">Incluye</th>
                <th className="p-3 text-right font-bold">Precio neto</th>
              </tr>
            </thead>
            <tbody>
              {tariff.classicTours.map((item) => (
                <tr key={item.tour} className="border-b border-black/8 odd:bg-[#F8F6F0]">
                  <td className="p-3 font-bold text-obsidian">{item.tour}</td>
                  <td className="p-3 text-charcoal/70">{item.duration}</td>
                  <td className="p-3 text-charcoal/70">{item.includes}</td>
                  <td className="p-3 text-right font-extrabold text-obsidian">{tariff.currency} {item.netPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle icon={CalendarDays} title="Paquetes turisticos" subtitle="Precios netos, comisiones y tarifa de venta sugerida." />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="bg-obsidian text-left text-white">
                <th className="p-3">Programa</th>
                <th className="p-3">Categoria</th>
                <th className="p-3 text-right">Neto</th>
                <th className="p-3 text-right">10%</th>
                <th className="p-3 text-right">15%</th>
                <th className="p-3 text-right">20%</th>
                <th className="p-3 text-right">Venta sugerida</th>
              </tr>
            </thead>
            <tbody>
              {tariff.packages.map((item) => (
                <tr key={`${item.name}-${item.hotelCategory}`} className="border-b border-black/8 odd:bg-[#F8F6F0]">
                  <td className="p-3 font-bold text-obsidian">{item.name}</td>
                  <td className="p-3 text-charcoal/70">{item.hotelCategory}</td>
                  <td className="p-3 text-right">{item.netPrice}</td>
                  <td className="p-3 text-right">{item.commission10}</td>
                  <td className="p-3 text-right">{item.commission15}</td>
                  <td className="p-3 text-right">{item.commission20}</td>
                  <td className="p-3 text-right font-bold text-obsidian">{item.suggestedPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <SectionTitle icon={Hotel} title="Hoteles por categoria" subtitle="Precios netos por persona por noche, sin desayuno." />
          <div className="grid gap-4">
            {tariff.hotels.map((item) => (
              <article key={item.category} className="rounded-lg border border-black/8 bg-[#F8F6F0] p-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-extrabold text-obsidian">{item.category}</h3>
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-bold text-obsidian">{tariff.currency} {item.priceRange}</span>
                </div>
                <ul className="mt-3 grid gap-1 text-sm text-charcoal/70">
                  {item.hotels.map((hotel) => <li key={hotel}>{hotel}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <SectionTitle icon={Soup} title="Feed / Alimentacion" subtitle="Detalle de alimentacion incluida o no incluida." />
          <div className="grid gap-3">
            {tariff.feed.map((item) => (
              <div key={item.service} className="rounded-lg border border-black/8 bg-[#F8F6F0] p-4">
                <h3 className="font-extrabold text-obsidian">{item.service}</h3>
                <p className="mt-1 text-sm leading-6 text-charcoal/70">{item.includes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <SectionTitle icon={ShieldCheck} title="Politicas de reserva" subtitle="Condiciones operativas para confirmar servicios." />
          <ul className="grid gap-3">
            {tariff.reservationPolicies.filter(policyIsActive).map((item) => (
              <li key={policyText(item)} className="rounded-lg bg-[#F8F6F0] p-3 text-sm leading-6 text-charcoal/72">{policyText(item)}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
          <SectionTitle icon={ShieldCheck} title="Cancelaciones y reembolsos" subtitle="Cargos segun anticipacion de cancelacion." />
          <div className="grid gap-3">
            {tariff.cancellationPolicies.map((item) => (
              <div key={item.period} className="grid gap-2 rounded-lg bg-[#F8F6F0] p-3 sm:grid-cols-[150px_1fr]">
                <span className="font-extrabold text-obsidian">{item.period}</span>
                <span className="text-sm leading-6 text-charcoal/72">{item.charge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
