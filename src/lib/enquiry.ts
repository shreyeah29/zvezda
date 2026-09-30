export type CustomEnquiry = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  product: string;
  occasion: string;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  length: string;
  size: string;
  budget: string;
  deliveryDate: string;
  notes: string;
  source: string;
};

function text(value: unknown, max = 400) {
  return String(value ?? "").trim().slice(0, max);
}

export function validateCustomEnquiry(input: Partial<CustomEnquiry>): CustomEnquiry {
  const enquiry: CustomEnquiry = {
    fullName: text(input.fullName, 120),
    phone: text(input.phone, 40),
    email: text(input.email, 160),
    city: text(input.city, 80),
    product: text(input.product, 160),
    occasion: text(input.occasion, 40),
    bust: text(input.bust, 20),
    waist: text(input.waist, 20),
    hip: text(input.hip, 20),
    shoulder: text(input.shoulder, 20),
    length: text(input.length, 20),
    size: text(input.size, 12),
    budget: text(input.budget, 40),
    deliveryDate: text(input.deliveryDate, 20),
    notes: text(input.notes, 2000),
    source: text(input.source, 40),
  };

  if (enquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    throw new Error("Please enter a valid email address, or leave it blank.");
  }
  if (enquiry.phone && enquiry.phone.replace(/\D/g, "").length < 10) {
    throw new Error("Please enter a valid phone number, or leave it blank.");
  }

  return enquiry;
}

export function createCustomOrderId() {
  return `ZV-C-${Date.now().toString(36).toUpperCase()}`;
}

export function formatCustomOrderMessage(enquiryId: string, enquiry: CustomEnquiry) {
  return [
    "ZVEZDA custom order",
    "",
    `Order: ${enquiryId}`,
    `Name: ${enquiry.fullName || "—"}`,
    `WhatsApp: ${enquiry.phone || "—"}`,
    `Email: ${enquiry.email || "—"}`,
    `City: ${enquiry.city || "—"}`,
    `Product: ${enquiry.product || "—"}`,
    `Occasion: ${enquiry.occasion || "—"}`,
    `Measurements — Bust: ${enquiry.bust || "—"} · Waist: ${enquiry.waist || "—"} · Hip: ${enquiry.hip || "—"} · Shoulder: ${enquiry.shoulder || "—"} · Length: ${enquiry.length || "—"}`,
    `Preferred size: ${enquiry.size || "—"}`,
    `Budget: ${enquiry.budget || "—"}`,
    `Preferred delivery: ${enquiry.deliveryDate || "—"}`,
    `Notes: ${enquiry.notes || "—"}`,
    `Heard about ZVEZDA: ${enquiry.source || "—"}`,
  ].join("\n");
}
