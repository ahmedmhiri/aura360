import { NextResponse } from "next/server";
import { SESSION_COOKIE, signSession, adminPassword } from "@/lib/auth";
import { badRequest, readJson } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request) {
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
