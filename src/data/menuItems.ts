export const MENU_ITEMS = [
  { label: "Home", href: "/", image: "/assets/menu/home.jpg", caption: "The house" },
  { label: "Collections", href: "/collections", image: "/assets/menu/collections.jpg", caption: "Jardin, SS26" },
  { label: "Shop", href: "/shop", image: "/assets/menu/shop.jpg", caption: "Ready to wear" },
  { label: "Custom Order", href: "/custom-order", image: "/assets/menu/custom-order.jpg", caption: "Made to measure" },
  { label: "About", href: "/about", image: "/assets/menu/about.jpg", caption: "The atelier" },
  { label: "Contact", href: "/contact", image: "/assets/menu/contact.jpg", caption: "Appointments" },
] as const;

export type MenuItem = (typeof MENU_ITEMS)[number];

export function getMenuActiveIndex(pathname: string) {
  const exact = MENU_ITEMS.findIndex((item) => item.href === pathname);
  if (exact >= 0) return exact;
  return MENU_ITEMS.findIndex((item) => item.href !== "/" && pathname.startsWith(`${item.href}/`));
}
