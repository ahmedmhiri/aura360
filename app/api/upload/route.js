import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { unauthorized, badRequest } from "@/lib/api";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

// Sniff the actual image format from the file's leading bytes — the extension
// and client-supplied MIME type are trivial to spoof. Returns the canonical
// extension, or null when the bytes match no supported format.
function sniffImageType(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "gif";
  // RIFF....WEBP
  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  )
    return "webp";
  // ISO-BMFF: ....ftypavif / ftypavis
  const brand = buf.toString("ascii", 4, 12);
  if (brand === "ftypavif" || brand === "ftypavis") return "avif";
  return null;
}

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
  if (!file.type?.startsWith("image/")) {
    return badRequest("Only image uploads are allowed.");
  }
  if (file.size > MAX_BYTES) {
    return badRequest("Image is too large (maximum 15 MB).");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_BYTES) {
    return badRequest("Image is too large (maximum 15 MB).");
  }

  const ext = sniffImageType(buffer);
  if (!ext) {
    return badRequest("Unsupported file type. Use JPEG, PNG, WebP, AVIF or GIF.");
  }

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Use Vercel Blob when available (production), fall back to /public/uploads in dev.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import("@vercel/blob");
      const { url } = await put(`uploads/${name}`, buffer, {
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
    await writeFile(join(dir, name), buffer);
    return NextResponse.json({ ok: true, url: `/uploads/${name}` });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
