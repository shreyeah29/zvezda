import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";
import { atelierContact } from "@/data/atelier";

export const metadata = {
  title: "Shipping Policy — Zvezda Atelier",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPageLayout title="Shipping Policy">
      <p>
        All orders are made to order and are carefully crafted upon confirmation. Please
        review the timelines below before placing your order.
      </p>

      <h2>Domestic shipping — India</h2>
      <ul>
        <li>Production time: 3–4 weeks.</li>
        <li>Dispatch: orders will be dispatched once the outfit is completed.</li>
        <li>Delivery: approximately 5–7 business days from the date of dispatch.</li>
      </ul>

      <h2>International shipping</h2>
      <ul>
        <li>Production time: 3–4 weeks.</li>
        <li>Dispatch: orders will be dispatched once the outfit is completed.</li>
        <li>Delivery: approximately 10–12 business days from the date of dispatch.</li>
      </ul>

      <h2>Please note</h2>
      <ul>
        <li>
          Production and shipping timelines are estimates and may vary depending on the
          design, customisation, and order volume.
        </li>
        <li>
          Shipping timelines begin after dispatch and do not include the production period.
        </li>
        <li>
          Delays caused by customs clearance, courier services, weather conditions, or other
          circumstances beyond our control may occur.
        </li>
        <li>
          For international orders, any applicable customs duties, import taxes, or additional
          charges are the responsibility of the customer.
        </li>
        <li>Once an order has been dispatched, tracking details will be shared with the customer.</li>
      </ul>

      <h2>Collect from the studio</h2>
      <p>
        Hyderabad clients may collect from Zvezda Atelier at 8-2-293/82/A/1177, Jubilee Hills
        Road No. 56, Jubilee Hills, Hyderabad 500033. The studio is open 11:00 am – 7:00 pm IST.
        Choose pay at store at checkout, or ask us to hold a finished piece for collection.
      </p>

      <h2>How fulfilment works</h2>
      <ul>
        <li>Order placed (online checkout or WhatsApp / enquiry confirmed).</li>
        <li>
          In-stock pieces are dispatched within 1–2 business days. Made-to-order pieces take
          3–4 weeks to produce after payment is confirmed.
        </li>
        <li>A shipping confirmation with tracking is sent to the customer — or a collection note if you are coming to the studio.</li>
        <li>
          Domestic delivery in 5–7 business days from dispatch; international in 10–12
          business days from dispatch.
        </li>
      </ul>

      <h2>Questions</h2>
      <p>
        For shipping enquiries, please visit our <a href="/contact">Contact</a> page or email{" "}
        <a href={`mailto:${atelierContact.careEmail}`}>{atelierContact.careEmail}</a>.
      </p>
    </PolicyPageLayout>
  );
}
