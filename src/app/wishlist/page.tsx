import { WishlistPage } from "@/components/commerce/WishlistPage";

export const metadata = {
  title: "Wishlist — Zvezda Atelier",
  robots: { index: false, follow: false },
};

export default function WishlistRoute() {
  return <WishlistPage />;
}
