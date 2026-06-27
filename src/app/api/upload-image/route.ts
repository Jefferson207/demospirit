import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  const uploadUrl = process.env.CPANEL_UPLOAD_URL;
  const uploadToken = process.env.CPANEL_UPLOAD_TOKEN;

  if (!uploadUrl || !uploadToken) {
    return NextResponse.json({ ok: false, error: "Upload service is not configured." }, { status: 500 });
  }

  try {
    const incoming = await request.formData();
    const file = incoming.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "File is required." }, { status: 400 });
    }

    const outgoing = new FormData();
    outgoing.append("file", file);
    outgoing.append("token", uploadToken);

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${uploadToken}`,
        "X-Upload-Token": uploadToken
      },
      body: outgoing,
      cache: "no-store"
    });

    const contentType = response.headers.get("content-type") ?? "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : { body: await response.text() };

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: "Upload failed.", payload }, { status: response.status });
    }

    return NextResponse.json({ ok: true, payload });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to upload image" },
      { status: 500 }
    );
  }
}
