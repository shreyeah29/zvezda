import { StorePayPage } from "@/components/commerce/StorePayPage";

export const metadata = {
  title: "Pay at store — Zvezda Atelier",
  robots: { index: false, follow: false },
};

export default function StorePayRoute() {
  return <StorePayPage />;
}
