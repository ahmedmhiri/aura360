import { NextResponse } from "next/server";
import prisma, { isDbEnabled } from "@/lib/prisma";

export const runtime = "nodejs";

// This starter does not send real email. It saves the inquiry to the database
// (readable from the admin Messages page) and also logs it server-side. For
// production, you could additionally wire this to Resend, Nodemailer/SMTP, or
// a CRM webhook (see README).
export async function POST(request) {
  let data = {};
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
  const subject = String(data.subject || "").trim();
  const message = String(data.message || "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
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

  return NextResponse.json({ ok: true });
}
