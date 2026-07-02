// Best-effort deletion of uploaded images when their project is removed, so
// files don't accumulate forever. Handles both storage backends used by
// /api/upload: Vercel Blob (production) and /public/uploads (local dev).
// External URLs (e.g. picsum placeholders or hand-pasted links) are ignored.

function isBlobUrl(url) {
  try {
    return new URL(url).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export async function deleteUploadedImages(urls) {
  const unique = [...new Set((urls || []).filter(Boolean))];
  if (!unique.length) return;

  const blobUrls = unique.filter(isBlobUrl);
  const localUrls = unique.filter((u) => u.startsWith("/uploads/"));

  if (blobUrls.length && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { del } = await import("@vercel/blob");
      await del(blobUrls);
    } catch (e) {
      console.warn("[aura360lab] Failed to delete blob uploads:", e.message);
    }
  }

  if (localUrls.length) {
    try {
      const { unlink } = await import("fs/promises");
      const { join, basename } = await import("path");
      const dir = join(process.cwd(), "public", "uploads");
      await Promise.all(
        localUrls.map((u) =>
          // basename() strips any path segments, preventing traversal.
          unlink(join(dir, basename(u))).catch(() => {})
        )
      );
    } catch (e) {
      console.warn("[aura360lab] Failed to delete local uploads:", e.message);
    }
  }
}

// All image URLs referenced by a project row.
export function projectImageUrls(project) {
  if (!project) return [];
  return [
    project.coverImage,
    ...(project.gallery || []),
    ...(project.panoramas || []),
  ];
}
