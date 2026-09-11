import { findProduct } from "@/data/findProduct";
import { studioAddressText, studioHoursText } from "@/data/atelier";

export type CheckoutCartItem = {
  slug: string;
  size: string;
  quantity: number;
};

export type CheckoutCustomer = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
};

export type QuotedLine = {
  slug: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  priceOnRequest?: boolean;
};

export type StoreCustomer = {
  fullName: string;
  email: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  notes: string;
};

export const STORE_VISIT_SLOTS = [
  { value: "11:00", label: "11:00 am" },
  { value: "11:30", label: "11:30 am" },
  { value: "12:00", label: "12:00 pm" },
  { value: "12:30", label: "12:30 pm" },
  { value: "13:00", label: "1:00 pm" },
  { value: "13:30", label: "1:30 pm" },
  { value: "14:00", label: "2:00 pm" },
  { value: "14:30", label: "2:30 pm" },
  { value: "15:00", label: "3:00 pm" },
  { value: "15:30", label: "3:30 pm" },
  { value: "16:00", label: "4:00 pm" },
  { value: "16:30", label: "4:30 pm" },
  { value: "17:00", label: "5:00 pm" },
  { value: "17:30", label: "5:30 pm" },
  { value: "18:00", label: "6:00 pm" },
  { value: "18:30", label: "6:30 pm" },
] as const;

export function istTodayIso() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export function formatStoreVisitWindow(visitDate: string, visitTime: string) {
  const slot = STORE_VISIT_SLOTS.find((item) => item.value === visitTime);
  const date = new Date(`${visitDate}T12:00:00+05:30`);
  const day = Number.isNaN(date.getTime())
    ? visitDate
    : new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(date);
  return `${day} · ${slot?.label ?? visitTime} IST`;
}

export type CartQuote = {
  lines: QuotedLine[];
  subtotal: number;
  amountPaise: number;
  currency: "INR";
};

export function quoteCheckoutCart(items: CheckoutCartItem[]): CartQuote {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const lines: QuotedLine[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = findProduct(item.slug);
    if (!product) {
      throw new Error("One of the pieces in your cart is no longer available.");
    }
    if (product.priceOnRequest || !product.price) {
      throw new Error(`${product.name} is price on request. Please enquire before paying.`);
    }
    if (product.currency !== "INR") {
      throw new Error(`${product.name} cannot be paid online yet. Please enquire to order.`);
    }

    const quantity = Math.max(1, Math.min(10, Math.floor(Number(item.quantity) || 1)));
    const size = String(item.size || "M").slice(0, 12);
    const lineTotal = product.price * quantity;
    subtotal += lineTotal;
    lines.push({
      slug: product.slug,
      name: product.name,
      size,
      quantity,
      unitPrice: product.price,
      lineTotal,
    });
  }

  return {
    lines,
    subtotal,
    amountPaise: Math.round(subtotal * 100),
    currency: "INR",
  };
}

export function validateCustomer(input: Partial<CheckoutCustomer>): CheckoutCustomer {
  const fullName = String(input.fullName ?? "").trim();
  const email = String(input.email ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  const address = String(input.address ?? "").trim();
  const city = String(input.city ?? "").trim();
  const pincode = String(input.pincode ?? "").trim();
  const country = String(input.country ?? "India").trim() || "India";

  if (!fullName || !email || !phone || !address || !city || !pincode) {
    throw new Error("Please complete your delivery details.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (phone.replace(/\D/g, "").length < 10) {
    throw new Error("Please enter a valid phone number.");
  }

  return { fullName, email, phone, address, city, pincode, country };
}

export function quoteStoreCart(items: CheckoutCartItem[]): CartQuote {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const lines: QuotedLine[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = findProduct(item.slug);
    if (!product) {
      throw new Error("One of the pieces in your cart is no longer available.");
    }

    const quantity = Math.max(1, Math.min(10, Math.floor(Number(item.quantity) || 1)));
    const size = String(item.size || "M").slice(0, 12);
    const onRequest = Boolean(product.priceOnRequest || !product.price);
    const unitPrice = onRequest ? 0 : product.price;
    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;
    lines.push({
      slug: product.slug,
      name: product.name,
      size,
      quantity,
      unitPrice,
      lineTotal,
      priceOnRequest: onRequest,
    });
  }

  return {
    lines,
    subtotal,
    amountPaise: Math.round(subtotal * 100),
    currency: "INR",
  };
}

export function validateStoreCustomer(input: Partial<StoreCustomer>): StoreCustomer {
  const fullName = String(input.fullName ?? "").trim();
  const email = String(input.email ?? "").trim();
  const phone = String(input.phone ?? "").trim();
  const visitDate = String(input.visitDate ?? "").trim();
  const visitTime = String(input.visitTime ?? "").trim();

  if (!fullName || !email || !phone) {
    throw new Error("Please share your name, email, and phone so the atelier can expect you.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (phone.replace(/\D/g, "").length < 10) {
    throw new Error("Please enter a valid phone number.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(visitDate) || visitDate < istTodayIso()) {
    throw new Error("Please choose a visit date from today onward.");
  }
  if (!STORE_VISIT_SLOTS.some((slot) => slot.value === visitTime)) {
    throw new Error("Please choose a visit time during studio hours.");
  }

  return {
    fullName,
    email,
    phone,
    visitDate,
    visitTime,
    notes: formatStoreVisitWindow(visitDate, visitTime),
  };
}

export function createStoreReservationId() {
  return `ZV-STORE-${Date.now().toString(36).toUpperCase()}`;
}

export function formatStoreReservationMessage(input: {
  reservationId: string;
  customer: StoreCustomer;
  quote: CartQuote;
}) {
  const lines = input.quote.lines.map((line) => {
    const amount = line.priceOnRequest
      ? "Price on request"
      : `₹${line.lineTotal.toLocaleString("en-IN")}`;
    return `- ${line.name} · Size ${line.size} · Qty ${line.quantity} · ${amount}`;
  });
  const total =
    input.quote.subtotal > 0
      ? `₹${input.quote.subtotal.toLocaleString("en-IN")}`
      : "To confirm in store";

  return [
    "Pay at store reservation",
    "",
    `Reservation: ${input.reservationId}`,
    `Name: ${input.customer.fullName}`,
    `Email: ${input.customer.email}`,
    `Phone: ${input.customer.phone}`,
    `Visit: ${input.customer.notes || "—"}`,
    "",
    "Pieces:",
    ...lines,
    "",
    `Amount due in store: ${total}`,
    "",
    "Studio:",
    studioAddressText(),
    studioHoursText(),
    "",
    "The guest will visit the atelier to try the piece and pay in person.",
  ].join("\n");
}
