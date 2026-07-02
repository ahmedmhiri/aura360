import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { toProjectData, validateProjectData } from "@/lib/project-input";
import { dbDisabled, unauthorized, badRequest, readJson } from "@/lib/api";

export const runtime = "nodejs";

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

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request");

  const data = toProjectData(body);
  const error = validateProjectData(data, { requireCategory: true });
  if (error) return badRequest(error);

  try {
    const project = await prisma.project.update({ where: { id: params.id }, data });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, project });
  } catch (e) {
    const msg = e.code === "P2002" ? "A project with that slug already exists." : e.message;
    return badRequest(msg);
  }
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();
  try {
    await prisma.project.delete({ where: { id: params.id } });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return badRequest(e.message);
  }
}