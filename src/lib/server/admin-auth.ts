import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const adminCookieName = "spirit_qosqo_admin";
const sessionHours = 8;

function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword() || "local-session";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function secureCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateAdminCredentials(username: string, password: string) {
  const configuredUser = getAdminUsername();
  const configuredPassword = getAdminPassword();

  if (!configuredPassword) return false;
  return secureCompare(username, configuredUser) && secureCompare(password, configuredPassword);
}

export function createAdminToken(username = getAdminUsername()) {
  const expiresAt = Date.now() + sessionHours * 60 * 60 * 1000;
  const payload = `${username}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token) return false;

  const [username, expiresAt, signature] = token.split(".");
  if (!username || !expiresAt || !signature) return false;
  if (username !== getAdminUsername()) return false;

  const expires = Number(expiresAt);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const payload = `${username}.${expiresAt}`;
  const expectedSignature = sign(payload);
  return secureCompare(signature, expectedSignature);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(adminCookieName)?.value);
}

export function isAdminRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${adminCookieName}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  return verifyAdminToken(token ? decodeURIComponent(token) : null);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionHours * 60 * 60
  };
}
