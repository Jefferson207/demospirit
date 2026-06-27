import { NextResponse } from "next/server";
import { adminCookieName, adminCookieOptions, createAdminToken, validateAdminCredentials } from "@/lib/server/admin-auth";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as { username?: string; password?: string };

    if (!username || !password || !validateAdminCredentials(username, password)) {
      return NextResponse.json({ ok: false, error: "Usuario o contrasena incorrectos." }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookieName, createAdminToken(username), adminCookieOptions());

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "No se pudo iniciar sesion." }, { status: 400 });
  }
}
