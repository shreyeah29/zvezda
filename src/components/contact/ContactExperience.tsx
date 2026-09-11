"use client";

import { Suspense } from "react";
import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";
import { AtelierEnquiryForm } from "@/components/contact/AtelierEnquiryForm";
import { atelierContact } from "@/data/atelier";
import { StudioVisit } from "@/components/atelier/StudioVisit";

export function ContactExperience() {
  return (
    <PolicyPageLayout title="Contact" eyebrow="Atelier">
      <p>
        For order enquiries, bespoke commissions, press requests, private appointments, or a
        visit to the studio — our team is here.
      </p>

      <h2>The studio</h2>
      <StudioVisit />
      <p>Fittings and pay-at-store visits are received during these hours. Writing ahead is welcome.</p>

      <h2>Customer care</h2>
      <p>
        Email:{" "}
        <a href={`mailto:${atelierContact.careEmail}`}>{atelierContact.careEmail}</a>
        <br />
        We respond during studio hours, 11:00 am – 7:00 pm IST.
      </p>

      <h2>Press &amp; collaborations</h2>
      <p>
        Email:{" "}
        <a href={`mailto:${atelierContact.pressEmail}`}>{atelierContact.pressEmail}</a>
      </p>

      <h2>Follow us</h2>
      <p>
        Instagram:{" "}
        <a href={atelierContact.instagramUrl} target="_blank" rel="noopener noreferrer">
          {atelierContact.instagramHandle}
        </a>
      </p>

      <h2>Before you write</h2>
      <p>
        Many common questions are answered on our{" "}
        <a href="/faq">FAQ</a>,{" "}
        <a href="/shipping">Shipping</a>, and{" "}
        <a href="/returns">Returns</a> pages.
      </p>

      <Suspense fallback={null}>
        <AtelierEnquiryForm />
      </Suspense>
    </PolicyPageLayout>
  );
}
