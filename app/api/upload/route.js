import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED = ["jpg", "jpeg", "png", "webp", "avif", "gif"];

// Saves uploads to /public/uploads and returns a public URL.
// NOTE: on serverless hosts (e.g. Vercel) the filesystem is ephemeral and not
// shared between instances — swap this for S3 / Cloudinary / UploadThing in
// production. See the README "Image uploads" section.
export async function POST(request) {
  if (!isAuthenticated())
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }

  const ext =
    file.name && file.name.includes(".")
      ? file.name.split(".").pop().toLowerCase().replace(/[^a-z0-9]/g, "")
      : "jpg";
  if (!ALLOWED.includes(ext)) {
    return NextResponse.json({ ok: false, error: "Unsupported file type." }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), bytes);
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}
