"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { brand } from "@/data/brand";

export function AtelierDoor() {
  const router = useRouter();
  const taps = useRef({ count: 0, at: 0 });

  function onClick() {
    const now = Date.now();
    if (now - taps.current.at > 4000) taps.current.count = 0;
    taps.current.at = now;
    taps.current.count += 1;
    if (taps.current.count < 3) return;
    taps.current.count = 0;
    router.push("/atelier");
  }

  return (
    <button type="button" className="jm-footer__copy jm-footer__copy--door" onClick={onClick}>
      © {new Date().getFullYear()} ZVEZDA Atelier · {brand.statement}
    </button>
  );
}
