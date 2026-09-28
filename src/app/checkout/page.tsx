import { CheckoutPage } from "@/components/commerce/CheckoutPage";

export const metadata = {
  title: "Checkout — Zvezda Atelier",
  robots: { index: false, follow: false },
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
