import nodemailer from "nodemailer";
import { atelierContact } from "@/data/atelier";
import { renderOrderEmail } from "./templates";
import type { OrderEmailPayload } from "./types";

function getTransport() {
  const user = process.env.GMAIL_USER?.trim() || atelierContact.careEmail;
  const pass = process.env.GMAIL_APP_PASSWORD?.replaceAll(" ", "");
  if (!pass) return null;

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export function canSendCustomerEmail() {
  return Boolean(process.env.GMAIL_APP_PASSWORD?.replaceAll(" ", ""));
}

export async function sendOrderEmail(payload: OrderEmailPayload) {
  const transport = getTransport();
  const rendered = renderOrderEmail(payload);

  if (!transport) {
    console.info("Customer email skipped (no GMAIL_APP_PASSWORD)", payload.kind, payload.to);
    return { sent: false, subject: rendered.subject };
  }

  const fromUser = process.env.GMAIL_USER?.trim() || atelierContact.careEmail;
  await transport.sendMail({
    from: `"Zvezda Atelier" <${fromUser}>`,
    to: payload.to,
    bcc: atelierContact.careEmail,
    replyTo: atelierContact.careEmail,
    subject: rendered.subject,
    text: rendered.text,
    html: rendered.html,
  });

  return { sent: true, subject: rendered.subject };
}
