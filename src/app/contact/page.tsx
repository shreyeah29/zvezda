import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export const metadata = {
  title: "Contact — Zvezda Atelier",
};

export default function ContactPage() {
  return (
    <PolicyPageLayout title="Contact" eyebrow="Atelier">
      <p>
        For order enquiries, bespoke commissions, press requests, or private appointments —
        our team is here to assist.
      </p>

      <h2>Customer care</h2>
      <p>
        Email:{" "}
        <a href="mailto:care@zvezdaatelier.com">care@zvezdaatelier.com</a>
        <br />
        We respond Monday–Friday, 10:00–18:00 IST.
      </p>

      <h2>Press &amp; collaborations</h2>
      <p>
        Email:{" "}
        <a href="mailto:press@zvezdaatelier.com">press@zvezdaatelier.com</a>
      </p>

      <h2>Follow us</h2>
      <p>
        Instagram:{" "}
        <a href="https://www.instagram.com/zvezda_atelier/" target="_blank" rel="noopener noreferrer">
          @zvezda_atelier
        </a>
      </p>

      <h2>Before you write</h2>
      <p>
        Many common questions are answered on our{" "}
        <a href="/faq">FAQ</a>,{" "}
        <a href="/shipping">Shipping</a>, and{" "}
        <a href="/returns">Returns</a> pages.
      </p>
    </PolicyPageLayout>
  );
}
