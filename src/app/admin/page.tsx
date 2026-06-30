import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPlatform } from "@/components/admin-platform";
import { isAdminAuthenticated } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel Administrador | Spirit Qosqo Travel",
  description: "Dashboard administrativo para gestionar tours, paquetes, reservas, clientes y configuración comercial."
};

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return <AdminPlatform />;
}
