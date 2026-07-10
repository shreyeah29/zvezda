import { PolicyPageLayout } from "@/components/layout/PolicyPageLayout";

export const metadata = {
  title: "Privacy Policy — Zvezda Atelier",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageLayout title="Privacy Policy">
      <p>
        Zvezda Atelier (&quot;we&quot;, &quot;us&quot;) respects your privacy. This policy
        explains what information we collect and how we use it when you visit our website or
        place an order.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>Contact details you provide at checkout or when contacting us (name, email, address, phone).</li>
        <li>Order and payment information processed securely through our payment provider.</li>
        <li>Technical data such as browser type, device, and pages visited for site performance.</li>
        <li>Wishlist and cart preferences stored locally in your browser.</li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>To process and fulfil orders, including shipping updates.</li>
        <li>To respond to enquiries and provide customer support.</li>
        <li>To improve our website and shopping experience.</li>
        <li>To send transactional emails related to your orders.</li>
      </ul>

      <h2>Data sharing</h2>
      <p>
        We do not sell your personal data. We share information only with trusted service
        providers necessary to operate our store (payment processing, shipping carriers, email
        delivery) under appropriate confidentiality agreements.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by
        contacting <a href="mailto:care@zvezdaatelier.com">care@zvezdaatelier.com</a>.
      </p>

      <h2>Updates</h2>
      <p>
        We may update this policy from time to time. The latest version will always be
        available on this page.
      </p>
    </PolicyPageLayout>
  );
}
