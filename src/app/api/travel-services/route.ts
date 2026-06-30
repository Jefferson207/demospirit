import { NextResponse } from "next/server";
import { defaultAdminContent, type AdminContent } from "@/lib/admin-content";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getJson, setJson } from "@/lib/server/upstash";
import { serviceImages, travelServices, type ItineraryStep, type TravelService } from "@/lib/travel-services";

const key = "spirit-qosqo:travel-services";
const adminContentKey = "spirit-qosqo:admin-content";

function text(record: Record<string, unknown>, field: string, fallback = "") {
  const value = record[field];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function lines(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value !== "string") return fallback;
  const items = value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  return items.length ? items : fallback;
}

function numberValue(value: unknown) {
  const number = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(number) && number > 0 ? number : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function itineraryFrom(value: unknown): ItineraryStep[] {
  const items = lines(value);
  if (!items.length) {
    return [
      { titulo: "Coordinacion", descripcion: "Confirmacion de horarios y servicios antes de la salida." },
      { titulo: "Experiencia", descripcion: "Servicio turistico segun programa confirmado." },
      { titulo: "Retorno", descripcion: "Finalizacion y asistencia por canales digitales." }
    ];
  }

  return items.map((item, index) => {
    const [title, ...description] = item.split(":");
    return {
      titulo: description.length ? title.trim() : `Dia ${index + 1}`,
      descripcion: (description.length ? description.join(":") : item).trim()
    };
  });
}

function serviceFromAdminRecord(record: Record<string, unknown>, tipoServicio: TravelService["tipoServicio"], index: number): TravelService | null {
  if (record.status === "Inactivo") return null;

  const nombre = text(record, "name", `Servicio ${index + 1}`);
  const basePrice = numberValue(record.offerPriceUsd) ?? numberValue(record.basePriceUsd);
  const mainImage = text(record, "mainImage", tipoServicio === "paquete" ? serviceImages.machu : serviceImages.cusco);
  const destination = text(record, "destination", text(record, "category", "Cusco"));
  const mapUrl = text(record, "mapUrl", `https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`);

  return {
    nombre,
    slug: text(record, "slug", slugify(nombre)),
    categoria: text(record, "category", tipoServicio === "paquete" ? "Paquete turistico" : "Tour"),
    etiqueta: index === 0 ? "Popular" : "Nuevo",
    descripcionCorta: text(record, "shortDescription", text(record, "description", "Experiencia turistica disponible previa confirmacion.")),
    descripcionCompleta: text(record, "description", text(record, "shortDescription", "Experiencia turistica disponible previa confirmacion.")),
    duracion: text(record, "duration", "Consultar"),
    dificultad: text(record, "difficulty", "Moderado"),
    precio: basePrice,
    moneda: "USD",
    precioTexto: basePrice ? `Desde USD ${basePrice}` : "Consultar",
    reservas: Number(record.reservationsCount ?? 0),
    rating: 5,
    incluye: lines(record.includes ?? record.toursIncluded, ["Servicio coordinado", "Asistencia por WhatsApp"]),
    noIncluye: lines(record.excludes, ["Gastos personales"]),
    queLlevar: lines(record.bring, ["Documento", "Ropa comoda", "Efectivo"]),
    recomendaciones: lines(record.policies, ["Confirmar disponibilidad antes del pago"]),
    itinerario: itineraryFrom(record.itinerary),
    imagenPrincipal: mainImage,
    galeria: lines(record.gallery, [mainImage]),
    mapaUrl: mapUrl,
    horariosDisponibles: ["Segun disponibilidad"],
    tipoServicio,
    preguntasFrecuentes: lines(record.faqs, ["La disponibilidad se confirma antes del pago."]),
    serviciosIncluidos: lines(record.services ?? record.includes)
  };
}

function servicesFromAdminContent(content: AdminContent) {
  const tours = (Array.isArray(content.tours) ? content.tours : [])
    .map((record, index) => serviceFromAdminRecord(record, "tour", index))
    .filter((service): service is TravelService => Boolean(service));

  const packages = (Array.isArray(content.packages) ? content.packages : [])
    .map((record, index) => serviceFromAdminRecord(record, "paquete", index))
    .filter((service): service is TravelService => Boolean(service));

  return [...tours, ...packages];
}

export async function GET() {
  const storedServices = await getJson<TravelService[]>(key, travelServices).catch(() => travelServices);
  const adminContent = await getJson<AdminContent>(adminContentKey, defaultAdminContent).catch(() => null);
  const adminServices = adminContent ? servicesFromAdminContent(adminContent) : [];

  if (adminServices.length > 0) {
    return NextResponse.json({ services: adminServices });
  }

  try {
    return NextResponse.json({ services: storedServices });
  } catch (error) {
    return NextResponse.json({ services: travelServices, warning: error instanceof Error ? error.message : "Unknown error" });
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  try {
    const services = (await request.json()) as TravelService[];
    await setJson(key, services);
    return NextResponse.json({ ok: true, services });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save services" },
      { status: 500 }
    );
  }
}
