import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export const metadata = {
  title: "Shipping Policy — Zvezda Atelier",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPageLayout title="Shipping Policy">
      <p>
        Every Zvezda piece is made to order and prepared with care before it leaves the atelier.
        Shipping timelines begin once your order is confirmed and production is complete.
      </p>

      <h2>Production &amp; dispatch</h2>
      <p>
        Standard made-to-order pieces require 4–6 weeks for production. Complex or bespoke
        commissions may require additional time — we will confirm your estimated dispatch date
        by email after purchase.
      </p>

      <h2>Delivery regions</h2>
      <p>We ship domestically across India and internationally to select destinations. Shipping
        rates and carriers are calculated at checkout based on your delivery address.</p>

      <h2>Tracking</h2>
      <p>
        Once your order ships, you will receive a confirmation email with tracking details.
        Please allow 24–48 hours for tracking information to activate.
      </p>

      <h2>Customs &amp; duties</h2>
      <p>
        International orders may be subject to import duties, taxes, or customs fees determined
        by your country. These charges are the responsibility of the recipient and are not
        included in our shipping rates.
      </p>

      <h2>Questions</h2>
      <p>
        For shipping enquiries, please visit our{" "}
        <a href="/contact">Contact</a> page or email{" "}
        <a href="mailto:care@zvezdaatelier.com">care@zvezdaatelier.com</a>.
      </p>
    </PolicyPageLayout>
  );
}
