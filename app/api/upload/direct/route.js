import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { unauthorized, badRequest, readJson } from "@/lib/api";
import { MAX_VIDEO_BYTES, VIDEO_CONTENT_TYPES } from "@/lib/service-videos";

export const runtime = "nodejs";

// Files the serverless request limit (4.5 MB on Vercel) can't carry — videos
// and full-resolution 360° panoramas — go from the browser straight to Vercel
// Blob. This route only hands an authenticated admin a short-lived upload
// token, restricted by path prefix to the matching file types and size.
const RULES = {
  "videos/": { allowedContentTypes: VIDEO_CONTENT_TYPES, maximumSizeInBytes: MAX_VIDEO_BYTES },
  "images/": {
    allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
    maximumSizeInBytes: 60 * 1024 * 1024,
  },
};

export async function POST(request) {
  if (!isAuthenticated()) return unauthorized();
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "Direct uploads need BLOB_READ_WRITE_TOKEN (Vercel Blob)." },
      { status: 503 }
    );
  }

  const body = await readJson(request);
  if (!body) return badRequest("Invalid request body.");

  try {
    const { handleUpload } = await import("@vercel/blob/client");
    const json = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const prefix = Object.keys(RULES).find((p) => pathname.startsWith(p));
        if (!prefix) throw new Error("Invalid upload path.");
        return { ...RULES[prefix], addRandomSuffix: true };
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
