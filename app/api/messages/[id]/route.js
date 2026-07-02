import { NextResponse } from "next/server";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { dbDisabled, unauthorized, badRequest, readJson } from "@/lib/api";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request");

  try {
    const message = await prisma.message.update({
      where: { id: params.id },
      data: { read: Boolean(body.read) },
    });
    return NextResponse.json({ ok: true, message });
  } catch (e) {
    return badRequest(e.message);
  }
}

export async function DELETE(request, { params }) {
  if (!isAuthenticated()) return unauthorized();
  if (!isDbEnabled) return dbDisabled();
  try {
    await prisma.message.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return badRequest(e.message);
  }
}