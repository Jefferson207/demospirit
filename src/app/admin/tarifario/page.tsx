import type { Metadata } from "next";
import { AdminTariffEditor } from "@/components/admin-tariff-editor";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Administrar Tarifario",
  description: "Panel local para editar el tarifario de Spirit Qosqo Travel."
};

export default function AdminTariffPage() {
  return (
    <LegalPage
      eyebrow="Panel local"
      title="Administrar Tarifario"
      description="Edita la estructura del tarifario, guarda cambios en el navegador y exporta el JSON para respaldo o publicacion."
    >
      <AdminTariffEditor />
    </LegalPage>
  );
}
