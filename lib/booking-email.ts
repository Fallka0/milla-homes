import nodemailer from "nodemailer";

import { getInquiryEmailConfig, type InquiryEmailConfig } from "@/lib/inquiry-email";
import { resolvePublicLocale } from "@/lib/public-copy";

type TourRequestEmailInput = {
  clientEmail: string;
  clientName: string;
  clientPhone: string;
  locale: string;
  notes: string;
  propertyTitle: string;
  tourDate: string;
  tourTime: string;
};

type TourConfirmationEmailInput = {
  clientEmail: string;
  clientName: string;
  locale: string;
  propertyTitle: string;
  tourDate: string;
  tourTime: string;
};

const confirmationCopy = {
  en: {
    subject: (property: string) => `Your tour is confirmed: ${property}`,
    greeting: (name: string) => `Hello ${name},`,
    body: (property: string, date: string, time: string) =>
      `Your tour of ${property} is confirmed for ${date}${time ? ` at ${time}` : ""}. We look forward to seeing you!`,
    signoff: "Kind regards,\nMilla Homes",
  },
  es: {
    subject: (property: string) => `Tu visita está confirmada: ${property}`,
    greeting: (name: string) => `Hola ${name}:`,
    body: (property: string, date: string, time: string) =>
      `Tu visita a ${property} está confirmada para el ${date}${time ? ` a las ${time}` : ""}. ¡Te esperamos!`,
    signoff: "Un saludo,\nMilla Homes",
  },
  ru: {
    subject: (property: string) => `Ваш просмотр подтверждён: ${property}`,
    greeting: (name: string) => `Здравствуйте, ${name}!`,
    body: (property: string, date: string, time: string) =>
      `Ваш просмотр объекта ${property} подтверждён на ${date}${time ? ` в ${time}` : ""}. Ждём вас!`,
    signoff: "С уважением,\nMilla Homes",
  },
  de: {
    subject: (property: string) => `Ihre Besichtigung ist bestätigt: ${property}`,
    greeting: (name: string) => `Hallo ${name},`,
    body: (property: string, date: string, time: string) =>
      `Ihre Besichtigung von ${property} ist für den ${date}${time ? ` um ${time}` : ""} bestätigt. Wir freuen uns auf Sie!`,
    signoff: "Mit freundlichen Grüßen\nMilla Homes",
  },
} as const;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createTransport(config: InquiryEmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });
}

export async function sendTourRequestAdminEmail(input: TourRequestEmailInput) {
  const config = getInquiryEmailConfig();

  if (!config || config.to.length === 0) {
    return { ok: false as const, reason: "missing-config" as const };
  }

  const lines = [
    "New tour request",
    "",
    `Property: ${input.propertyTitle}`,
    `Preferred date: ${input.tourDate}`,
    `Preferred time: ${input.tourTime || "Not provided"}`,
    "",
    `Name: ${input.clientName}`,
    `Email: ${input.clientEmail}`,
    `Phone: ${input.clientPhone || "Not provided"}`,
    `Locale: ${input.locale}`,
    "",
    "Notes:",
    input.notes || "None",
    "",
    "Confirm or decline this request in the admin bookings calendar.",
  ];

  const html = `
    <div style="font-family: Arial, sans-serif; color: #163728; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">New tour request</h2>
      <p style="margin: 0 0 8px;"><strong>Property:</strong> ${escapeHtml(input.propertyTitle)}</p>
      <p style="margin: 0 0 8px;"><strong>Preferred date:</strong> ${escapeHtml(input.tourDate)}</p>
      <p style="margin: 0 0 16px;"><strong>Preferred time:</strong> ${escapeHtml(input.tourTime || "Not provided")}</p>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(input.clientName)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(input.clientEmail)}</p>
      <p style="margin: 0 0 16px;"><strong>Phone:</strong> ${escapeHtml(input.clientPhone || "Not provided")}</p>
      <p style="margin: 0 0 8px;"><strong>Notes:</strong></p>
      <div style="padding: 16px; border-radius: 16px; background: #f5efe4; white-space: pre-wrap;">${escapeHtml(
        input.notes || "None",
      )}</div>
      <p style="margin: 16px 0 0;">Confirm or decline this request in the admin bookings calendar.</p>
    </div>
  `;

  try {
    await createTransport(config).sendMail({
      from: config.from,
      to: config.to,
      replyTo: input.clientEmail,
      subject: `New tour request: ${input.propertyTitle}`,
      text: lines.join("\n"),
      html,
    });

    return { ok: true as const };
  } catch (error) {
    console.error("Failed to send tour request email", error);
    return { ok: false as const, reason: "send-failed" as const };
  }
}

export async function sendTourConfirmationEmail(input: TourConfirmationEmailInput) {
  const config = getInquiryEmailConfig();

  if (!config) {
    return { ok: false as const, reason: "missing-config" as const };
  }

  const copy = confirmationCopy[resolvePublicLocale(input.locale)];
  const text = [
    copy.greeting(input.clientName),
    "",
    copy.body(input.propertyTitle, input.tourDate, input.tourTime),
    "",
    copy.signoff,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #163728; line-height: 1.6;">
      <p style="margin: 0 0 16px;">${escapeHtml(copy.greeting(input.clientName))}</p>
      <p style="margin: 0 0 16px;">${escapeHtml(copy.body(input.propertyTitle, input.tourDate, input.tourTime))}</p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(copy.signoff)}</p>
    </div>
  `;

  try {
    await createTransport(config).sendMail({
      from: config.from,
      to: input.clientEmail,
      subject: copy.subject(input.propertyTitle),
      text,
      html,
    });

    return { ok: true as const };
  } catch (error) {
    console.error("Failed to send tour confirmation email", error);
    return { ok: false as const, reason: "send-failed" as const };
  }
}
