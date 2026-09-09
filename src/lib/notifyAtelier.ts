import { atelierContact } from "@/data/atelier";

export async function notifyAtelier(input: {
  subject: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const endpoint = `https://formsubmit.co/ajax/${atelierContact.careEmail}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: input.subject.slice(0, 150),
      _template: "box",
      _captcha: false,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    }),
  });

  if (!response.ok) {
    throw new Error("The atelier could not be notified. Please try again.");
  }
}
