import { CheckoutSuccessPage } from "@/components/commerce/CheckoutSuccessPage";

export const metadata = {
  title: "Order confirmed — Zvezda Atelier",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessRoute() {
  return <CheckoutSuccessPage />;
}
