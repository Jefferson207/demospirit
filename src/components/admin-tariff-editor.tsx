"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Copy,
  Database,
  Download,
  Eye,
  ImageUp,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { defaultTariff, tariffStorageKey, type Tariff } from "@/lib/tariff";
import { travelServices, type ItineraryStep, type TravelService } from "@/lib/travel-services";
import { cn } from "@/lib/utils";

type ServiceSection = "tour" | "paquete" | "hotel";
type AdminTab = ServiceSection | "feed" | "policies" | "legal" | "contact" | "advanced";
type EditableTravelService = TravelService & {
  activo?: boolean;
  orden?: number;
  diasNoches?: string;
  tablaPreciosHotel?: Array<{
    categoriaHotel: string;
    precioNeto: string;
    comisionAgencia: string;
    tarifaVentaSugerida: string;
  }>;
};
type HotelRecord = Tariff["hotels"][number];
type FeedRecord = Tariff["feed"][number];
type CancellationRecord = Tariff["cancellationPolicies"][number];

const tabs: Array<{ id: AdminTab; label: string; helper: string }> = [
  { id: "tour", label: "Tours clásicos", helper: "Experiencias y excursiones vendibles." },
  { id: "paquete", label: "Paquetes", helper: "Programas por días, noches y categoría hotelera." },
  { id: "hotel", label: "Hoteles", helper: "Servicios hoteleros publicados como producto." },
  { id: "feed", label: "Alimentación", helper: "Desayuno, almuerzo, cenas y dietas." },
  { id: "policies", label: "Políticas", helper: "Reserva, cancelacion y reembolsos." },
  { id: "legal", label: "Info legal", helper: "RUC, constancias y comunicados." },
  { id: "contact", label: "Contacto", helper: "Dirección, teléfonos y redes." },
  { id: "advanced", label: "JSON", helper: "Importar, exportar y restaurar." }
];

const serviceLabels: Record<ServiceSection, string> = {
  tour: "tour",
  paquete: "paquete",
  hotel: "hotel"
};

const serviceTypeLabels: Record<ServiceSection, string> = {
  tour: "tour",
  paquete: "paquete",
  hotel: "hotel"
};

function pretty(data: unknown) {
  return JSON.stringify(data, null, 2);
}

function lines(value?: string[]) {
  return (value ?? []).join("\n");
}

function toLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function itineraryToText(value?: ItineraryStep[]) {
  return (value ?? []).map((item) => `${item.titulo} | ${item.descripcion}`).join("\n");
}

function textToItinerary(value: string) {
  return value
    .split("\n")
    .map((line) => {
      const [title, ...description] = line.split("|");
      return { titulo: title?.trim() || "Paso", descripcion: description.join("|").trim() || title?.trim() || "" };
    })
    .filter((item) => item.titulo || item.descripcion);
}

function priceTableToText(value?: EditableTravelService["tablaPreciosHotel"]) {
  return (value ?? [])
    .map((item) => `${item.categoriaHotel} | ${item.precioNeto} | ${item.comisionAgencia} | ${item.tarifaVentaSugerida}`)
    .join("\n");
}

