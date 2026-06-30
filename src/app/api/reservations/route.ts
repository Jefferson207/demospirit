import { NextResponse } from "next/server";
import { defaultAdminContent, type AdminContent, type AdminReservation } from "@/lib/admin-content";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getJson, setJson } from "@/lib/server/upstash";

const key = "spirit-qosqo:admin-content";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  try {
    const content = await getJson<AdminContent>(key, defaultAdminContent);
    return NextResponse.json({ reservations: content.reservations });
  } catch (error) {
    return NextResponse.json(
      { reservations: [], warning: error instanceof Error ? error.message : "Unknown error" },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<AdminReservation>;
    const content = await getJson<AdminContent>(key, defaultAdminContent);
    const reservation: AdminReservation = {
      id: crypto.randomUUID(),
      code: `SQ-${Date.now().toString().slice(-7)}`,
      clientName: payload.clientName ?? "",
      clientLastName: payload.clientLastName ?? "",
      email: payload.email ?? "",
      whatsapp: payload.whatsapp ?? "",
      country: payload.country ?? "",
      tour: payload.tour ?? "",
      packageName: payload.packageName ?? "",
      date: payload.date ?? "",
      adults: Number(payload.adults ?? 0),
      children: Number(payload.children ?? 0),
      babies: Number(payload.babies ?? 0),
      hotel: payload.hotel ?? "",
      extras: payload.extras ?? [],
      basePrice: Number(payload.basePrice ?? 0),
      extrasPrice: Number(payload.extrasPrice ?? 0),
      subtotal: Number(payload.subtotal ?? 0),
      discount: Number(payload.discount ?? 0),
      taxes: Number(payload.taxes ?? 0),
      total: Number(payload.total ?? 0),
      status: "Pendiente",
      method: payload.method ?? "WhatsApp",
      observations: payload.observations ?? "",
      history: [`Reserva creada desde la web - ${new Date().toLocaleString("es-PE")}`],
      createdAt: new Date().toISOString()
    };

    const nextContent = {
      ...content,
      reservations: [reservation, ...content.reservations]
    };

    await setJson(key, nextContent);
    return NextResponse.json({ ok: true, reservation });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create reservation" },
      { status: 500 }
    );
  }
}
