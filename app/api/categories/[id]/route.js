import { NextResponse } from "next/server";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

const dbDisabled = () =>
  NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
const unauthorized = () =>
  NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

export async function PUT(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const data = {};
  if (body.slug != null) data.slug = String(body.slug).trim();
  if (body.nameEn != null) data.nameEn = String(body.nameEn).trim();
  if (body.nameFr != null) data.nameFr = String(body.nameFr).trim();
  if (body.order != null) data.order = parseInt(body.order, 10) || 0;

  try {
    const category = await prisma.category.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true, category });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();
  try {
    // Projects in this category are removed via the schema's cascade rule.
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
