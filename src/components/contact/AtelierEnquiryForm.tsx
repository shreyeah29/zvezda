"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { shopProducts } from "@/data/shopCatalog";
import {
  atelierContact,
  enquiryBudgets,
  enquiryOccasions,
  enquirySizes,
  enquirySources,
} from "@/data/atelier";
import "./AtelierEnquiryForm.css";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  product: string;
  occasion: string;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  length: string;
  size: string;
  budget: string;
  deliveryDate: string;
  notes: string;
  source: string;
};

const INITIAL: FormState = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  product: "",
  occasion: "",
  bust: "",
  waist: "",
  hip: "",
  shoulder: "",
  length: "",
  size: "",
  budget: "",
  deliveryDate: "",
  notes: "",
  source: "",
};

function buildMessage(values: FormState) {
  return [
    "ZVEZDA made-to-order enquiry",
    "",
    `Name: ${values.fullName}`,
    `WhatsApp: ${values.phone}`,
    `Email: ${values.email}`,
    `City: ${values.city}`,
    `Product: ${values.product || "—"}`,
    `Occasion: ${values.occasion || "—"}`,
    `Measurements — Bust: ${values.bust || "—"} · Waist: ${values.waist || "—"} · Hip: ${values.hip || "—"} · Shoulder: ${values.shoulder || "—"} · Length: ${values.length || "—"}`,
    `Preferred size: ${values.size || "—"}`,
    `Budget: ${values.budget || "—"}`,
    `Preferred delivery: ${values.deliveryDate || "—"}`,
    `Notes: ${values.notes || "—"}`,
    `Heard about ZVEZDA: ${values.source || "—"}`,
  ].join("\n");
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="enquiry-field">
      <span>
        {label}
        {required ? <em>Required</em> : <em>Optional</em>}
      </span>
      {children}
    </label>
  );
}

export function AtelierEnquiryForm() {
  const searchParams = useSearchParams();
  const presetProduct = searchParams.get("product") ?? "";
  const resolvedProduct = useMemo(() => {
    const match = shopProducts.find(
      (product) => product.slug === presetProduct || product.name === presetProduct,
    );
    return match?.name ?? presetProduct;
  }, [presetProduct]);
  const [values, setValues] = useState<FormState>(INITIAL);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!resolvedProduct) return;
    setValues((current) => ({ ...current, product: resolvedProduct }));
  }, [resolvedProduct]);

  const productOptions = useMemo(
    () => [
      ...shopProducts.map((product) => ({ value: product.name, label: product.name })),
      { value: "Other / custom", label: "Other / custom" },
    ],
    [],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = encodeURIComponent(buildMessage(values));
    const subject = encodeURIComponent(`ZVEZDA enquiry — ${values.product || values.fullName}`);
    window.location.href = `mailto:${atelierContact.careEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  const whatsappHref = atelierContact.whatsapp
    ? `https://wa.me/${atelierContact.whatsapp}?text=${encodeURIComponent(buildMessage(values))}`
    : undefined;

  return (
    <form className="enquiry-form" onSubmit={onSubmit} id="enquiry">
      <div className="enquiry-form__intro">
        <p className="enquiry-form__eyebrow">Made to order</p>
        <h2>Enquire for a custom piece</h2>
        <p>
          Share your measurements and the piece you have in mind. We will confirm design,
          price, and timeline before production begins.
        </p>
      </div>

      <div className="enquiry-form__grid">
        <Field label="Full name" required>
          <input
            required
            name="fullName"
            autoComplete="name"
            value={values.fullName}
            onChange={(event) => update("fullName", event.target.value)}
          />
        </Field>
        <Field label="Phone number (WhatsApp)" required>
          <input
            required
            name="phone"
            type="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </Field>
        <Field label="Email address" required>
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </Field>
        <Field label="City / location" required>
          <input
            required
            name="city"
            autoComplete="address-level2"
            value={values.city}
            onChange={(event) => update("city", event.target.value)}
          />
        </Field>
        <Field label="Product of interest" required>
          <select
            required
            name="product"
            value={values.product}
            onChange={(event) => update("product", event.target.value)}
          >
            <option value="">Select a piece</option>
            {productOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Occasion">
          <select
            name="occasion"
            value={values.occasion}
            onChange={(event) => update("occasion", event.target.value)}
          >
            <option value="">Select if you like</option>
            {enquiryOccasions.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <fieldset className="enquiry-form__measures">
        <legend>
          Measurements <em>Required for made-to-measure</em>
        </legend>
        <div className="enquiry-form__grid enquiry-form__grid--five">
          {(
            [
              ["bust", "Bust"],
              ["waist", "Waist"],
              ["hip", "Hip"],
              ["shoulder", "Shoulder"],
              ["length", "Length"],
            ] as const
          ).map(([key, label]) => (
            <Field key={key} label={label} required>
              <input
                required
                name={key}
                inputMode="decimal"
                value={values[key]}
                onChange={(event) => update(key, event.target.value)}
              />
            </Field>
          ))}
        </div>
      </fieldset>

      <div className="enquiry-form__grid">
        <Field label="Preferred size (if standard sizing)">
          <select name="size" value={values.size} onChange={(event) => update("size", event.target.value)}>
            <option value="">Select a size</option>
            {enquirySizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget range">
          <select
            name="budget"
            value={values.budget}
            onChange={(event) => update("budget", event.target.value)}
          >
            <option value="">Select a range</option>
            {enquiryBudgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred delivery date">
          <input
            name="deliveryDate"
            type="date"
            value={values.deliveryDate}
            onChange={(event) => update("deliveryDate", event.target.value)}
          />
        </Field>
        <Field label="How did you hear about ZVEZDA?">
          <select
            name="source"
            value={values.source}
            onChange={(event) => update("source", event.target.value)}
          >
            <option value="">Select</option>
            {enquirySources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Customization notes">
        <textarea
          name="notes"
          rows={5}
          placeholder="Colour tweaks, embellishments, length changes…"
          value={values.notes}
          onChange={(event) => update("notes", event.target.value)}
        />
      </Field>

      <div className="enquiry-form__actions">
        <button type="submit" className="enquiry-form__submit">
          Send enquiry
        </button>
        {whatsappHref ? (
          <a className="enquiry-form__whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Continue on WhatsApp
          </a>
        ) : (
          <p className="enquiry-form__hint">
            Your enquiry opens an email to {atelierContact.careEmail}. Add a WhatsApp number
            when you have one and this form will offer a WhatsApp send as well.
          </p>
        )}
      </div>

      {sent ? (
        <p className="enquiry-form__confirm" role="status">
          Thank you for choosing ZVEZDA. Send the email that just opened and our team will
          reach out within 24 hours to confirm measurements and timeline.
        </p>
      ) : null}
    </form>
  );
}
