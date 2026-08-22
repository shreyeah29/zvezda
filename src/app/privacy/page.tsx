import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";
import { atelierContact } from "@/data/atelier";

export const metadata = {
  title: "Privacy Policy — Zvezda Atelier",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout title="Privacy Policy">
      <p>
        ZVEZDA collects only the information necessary to process your order and communicate
        with you — name, contact number, email, and shipping address. We do not sell or share
        your personal data with third parties except payment processors and shipping partners
        required to fulfil your order. Payment details are handled securely by our payment
        gateway and are never stored by ZVEZDA directly.
      </p>

      <h2>What stays on your device</h2>
      <p>
        Wishlist and cart preferences are stored locally in your browser so you can continue
        shopping. This information is not sent to us until you place an order or submit an
        enquiry.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by
        contacting <a href={`mailto:${atelierContact.careEmail}`}>{atelierContact.careEmail}</a>.
      </p>
    </PolicyPageLayout>
  );
}
