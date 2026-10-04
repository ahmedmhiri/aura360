// Browser-side upload straight to Vercel Blob, for files the serverless request
// limit (4.5 MB on Vercel) can't carry: videos and full-resolution panoramas.
// /api/upload/direct only issues the token. `pathname` must start with
// "videos/" or "images/". Returns the public URL.
export async function uploadDirect(file, pathname, contentType, onProgress) {
  const { upload } = await import("@vercel/blob/client");
  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/upload/direct",
    contentType,
    multipart: file.size > 50 * 1024 * 1024,
    onUploadProgress: ({ percentage }) => onProgress?.(Math.round(percentage)),
  });
  return blob.url;
}

// True when an MP4/MOV keeps its index ("moov") before the media data, so a
// browser can start playing before the whole file arrives ("Fast Start" /
// "Web optimized" on export). Reads only the 8–16 byte box headers.
export async function isFastStart(file) {
  let offset = 0;
  for (let i = 0; i < 64 && offset + 8 <= file.size; i++) {
    const head = new DataView(await file.slice(offset, offset + 16).arrayBuffer());
    let size = head.getUint32(0);
    const type = String.fromCharCode(
      head.getUint8(4), head.getUint8(5), head.getUint8(6), head.getUint8(7)
    );
    if (type === "moov") return true;
    if (type === "mdat") return false;
    if (size === 1 && head.byteLength >= 16) size = Number(head.getBigUint64(8)); // 64-bit size
    if (size < 8) return true; // unknown layout: don't warn
    offset += size;
  }
  return true;
}
