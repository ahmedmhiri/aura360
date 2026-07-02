import { NextResponse } from "next/server";
import { SESSION_COOKIE, signSession, adminPassword } from "@/lib/auth";
import { badRequest, readJson } from "@/lib/api";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Max 5 login attempts per IP per 15 minutes (see lib/rate-limit.js for the
// in-memory caveat and how to swap in a shared store).
const loginLimiter = rateLimit({ limit: 5, windowMs: 15 * 60 * 1000 });

export async function POST(request) {
  const { ok, retryAfterSeconds } = loginLimiter.check(clientIp(request));
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request");

  if (!body.password || body.password !== adminPassword()) {
    return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: signSession(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
