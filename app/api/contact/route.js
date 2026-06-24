import { NextResponse } from "next/server";

export const runtime = "nodejs";

// This starter does not send real email. It validates the payload and logs it
// server-side so the form works end-to-end in development. For production, wire
// this to Resend, Nodemailer/SMTP, or a CRM webhook (see README).
export async function POST(request) {
  let data = {};
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim();
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
    subject: String(data.subject || "").trim(),
    message,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
