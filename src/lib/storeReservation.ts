export const STORE_RESERVATION_KEY = "zvezda-store-reservation";

export type StoredStoreReservation = {
  reservationId: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    notes: string;
  };
  quote?: {
    subtotal: number;
    lines: Array<{
      name: string;
      size: string;
      quantity: number;
      lineTotal: number;
      priceOnRequest?: boolean;
    }>;
  };
  createdAt: number;
};
