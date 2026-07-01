import { NextResponse } from "next/server";
import { defaultAdminContent, type AdminContent } from "@/lib/admin-content";
import { getJson } from "@/lib/server/upstash";

const adminContentKey = "spirit-qosqo:admin-content";

function lines(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value !== "string") return [];
  return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
}

function numberValue(value: unknown) {
  const number = Number(String(value ?? "").replace(/,/g, ""));
  return Number.isFinite(number) && number > 0 ? number : 0;
}

export async function GET() {
  const content = await getJson<AdminContent>(adminContentKey, defaultAdminContent).catch(() => defaultAdminContent);
  const hotels = (Array.isArray(content.hotels) ? content.hotels : [])
    .filter((item) => item.status !== "Inactivo")
    .map((item) => ({
      id: String(item.id ?? item.name ?? crypto.randomUUID()),
      name: String(item.name ?? "Hotel"),
      category: String(item.category ?? "3 estrellas"),
      city: String(item.city ?? "Cusco"),
      price: numberValue(item.nightlyPriceUsd),
      description: String(item.description ?? ""),
      services: lines(item.services),
      address: String(item.address ?? ""),
      image: String(item.mainImage ?? "")
    }));

  return NextResponse.json({ hotels });
}
