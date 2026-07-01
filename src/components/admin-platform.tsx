"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Eye, Pencil, Plus, Save, Search, Trash2, Upload, X } from "lucide-react";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminFieldLabels, adminSchemas, defaultAdminContent, type AdminContent, type AdminReservation } from "@/lib/admin-content";
import { cn } from "@/lib/utils";

type ModuleKey = "dashboard" | "tours" | "packages" | "hotels" | "reservations" | "extras" | "categories" | "paymentMethods" | "settings";

const modules: Array<{ key: ModuleKey; label: string }> = [
  { key: "dashboard", label: "Dashboard" },
  { key: "tours", label: "Tours" },
  { key: "packages", label: "Paquetes" },
  { key: "hotels", label: "Hoteles" },
  { key: "reservations", label: "Reservas" },
  { key: "extras", label: "Extras" },
  { key: "categories", label: "Categorias" },
  { key: "paymentMethods", label: "Medios de pago" },
  { key: "settings", label: "Configuracion" },
];

function listOf(content: AdminContent, module: ModuleKey) {
  if (module === "settings" || module === "dashboard") return [];
  const items = content[module];
  return Array.isArray(items) ? items as Array<Record<string, unknown>> : [];
}

function moduleSchema(module: ModuleKey) {
  return adminSchemas[module] ?? [];
}

function emptyRecord(module: ModuleKey) {
  const record: Record<string, unknown> = { id: crypto.randomUUID(), status: "Activo" };
  moduleSchema(module).forEach((field) => {
    if (!(field in record)) record[field] = field.includes("Price") || field === "order" ? 0 : "";
  });
  return record;
}

function labelOf(field: string) {
  return adminFieldLabels[field] ?? field;
}

function normalizeContent(content?: Partial<AdminContent>): AdminContent {
  return {
    ...defaultAdminContent,
    ...content,
    tours: Array.isArray(content?.tours) ? content.tours : defaultAdminContent.tours,
    packages: Array.isArray(content?.packages) ? content.packages : defaultAdminContent.packages,
    hotels: Array.isArray(content?.hotels) ? content.hotels : defaultAdminContent.hotels,
    reservations: Array.isArray(content?.reservations) ? content.reservations : defaultAdminContent.reservations,
    clients: Array.isArray(content?.clients) ? content.clients : defaultAdminContent.clients,
    extras: Array.isArray(content?.extras) ? content.extras : defaultAdminContent.extras,
    categories: Array.isArray(content?.categories) ? content.categories : defaultAdminContent.categories,
    paymentMethods: Array.isArray(content?.paymentMethods) ? content.paymentMethods : defaultAdminContent.paymentMethods,
    settings: { ...defaultAdminContent.settings, ...(content?.settings ?? {}) },
    users: Array.isArray(content?.users) ? content.users : defaultAdminContent.users
  };
}

