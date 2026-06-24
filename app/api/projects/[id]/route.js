import { NextResponse } from "next/server";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { toProjectData, validateProjectData } from "@/lib/project-input";

export const runtime = "nodejs";

const dbDisabled = () =>
  NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });
const unauthorized = () =>
  NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

export async function GET(request, { params }) {
  if (!isDbEnabled) return dbDisabled();
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!project) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true, project });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();

  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const data = toProjectData(body);
  const error = validateProjectData(data, { requireCategory: true });
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });

  try {
    const project = await prisma.project.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true, project });
  } catch (e) {
    const msg = e.code === "P2002" ? "A project with that slug already exists." : e.message;
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
