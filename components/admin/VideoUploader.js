"use client";

import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { uploadDirect, isFastStart } from "@/lib/direct-upload";

export const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime";

export async function uploadVideo(file, folder, onProgress) {
  const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
  return uploadDirect(file, `videos/${folder}.${ext}`, file.type || "video/mp4", onProgress);
}

export { isFastStart };

// Multiple-video field for the project form: previews, remove, and an upload
// button with progress. `value` is an array of URLs.
export default function VideoUploader({ value, onChange, label, dict }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null); // null = idle
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const videos = Array.isArray(value) ? value : [];

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError("");
    setWarning("");
    try {
      const slow = [];
      for (const file of files) if (!(await isFastStart(file))) slow.push(file.name);
      if (slow.length) setWarning(`${slow.join(", ")}: ${dict?.videoNotOptimized || ""}`);
      const uploaded = [];
      for (const [i, file] of files.entries()) {
        const url = await uploadVideo(file, "projects/video", (p) =>
          setProgress(Math.round((i * 100 + p) / files.length))
        );
        uploaded.push(url);
      }
      onChange([...videos, ...uploaded]);
    } catch (err) {
      setError(err.message);
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      {label ? <span className="annotation mb-2 block text-ash">{label}</span> : null}

      {videos.length > 0 && (
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {videos.map((src, i) => (
            <div key={`${src}-${i}`} className="relative border hairline bg-ink">
              <video src={src} controls preload="metadata" className="aspect-video w-full" />
              <button
                type="button"
                onClick={() => onChange(videos.filter((_, idx) => idx !== i))}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-bone transition-colors hover:bg-ink"
                aria-label={dict?.remove || "Remove"}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={VIDEO_ACCEPT}
        multiple
        onChange={onFiles}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={progress !== null}
        className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-annotation text-ink transition-colors hover:bg-ink hover:text-bone disabled:opacity-60"
      >
        <Plus size={14} strokeWidth={2} />
        {progress !== null
          ? `${dict?.uploading || "Uploading…"} ${progress}%`
          : dict?.uploadVideo || "Upload video"}
      </button>

      {progress !== null ? (
        <div className="mt-3 h-1 w-full bg-line">
          <div className="h-1 bg-blueprint transition-all" style={{ width: `${progress}%` }} />
        </div>
      ) : null}
      {warning ? <p className="mt-2 text-sm text-blueprint">⚠ {warning}</p> : null}
      {error ? <p className="mt-2 text-sm text-blueprint">{error}</p> : null}
    </div>
  );
}
