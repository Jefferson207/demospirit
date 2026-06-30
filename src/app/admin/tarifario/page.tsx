import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminTariffEditor } from "@/components/admin-tariff-editor";
import { LegalPage } from "@/components/legal-page";
import { isAdminAuthenticated } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrar Tarifario",
  description: "Panel privado para editar el tarifario de Spirit Qosqo Travel."
};

export default async function AdminTariffPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <LegalPage
      eyebrow="Panel privado"
      title="Administrar Tarifario"
      description="Edita tarifas, servicios e imágenes publicados en la web. Los cambios se guardan en la base conectada al sitio."
    >
      <div className="not-prose mb-5 flex justify-end">
        <AdminLogoutButton />
      </div>
      <AdminTariffEditor />
    </LegalPage>
  );
}
