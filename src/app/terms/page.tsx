import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";
import { atelierContact } from "@/data/atelier";

export const metadata = {
  title: "Terms & Conditions — Zvezda Atelier",
};

export default function TermsPage() {
  return (
    <PolicyPageLayout title="Terms & Conditions">
      <p>
        By placing an order with ZVEZDA, you agree to the following terms: all product
        descriptions, pricing, and availability are accurate to the best of our knowledge at
        the time of listing; ZVEZDA reserves the right to refuse or cancel any order at its
        discretion (for example, pricing errors, stock issues, or suspected fraud); all
        designs, photography, and content on this site are the property of ZVEZDA and may not
        be reproduced without permission; use of this site constitutes acceptance of these
        terms.
      </p>

      <h2>How orders are placed</h2>
      <p>
        In-stock, ready-to-ship pieces will be paid for online at checkout via Razorpay.
        Made-to-order and custom pieces are placed by enquiry (this website or WhatsApp).
        ZVEZDA confirms design, measurements, price, and timeline, then collects payment in
        full or as a deposit before production begins.
      </p>

      <h2>Cancellation</h2>
      <p>
        In-stock orders can be cancelled within 12 hours of placing the order, before
        dispatch. Made-to-order and custom pieces can be cancelled only before production
        begins; once production has started, the order is non-cancellable and non-refundable.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{" "}
        <a href={`mailto:${atelierContact.careEmail}`}>{atelierContact.careEmail}</a>
      </p>
    </PolicyPageLayout>
  );
}
