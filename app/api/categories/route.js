import { NextResponse } from "next/server";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

const dbDisabled = () =>
  NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
const unauthorized = () =>
  NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

export async function GET() {
  if (!isDbEnabled) return dbDisabled();
  try {
    const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ ok: true, categories });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const slug = String(body.slug || "").trim();
  const nameEn = String(body.nameEn || "").trim();
  const nameFr = String(body.nameFr || "").trim();
  if (!slug || !/^[a-z0-9-]+$/.test(slug))
    return NextResponse.json({ ok: false, error: "Invalid slug." }, { status: 400 });
  if (!nameEn || !nameFr)
    return NextResponse.json({ ok: false, error: "Both names are required." }, { status: 400 });

  try {
    const category = await prisma.category.create({
      data: { slug, nameEn, nameFr, order: parseInt(body.order, 10) || 0 },
    });
    return NextResponse.json({ ok: true, category }, { status: 201 });
  } catch (e) {
    const msg = e.code === "P2002" ? "That category slug already exists." : e.message;
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
