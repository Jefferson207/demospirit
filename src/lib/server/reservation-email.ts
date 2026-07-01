import nodemailer from "nodemailer";
import type { AdminReservation } from "@/lib/admin-content";
import { company } from "@/lib/company";

type EmailResult = {
  sent: boolean;
  warning?: string;
};

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function reservationText(reservation: AdminReservation) {
  return [
    `Nueva reserva generada: ${reservation.code}`,
    "",
    `Estado: ${reservation.status}`,
    `Metodo: ${reservation.method}`,
    "",
    `Cliente: ${reservation.clientName} ${reservation.clientLastName}`,
    `Correo: ${reservation.email}`,
    `WhatsApp: ${reservation.whatsapp}`,
    `Pais: ${reservation.country}`,
    "",
    `Tour / paquete: ${reservation.tour}`,
    `Fecha: ${reservation.date}`,
    `Adultos: ${reservation.adults}`,
    `Ninos: ${reservation.children}`,
    `Bebes: ${reservation.babies}`,
    `Hotel: ${reservation.hotel || "No aplica"}`,
    `Extras: ${reservation.extras.length ? reservation.extras.join(", ") : "Sin extras"}`,
    "",
    `Precio base: USD ${reservation.basePrice}`,
    `Extras: USD ${reservation.extrasPrice}`,
    `Subtotal: USD ${reservation.subtotal}`,
    `Impuestos: USD ${reservation.taxes}`,
    `Total: USD ${reservation.total}`,
    "",
    `Comentarios: ${reservation.observations || "Sin comentarios"}`,
    "",
    "Esta reserva ya fue guardada en el admin."
  ].join("\n");
}

export async function sendReservationEmail(reservation: AdminReservation): Promise<EmailResult> {
  if (!smtpConfigured()) {
    return { sent: false, warning: "SMTP no configurado." };
  }

  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = String(process.env.SMTP_SECURE ?? "").toLowerCase() === "true" || port === 465;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || company.email;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from,
    to: company.email,
    replyTo: reservation.email || undefined,
    subject: `Nueva reserva ${reservation.code} - ${reservation.clientName} ${reservation.clientLastName}`,
    text: reservationText(reservation)
  });

  return { sent: true };
}
