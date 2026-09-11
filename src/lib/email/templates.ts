import { atelierContact, atelierStudio, studioAddressText, studioHoursText, studioMapsUrl } from "@/data/atelier";
import type { OrderEmailKind, OrderEmailPayload, OrderEmailPiece } from "./types";

export type RenderedEmail = {
  subject: string;
  html: string;
  text: string;
};

const SITE = "https://www.atelierzvezda.in";
const INK = "#0c0b0a";
const CREAM = "#f6f1e8";
const GOLD = "#c4a574";
const MUTED = "#6b645c";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function firstName(name: string) {
  const part = name.trim().split(/\s+/)[0];
  return part || "there";
}

function formatPieces(pieces: OrderEmailPiece[] = []) {
  if (pieces.length === 0) return "";
  return pieces
    .map((piece) => {
      const size = piece.size ? ` · Size ${piece.size}` : "";
      const qty = piece.quantity && piece.quantity > 1 ? ` · Qty ${piece.quantity}` : "";
      return `${piece.name}${size}${qty}`;
    })
    .join("\n");
}

function piecesHtml(pieces: OrderEmailPiece[] = []) {
  if (pieces.length === 0) return "";
  const rows = pieces
    .map((piece) => {
      const meta = [piece.size ? `Size ${escapeHtml(piece.size)}` : "", piece.quantity ? `Qty ${piece.quantity}` : ""]
        .filter(Boolean)
        .join(" · ");
      return `<tr>
        <td style="padding:10px 0;border-bottom:1px solid rgba(12,11,10,0.08);font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${INK};">
          ${escapeHtml(piece.name)}
          ${meta ? `<div style="margin-top:4px;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${MUTED};">${meta}</div>` : ""}
        </td>
      </tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 22px;">${rows}</table>`;
}

function buttonHtml(href: string, label: string) {
  return `<p style="margin:28px 0 8px;">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:13px 22px;background:${INK};color:${CREAM};text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;">
      ${escapeHtml(label)}
    </a>
  </p>`;
}

function wrapEmail(input: { eyebrow: string; heading: string; bodyHtml: string; extraHtml?: string }) {
  const address = studioAddressText();
  const hours = studioHoursText();
  const maps = studioMapsUrl();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Zvezda Atelier</title>
</head>
<body style="margin:0;padding:0;background:${CREAM};color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf8;border:1px solid rgba(12,11,10,0.08);">
          <tr>
            <td style="padding:28px 28px 18px;border-bottom:1px solid rgba(196,165,116,0.35);">
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.42em;text-transform:uppercase;color:${GOLD};">Zvezda Atelier</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 12px;">
              <p style="margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:${MUTED};">${escapeHtml(input.eyebrow)}</p>
              <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.1;font-weight:normal;font-style:italic;color:${INK};">${escapeHtml(input.heading)}</h1>
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${INK};">
                ${input.bodyHtml}
              </div>
              ${input.extraHtml ?? ""}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 32px;">
              <p style="margin:0 0 14px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:${GOLD};">The studio</p>
              <p style="margin:0 0 6px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.6;color:${INK};">
                ${escapeHtml(atelierStudio.name)}<br />
                ${escapeHtml(address)}
              </p>
              <p style="margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.08em;color:${MUTED};">${escapeHtml(hours)}</p>
              <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:12px;">
                <a href="${escapeHtml(maps)}" style="color:${INK};">Directions</a>
                &nbsp;·&nbsp;
                <a href="mailto:${atelierContact.careEmail}" style="color:${INK};">${atelierContact.careEmail}</a>
                &nbsp;·&nbsp;
                <a href="${atelierContact.instagramUrl}" style="color:${INK};">${atelierContact.instagramHandle}</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:18px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;color:${MUTED};">Where light becomes garment.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function copyFor(payload: OrderEmailPayload): { eyebrow: string; heading: string; subject: string; paragraphs: string[]; extraHtml?: string } {
  const name = firstName(payload.name);
  const id = payload.orderId;
  const amount = payload.amount ? ` Amount recorded: ${payload.amount}.` : "";

  switch (payload.kind) {
    case "order-placed":
      return {
        eyebrow: "Order placed",
        heading: "Payment received.",
        subject: `Your Zvezda order is confirmed — ${id}`,
        paragraphs: [
          `Dear ${name},`,
          `Thank you. Your order ${id} is confirmed and payment has been received.${amount}`,
          "If this is a made-to-order piece, the atelier will begin after any measurements are confirmed. Most pieces take 3–4 weeks to make. We will write again when cutting and stitching start.",
          "Questions before then are welcome — reply to this letter, or visit the studio during open hours.",
        ],
      };
    case "visit-reserved":
      return {
        eyebrow: "Visit reserved",
        heading: "We are expecting you.",
        subject: `We are expecting you at the studio — ${id}`,
        paragraphs: [
          `Dear ${name},`,
          `Your pay-at-store visit ${id} is reserved. Come to the studio, try the piece, and pay in person. No payment has been taken online.`,
          `${studioHoursText()}. Please arrive within these hours so we can receive you properly.`,
          "If your timing changes, reply to this letter and we will hold the piece accordingly.",
        ],
        extraHtml: `${buttonHtml(studioMapsUrl(), "Studio directions")}`,
      };
    case "in-production":
      return {
        eyebrow: "In production",
        heading: "Cutting has begun.",
        subject: `Your piece has entered the atelier — ${id}`,
        paragraphs: [
          `Dear ${name},`,
          `Your order ${id} is now in the atelier. Cutting and stitching have started — one piece, made for you.`,
          "This is the quiet part of the process. We will write again when the garment is ready for pickup or about to leave for you.",
        ],
      };
    case "ready": {
      const pickup =
        payload.fulfilment !== "ship"
          ? `Your piece is ready to collect at the studio. ${studioHoursText()}. Please bring this letter or your order number ${id}.`
          : `Your piece is packed and about to ship. Tracking will follow as soon as the courier collects it.`;
      return {
        eyebrow: "Ready",
        heading: payload.fulfilment === "ship" ? "Ready to leave the atelier." : "Ready for you.",
        subject: `Your Zvezda piece is ready — ${id}`,
        paragraphs: [
          `Dear ${name},`,
          pickup,
          "If you would like us to hold it for a particular day, reply here and we will wait for you.",
        ],
        extraHtml: payload.fulfilment === "ship" ? "" : buttonHtml(studioMapsUrl(), "Collect at the studio"),
      };
    }
    case "shipped": {
      const courier = payload.trackingCourier ? ` with ${payload.trackingCourier}` : "";
      const track = payload.trackingUrl
        ? ` Follow the parcel here: ${payload.trackingUrl}`
        : " Tracking will be shared as soon as the courier provides it.";
      return {
        eyebrow: "Shipped",
        heading: "On its way.",
        subject: `Your Zvezda piece has shipped — ${id}`,
        paragraphs: [
          `Dear ${name},`,
          `Order ${id} has left the atelier${courier}.${track}`,
          "Domestic delivery is usually 5–7 business days from dispatch; international, about 10–12. We will be here if anything needs us.",
        ],
        extraHtml: payload.trackingUrl ? buttonHtml(payload.trackingUrl, "Track this parcel") : "",
      };
    }
    case "delivered":
      return {
        eyebrow: "Delivered",
        heading: "A star, arrived.",
        subject: `Your Zvezda piece is with you — ${id}`,
        paragraphs: [
          `Dear ${name},`,
          `Order ${id} has been delivered or collected. We hope it feels like it was always meant for you.`,
          "Care: dry clean only, unless we have noted otherwise. If anything is not as it should be, write within 24 hours with an unboxing video — we will look after it.",
          "When you wear it, we would love to see. Tag us, or simply send a still.",
        ],
        extraHtml: buttonHtml(atelierContact.instagramUrl, "Follow the atelier"),
      };
  }
}

export function renderOrderEmail(payload: OrderEmailPayload): RenderedEmail {
  const copy = copyFor(payload);
  const pieceBlock = piecesHtml(payload.pieces);
  const bodyHtml = copy.paragraphs
    .map((paragraph, index) => `<p style="margin:${index === 0 ? "0 0 16px" : "0 0 16px"};">${escapeHtml(paragraph)}</p>`)
    .join("");
  const extra = `${pieceBlock}${copy.extraHtml ?? ""}${buttonHtml(SITE, "Visit the house")}`;
  const html = wrapEmail({
    eyebrow: copy.eyebrow,
    heading: copy.heading,
    bodyHtml,
    extraHtml: extra,
  });
  const text = [
    copy.heading,
    "",
    ...copy.paragraphs,
    "",
    formatPieces(payload.pieces),
    "",
    atelierStudio.name,
    studioAddressText(),
    studioHoursText(),
    atelierContact.careEmail,
    payload.trackingUrl ? `Tracking: ${payload.trackingUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject: copy.subject, html, text };
}

export function orderEmailLabel(kind: OrderEmailKind) {
  const labels: Record<OrderEmailKind, string> = {
    "order-placed": "Order placed — online payment received",
    "visit-reserved": "Visit reserved — pay at store",
    "in-production": "In production — cutting has started",
    ready: "Ready — pickup or about to ship",
    shipped: "Shipped — courier and tracking",
    delivered: "Delivered / collected",
  };
  return labels[kind];
}
