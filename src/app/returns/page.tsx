import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export const metadata = {
  title: "Returns & Exchanges — Zvezda Atelier",
};

export default function ReturnsPolicyPage() {
  return (
    <PolicyPageLayout title="Returns & Exchanges">
      <p>
        We want you to love your Zvezda piece. Because our garments are made to order and
        crafted by hand, our return policy differs from standard ready-to-wear retailers.
      </p>

      <h2>Eligibility</h2>
      <ul>
        <li>Returns are accepted within 14 days of delivery for unworn, unwashed pieces with all original tags attached.</li>
        <li>Items must be free of alterations, damage, perfume, or signs of wear.</li>
        <li>Final-sale, bespoke, and made-to-measure pieces are not eligible for return unless defective.</li>
      </ul>

      <h2>Exchanges</h2>
      <p>
        We offer one complimentary size exchange per order within 14 days of delivery, subject
        to availability. Exchange requests should be initiated via our{" "}
        <a href="/contact">Contact</a> page before returning any item.
      </p>

      <h2>How to initiate a return</h2>
      <p>
        Email <a href="mailto:care@zvezdaatelier.com">care@zvezdaatelier.com</a> with your
        order number and reason for return. We will provide return instructions and a shipping
        address within 2 business days.
      </p>

      <h2>Refunds</h2>
      <p>
        Approved returns are refunded to the original payment method within 7–10 business days
        after we receive and inspect the garment. Original shipping charges are non-refundable.
      </p>
    </PolicyPageLayout>
  );
}
