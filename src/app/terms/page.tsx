import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export const metadata = {
  title: "Terms of Service — Zvezda Atelier",
};

export default function TermsPage() {
  return (
    <PolicyPageLayout title="Terms of Service">
      <p>
        By accessing zvezdaatelier.com and placing an order, you agree to these terms. Please
        read them carefully before purchasing.
      </p>

      <h2>Orders &amp; acceptance</h2>
      <p>
        All orders are subject to acceptance and availability. We reserve the right to decline
        an order before production begins. A contract is formed when we send your order
        confirmation email.
      </p>

      <h2>Pricing &amp; payment</h2>
      <p>
        Prices are listed in the currency shown at checkout and include applicable taxes where
        stated. We reserve the right to correct pricing errors. Payment must be received in
        full before production commences.
      </p>

      <h2>Made-to-order production</h2>
      <p>
        Because pieces are crafted to order, production timelines are estimates, not guarantees.
        We will notify you of any significant delays. Cancellations after production has begun
        may not be possible.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All designs, imagery, text, and branding on this site are the property of Zvezda Atelier
        and may not be reproduced without written permission.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Zvezda Atelier is not liable for indirect or
        consequential damages arising from use of this website or purchase of our products.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of India. Disputes shall be subject to the
        exclusive jurisdiction of courts in India.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href="mailto:care@zvezdaatelier.com">care@zvezdaatelier.com</a>
      </p>
    </PolicyPageLayout>
  );
}
