import nodemailer from "nodemailer";

type InquiryEmailInput = {
  email: string;
  locale: string;
  message: string;
  name: string;
  phone: string;
  propertyTitle: string;
  timeline?: string;
};

export type InquiryEmailConfig = {
  from: string;
  host: string;
  password: string;
  port: number;
  secure: boolean;
  to: string[];
  user: string;
};

export function getInquiryEmailConfig(): InquiryEmailConfig | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const to = process.env.INQUIRY_EMAIL_TO;
  const from = process.env.INQUIRY_EMAIL_FROM ?? user;
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = (process.env.SMTP_SECURE ?? "true").toLowerCase() !== "false";

  if (!host || !user || !password || !to || !from || !Number.isFinite(port)) {
    return null;
  }

  return {
    from,
    host,
    password,
    port,
    secure,
    to: to
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
    user,
  };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildTextBody(input: InquiryEmailInput) {
  return [
    "New Milla Homes inquiry",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "Not provided"}`,
    `Preferred viewing time: ${input.timeline || "Not provided"}`,
    `Locale: ${input.locale}`,
    `Property: ${input.propertyTitle || "General inquiry"}`,
    "",
    "Message:",
    input.message,
  ].join("\n");
}

function buildHtmlBody(input: InquiryEmailInput) {
  return `
    <div style="font-family: Arial, sans-serif; color: #163728; line-height: 1.6;">
      <h2 style="margin: 0 0 16px;">New Milla Homes inquiry</h2>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${escapeHtml(input.phone || "Not provided")}</p>
      <p style="margin: 0 0 8px;"><strong>Preferred viewing time:</strong> ${escapeHtml(input.timeline || "Not provided")}</p>
      <p style="margin: 0 0 8px;"><strong>Locale:</strong> ${escapeHtml(input.locale)}</p>
      <p style="margin: 0 0 16px;"><strong>Property:</strong> ${escapeHtml(
        input.propertyTitle || "General inquiry",
      )}</p>
      <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
      <div style="padding: 16px; border-radius: 16px; background: #f5efe4; white-space: pre-wrap;">${escapeHtml(
        input.message,
      )}</div>
    </div>
  `;
}

export function isInquiryEmailConfigured() {
  return Boolean(getInquiryEmailConfig());
}

export async function sendInquiryEmail(input: InquiryEmailInput) {
  const config = getInquiryEmailConfig();

  if (!config || config.to.length === 0) {
    return { ok: false as const, reason: "missing-config" as const };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  try {
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: input.email,
      subject: input.propertyTitle
        ? `New inquiry: ${input.propertyTitle}`
        : "New inquiry from Milla Homes website",
      text: buildTextBody(input),
      html: buildHtmlBody(input),
    });

    return { ok: true as const };
  } catch (error) {
    console.error("Failed to send inquiry email", error);
    return { ok: false as const, reason: "send-failed" as const };
  }
}
