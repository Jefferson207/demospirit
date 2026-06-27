import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { BrandLogo } from "@/components/brand-logo";
import { isAdminAuthenticated } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acceso Administrador",
  description: "Ingreso seguro al panel administrativo de Spirit Qosqo Travel."
};

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin/tarifario");

  return (
    <main className="bg-[#F8F6F0] px-4 py-12 sm:py-16">
      <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-xl md:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-obsidian p-8 text-ivory sm:p-10">
          <BrandLogo inverse />
          <div className="mt-12 max-w-sm">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Panel seguro</p>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">Administrador de tarifario y contenido turistico</h1>
            <p className="mt-5 text-sm leading-7 text-white/72">
              Gestiona tarifas, servicios, imagenes y datos publicados desde un entorno privado con sesion protegida.
            </p>
          </div>
          <div className="mt-10 grid gap-3 text-sm text-white/78">
            <p className="rounded-lg border border-white/12 bg-white/8 p-4">Conexion preparada para Upstash Redis.</p>
            <p className="rounded-lg border border-white/12 bg-white/8 p-4">Subida de imagenes mediante el endpoint del hosting.</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald">Acceso privado</p>
          <h2 className="mt-3 text-2xl font-black text-obsidian">Iniciar sesion</h2>
          <p className="mt-3 text-sm leading-7 text-charcoal/68">
            Ingresa las credenciales administrativas configuradas en el servidor. La sesion se guarda en una cookie segura HTTP-only.
          </p>
          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
