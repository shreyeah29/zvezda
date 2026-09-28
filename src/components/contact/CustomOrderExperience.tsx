"use client";

import { Suspense } from "react";
import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";
import { AtelierEnquiryForm } from "@/components/contact/AtelierEnquiryForm";

export function CustomOrderExperience() {
  return (
    <PolicyPageLayout title="Custom Order" eyebrow="Atelier">
      <p>
        Every ZVEZDA piece is made to order. Share the silhouette, colour, and measurements
        you have in mind — we will confirm design, price, and timeline before anything is cut.
      </p>

      <Suspense fallback={null}>
        <AtelierEnquiryForm />
      </Suspense>
    </PolicyPageLayout>
  );
}
