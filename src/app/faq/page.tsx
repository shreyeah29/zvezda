import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export const metadata = {
  title: "FAQ — Zvezda Atelier",
};

export default function FaqPage() {
  return (
    <PolicyPageLayout title="Frequently Asked Questions">
      <h2>Are all pieces made to order?</h2>
      <p>
        Yes. Each garment is produced after your order is placed to reduce waste and ensure
        the highest standard of craftsmanship. Production typically takes 4–6 weeks.
      </p>

      <h2>Can I request alterations?</h2>
      <p>
        Minor alterations may be accommodated at the time of order. For significant custom
        requests, please contact us before purchasing so we can advise on feasibility and
        timeline.
      </p>

      <h2>What payment methods do you accept?</h2>
      <p>
        We accept major credit and debit cards and other payment methods displayed at checkout.
        Full payment is required to confirm your order.
      </p>

      <h2>How do I track my order?</h2>
      <p>
        You will receive email updates at each stage — order confirmation, production, and
        dispatch. Tracking details are sent once your piece ships.
      </p>

      <h2>Can I visit the atelier?</h2>
      <p>
        Private appointments are available by request. Please reach out via our{" "}
        <a href="/contact">Contact</a> page to schedule a visit.
      </p>

      <h2>Still have a question?</h2>
      <p>
        We are happy to help. Email{" "}
        <a href="mailto:care@zvezdaatelier.com">care@zvezdaatelier.com</a> and we will
        respond within 1–2 business days.
      </p>
    </PolicyPageLayout>
  );
}