function textToPriceTable(value: string): EditableTravelService["tablaPreciosHotel"] {
  return value
    .split("\n")
    .map((line) => {
      const [category, net, commission, suggested] = line.split("|").map((item) => item?.trim() ?? "");
      return { categoriaHotel: category, precioNeto: net, comisionAgencia: commission, tarifaVentaSugerida: suggested };
    })
    .filter((item) => item.categoriaHotel || item.precioNeto || item.tarifaVentaSugerida);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function defaultService(type: ServiceSection): EditableTravelService {
  const name = type === "paquete" ? "Nuevo paquete turístico" : type === "hotel" ? "Nuevo hotel" : "Nuevo tour";

  return {
    nombre: name,
    slug: slugify(name),
    categoria: type === "paquete" ? "Paquete turístico" : type === "hotel" ? "Hotel" : "Cultura",
    etiqueta: "Nuevo" as TravelService["etiqueta"],
    descripcionCorta: "Descripcion breve del servicio.",
    descripcionCompleta: "Descripcion completa del servicio turístico.",
    duracion: type === "paquete" ? "4 días / 3 noches" : "Full day",
    dificultad: "Moderado",
    precio: null,
    moneda: type === "paquete" ? "USD" : "PEN",
    precioTexto: type === "paquete" ? "Consultar" : "Desde S/ 95",
    reservas: 0,
    rating: 5,
    incluye: ["Transporte turístico", "Guía profesional"],
    noIncluye: ["Gastos personales"],
    queLlevar: ["Documento", "Ropa comoda"],
    recomendaciones: ["Reservar con anticipacion"],
    itinerario: [{ titulo: "Inicio", descripcion: "Recojo o punto de encuentro confirmado." }],
    imagenPrincipal: "https://upload.wikimedia.org/wikipedia/commons/4/43/Peru_Machu_Picchu_Sunrise.jpg",
    galeria: [],
    mapaUrl: "https://www.google.com/maps?q=Cusco%20Peru&output=embed",
    horariosDisponibles: ["Manana", "Tarde"],
    tipoServicio: serviceTypeLabels[type] as TravelService["tipoServicio"],
    preguntasFrecuentes: ["La disponibilidad se confirma antes del pago."],
    activo: true,
    orden: 0,
    nochesHotel: type === "paquete" ? 3 : undefined,
    categoriaHotel: type === "paquete" ? "3 estrellas" : undefined,
    precioNeto: type === "paquete" ? 0 : undefined,
    comisionAgencia: type === "paquete" ? "10%, 15% o 20%" : undefined,
    tarifaVentaSugerida: type === "paquete" ? "Consultar" : undefined,
    serviciosIncluidos: type === "paquete" ? ["Recepcion", "Traslados", "Hotel", "Tren", "Bus", "Entrada", "Guía", "Desayunos"] : undefined,
    diasNoches: type === "paquete" ? "4 días / 3 noches" : undefined,
    tablaPreciosHotel: type === "paquete" ? [] : undefined
  };
}

function statusOf(active?: boolean) {
  return active === false ? "Inactivo" : "Activo";
}

function getReservationText(item: Tariff["reservationPolicies"][number]) {
  return typeof item === "string" ? item : item.text;
}

export function AdminTariffEditor() {
  const [activeTab, setActiveTab] = useState<AdminTab>("tour");
  const [services, setServices] = useState<EditableTravelService[]>(travelServices as EditableTravelService[]);
  const [tariff, setTariff] = useState<Tariff>(defaultTariff);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [serviceDraft, setServiceDraft] = useState<EditableTravelService | null>(null);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [previewService, setPreviewService] = useState<EditableTravelService | null>(null);
  const [hotelDraft, setHotelDraft] = useState<HotelRecord | null>(null);
  const [editingHotelIndex, setEditingHotelIndex] = useState<number | null>(null);
  const [feedDraft, setFeedDraft] = useState<FeedRecord | null>(null);
  const [editingFeedIndex, setEditingFeedIndex] = useState<number | null>(null);
  const [reservationDraft, setReservationDraft] = useState("");
  const [editingReservationIndex, setEditingReservationIndex] = useState<number | null>(null);
  const [cancellationDraft, setCancellationDraft] = useState<CancellationRecord | null>(null);
  const [editingCancellationIndex, setEditingCancellationIndex] = useState<number | null>(null);
  const [servicesJson, setServicesJson] = useState(pretty(travelServices));
  const [tariffJson, setTariffJson] = useState(pretty(defaultTariff));

  useEffect(() => {
    const load = async () => {
      try {
        const [servicesResponse, tariffResponse] = await Promise.all([
          fetch("/api/travel-services", { cache: "no-store" }),
          fetch("/api/tariff", { cache: "no-store" })
        ]);
        const servicesPayload = (await servicesResponse.json()) as { services?: EditableTravelService[] };
        const tariffPayload = (await tariffResponse.json()) as { tariff?: Tariff };

        if (servicesPayload.services) {
          setServices(servicesPayload.services);
          setServicesJson(pretty(servicesPayload.services));
        }
        if (tariffPayload.tariff) {
          setTariff(tariffPayload.tariff);
          setTariffJson(pretty(tariffPayload.tariff));
        }
      } catch {
        const saved = window.localStorage.getItem(tariffStorageKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as Tariff;
            setTariff(parsed);
            setTariffJson(pretty(parsed));
          } catch {
            setTariff(defaultTariff);
          }
        }
      }
    };

    load();
  }, []);

  const filteredServices = useMemo(() => {
    if (!["tour", "paquete", "hotel"].includes(activeTab)) return [];
    const type = serviceLabels[activeTab as ServiceSection];

    return services
      .map((service, index) => ({ service, index }))
      .filter(({ service }) => service.tipoServicio === type)
      .filter(({ service }) => categoryFilter === "Todos" || service.categoria === categoryFilter)
      .filter(({ service }) => {
        const text = `${service.nombre} ${service.categoria} ${service.slug}`.toLowerCase();
        return text.includes(query.toLowerCase());
      })
      .sort((a, b) => (a.service.orden ?? a.index) - (b.service.orden ?? b.index));
  }, [activeTab, categoryFilter, query, services]);

  const categories = useMemo(() => {
    if (!["tour", "paquete", "hotel"].includes(activeTab)) return ["Todos"];
    const type = serviceLabels[activeTab as ServiceSection];
    return ["Todos", ...Array.from(new Set(services.filter((item) => item.tipoServicio === type).map((item) => item.categoria)))];
  }, [activeTab, services]);

  const saveAll = async () => {
    setSaving(true);
    setMessage("");

    try {
      const [servicesResponse, tariffResponse] = await Promise.all([
        fetch("/api/travel-services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(services)
        }),
        fetch("/api/tariff", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tariff)
        })
      ]);
      const servicesPayload = await servicesResponse.json();
      const tariffPayload = await tariffResponse.json();

      if (!servicesResponse.ok || !servicesPayload.ok) throw new Error(servicesPayload.error ?? "No se pudieron guardar los servicios.");
      if (!tariffResponse.ok || !tariffPayload.ok) throw new Error(tariffPayload.error ?? "No se pudo guardar el tarifario.");

      window.localStorage.setItem(tariffStorageKey, pretty(tariff));
      setServicesJson(pretty(services));
      setTariffJson(pretty(tariff));
      setMessage("Cambios guardados correctamente en la base actual.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudieron guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File | undefined, mode: "principal" | "galeria") => {
    if (!file || !serviceDraft) return;
    setMessage("Subiendo imagen...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload-image", { method: "POST", body: formData });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "No se pudo subir la imagen.");

      const possibleUrl = payload.payload?.url ?? payload.payload?.file ?? payload.payload?.path ?? payload.payload?.body ?? "";
      if (!possibleUrl) throw new Error("La subida termino, pero no se encontro una URL en la respuesta.");

      setServiceDraft((current) => {
        if (!current) return current;
        if (mode === "principal") return { ...current, imagenPrincipal: possibleUrl };
        return { ...current, galeria: [...current.galeria, possibleUrl] };
      });
      setMessage("Imagen subida. Revisa la vista previa antes de guardar.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    }
  };

  const beginNewService = (type: ServiceSection) => {
    setEditingServiceIndex(null);
    setServiceDraft(defaultService(type));
    setPreviewService(null);
  };

  const beginEditService = (service: EditableTravelService, index: number) => {
    setEditingServiceIndex(index);
    setServiceDraft({ ...service, activo: service.activo !== false });
    setPreviewService(null);
  };

  const saveServiceDraft = () => {
    if (!serviceDraft) return;
    const normalized = {
      ...serviceDraft,
      slug: serviceDraft.slug || slugify(serviceDraft.nombre),
      precio: Number.isFinite(Number(serviceDraft.precio)) ? Number(serviceDraft.precio) : null,
      reservas: Number(serviceDraft.reservas) || 0,
      rating: Math.min(5, Math.max(0, Number(serviceDraft.rating) || 0)),
      orden: serviceDraft.orden ?? services.length
    };

    setServices((current) => {
      if (editingServiceIndex === null) return [...current, normalized];
      return current.map((item, index) => (index === editingServiceIndex ? normalized : item));
    });
    setPreviewService(normalized);
    setServiceDraft(null);
    setEditingServiceIndex(null);
    setMessage("Registro listo. Presiona Guardar cambios para publicarlo.");
  };

  const deleteService = (index: number) => {
    if (!window.confirm("Quieres eliminar este registro? Esta accion no se publica hasta presionar Guardar cambios.")) return;
    setServices((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setMessage("Registro eliminado del borrador.");
  };

  const duplicateService = (service: EditableTravelService) => {
    const copy = {
      ...service,
      nombre: `${service.nombre} copia`,
      slug: `${service.slug || slugify(service.nombre)}-copia`,
      activo: false,
      orden: services.length
    };
    setServices((current) => [...current, copy]);
    setMessage("Registro duplicado como inactivo.");
  };

  const toggleService = (index: number) => {
    setServices((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, activo: item.activo === false } : item)));
  };

  const moveService = (index: number, direction: -1 | 1) => {
    setServices((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((item, itemIndex) => ({ ...item, orden: itemIndex }));
    });
  };

  const saveHotel = () => {
    if (!hotelDraft) return;
    setTariff((current) => ({
      ...current,
      hotels:
        editingHotelIndex === null
          ? [...current.hotels, hotelDraft]
          : current.hotels.map((item, index) => (index === editingHotelIndex ? hotelDraft : item))
    }));
    setHotelDraft(null);
    setEditingHotelIndex(null);
    setMessage("Hotel listo. Presiona Guardar cambios para publicarlo.");
  };

  const saveFeed = () => {
    if (!feedDraft) return;
    setTariff((current) => ({
      ...current,
      feed:
        editingFeedIndex === null
          ? [...current.feed, feedDraft]
          : current.feed.map((item, index) => (index === editingFeedIndex ? feedDraft : item))
    }));
    setFeedDraft(null);
    setEditingFeedIndex(null);
    setMessage("Alimentación lista. Presiona Guardar cambios para publicarla.");
  };

  const saveReservationPolicy = () => {
    if (!reservationDraft.trim()) return;
    setTariff((current) => ({
      ...current,
      reservationPolicies:
        editingReservationIndex === null
          ? [...current.reservationPolicies, { text: reservationDraft.trim(), active: true }]
          : current.reservationPolicies.map((item, index) => (index === editingReservationIndex ? { text: reservationDraft.trim(), active: true } : item))
    }));
    setReservationDraft("");
    setEditingReservationIndex(null);
  };

  const saveCancellationPolicy = () => {
    if (!cancellationDraft) return;
    setTariff((current) => ({
      ...current,
      cancellationPolicies:
        editingCancellationIndex === null
          ? [...current.cancellationPolicies, cancellationDraft]
          : current.cancellationPolicies.map((item, index) => (index === editingCancellationIndex ? cancellationDraft : item))
    }));
    setCancellationDraft(null);
    setEditingCancellationIndex(null);
  };

  const importServices = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as EditableTravelService[];
    setServices(parsed);
    setServicesJson(pretty(parsed));
    setMessage("Servicios importados. Revisa y presiona Guardar cambios.");
  };

  const importTariff = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    const parsed = JSON.parse(text) as Tariff;
    setTariff(parsed);
    setTariffJson(pretty(parsed));
    setMessage("Tarifario importado. Revisa y presiona Guardar cambios.");
  };

  const downloadJson = (name: string, data: unknown) => {
    const blob = new Blob([pretty(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="not-prose grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <Database className="size-8 rounded-full bg-emerald/10 p-1.5 text-emerald" />
          <h2 className="mt-4 text-base font-black text-obsidian">Base conectada</h2>
          <p className="mt-2 text-sm leading-6 text-charcoal/68">Los servicios y el tarifario se guardan en Upstash Redis.</p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <ImageUp className="size-8 rounded-full bg-gold/15 p-1.5 text-obsidian" />
          <h2 className="mt-4 text-base font-black text-obsidian">Imágenes</h2>
          <p className="mt-2 text-sm leading-6 text-charcoal/68">Sube imágenes al hosting y asigna la URL al servicio.</p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
          <CheckCircle2 className="size-8 rounded-full bg-obsidian/10 p-1.5 text-obsidian" />
          <h2 className="mt-4 text-base font-black text-obsidian">Flujo visual</h2>
          <p className="mt-2 text-sm leading-6 text-charcoal/68">Crea, edita, duplica, ordena y previsualiza antes de guardar.</p>
        </div>
      </div>

      <div className="sticky top-20 z-20 rounded-lg border border-black/10 bg-white/95 p-3 shadow-sm backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setServiceDraft(null);
                  setHotelDraft(null);
                  setFeedDraft(null);
                }}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition",
                  activeTab === tab.id ? "bg-obsidian text-gold-soft" : "bg-[#F8F6F0] text-charcoal/72 hover:bg-gold/15"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Button type="button" variant="gold" onClick={saveAll} disabled={saving}>
            <Save className="size-4" />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>

      {message && <p className="rounded-lg border border-gold/25 bg-gold/10 p-4 text-sm font-bold text-obsidian">{message}</p>}

      <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">{tabs.find((tab) => tab.id === activeTab)?.label}</p>
            <h2 className="mt-2 text-2xl font-black text-obsidian">{tabs.find((tab) => tab.id === activeTab)?.helper}</h2>
          </div>

          {["tour", "paquete", "hotel"].includes(activeTab) && (
            <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_180px_auto]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-charcoal/45" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-11" placeholder="Buscar por nombre, slug o categoria" />
              </label>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold text-charcoal shadow-sm outline-none focus:border-gold"
              >
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
              <Button type="button" variant="gold" onClick={() => beginNewService(activeTab as ServiceSection)}>
                <Plus className="size-4" />
                Nuevo
              </Button>
            </div>
          )}
        </div>

        {["tour", "paquete", "hotel"].includes(activeTab) && (
          <div className="mt-6 grid gap-4">
            {filteredServices.map(({ service, index }) => (
              <article key={`${service.slug}-${index}`} className="grid gap-4 rounded-lg border border-black/10 bg-[#F8F6F0] p-4 lg:grid-cols-[180px_1fr_auto]">
                <div className="min-h-32 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url("${service.imagenPrincipal}")` }} />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("rounded-full px-3 py-1 text-xs font-black", service.activo === false ? "bg-black/10 text-charcoal/60" : "bg-emerald/10 text-emerald")}>
                      {statusOf(service.activo)}
                    </span>
                    <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-black text-obsidian">{service.etiqueta}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-charcoal/70">{service.categoria}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-black text-obsidian">{service.nombre}</h3>
                  <p className="mt-2 text-sm leading-6 text-charcoal/68">{service.descripcionCorta}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-charcoal/64">
                    <span>{service.duracion}</span>
                    <span>{service.dificultad}</span>
                    <span>{service.precioTexto}</span>
                    <span>{service.rating}/5</span>
                    <span>{service.reservas} reservas</span>
                  </div>
                </div>
                <div className="flex flex-wrap content-start gap-2 lg:w-44">
                  <Button type="button" size="sm" variant="default" onClick={() => beginEditService(service, index)}><Pencil className="size-4" />Editar</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => {
                    setServiceDraft(null);
                    setEditingServiceIndex(null);
                    setPreviewService(service);
                  }}><Eye className="size-4" />Vista</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => duplicateService(service)}><Copy className="size-4" />Duplicar</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => toggleService(index)}>{service.activo === false ? "Activar" : "Desactivar"}</Button>
                  <Button type="button" size="icon" variant="ghost" aria-label="Subir orden" onClick={() => moveService(index, -1)}><ArrowUp className="size-4" /></Button>
                  <Button type="button" size="icon" variant="ghost" aria-label="Bajar orden" onClick={() => moveService(index, 1)}><ArrowDown className="size-4" /></Button>
                  <Button type="button" size="icon" variant="ghost" aria-label="Eliminar" onClick={() => deleteService(index)}><Trash2 className="size-4 text-red-600" /></Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === "feed" && (
          <FeedManager
            feed={tariff.feed}
            draft={feedDraft}
            editingIndex={editingFeedIndex}
            onNew={() => {
              setFeedDraft({ service: "Nuevo servicio", includes: "", active: true });
              setEditingFeedIndex(null);
            }}
            onEdit={(item, index) => {
              setFeedDraft(item);
              setEditingFeedIndex(index);
            }}
            onToggle={(index) => setTariff((current) => ({ ...current, feed: current.feed.map((item, itemIndex) => (itemIndex === index ? { ...item, active: item.active === false } : item)) }))}
            onMove={(index, direction) => setTariff((current) => {
              const feed = [...current.feed];
              const target = index + direction;
              if (target < 0 || target >= feed.length) return current;
              [feed[index], feed[target]] = [feed[target], feed[index]];
              return { ...current, feed: feed.map((item, itemIndex) => ({ ...item, order: itemIndex })) };
            })}
            onDelete={(index) => setTariff((current) => ({ ...current, feed: current.feed.filter((_, itemIndex) => itemIndex !== index) }))}
            onDraft={setFeedDraft}
            onSave={saveFeed}
          />
        )}

        {activeTab === "policies" && (
          <PoliciesManager
            tariff={tariff}
            reservationDraft={reservationDraft}
            cancellationDraft={cancellationDraft}
            editingReservationIndex={editingReservationIndex}
            editingCancellationIndex={editingCancellationIndex}
            onReservationDraft={setReservationDraft}
            onCancellationDraft={setCancellationDraft}
            onEditReservation={(text, index) => {
              setReservationDraft(text);
              setEditingReservationIndex(index);
            }}
            onDeleteReservation={(index) => setTariff((current) => ({ ...current, reservationPolicies: current.reservationPolicies.filter((_, itemIndex) => itemIndex !== index) }))}
            onSaveReservation={saveReservationPolicy}
            onNewCancellation={() => {
              setCancellationDraft({ period: "Nuevo periodo", charge: "Condicion aplicable", active: true });
              setEditingCancellationIndex(null);
            }}
            onEditCancellation={(item, index) => {
              setCancellationDraft(item);
              setEditingCancellationIndex(index);
            }}
            onDeleteCancellation={(index) => setTariff((current) => ({ ...current, cancellationPolicies: current.cancellationPolicies.filter((_, itemIndex) => itemIndex !== index) }))}
            onSaveCancellation={saveCancellationPolicy}
          />
        )}

        {activeTab === "hotel" && (
          <TariffHotelsManager
            hotels={tariff.hotels}
            draft={hotelDraft}
            editingIndex={editingHotelIndex}
            onNew={() => {
              setHotelDraft({ category: "Nueva categoria", hotels: [], priceRange: "", active: true });
              setEditingHotelIndex(null);
            }}
            onEdit={(item, index) => {
              setHotelDraft(item);
              setEditingHotelIndex(index);
            }}
            onToggle={(index) => setTariff((current) => ({ ...current, hotels: current.hotels.map((item, itemIndex) => (itemIndex === index ? { ...item, active: item.active === false } : item)) }))}
            onMove={(index, direction) => setTariff((current) => {
              const hotels = [...current.hotels];
              const target = index + direction;
              if (target < 0 || target >= hotels.length) return current;
              [hotels[index], hotels[target]] = [hotels[target], hotels[index]];
              return { ...current, hotels: hotels.map((item, itemIndex) => ({ ...item, order: itemIndex })) };
            })}
            onDelete={(index) => setTariff((current) => ({ ...current, hotels: current.hotels.filter((_, itemIndex) => itemIndex !== index) }))}
            onDraft={setHotelDraft}
            onSave={saveHotel}
          />
        )}

        {activeTab === "legal" && (
          <LegalManager
            value={tariff.legalInfo ?? { active: true, items: ["RUC 20615956997", "Razón social: SPIRIT QOSQO E.I.R.L"] }}
            onChange={(legalInfo) => setTariff((current) => ({ ...current, legalInfo }))}
          />
        )}

        {activeTab === "contact" && (
          <ContactManager
            value={tariff.contactInfo ?? { active: true, address: "", phone: "", whatsapp: "", email: "", website: "", socials: [] }}
            onChange={(contactInfo) => setTariff((current) => ({ ...current, contactInfo }))}
          />
        )}

        {activeTab === "advanced" && (
          <AdvancedJson
            servicesJson={servicesJson}
            tariffJson={tariffJson}
            onServicesJson={setServicesJson}
            onTariffJson={setTariffJson}
            onApplyServices={() => {
              setServices(JSON.parse(servicesJson) as EditableTravelService[]);
              setMessage("JSON de servicios aplicado al borrador.");
            }}
            onApplyTariff={() => {
              setTariff(JSON.parse(tariffJson) as Tariff);
              setMessage("JSON de tarifario aplicado al borrador.");
            }}
            onExportServices={() => downloadJson("servicios-spirit-qosqo.json", services)}
            onExportTariff={() => downloadJson("tarifario-spirit-qosqo.json", tariff)}
            onImportServices={importServices}
            onImportTariff={importTariff}
            onRestore={() => {
              setServices(travelServices as EditableTravelService[]);
              setTariff(defaultTariff);
              setServicesJson(pretty(travelServices));
              setTariffJson(pretty(defaultTariff));
              setMessage("Datos base restaurados en borrador. Presiona Guardar cambios para publicarlos.");
            }}
          />
        )}
      </section>

      {serviceDraft && (
        <ServiceEditor
          draft={serviceDraft}
          onDraft={setServiceDraft}
          onClose={() => {
            setServiceDraft(null);
            setEditingServiceIndex(null);
          }}
          onSave={saveServiceDraft}
          onUpload={uploadImage}
        />
      )}

      {previewService && <ServicePreview service={previewService} onClose={() => setPreviewService(null)} />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-obsidian">
      {label}
      {children}
    </label>
  );
}

function ServiceEditor({
  draft,
  onDraft,
  onClose,
  onSave,
  onUpload
}: {
  draft: EditableTravelService;
  onDraft: (value: EditableTravelService | null) => void;
  onClose: () => void;
  onSave: () => void;
  onUpload: (file: File | undefined, mode: "principal" | "galeria") => void;
}) {
  const set = <K extends keyof EditableTravelService>(key: K, value: EditableTravelService[K]) => onDraft({ ...draft, [key]: value });

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-[1500px] rounded-lg bg-[#F8F6F0] shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/10 bg-white/95 p-4 backdrop-blur-xl">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Editor visual</p>
            <h3 className="text-xl font-black text-obsidian">{draft.nombre}</h3>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="button" variant="gold" onClick={onSave}><Save className="size-4" />Guardar registro</Button>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="grid gap-5">
            <div className="grid gap-4 rounded-lg border border-black/10 bg-white p-5 md:grid-cols-2">
              <Field label="Nombre">
                <Input value={draft.nombre} onChange={(event) => set("nombre", event.target.value)} />
              </Field>
              <Field label="Slug">
                <Input value={draft.slug} onChange={(event) => set("slug", slugify(event.target.value))} />
              </Field>
              <Field label="Etiqueta">
                <select value={String(draft.etiqueta)} onChange={(event) => set("etiqueta", event.target.value as TravelService["etiqueta"])} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm">
                  {["Más vendido", "Popular", "Oferta", "Nuevo", "Más vendido"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </Field>
              <Field label="Categoría">
                <Input value={draft.categoria} onChange={(event) => set("categoria", event.target.value)} />
              </Field>
              <Field label="Duracion">
                <Input value={draft.duracion} onChange={(event) => set("duracion", event.target.value)} />
              </Field>
              <Field label="Dificultad">
                <Input value={draft.dificultad} onChange={(event) => set("dificultad", event.target.value)} />
              </Field>
              <Field label="Precio interno">
                <Input type="number" value={draft.precio ?? ""} onChange={(event) => set("precio", event.target.value ? Number(event.target.value) : null)} />
              </Field>
              <Field label="Moneda">
                <select value={draft.moneda} onChange={(event) => set("moneda", event.target.value as "PEN" | "USD")} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm">
                  <option>PEN</option>
                  <option>USD</option>
                </select>
              </Field>
              <Field label="Precio visible">
                <Input value={draft.precioTexto} onChange={(event) => set("precioTexto", event.target.value)} placeholder="Desde S/ 95 o Consultar" />
              </Field>
              <Field label="Reservas">
                <Input type="number" value={draft.reservas} onChange={(event) => set("reservas", Number(event.target.value))} />
              </Field>
              <Field label="Rating">
                <Input type="number" min={0} max={5} step={0.1} value={draft.rating} onChange={(event) => set("rating", Number(event.target.value))} />
              </Field>
              <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#F8F6F0] px-4 py-3 text-sm font-bold text-obsidian">
                <input type="checkbox" checked={draft.activo !== false} onChange={(event) => set("activo", event.target.checked)} />
                Estado activo
              </label>
            </div>

            <div className="grid gap-4 rounded-lg border border-black/10 bg-white p-5">
              <Field label="Descripcion corta">
                <Textarea value={draft.descripcionCorta} onChange={(event) => set("descripcionCorta", event.target.value)} />
              </Field>
              <Field label="Descripcion completa">
                <Textarea value={draft.descripcionCompleta} onChange={(event) => set("descripcionCompleta", event.target.value)} className="min-h-32" />
              </Field>
            </div>

            <div className="grid gap-4 rounded-lg border border-black/10 bg-white p-5 md:grid-cols-2">
              <Field label="Imagen principal URL">
                <Input value={draft.imagenPrincipal} onChange={(event) => set("imagenPrincipal", event.target.value)} />
              </Field>
              <Field label="Subir imagen principal">
                <span className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-obsidian px-5 text-sm font-bold text-ivory">
                  <Upload className="size-4" />
                  Seleccionar imagen
                  <input type="file" accept="image/*" className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => onUpload(event.target.files?.[0], "principal")} />
                </span>
              </Field>
              <Field label="Galeria, una URL por linea">
                <Textarea value={lines(draft.galeria)} onChange={(event) => set("galeria", toLines(event.target.value))} className="min-h-32" />
              </Field>
              <Field label="Agregar imagen a galeria">
                <span className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-obsidian px-5 text-sm font-bold text-ivory">
                  <Upload className="size-4" />
                  Subir a galeria
                  <input type="file" accept="image/*" className="sr-only" onChange={(event: ChangeEvent<HTMLInputElement>) => onUpload(event.target.files?.[0], "galeria")} />
                </span>
              </Field>
            </div>

            <div className="grid gap-4 rounded-lg border border-black/10 bg-white p-5 md:grid-cols-2">
              <Field label="Incluye, uno por linea">
                <Textarea value={lines(draft.incluye)} onChange={(event) => set("incluye", toLines(event.target.value))} />
              </Field>
              <Field label="No incluye, uno por linea">
                <Textarea value={lines(draft.noIncluye)} onChange={(event) => set("noIncluye", toLines(event.target.value))} />
              </Field>
              <Field label="Que llevar, uno por linea">
                <Textarea value={lines(draft.queLlevar)} onChange={(event) => set("queLlevar", toLines(event.target.value))} />
              </Field>
              <Field label="Recomendaciones, una por linea">
                <Textarea value={lines(draft.recomendaciones)} onChange={(event) => set("recomendaciones", toLines(event.target.value))} />
              </Field>
              <Field label="Preguntas frecuentes, una por linea">
                <Textarea value={lines(draft.preguntasFrecuentes)} onChange={(event) => set("preguntasFrecuentes", toLines(event.target.value))} />
              </Field>
              <Field label="Horarios disponibles, uno por linea">
                <Textarea value={lines(draft.horariosDisponibles)} onChange={(event) => set("horariosDisponibles", toLines(event.target.value))} />
              </Field>
              <Field label="Itinerario: Titulo | Descripcion">
                <Textarea value={itineraryToText(draft.itinerario)} onChange={(event) => set("itinerario", textToItinerary(event.target.value))} className="min-h-32" />
              </Field>
              <Field label="Mapa URL">
                <Textarea value={draft.mapaUrl} onChange={(event) => set("mapaUrl", event.target.value)} />
              </Field>
            </div>

            {draft.tipoServicio === "paquete" && (
              <div className="grid gap-4 rounded-lg border border-gold/25 bg-gold/10 p-5 md:grid-cols-2">
                <Field label="Días y noches">
                  <Input value={draft.diasNoches ?? draft.duracion} onChange={(event) => set("diasNoches", event.target.value)} />
                </Field>
                <Field label="Noches hotel">
                  <Input type="number" value={draft.nochesHotel ?? ""} onChange={(event) => set("nochesHotel", Number(event.target.value))} />
                </Field>
                <Field label="Categoría hotel">
                  <select value={draft.categoriaHotel ?? "3 estrellas"} onChange={(event) => set("categoriaHotel", event.target.value as EditableTravelService["categoriaHotel"])} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm">
                    {["2 estrellas", "3 estrellas", "4 estrellas", "5 estrellas"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="Precio neto">
                  <Input type="number" value={draft.precioNeto ?? ""} onChange={(event) => set("precioNeto", Number(event.target.value))} />
                </Field>
                <Field label="Comisión agencia">
                  <Input value={draft.comisionAgencia ?? ""} onChange={(event) => set("comisionAgencia", event.target.value)} />
                </Field>
                <Field label="Tarifa venta sugerida">
                  <Input value={draft.tarifaVentaSugerida ?? ""} onChange={(event) => set("tarifaVentaSugerida", event.target.value)} />
                </Field>
                <Field label="Servicios incluidos, uno por linea">
                  <Textarea value={lines(draft.serviciosIncluidos)} onChange={(event) => set("serviciosIncluidos", toLines(event.target.value))} />
                </Field>
                <Field label="Tabla de precios: Categoría | Neto | Comisión | Venta sugerida">
                  <Textarea value={priceTableToText(draft.tablaPreciosHotel)} onChange={(event) => set("tablaPreciosHotel", textToPriceTable(event.target.value))} />
                </Field>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicePreview({ service, onClose }: { service: EditableTravelService; onClose: () => void }) {
  return (
    <section className="rounded-lg border border-gold/25 bg-gold/10 p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Vista previa completa</p>
          <h3 className="mt-1 text-xl font-black text-obsidian">{service.nombre}</h3>
        </div>
        <Button type="button" variant="ghost" onClick={onClose}>Cerrar vista previa</Button>
      </div>
      <FullPreviewContent service={service} />
    </section>
  );
}

function FullPreviewContent({ service, compact = false }: { service: EditableTravelService; compact?: boolean }) {
  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
      <div className={cn("bg-cover bg-center", compact ? "h-44" : "h-72")} style={{ backgroundImage: `url("${service.imagenPrincipal}")` }} />
      <div className={cn("grid gap-6", compact ? "p-4" : "p-6 lg:grid-cols-[1.2fr_0.8fr]")}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-black text-obsidian">{service.etiqueta}</span>
            <span className="rounded-full bg-[#F8F6F0] px-3 py-1 text-xs font-bold text-charcoal/70">{service.rating}/5</span>
            <span className="rounded-full bg-[#F8F6F0] px-3 py-1 text-xs font-bold text-charcoal/70">{service.reservas} reservas</span>
          </div>
          <h3 className={cn("mt-3 font-black text-obsidian", compact ? "text-lg" : "text-3xl")}>{service.nombre}</h3>
          <p className="mt-3 text-sm leading-7 text-charcoal/70">{service.descripcionCompleta}</p>
          <div className={cn("mt-5 grid gap-3", compact ? "grid-cols-1" : "sm:grid-cols-3")}>
            {[service.duracion, service.dificultad, service.horariosDisponibles.join(", ")].map((item) => (
              <span key={item} className="rounded-lg bg-[#F8F6F0] p-3 text-sm font-black text-obsidian">{item}</span>
            ))}
          </div>
          {service.galeria.length > 0 && (
            <div className={cn("mt-5 grid gap-3", compact ? "grid-cols-2" : "grid-cols-3")}>
              {service.galeria.slice(0, compact ? 2 : 6).map((src) => <div key={src} className="h-24 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url("${src}")` }} />)}
            </div>
          )}
          <div className="mt-5 grid gap-3">
            {service.itinerario.map((step, index) => (
              <div key={`${step.titulo}-${index}`} className="rounded-lg bg-[#F8F6F0] p-4 text-sm">
                <strong className="text-obsidian">{index + 1}. {step.titulo}</strong>
                <p className="mt-1 text-charcoal/70">{step.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid content-start gap-5">
          <div className="rounded-lg bg-obsidian p-5 text-white">
            <p className="text-sm text-white/60">Precio</p>
            <p className="mt-1 text-3xl font-black text-gold-soft">{service.precioTexto}</p>
          </div>
          {service.tipoServicio === "paquete" && (
            <div className="rounded-lg border border-gold/25 bg-gold/10 p-4 text-sm text-charcoal/76">
              <h4 className="font-black text-obsidian">Datos del paquete</h4>
              <p className="mt-2">Dias/noches: {service.diasNoches || service.duracion}</p>
              <p>Categoría hotel: {service.categoriaHotel ?? "Consultar"}</p>
              <p>Precio neto: {service.precioNeto ? `${service.moneda} ${service.precioNeto}` : "Consultar"}</p>
              <p>Comisión: {service.comisionAgencia ?? "Consultar"}</p>
              <p>Venta sugerida: {service.tarifaVentaSugerida ?? "Consultar"}</p>
            </div>
          )}
          <PreviewList title="Incluye" items={service.incluye} />
          <PreviewList title="No incluye" items={service.noIncluye} />
          <PreviewList title="Que llevar" items={service.queLlevar} />
          <PreviewList title="Recomendaciones" items={service.recomendaciones} />
          <PreviewList title="Preguntas frecuentes" items={service.preguntasFrecuentes} />
        </div>
      </div>
    </div>
  );
}

function PreviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-black text-obsidian">{title}</h4>
      <ul className="mt-2 grid gap-2">
        {items.map((item) => <li key={item} className="rounded-lg bg-[#F8F6F0] p-3 text-sm text-charcoal/70">{item}</li>)}
      </ul>
    </div>
  );
}

function TariffHotelsManager({
  hotels,
  draft,
  editingIndex,
  onNew,
  onEdit,
  onToggle,
  onMove,
  onDelete,
  onDraft,
  onSave
}: {
  hotels: HotelRecord[];
  draft: HotelRecord | null;
  editingIndex: number | null;
  onNew: () => void;
  onEdit: (item: HotelRecord, index: number) => void;
  onToggle: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onDelete: (index: number) => void;
  onDraft: (item: HotelRecord | null) => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-6 grid gap-5">
      <Button type="button" variant="gold" className="w-fit" onClick={onNew}><Plus className="size-4" />Nueva categoría hotelera</Button>
      <div className="grid gap-4 md:grid-cols-2">
        {hotels.map((item, index) => (
          <article key={`${item.category}-${index}`} className="rounded-lg border border-black/10 bg-[#F8F6F0] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-black text-emerald">{statusOf(item.active)}</span>
                <h3 className="mt-3 font-black text-obsidian">{item.category}</h3>
                <p className="mt-1 text-sm font-bold text-charcoal/66">USD {item.priceRange}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => onEdit(item, index)}><Pencil className="size-4" /></Button>
                <Button size="icon" variant="ghost" aria-label="Subir orden" onClick={() => onMove(index, -1)}><ArrowUp className="size-4" /></Button>
                <Button size="icon" variant="ghost" aria-label="Bajar orden" onClick={() => onMove(index, 1)}><ArrowDown className="size-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => onToggle(index)}>{item.active === false ? "Activar" : "Desactivar"}</Button>
                <Button size="icon" variant="ghost" onClick={() => window.confirm("Eliminar categoria?") && onDelete(index)}><Trash2 className="size-4 text-red-600" /></Button>
              </div>
            </div>
            <ul className="mt-3 grid gap-1 text-sm text-charcoal/70">
              {item.hotels.map((hotel) => <li key={hotel}>{hotel}</li>)}
            </ul>
          </article>
        ))}
      </div>
      {draft && (
        <div className="rounded-lg border border-gold/25 bg-gold/10 p-5">
          <h3 className="font-black text-obsidian">{editingIndex === null ? "Nueva categoria" : "Editar categoria"}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Categoría"><Input value={draft.category} onChange={(event) => onDraft({ ...draft, category: event.target.value })} /></Field>
            <Field label="Rango de precio"><Input value={draft.priceRange} onChange={(event) => onDraft({ ...draft, priceRange: event.target.value })} /></Field>
            <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-obsidian"><input type="checkbox" checked={draft.active !== false} onChange={(event) => onDraft({ ...draft, active: event.target.checked })} />Activo</label>
            <Field label="Hoteles, uno por linea"><Textarea value={lines(draft.hotels)} onChange={(event) => onDraft({ ...draft, hotels: toLines(event.target.value) })} className="md:col-span-3" /></Field>
          </div>
          <Button type="button" variant="gold" className="mt-4" onClick={onSave}>Guardar categoria</Button>
        </div>
      )}
    </div>
  );
}

function FeedManager({
  feed,
  draft,
  editingIndex,
  onNew,
  onEdit,
  onToggle,
  onMove,
  onDelete,
  onDraft,
  onSave
}: {
  feed: FeedRecord[];
  draft: FeedRecord | null;
  editingIndex: number | null;
  onNew: () => void;
  onEdit: (item: FeedRecord, index: number) => void;
  onToggle: (index: number) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onDelete: (index: number) => void;
  onDraft: (item: FeedRecord | null) => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-6 grid gap-5">
      <Button type="button" variant="gold" className="w-fit" onClick={onNew}><Plus className="size-4" />Nuevo item</Button>
      <div className="grid gap-4 md:grid-cols-2">
        {feed.map((item, index) => (
          <article key={`${item.service}-${index}`} className="rounded-lg border border-black/10 bg-[#F8F6F0] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-black text-emerald">{statusOf(item.active)}</span>
                <h3 className="mt-3 font-black text-obsidian">{item.service}</h3>
                <p className="mt-2 text-sm leading-6 text-charcoal/70">{item.includes}</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => onEdit(item, index)}><Pencil className="size-4" /></Button>
                <Button size="icon" variant="ghost" aria-label="Subir orden" onClick={() => onMove(index, -1)}><ArrowUp className="size-4" /></Button>
                <Button size="icon" variant="ghost" aria-label="Bajar orden" onClick={() => onMove(index, 1)}><ArrowDown className="size-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => onToggle(index)}>{item.active === false ? "Activar" : "Desactivar"}</Button>
                <Button size="icon" variant="ghost" onClick={() => window.confirm("Eliminar item?") && onDelete(index)}><Trash2 className="size-4 text-red-600" /></Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {draft && (
        <div className="rounded-lg border border-gold/25 bg-gold/10 p-5">
          <h3 className="font-black text-obsidian">{editingIndex === null ? "Nuevo item" : "Editar item"}</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Servicio"><Input value={draft.service} onChange={(event) => onDraft({ ...draft, service: event.target.value })} /></Field>
            <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-obsidian"><input type="checkbox" checked={draft.active !== false} onChange={(event) => onDraft({ ...draft, active: event.target.checked })} />Activo</label>
            <Field label="Incluye"><Textarea value={draft.includes} onChange={(event) => onDraft({ ...draft, includes: event.target.value })} className="md:col-span-2" /></Field>
          </div>
          <Button type="button" variant="gold" className="mt-4" onClick={onSave}>Guardar item</Button>
        </div>
      )}
    </div>
  );
}

function PoliciesManager({
  tariff,
  reservationDraft,
  cancellationDraft,
  editingReservationIndex,
  editingCancellationIndex,
  onReservationDraft,
  onCancellationDraft,
  onEditReservation,
  onDeleteReservation,
  onSaveReservation,
  onNewCancellation,
  onEditCancellation,
  onDeleteCancellation,
  onSaveCancellation
}: {
  tariff: Tariff;
  reservationDraft: string;
  cancellationDraft: CancellationRecord | null;
  editingReservationIndex: number | null;
  editingCancellationIndex: number | null;
  onReservationDraft: (value: string) => void;
  onCancellationDraft: (value: CancellationRecord | null) => void;
  onEditReservation: (value: string, index: number) => void;
  onDeleteReservation: (index: number) => void;
  onSaveReservation: () => void;
  onNewCancellation: () => void;
  onEditCancellation: (value: CancellationRecord, index: number) => void;
  onDeleteCancellation: (index: number) => void;
  onSaveCancellation: () => void;
}) {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="grid content-start gap-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-black text-obsidian">Políticas de reserva</h3>
          <Button type="button" size="sm" variant="gold" onClick={() => onReservationDraft("")}><Plus className="size-4" />Nueva</Button>
        </div>
        {tariff.reservationPolicies.map((item, index) => (
          <article key={`${getReservationText(item)}-${index}`} className="rounded-lg bg-[#F8F6F0] p-4">
            <p className="text-sm leading-6 text-charcoal/72">{getReservationText(item)}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => onEditReservation(getReservationText(item), index)}><Pencil className="size-4" />Editar</Button>
              <Button size="sm" variant="ghost" onClick={() => window.confirm("Eliminar politica?") && onDeleteReservation(index)}><Trash2 className="size-4 text-red-600" />Eliminar</Button>
            </div>
          </article>
        ))}
        {(reservationDraft || editingReservationIndex !== null) && (
          <div className="rounded-lg border border-gold/25 bg-gold/10 p-4">
            <Field label="Política"><Textarea value={reservationDraft} onChange={(event) => onReservationDraft(event.target.value)} /></Field>
            <Button type="button" variant="gold" className="mt-3" onClick={onSaveReservation}>Guardar politica</Button>
          </div>
        )}
      </div>

      <div className="grid content-start gap-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-black text-obsidian">Cancelaciónes y reembolsos</h3>
          <Button type="button" size="sm" variant="gold" onClick={onNewCancellation}><Plus className="size-4" />Nueva</Button>
        </div>
        {tariff.cancellationPolicies.map((item, index) => (
          <article key={`${item.period}-${index}`} className="rounded-lg bg-[#F8F6F0] p-4">
            <h4 className="font-black text-obsidian">{item.period}</h4>
            <p className="mt-2 text-sm leading-6 text-charcoal/72">{item.charge}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => onEditCancellation(item, index)}><Pencil className="size-4" />Editar</Button>
              <Button size="sm" variant="ghost" onClick={() => window.confirm("Eliminar condicion?") && onDeleteCancellation(index)}><Trash2 className="size-4 text-red-600" />Eliminar</Button>
            </div>
          </article>
        ))}
        {cancellationDraft && (
          <div className="rounded-lg border border-gold/25 bg-gold/10 p-4">
            <div className="grid gap-4">
              <Field label="Periodo"><Input value={cancellationDraft.period} onChange={(event) => onCancellationDraft({ ...cancellationDraft, period: event.target.value })} /></Field>
              <Field label="Cargo"><Textarea value={cancellationDraft.charge} onChange={(event) => onCancellationDraft({ ...cancellationDraft, charge: event.target.value })} /></Field>
            </div>
            <Button type="button" variant="gold" className="mt-3" onClick={onSaveCancellation}>{editingCancellationIndex === null ? "Crear condicion" : "Guardar condicion"}</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function LegalManager({ value, onChange }: { value: NonNullable<Tariff["legalInfo"]>; onChange: (value: NonNullable<Tariff["legalInfo"]>) => void }) {
  return (
    <div className="mt-6 rounded-lg border border-black/10 bg-[#F8F6F0] p-5">
      <label className="flex items-center gap-3 text-sm font-bold text-obsidian"><input type="checkbox" checked={value.active !== false} onChange={(event) => onChange({ ...value, active: event.target.checked })} />Información legal activa</label>
      <Field label="Items legales, uno por linea">
        <Textarea value={lines(value.items)} onChange={(event) => onChange({ ...value, items: toLines(event.target.value) })} className="mt-4 min-h-52" />
      </Field>
    </div>
  );
}

function ContactManager({ value, onChange }: { value: NonNullable<Tariff["contactInfo"]>; onChange: (value: NonNullable<Tariff["contactInfo"]>) => void }) {
  return (
    <div className="mt-6 grid gap-4 rounded-lg border border-black/10 bg-[#F8F6F0] p-5 md:grid-cols-2">
      <label className="flex items-center gap-3 text-sm font-bold text-obsidian md:col-span-2"><input type="checkbox" checked={value.active !== false} onChange={(event) => onChange({ ...value, active: event.target.checked })} />Contacto activo</label>
      <Field label="Dirección"><Input value={value.address} onChange={(event) => onChange({ ...value, address: event.target.value })} /></Field>
      <Field label="Teléfono"><Input value={value.phone} onChange={(event) => onChange({ ...value, phone: event.target.value })} /></Field>
      <Field label="WhatsApp"><Input value={value.whatsapp} onChange={(event) => onChange({ ...value, whatsapp: event.target.value })} /></Field>
      <Field label="Correo"><Input value={value.email} onChange={(event) => onChange({ ...value, email: event.target.value })} /></Field>
      <Field label="Web"><Input value={value.website} onChange={(event) => onChange({ ...value, website: event.target.value })} /></Field>
      <Field label="Redes sociales, una por linea"><Textarea value={lines(value.socials)} onChange={(event) => onChange({ ...value, socials: toLines(event.target.value) })} /></Field>
    </div>
  );
}

function AdvancedJson({
  servicesJson,
  tariffJson,
  onServicesJson,
  onTariffJson,
  onApplyServices,
  onApplyTariff,
  onExportServices,
  onExportTariff,
  onImportServices,
  onImportTariff,
  onRestore
}: {
  servicesJson: string;
  tariffJson: string;
  onServicesJson: (value: string) => void;
  onTariffJson: (value: string) => void;
  onApplyServices: () => void;
  onApplyTariff: () => void;
  onExportServices: () => void;
  onExportTariff: () => void;
  onImportServices: (file?: File) => void;
  onImportTariff: (file?: File) => void;
  onRestore: () => void;
}) {
  return (
    <div className="mt-6 grid gap-5">
      <div className="rounded-lg border border-gold/25 bg-gold/10 p-4 text-sm leading-7 text-charcoal/72">
        <strong className="text-obsidian">Herramienta avanzada:</strong> usa JSON solo para respaldo, migracion o recuperacion. El flujo principal del administrador esta en los formularios visuales.
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="default" onClick={onExportServices}><Download className="size-4" />Exportar servicios</Button>
        <Button type="button" variant="default" onClick={onExportTariff}><Download className="size-4" />Exportar tarifario</Button>
        <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-obsidian px-6 text-sm font-semibold text-ivory shadow-sm">
          <Upload className="size-4" />Importar servicios
          <input type="file" accept="application/json" className="sr-only" onChange={(event) => onImportServices(event.target.files?.[0])} />
        </label>
        <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-obsidian px-6 text-sm font-semibold text-ivory shadow-sm">
          <Upload className="size-4" />Importar tarifario
          <input type="file" accept="application/json" className="sr-only" onChange={(event) => onImportTariff(event.target.files?.[0])} />
        </label>
        <Button type="button" variant="ghost" onClick={onRestore}><RotateCcw className="size-4" />Restaurar base</Button>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-black text-obsidian">Servicios JSON</h3>
            <Button type="button" size="sm" variant="gold" onClick={onApplyServices}>Aplicar</Button>
          </div>
          <Textarea value={servicesJson} onChange={(event) => onServicesJson(event.target.value)} className="min-h-[520px] font-mono text-xs leading-6" spellCheck={false} />
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-black text-obsidian">Tarifario JSON</h3>
            <Button type="button" size="sm" variant="gold" onClick={onApplyTariff}>Aplicar</Button>
          </div>
          <Textarea value={tariffJson} onChange={(event) => onTariffJson(event.target.value)} className="min-h-[520px] font-mono text-xs leading-6" spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