export function AdminPlatform() {
  const [content, setContent] = useState<AdminContent>(() => normalizeContent(defaultAdminContent));
  const [module, setModule] = useState<ModuleKey>("dashboard");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [reservationDetail, setReservationDetail] = useState<AdminReservation | null>(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/admin/content", { cache: "no-store" });
        const payload = (await response.json()) as { content?: Partial<AdminContent> };
        setContent(normalizeContent(payload.content));
      } catch {
        setContent(normalizeContent(defaultAdminContent));
      }
    };
    load();
  }, []);

  const currentList = useMemo(() => {
    const items = listOf(content, module);
    return items.filter((item) => {
      const text = JSON.stringify(item).toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const matchesStatus = statusFilter === "Todos" || item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [content, module, query, statusFilter]);

  const stats = useMemo<Array<[string, string | number]>>(() => {
    const today = new Date().toISOString().slice(0, 10);
    const reservations = Array.isArray(content.reservations) ? content.reservations : [];
    return [
      ["Reservas del dia", reservations.filter((item) => (item.createdAt ?? item.date ?? "").slice(0, 10) === today).length],
      ["Pendientes", reservations.filter((item) => item.status === "Pendiente").length],
      ["Confirmadas", reservations.filter((item) => item.status === "Confirmada").length],
      ["Ingresos estimados", `USD ${reservations.reduce((sum, item) => sum + Number(item.total ?? 0), 0)}`]
    ];
  }, [content]);
  const categoryOptions = useMemo(() => {
    const options = (Array.isArray(content.categories) ? content.categories : [])
      .filter((item) => item.status !== "Inactivo")
      .map((item) => String(item.name ?? ""))
      .filter(Boolean);

    return options.length ? options : ["Tours", "Aventura", "Premium"];
  }, [content.categories]);

  const createRecord = (targetModule: ModuleKey) => {
    const record = emptyRecord(targetModule);
    if (targetModule === "tours") record.category = categoryOptions[0] ?? "";
    return record;
  };

  const saveContent = async (next = content) => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next)
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "No se pudo guardar.");
      setContent(next);
      setMessage("Cambios guardados correctamente.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  };

  const upsertRecord = () => {
    if (!editing || module === "dashboard" || module === "settings") return;
    const items = listOf(content, module);
    const editingId = editing.id;
    const exists = items.some((item) => item.id === editingId);
    const nextItems = exists ? items.map((item) => item.id === editingId ? editing : item) : [editing, ...items];
    const next = { ...content, [module]: nextItems } as AdminContent;
    setEditing(null);
    saveContent(next);
  };

  const deleteRecord = (record: Record<string, unknown>) => {
    if (!window.confirm("Eliminar registro?")) return;
    const items = listOf(content, module).filter((item) => item.id !== record.id);
    saveContent({ ...content, [module]: items } as AdminContent);
  };

  const duplicateRecord = (record: Record<string, unknown>) => {
    const items = listOf(content, module);
    const copy = { ...record, id: crypto.randomUUID(), name: `${String(record.name ?? record.title ?? "Registro")} copia`, status: "Activo" };
    saveContent({ ...content, [module]: [copy, ...items] } as AdminContent);
  };

  const toggleRecord = (record: Record<string, unknown>) => {
    const items = listOf(content, module).map((item) =>
      item.id === record.id ? { ...item, status: item.status === "Inactivo" ? "Activo" : "Inactivo" } : item
    );
    saveContent({ ...content, [module]: items } as AdminContent);
  };


  const updateReservation = (reservation: AdminReservation, status: AdminReservation["status"]) => {
    const reservations = (Array.isArray(content.reservations) ? content.reservations : []).map((item) =>
      item.id === reservation.id
        ? { ...item, status, history: [`Estado cambiado a ${status} - ${new Date().toLocaleString("es-PE")}`, ...(item.history ?? [])] }
        : item
    );
    saveContent({ ...content, reservations });
    setReservationDetail(null);
  };

  return (
    <div className="not-prose min-h-screen bg-[#F8F6F0] px-3 py-4 text-obsidian sm:px-5 lg:px-6">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-black/10 bg-white p-3 shadow-sm lg:sticky lg:top-4 lg:self-start">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-black/8 px-2 pb-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gold">Admin</p>
            <p className="mt-1 text-sm font-black text-obsidian">Panel web</p>
          </div>
          <AdminLogoutButton />
        </div>
        <nav className="grid gap-1">
          {modules.map((item) => (
            <button
              key={item.key}
              onClick={() => { setModule(item.key); setQuery(""); setStatusFilter("Todos"); }}
              className={cn(
                "flex min-h-11 items-center rounded-lg px-4 text-left text-sm font-black transition",
                module === item.key ? "bg-obsidian text-gold-soft" : "text-charcoal/70 hover:bg-gold/12 hover:text-obsidian"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="min-w-0">
        <div className="mb-4 flex flex-col justify-between gap-4 rounded-lg border border-black/10 bg-white p-4 shadow-sm md:flex-row md:items-center md:p-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Spirit Qosqo Travel</p>
            <h1 className="mt-1 text-2xl font-black leading-tight text-obsidian">{modules.find((item) => item.key === module)?.label}</h1>
          </div>
          {module !== "dashboard" && module !== "reservations" && (
            <div className="flex flex-wrap gap-2 md:justify-end">
              <Button variant="default" onClick={() => saveContent()} disabled={saving}><Save className="size-4" />{saving ? "Guardando..." : "Guardar"}</Button>
              {module !== "settings" && <Button variant="gold" onClick={() => setEditing(createRecord(module))}><Plus className="size-4" />Nuevo</Button>}
            </div>
          )}
        </div>

        {message && <p className="mb-5 rounded-lg bg-gold/10 p-4 text-sm font-bold text-obsidian">{message}</p>}

        {module === "dashboard" && <Dashboard stats={stats} content={content} onOpenReservation={setReservationDetail} onSelectModule={setModule} />}
        {module === "settings" && <SettingsEditor content={content} setContent={setContent} saveContent={saveContent} />}
        {!["dashboard", "settings"].includes(module) && (
          <>
            <div className="mb-4 grid gap-3 rounded-lg border border-black/10 bg-white p-3 shadow-sm md:grid-cols-[1fr_190px] md:p-4">
              <label className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-charcoal/45" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-11" placeholder="Buscar" />
              </label>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-charcoal">
                {["Todos", "Activo", "Inactivo", "Pendiente", "Confirmada", "Cancelada", "Finalizada"].map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            {module === "reservations"
              ? <ReservationsView reservations={currentList as unknown as AdminReservation[]} onOpen={setReservationDetail} onDelete={deleteRecord} />
              : <RecordsGrid module={module} records={currentList} onEdit={setEditing} onDelete={deleteRecord} onDuplicate={duplicateRecord} onToggle={toggleRecord} />}
          </>
        )}
      </main>

      {editing && <EditModal module={module} record={editing} categoryOptions={categoryOptions} onChange={setEditing} onClose={() => setEditing(null)} onSave={upsertRecord} />}
      {reservationDetail && <ReservationModal reservation={reservationDetail} onClose={() => setReservationDetail(null)} onStatus={updateReservation} />}
      </div>
    </div>
  );
}

function Dashboard({ stats, content, onOpenReservation, onSelectModule }: { stats: Array<[string, string | number]>; content: AdminContent; onOpenReservation: (reservation: AdminReservation) => void; onSelectModule: (module: ModuleKey) => void }) {
  const recentReservations = (Array.isArray(content.reservations) ? content.reservations : []).slice(0, 5);
  const shortcuts: Array<{ label: string; description: string; module: ModuleKey }> = [
    { label: "Ver reservas", description: "Revisar solicitudes y cambiar estados.", module: "reservations" },
    { label: "Editar tours", description: "Actualizar experiencias publicadas.", module: "tours" },
    { label: "Editar paquetes", description: "Gestionar paquetes turisticos.", module: "packages" },
    { label: "Medios de pago", description: "Crear y actualizar las cards de pago.", module: "paymentMethods" }
  ];
  return (
    <div className="grid gap-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => <div key={label} className="rounded-lg border border-black/10 bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.14em] text-charcoal/45">{label}</p><p className="mt-2 text-2xl font-black text-obsidian">{value}</p></div>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {shortcuts.map((item) => (
          <button key={item.module} type="button" onClick={() => onSelectModule(item.module)} className="rounded-lg border border-black/10 bg-white p-4 text-left shadow-sm transition hover:border-gold/40 hover:bg-gold/8">
            <p className="font-black text-obsidian">{item.label}</p>
            <p className="mt-1 text-sm leading-6 text-charcoal/62">{item.description}</p>
          </button>
        ))}
      </div>
      <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="font-black text-obsidian">Ultimas reservas</h2>
          <Button size="sm" variant="ghost" onClick={() => onSelectModule("reservations")}>Ver todas</Button>
        </div>
        <div className="mt-4 grid gap-3">
          {recentReservations.length === 0 && <p className="text-sm text-charcoal/60">Aun no hay reservas registradas.</p>}
          {recentReservations.map((item) => (
            <button key={item.id} className="grid gap-2 rounded-lg bg-[#F8F6F0] p-4 text-left transition hover:bg-gold/10 md:grid-cols-[120px_1fr_130px]" onClick={() => onOpenReservation(item)}>
              <strong className="text-obsidian">{item.code}</strong>
              <span className="text-sm text-charcoal/72">{item.clientName} {item.clientLastName} - {item.tour}</span>
              <span className="text-sm font-bold text-gold">{item.status}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecordsGrid({
  module,
  records,
  onEdit,
  onDelete,
  onDuplicate,
  onToggle
}: {
  module: ModuleKey;
  records: Array<Record<string, unknown>>;
  onEdit: (record: Record<string, unknown>) => void;
  onDelete: (record: Record<string, unknown>) => void;
  onDuplicate: (record: Record<string, unknown>) => void;
  onToggle: (record: Record<string, unknown>) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {records.map((record, index) => (
        <article key={String(record.id ?? index)} className="flex min-h-[230px] flex-col rounded-lg border border-black/10 bg-white p-5 shadow-sm transition hover:border-gold/35 hover:shadow-md">
          <div className="flex items-start justify-between gap-4">
            <span className={cn(
              "rounded-full px-3 py-1 text-xs font-black",
              record.status === "Inactivo" ? "bg-black/6 text-charcoal/60" : "bg-gold/12 text-obsidian"
            )}>
              {String(record.status ?? "Activo")}
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-charcoal/35">{module}</p>
          </div>

          <div className="mt-4 flex-1">
            <h2 className="line-clamp-2 text-lg font-black leading-snug text-obsidian">{String(record.name ?? record.title ?? record.code ?? "Registro")}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-charcoal/65">{String(record.description ?? record.shortDescription ?? record.email ?? record.category ?? "")}</p>
          </div>

          <div className="mt-5 grid gap-2 border-t border-black/8 pt-4 sm:grid-cols-2">
            <Button size="sm" variant="default" className="justify-center" onClick={() => onEdit(record)}><Pencil className="size-4" />Editar</Button>
            <Button size="sm" variant="ghost" className="justify-center" onClick={() => onDuplicate(record)}>Duplicar</Button>
            <Button size="sm" variant="ghost" className="justify-center" onClick={() => onToggle(record)}>{record.status === "Inactivo" ? "Activar" : "Desactivar"}</Button>
            <Button size="sm" variant="ghost" className="justify-center text-red-600 hover:text-red-700" onClick={() => onDelete(record)}><Trash2 className="size-4" />Eliminar</Button>
          </div>
        </article>
      ))}
    </div>
  );
}

function ReservationsView({ reservations, onOpen, onDelete }: { reservations: AdminReservation[]; onOpen: (reservation: AdminReservation) => void; onDelete: (record: Record<string, unknown>) => void }) {
  return (
    <div className="grid gap-3">
      {reservations.map((item) => (
        <article key={item.id} className="grid gap-4 rounded-lg border border-black/10 bg-white p-4 shadow-sm transition hover:border-gold/35 hover:shadow-md xl:grid-cols-[1fr_auto]">
          <div className="grid gap-3 md:grid-cols-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">Codigo</p><p className="font-black text-obsidian">{item.code}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">Cliente</p><p className="font-black text-obsidian">{item.clientName} {item.clientLastName}</p></div>
            <div className="md:col-span-2"><p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">Tour</p><p className="font-black text-obsidian">{item.tour}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">Fecha</p><p className="text-sm font-semibold text-charcoal/75">{item.date}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">Estado</p><p className="text-sm font-black text-gold">{item.status}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">Total</p><p className="font-black text-obsidian">USD {item.total}</p></div>
            <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">Hotel</p><p className="text-sm font-semibold text-charcoal/75">{item.hotel || "No aplica"}</p></div>
          </div>
          <div className="grid content-start gap-2 sm:grid-cols-2 xl:w-[180px] xl:grid-cols-1">
            <Button size="sm" variant="default" className="justify-center" onClick={() => onOpen(item)}><Eye className="size-4" />Ver</Button>
            <Button size="sm" variant="ghost" className="justify-center text-red-600 hover:text-red-700" onClick={() => onDelete(item)}><Trash2 className="size-4" />Eliminar</Button>
          </div>
        </article>
      ))}
    </div>
  );
}


function SettingsEditor({ content, setContent, saveContent }: { content: AdminContent; setContent: (content: AdminContent) => void; saveContent: (content: AdminContent) => void }) {
  const settings = content.settings;
  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(settings).map(([key, value]) => (
          <label key={key} className="grid gap-2 text-sm font-bold text-obsidian">
            {labelOf(key)}
            <Input value={String(value ?? "")} onChange={(event) => setContent({ ...content, settings: { ...settings, [key]: event.target.value } })} />
          </label>
        ))}
      </div>
      <Button className="mt-5" variant="gold" onClick={() => saveContent(content)}><Save className="size-4" />Guardar configuraciÃ³n</Button>
    </div>
  );
}

function EditModal({
  module,
  record,
  categoryOptions,
  onChange,
  onClose,
  onSave
}: {
  module: ModuleKey;
  record: Record<string, unknown>;
  categoryOptions: string[];
  onChange: (record: Record<string, unknown>) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const fields = moduleSchema(module);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoValue = String(record.logo ?? "");
  const logoIsImage = logoValue.startsWith("http") || logoValue.startsWith("/");

  const uploadLogo = async (file?: File) => {
    if (!file) return;
    setUploadingLogo(true);
    setUploadMessage("Subiendo logo...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload-image", { method: "POST", body: formData });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "No se pudo subir el logo.");

      const possibleUrl = payload.payload?.url ?? payload.payload?.file ?? payload.payload?.path ?? payload.payload?.body ?? "";
      if (!possibleUrl) throw new Error("La subida termino, pero no se encontro una URL.");

      onChange({ ...record, logo: possibleUrl });
      setUploadMessage("Logo cargado. Guarda el registro para publicarlo.");
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : "No se pudo subir el logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl rounded-lg bg-[#F8F6F0] shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white/95 p-4 backdrop-blur-xl">
          <h2 className="text-xl font-black text-obsidian">Editar {modules.find((item) => item.key === module)?.label}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="size-5" /></Button>
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          {fields.map((field) => {
            const isLong = ["description", "shortDescription", "gallery", "includes", "excludes", "bring", "itinerary", "faqs", "policies", "services", "permissions", "history", "fieldRows", "details"].includes(field);
            const value = String(record[field] ?? "");
            const statusOptions = module === "reservations" ? ["Pendiente", "Confirmada", "Cancelada", "Finalizada"] : ["Activo", "Inactivo"];
            return (
              <label key={field} className={cn("grid gap-2 text-sm font-bold text-obsidian", isLong && "md:col-span-2")}>
                {labelOf(field)}
                {field === "status"
                  ? (
                    <select value={value || statusOptions[0]} onChange={(event) => onChange({ ...record, [field]: event.target.value })} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-charcoal outline-none">
                      {statusOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  )
                  : field === "category" && module === "tours"
                    ? (
                      <select value={value || categoryOptions[0] || ""} onChange={(event) => onChange({ ...record, [field]: event.target.value })} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold text-charcoal outline-none">
                        {categoryOptions.map((option) => <option key={option}>{option}</option>)}
                      </select>
                    )
                  : isLong
                    ? <Textarea value={value} onChange={(event) => onChange({ ...record, [field]: event.target.value })} className="min-h-28" />
                    : <Input value={value} onChange={(event) => onChange({ ...record, [field]: event.target.value })} />}
              </label>
            );
          })}
          {["mainImage", "gallery"].some((field) => fields.includes(field)) && (
            <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-obsidian px-6 text-sm font-semibold text-ivory shadow-sm">
              <Upload className="size-4" />Subir imagen
              <input type="file" className="sr-only" onChange={() => window.alert("La subida de imÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡genes esta disponible desde el editor de tarifario conectado al hosting.")} />
            </label>
          )}
          {module === "paymentMethods" && (
            <div className="grid gap-3 rounded-lg border border-black/10 bg-white p-4 md:col-span-2">
              <p className="text-sm font-bold text-obsidian">Logo del medio de pago</p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex h-24 w-full max-w-[190px] items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-[#F8F6F0]">
                  {logoIsImage
                    ? <Image src={logoValue} alt="Logo cargado" fill sizes="190px" className="object-contain p-3" unoptimized />
                    : <span className="text-sm font-black uppercase tracking-[0.16em] text-charcoal/45">{logoValue || "Sin logo"}</span>}
                </div>
                <div className="grid gap-2">
                  <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-obsidian px-6 text-sm font-semibold text-ivory shadow-sm transition hover:bg-charcoal">
                    <Upload className="size-4" />
                    {uploadingLogo ? "Subiendo..." : "Cargar logo"}
                    <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadLogo(event.target.files?.[0])} />
                  </label>
                  <p className="text-xs leading-5 text-charcoal/55">Tambien puedes escribir yape, plin, bcp o cci en el campo Logo.</p>
                </div>
              </div>
              {uploadMessage && <p className="rounded-lg bg-gold/10 p-3 text-sm font-semibold text-obsidian">{uploadMessage}</p>}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-black/10 bg-white p-4">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="gold" onClick={onSave}><Save className="size-4" />Guardar registro</Button>
        </div>
      </div>
    </div>
  );
}

function ReservationModal({ reservation, onClose, onStatus }: { reservation: AdminReservation; onClose: () => void; onStatus: (reservation: AdminReservation, status: AdminReservation["status"]) => void }) {
  const clientName = reservation.clientName || "viajero";
  const reservationCode = reservation.code || "sin codigo";
  const tourName = reservation.tour || "tu tour";
  const whatsappNumber = String(reservation.whatsapp ?? "").replace(/\D/g, "");
  const email = String(reservation.email ?? "");
  const isConfirmed = reservation.status === "Confirmada";
  const whatsappText = encodeURIComponent(`Hola ${clientName}, te escribimos por tu reserva ${reservationCode} para ${tourName}.`);
  return (
    <div className="fixed inset-0 z-[96] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-black/10 p-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Detalle de reserva</p><h2 className="text-xl font-black text-obsidian">{reservationCode}</h2></div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="size-5" /></Button>
        </div>
        <div className="grid gap-5 p-5 md:grid-cols-2">
          {Object.entries(reservation).filter(([key]) => !["id", "history"].includes(key)).map(([key, value]) => (
            <div key={key} className="rounded-lg bg-[#F8F6F0] p-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-charcoal/45">{labelOf(key)}</p><p className="mt-1 font-semibold text-obsidian">{Array.isArray(value) ? value.join(", ") : String(value)}</p></div>
          ))}
          <div className="md:col-span-2"><h3 className="font-black text-obsidian">Historial</h3><div className="mt-2 grid gap-2">{(reservation.history ?? []).map((item) => <p key={item} className="rounded-lg bg-[#F8F6F0] p-3 text-sm">{item}</p>)}</div></div>
        </div>
        {!isConfirmed && (
          <div className="flex flex-wrap gap-2 border-t border-black/10 p-4">
            <Button variant="gold" onClick={() => onStatus(reservation, "Confirmada")}>Confirmar reserva</Button>
            <Button variant="ghost" onClick={() => onStatus(reservation, "Cancelada")}>Cancelar</Button>
            {whatsappNumber
              ? <a className={cn(buttonVariants({ variant: "default", size: "default" }))} href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`} target="_blank">Enviar WhatsApp</a>
              : <Button variant="ghost" disabled>Sin WhatsApp</Button>}
            {email
              ? <a className={cn(buttonVariants({ variant: "default", size: "default" }))} href={`mailto:${email}?subject=Reserva ${reservationCode}`}>Enviar correo</a>
              : <Button variant="ghost" disabled>Sin correo</Button>}
          </div>
        )}
      </div>
    </div>
  );
}
