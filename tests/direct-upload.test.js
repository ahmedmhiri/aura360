import { describe, it, expect } from "vitest";
import { isFastStart } from "@/lib/direct-upload";

// Build an MP4-like file from [type, payloadBytes] boxes.
function mp4(boxes) {
  const parts = boxes.map(([type, len]) => {
    const buf = new Uint8Array(8 + len);
    new DataView(buf.buffer).setUint32(0, 8 + len);
    buf.set([...type].map((c) => c.charCodeAt(0)), 4);
    return buf;
  });
  return new Blob(parts);
}

describe("isFastStart", () => {
  it("is true when moov comes before mdat (web-optimized export)", async () => {
    expect(await isFastStart(mp4([["ftyp", 16], ["moov", 64], ["mdat", 4096]]))).toBe(true);
  });

  it("is false when mdat comes first (index at the end)", async () => {
    expect(await isFastStart(mp4([["ftyp", 16], ["free", 0], ["mdat", 4096], ["moov", 64]]))).toBe(false);
  });

  it("does not warn on files it cannot parse", async () => {
    expect(await isFastStart(new Blob([new Uint8Array(4)]))).toBe(true);
  });
});
