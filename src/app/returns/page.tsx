import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";
import { atelierContact } from "@/data/atelier";

export const metadata = {
  title: "Returns & Refunds — Zvezda Atelier",
};

export default function ReturnsPolicyPage() {
  return (
    <PolicyPageLayout title="Returns & Refunds">
      <p>
        Made-to-order pieces are non-returnable. As most ZVEZDA garments are created
        specifically for each customer, all sales are final. We do not accept returns or
        exchanges due to size, fit, or change of mind.
      </p>

      <h2>Manufacturing defects</h2>
      <p>
        In the unlikely event that you receive an item with a manufacturing defect, you must
        contact us within 24 hours of delivery. A mandatory unboxing video along with clear
        photos of the defect must be provided for the claim to be considered.
      </p>
      <p>
        Once the defect is verified and approved by our team, a replacement will be provided.
        No refunds or store credits will be issued.
      </p>

      <h2>Refund policy</h2>
      <p>
        All ZVEZDA orders are final sale, as our pieces are primarily made-to-order and are
        created specifically for each customer.
      </p>
      <p>We do not offer refunds for:</p>
      <ul>
        <li>Change of mind</li>
        <li>Size or fit issues</li>
        <li>Incorrect size selected by the customer</li>
        <li>Personal preferences</li>
        <li>Delays within the stated production or shipping timelines</li>
      </ul>
      <p>
        In the event of a verified manufacturing defect or incorrect item, the resolution will
        be handled through a replacement only, in accordance with this policy. No refunds or
        store credits will be issued.
      </p>
      <p>
        Once an order has been confirmed and production has commenced, the order cannot be
        cancelled or refunded.
      </p>

      <h2>How to reach us</h2>
      <p>
        Email <a href={`mailto:${atelierContact.careEmail}`}>{atelierContact.careEmail}</a>{" "}
        with your order details, unboxing video, and photographs of any defect. The studio is
        open 11:00 am – 7:00 pm IST at Jubilee Hills Road No. 56, Hyderabad.
      </p>
    </PolicyPageLayout>
  );
}
