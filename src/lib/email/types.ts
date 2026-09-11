export const ORDER_EMAIL_KINDS = [
  "order-placed",
  "visit-reserved",
  "in-production",
  "ready",
  "shipped",
  "delivered",
] as const;

export type OrderEmailKind = (typeof ORDER_EMAIL_KINDS)[number];

export type OrderEmailPiece = {
  name: string;
  size?: string;
  quantity?: number;
};

export type OrderEmailPayload = {
  kind: OrderEmailKind;
  to: string;
  name: string;
  orderId: string;
  pieces?: OrderEmailPiece[];
  amount?: string;
  trackingCourier?: string;
  trackingUrl?: string;
  fulfilment?: "pickup" | "ship";
  visitWhen?: string;
};
