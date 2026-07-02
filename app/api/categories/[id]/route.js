import { NextResponse } from "next/server";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { dbDisabled, unauthorized, badRequest, readJson } from "@/lib/api";
import { deleteUploadedImages, projectImageUrls } from "@/lib/uploads";

export const runtime = "nodejs";

export async function PUT(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request");

  const data = {};
  if (body.slug != null) data.slug = String(body.slug).trim();
  if (body.nameEn != null) data.nameEn = String(body.nameEn).trim();
  if (body.nameFr != null) data.nameFr = String(body.nameFr).trim();
  if (body.order != null) data.order = parseInt(body.order, 10) || 0;

  try {
    const category = await prisma.category.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true, category });
  } catch (e) {
    return badRequest(e.message);
  }
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();
  try {
    // Projects in this category are removed via the schema's cascade rule, so
    // grab their image URLs first and clean those up after the delete.
    const projects = await prisma.project.findMany({
      where: { categoryId: params.id },
      select: { coverImage: true, gallery: true, panoramas: true },
    });
    await prisma.category.delete({ where: { id: params.id } });
    await deleteUploadedImages(projects.flatMap(projectImageUrls));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return badRequest(e.message);
  }
}