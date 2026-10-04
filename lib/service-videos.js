import prisma, { isDbEnabled } from "@/lib/prisma";

// The three services shown on the home page; each can have one video.
export const SERVICE_KEYS = ["architecture", "visualization", "interior"];

export const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB
export const VIDEO_CONTENT_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

// Returns { [serviceKey]: url } for the services that have a video.
export async function getServiceVideos() {
  if (!isDbEnabled) return {};
  try {
    const rows = await prisma.serviceVideo.findMany();
    return Object.fromEntries(
      rows.filter((r) => SERVICE_KEYS.includes(r.service)).map((r) => [r.service, r.url])
    );
  } catch (e) {
    console.warn("[aura360lab] getServiceVideos failed:", e?.message);
    return {};
  }
}
