import { NextResponse } from "next/server";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

const dbDisabled = () =>
  NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
const unauthorized = () =>
  NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

export async function PATCH(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  try {
    const message = await prisma.message.update({
      where: { id: params.id },
      data: { read: Boolean(body.read) },
    });
    return NextResponse.json({ ok: true, message });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();
  try {
    await prisma.message.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
