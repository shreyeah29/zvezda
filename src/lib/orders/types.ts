export const ATELIER_ORDER_STATUSES = [
  "new",
  "confirmed",
  "visit",
  "in-production",
  "ready",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type AtelierOrderStatus = (typeof ATELIER_ORDER_STATUSES)[number];

export const ATELIER_ORDER_TYPES = ["paid", "store", "custom"] as const;
export type AtelierOrderType = (typeof ATELIER_ORDER_TYPES)[number];

export type AtelierOrderPiece = {
  name: string;
  size?: string;
  quantity?: number;
};

export type AtelierMeasurements = {
  bust?: string;
  waist?: string;
  hip?: string;
  shoulder?: string;
  length?: string;
};

export type AtelierOrder = {
  id: string;
  type: AtelierOrderType;
  status: AtelierOrderStatus;
  createdAt: string;
  updatedAt: string;
  customer: {
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    address?: string;
  };
  pieces: AtelierOrderPiece[];
  amount?: string;
  measurements?: AtelierMeasurements;
  notes?: string;
  visitWhen?: string;
  paymentId?: string;
  fulfilment?: "pickup" | "ship";
  trackingCourier?: string;
  trackingUrl?: string;
};

export const STATUS_LABELS: Record<AtelierOrderStatus, string> = {
  new: "New custom",
  confirmed: "Paid",
  visit: "Studio visit",
  "in-production": "In production",
  ready: "Ready",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const TYPE_LABELS: Record<AtelierOrderType, string> = {
  paid: "Online payment",
  store: "Pay at store",
  custom: "Custom order",
};
