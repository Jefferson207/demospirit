import { NextResponse } from "next/server";
import { defaultAdminContent, type AdminContent } from "@/lib/admin-content";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { getJson, setJson } from "@/lib/server/upstash";

const key = "spirit-qosqo:admin-content";

export async function GET() {
  try {
    const content = await getJson<AdminContent>(key, defaultAdminContent);
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ content: defaultAdminContent, warning: error instanceof Error ? error.message : "Unknown error" });
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  try {
    const content = (await request.json()) as AdminContent;
    await setJson(key, content);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save admin content" },
      { status: 500 }
    );
  }
}
