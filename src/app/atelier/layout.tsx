import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The house",
  robots: { index: false, follow: false, nocache: true },
};

export default function AtelierLayout({ children }: { children: ReactNode }) {
  return children;
}
