import { CartPage } from "@/components/commerce/CartPage";

export const metadata = {
  title: "Cart — Zvezda Atelier",
  robots: { index: false, follow: false },
};

export default function CartRoute() {
  return <CartPage />;
}
