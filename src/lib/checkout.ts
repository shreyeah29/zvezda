import { findProduct } from "@/data/findProduct";

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
};

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
