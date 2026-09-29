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
        name: enquiry.fullName,
        email: enquiry.email,
        phone: enquiry.phone,
        message,
      });
    } catch (error) {
      notified = false;
      console.error("Custom order atelier notice failed", enquiryId, error);
    }

    try {
      const result = await sendOrderEmail({
        kind: "custom-order",
        to: enquiry.email,
        name: enquiry.fullName,
        orderId: enquiryId,
        pieces: [{ name: enquiry.product, size: enquiry.size || undefined }],
        notes: message,
      });
      emailed = result.sent;
    } catch (error) {
      emailed = false;
      console.error("Custom order customer email failed", enquiryId, error);
    }

    if (!notified && !emailed) {
      return NextResponse.json(
        { error: "The atelier could not receive this order. Please try WhatsApp, or write to us directly." },
        { status: 502 },
      );
    }

    console.info("Custom order received", enquiryId, enquiry.email, enquiry.product);

    const now = new Date().toISOString();
    await recordAtelierOrder({
      id: enquiryId,
      type: "custom",
      status: "new",
      createdAt: now,
      customer: {
        fullName: enquiry.fullName,
        email: enquiry.email,
        phone: enquiry.phone,
        city: enquiry.city,
      },
      pieces: [{ name: enquiry.product, size: enquiry.size || undefined }],
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
