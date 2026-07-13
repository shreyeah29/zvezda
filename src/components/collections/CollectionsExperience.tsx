"use client";

import "@/components/home/jacquemus/jacquemus-theme.css";
import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { JacquemusFooter } from "@/components/home/jacquemus/JacquemusFooter";
import { CircularGallery } from "@/components/collections/CircularGallery";
import { JacquemusCollectionsPage } from "@/components/collections/JacquemusCollectionsPage";

export function CollectionsExperience() {
  return (
    <SessionLoadGate>
      <SmoothScroll>
        <main id="main-content">
          <CircularGallery />
          <JacquemusCollectionsPage />
        </main>
        <JacquemusFooter />
      </SmoothScroll>
    </SessionLoadGate>
  );
}
