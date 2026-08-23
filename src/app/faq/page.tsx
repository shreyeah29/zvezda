import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";
import { atelierContact } from "@/data/atelier";

export const metadata = {
  title: "FAQ — Zvezda Atelier",
};

export default function FaqPage() {
  return (
    <PolicyPageLayout title="Frequently Asked Questions">
      <h2>Do you offer returns or exchanges?</h2>
      <p>
        No — all pieces are made-to-order and sold as final sale, except in the case of a
        defect. See our <a href="/returns">Returns &amp; Refunds</a> policy.
      </p>

      <h2>How long does production take?</h2>
      <p>
        Most pieces take 3–4 weeks to make before shipping. Delivery is then about 5–7
        business days domestically, or 10–12 business days internationally. See{" "}
        <a href="/shipping">Shipping</a> for the full breakdown.
      </p>

      <h2>Do you ship internationally?</h2>
      <p>Yes, worldwide. Customs duties are the customer&apos;s responsibility.</p>

      <h2>How do I order a custom or made-to-measure piece?</h2>
      <p>
        Send an enquiry on our <a href="/contact#enquiry">Contact</a> page with your
        requirements. We will confirm measurements, price, and timeline before production
        begins.
      </p>

      <h2>What payment methods do you accept?</h2>
      <p>
        Online checkout via Razorpay for in-stock, ready-to-ship pieces, and
        enquiry-based orders (with payment confirmed manually before production starts) for
        made-to-order or custom pieces.
      </p>

      <h2>Still have a question?</h2>
      <p>
        Email <a href={`mailto:${atelierContact.careEmail}`}>{atelierContact.careEmail}</a>{" "}
        and we will respond within 1–2 business days.
      </p>
    </PolicyPageLayout>
  );
}
