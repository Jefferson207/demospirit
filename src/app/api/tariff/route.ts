import { NextResponse } from "next/server";
import { defaultTariff } from "@/lib/tariff";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getJson, setJson } from "@/lib/server/upstash";

const key = "spirit-qosqo:tariff";

export async function GET() {
  try {
    const tariff = await getJson(key, defaultTariff);
    return NextResponse.json({ tariff });
  } catch (error) {
    return NextResponse.json({ tariff: defaultTariff, warning: error instanceof Error ? error.message : "Unknown error" });
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  try {
    const tariff = await request.json();
    await setJson(key, tariff);
    return NextResponse.json({ ok: true, tariff });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save tariff" },
      { status: 500 }
    );
  }
}
