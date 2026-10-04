import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma, { isDbEnabled } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { dbDisabled, unauthorized, badRequest, readJson } from "@/lib/api";
import { deleteUploadedImages } from "@/lib/uploads";
import { SERVICE_KEYS } from "@/lib/service-videos";

export const runtime = "nodejs";

// Only videos uploaded through /api/upload/video (Vercel Blob) are accepted:
// the site plays them in a native <video> player.
function isBlobUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

async function guard(request) {
  if (!isAuthenticated()) return { error: unauthorized() };
  if (!isDbEnabled) return { error: dbDisabled() };
  const body = await readJson(request);
  if (!body) return { error: badRequest("Invalid request") };
  const service = String(body.service || "");
  if (!SERVICE_KEYS.includes(service)) return { error: badRequest("Unknown service.") };
  return { body, service };
}

// Set (or replace) a service's video. The replaced file is deleted.
export async function PUT(request) {
  const { error, body, service } = await guard(request);
  if (error) return error;

  const url = String(body.url || "").trim();
  if (!isBlobUrl(url)) return badRequest("Upload the video with the upload button.");

  try {
    const previous = await prisma.serviceVideo.findUnique({ where: { service } });
    const video = await prisma.serviceVideo.upsert({
      where: { service },
      create: { service, url },
      update: { url },
    });
    if (previous && previous.url !== url) await deleteUploadedImages([previous.url]);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, video });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// Remove a service's video and its file.
export async function DELETE(request) {
  const { error, service } = await guard(request);
  if (error) return error;

  try {
    const previous = await prisma.serviceVideo.findUnique({ where: { service } });
    if (previous) {
      await prisma.serviceVideo.delete({ where: { service } });
      await deleteUploadedImages([previous.url]);
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
