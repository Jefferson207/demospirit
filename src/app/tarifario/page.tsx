import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { TariffView } from "@/components/tariff-view";
import { defaultTariff } from "@/lib/tariff";

export const metadata: Metadata = {
  title: "Tarifario Oficial",
  description: "Tarifario oficial de tours, paquetes, hoteles, alimentacion y politicas comerciales de Spirit Qosqo Travel."
};

export default function TariffPage() {
  return (
    <LegalPage
      eyebrow="Tarifario administrable"
      title="Tarifario Oficial"
      description="Consulta precios referenciales, comisiones, tarifas sugeridas, hoteles por categoria y politicas comerciales. Los datos pueden actualizarse desde el panel administrativo."
    >
      <TariffView initialData={defaultTariff} />
    </LegalPage>
  );
}
