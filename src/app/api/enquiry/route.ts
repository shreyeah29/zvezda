import { NextResponse } from "next/server";
import {
  createCustomOrderId,
  formatCustomOrderMessage,
  validateCustomEnquiry,
  type CustomEnquiry,
} from "@/lib/enquiry";
import { notifyAtelier } from "@/lib/notifyAtelier";
import { sendOrderEmail } from "@/lib/email/mailer";
import { recordAtelierOrder } from "@/lib/orders/store";
import { atelierContact } from "@/data/atelier";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CustomEnquiry>;
    const enquiry = validateCustomEnquiry(body);
    const enquiryId = createCustomOrderId();
    const message = formatCustomOrderMessage(enquiryId, enquiry);
    let notified = true;
    let emailed = true;

    try {
      await notifyAtelier({
        subject: `Custom order — ${enquiryId}`,
        name: enquiry.fullName || "Guest",
        email: enquiry.email || atelierContact.careEmail,
        phone: enquiry.phone,
        message,
      });
    } catch (error) {
      notified = false;
      console.error("Custom order atelier notice failed", enquiryId, error);
    }

    try {
      if (enquiry.email) {
        const result = await sendOrderEmail({
          kind: "custom-order",
          to: enquiry.email,
          name: enquiry.fullName || "there",
          orderId: enquiryId,
          pieces: [{ name: enquiry.product || "Custom piece", size: enquiry.size || undefined }],
          notes: message,
        });
        emailed = result.sent;
      } else {
        emailed = false;
      }
    } catch (error) {
      emailed = false;
      console.error("Custom order customer email failed", enquiryId, error);
    }

    console.info("Custom order received", enquiryId, enquiry.email, enquiry.product);

    const now = new Date().toISOString();
    const recorded = await recordAtelierOrder({
      id: enquiryId,
      type: "custom",
      status: "new",
      createdAt: now,
      customer: {
        fullName: enquiry.fullName || "Guest",
        email: enquiry.email,
        phone: enquiry.phone || undefined,
        city: enquiry.city || undefined,
      },
      pieces: [{ name: enquiry.product || "Custom piece", size: enquiry.size || undefined }],
      amount: enquiry.budget || undefined,
      measurements: {
        bust: enquiry.bust,
        waist: enquiry.waist,
        hip: enquiry.hip,
        shoulder: enquiry.shoulder,
        length: enquiry.length,
      },
      notes: message,
    });

    if (!recorded && !notified && !emailed) {
      return NextResponse.json(
        { error: "The atelier could not receive this order. Please try WhatsApp, or write to us directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      enquiryId,
      emailed,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to place this custom order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
