export const MENU_ITEMS = [
  { label: "Home", href: "/", image: "/assets/menu/home.jpg" },
  { label: "Collections", href: "/collections", image: "/assets/menu/collections.jpg" },
  { label: "Shop", href: "/shop", image: "/assets/menu/shop.jpg" },
  { label: "Custom Order", href: "/custom-order", image: "/assets/menu/custom-order.jpg" },
  { label: "About", href: "/about", image: "/assets/menu/about.jpg" },
  { label: "Contact", href: "/contact", image: "/assets/menu/contact.jpg" },
] as const;

export type MenuItem = (typeof MENU_ITEMS)[number];

export function getMenuActiveIndex(pathname: string) {
  const exact = MENU_ITEMS.findIndex((item) => item.href === pathname);
  if (exact >= 0) return exact;
  return MENU_ITEMS.findIndex((item) => item.href !== "/" && pathname.startsWith(`${item.href}/`));
}
