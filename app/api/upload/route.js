import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { unauthorized, badRequest } from "@/lib/api";

export const runtime = "nodejs";

const ALLOWED = ["jpg", "jpeg", "png", "webp", "avif", "gif"];

export async function POST(request) {
  if (!isAuthenticated()) return unauthorized();

  let form;
  try {
    form = await request.formData();
  } catch {
    return badRequest("Invalid form data");
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return badRequest("No file provided.");
  }

  const ext =
    file.name && file.name.includes(".")
      ? file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "")
      : "jpg";
  if (!ALLOWED.includes(ext)) {
    return badRequest("Unsupported file type.");
  }

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Use Vercel Blob when available (production), fall back to /public/uploads in dev.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const { url } = await put(`uploads/${name}`, file.stream(), {
        access: "public",
        contentType: file.type || "image/jpeg",
      });
      return NextResponse.json({ ok: true, url });
    } catch (e) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
    }
  }

  // Local dev fallback: write to /public/uploads/
  try {
    const { writeFile, mkdir } = await import("fs/promises");
    const { join } = await import("path");
    const dir = join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, name), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ ok: true, url: `/uploads/${name}` });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
