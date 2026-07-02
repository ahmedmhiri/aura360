import { NextResponse } from "next/server";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { badRequest, readJson } from "@/lib/api";

export const runtime = "nodejs";

// TODO(owner): to enable email delivery, create a Resend account, verify a
// sending domain, then set RESEND_API_KEY and CONTACT_TO_EMAIL (see
// .env.example). Without the key this is a no-op and inquiries are only saved
// to the database / logged.
async function sendEmailNotification({ name, email, subject, message }) {
  if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      // TODO(owner): replace with an address on your verified Resend domain,
      // e.g. "AURA360LAB <studio@aura360lab.com>".
      from: process.env.CONTACT_FROM_EMAIL || "AURA360LAB <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: subject ? `Inquiry: ${subject}` : `New inquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
  } catch (e) {
    // Email is best-effort; the inquiry is already persisted below.
    console.error("[aura360lab] Failed to send inquiry email:", e.message);
  }
}

// Saves the inquiry to the database (readable from the admin Messages page),
// logs it server-side, and — when Resend is configured — emails it to the studio.
export async function POST(request) {
  const data = await readJson(request);
  if (!data) return badRequest("Invalid request");

  // Honeypot: humans never see the `company` field, so a value means a bot.
  // Pretend success so the bot does not learn to skip the field.
  if (data.company) {
    console.warn("[aura360lab] Contact submission dropped (honeypot filled).");
    return NextResponse.json({ ok: true });
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const subject = String(data.subject || "").trim();
  const message = String(data.message || "").trim();

  if (!name || !email || !message) {
    return badRequest("Missing required fields.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest("Invalid email.");
  }

  console.log("[aura360lab] New contact inquiry:", {
    name,
    email,
    subject,
    message,
    at: new Date().toISOString(),
  });

  if (isDbEnabled) {
    try {
      await prisma.message.create({ data: { name, email, subject, body: message } });
    } catch (e) {
      console.error("[aura360lab] Failed to save contact inquiry:", e.message);
    }
  }

  await sendEmailNotification({ name, email, subject, message });

  return NextResponse.json({ ok: true });
}
