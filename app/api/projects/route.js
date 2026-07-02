import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { toProjectData, validateProjectData } from "@/lib/project-input";
import { dbDisabled, unauthorized, badRequest, readJson } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  if (!isDbEnabled) return dbDisabled();
  try {
    const projects = await prisma.project.findMany({
      include: { category: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ ok: true, projects });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request");

  const data = toProjectData(body);
  const error = validateProjectData(data, { requireCategory: true });
  if (error) return badRequest(error);

  try {
    const project = await prisma.project.create({ data });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (e) {
    const msg = e.code === "P2002" ? "A project with that slug already exists." : e.message;
    return badRequest(msg);
  }
}