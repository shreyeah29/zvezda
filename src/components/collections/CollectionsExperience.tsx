"use client";

import "@/components/home/jacquemus/jacquemus-theme.css";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { CircularGallery } from "@/components/collections/CircularGallery";
import { KineticWheel } from "@/components/collections/KineticWheel";
import { JacquemusCollectionsPage } from "@/components/collections/JacquemusCollectionsPage";
import { useMaxWidth } from "@/hooks/useMaxWidth";

export function CollectionsExperience() {
  const isMobile = useMaxWidth(768);

  return (
    <SessionLoadGate>
      <SmoothScroll>
        <main id="main-content" className={isMobile ? "collections-main--mobile-wheel" : undefined}>
          {/* Desktop: circular gallery → collections list (no kinetic wheel) */}
          {!isMobile && <CircularGallery />}
          {isMobile && <KineticWheel />}
          {!isMobile && <JacquemusCollectionsPage />}
        </main>
        {/* Phone: wheel is the only section — no footer strip */}
        {!isMobile && <JacquemusFooter />}
      </SmoothScroll>
    </SessionLoadGate>
  );
}
