"use client";

import { SessionLoadGate } from "@/components/layout/SessionLoadGate";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { CollectionsPageContent } from "@/components/collections/editorial/CollectionsPageContent";
import { EditorialFooter } from "@/components/home/editorial/EditorialFooter";

export function CollectionsExperience() {
  return (
    <SessionLoadGate>
      <SmoothScroll>
        <main id="main-content">
          <CollectionsPageContent />
          <EditorialFooter />
        </main>
      </SmoothScroll>
    </SessionLoadGate>
  );
}
