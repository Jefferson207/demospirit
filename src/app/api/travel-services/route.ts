import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getJson, setJson } from "@/lib/server/upstash";
import { travelServices, type TravelService } from "@/lib/travel-services";

const key = "spirit-qosqo:travel-services";

export async function GET() {
  try {
    const services = await getJson<TravelService[]>(key, travelServices);
    return NextResponse.json({ services });
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
