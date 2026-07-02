import { NextResponse } from "next/server";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { dbDisabled, unauthorized, badRequest, readJson } from "@/lib/api";

export const runtime = "nodejs";

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

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request");

  const slug = String(body.slug || "").trim();
  const nameEn = String(body.nameEn || "").trim();
  const nameFr = String(body.nameFr || "").trim();
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return badRequest("Invalid slug.");
  if (!nameEn || !nameFr) return badRequest("Both names are required.");

  try {
    const category = await prisma.category.create({
      data: { slug, nameEn, nameFr, order: parseInt(body.order, 10) || 0 },
    });
    return NextResponse.json({ ok: true, category }, { status: 201 });
  } catch (e) {
    const msg = e.code === "P2002" ? "That category slug already exists." : e.message;
    return badRequest(msg);
  }
}