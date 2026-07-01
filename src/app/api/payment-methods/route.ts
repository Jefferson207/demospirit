import { NextResponse } from "next/server";
import { defaultAdminContent, type AdminContent } from "@/lib/admin-content";
import { company } from "@/lib/company";
import { getJson } from "@/lib/server/upstash";

const adminContentKey = "spirit-qosqo:admin-content";

function lines(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value !== "string") return [];
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function fieldsFrom(value: unknown) {
  return lines(value).map((item) => {
    const [label, ...rest] = item.split(":");
    return [label.trim(), rest.join(":").trim() || "Por completar"] as [string, string];
  });
}

export async function GET() {
  const content = await getJson<AdminContent>(adminContentKey, defaultAdminContent).catch(() => defaultAdminContent);
  const paymentMethods = Array.isArray(content.paymentMethods) ? content.paymentMethods : [];

  const methods = paymentMethods
    .filter((item) => item.status !== "Inactivo")
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0))
    .map((item) => {
      const fields = fieldsFrom(item.fieldRows);

      return {
        title: String(item.name ?? "Medio de pago"),
        logo: String(item.logo ?? ""),
        description: String(item.description ?? ""),
        fields: fields.length ? fields : [["Titular", company.legalName]]
      };
    });

  return NextResponse.json({ methods });
}
