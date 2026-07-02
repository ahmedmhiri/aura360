"use client";

import { useRef, useState } from "react";
import { Upload, X, Plus, Link2 } from "lucide-react";

const MAX_DIMENSION = 4096;
const JPEG_QUALITY = 0.88;

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

// Resizes the image client-side (preserving aspect ratio up to maxDimension)
// then uploads it to /api/upload, returning the stored URL.
// Falls back to a base64 data URL only if the upload API is unreachable.
async function uploadImage(file, maxDimension = MAX_DIMENSION, quality = JPEG_QUALITY) {
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // Convert canvas to Blob and POST to the upload API.
  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", quality));
  const form = new FormData();
  form.append("file", blob, "image.jpg");

  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  label,
  dict,
  maxDimension = MAX_DIMENSION,
  quality = JPEG_QUALITY,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  const images = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];

  const commit = (next) => onChange(multiple ? next : next[0] || "");

  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError("");
    setBusy(true);
    try {
      const uploaded = [];
      for (const file of files) {
        uploaded.push(await uploadImage(file, maxDimension, quality));
      }
      commit(multiple ? [...images, ...uploaded] : uploaded.slice(-1));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const addUrl = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    commit(multiple ? [...images, trimmed] : [trimmed]);
    setUrl("");
  };

  const removeAt = (i) => commit(images.filter((_, idx) => idx !== i));

  return (
    <div>
      {label ? <span className="annotation mb-2 block text-ash">{label}</span> : null}

      {images.length > 0 && (
        <div className={`mb-3 grid gap-3 ${multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"}`}>
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={`relative overflow-hidden border hairline bg-mist ${
                multiple ? "aspect-square" : "aspect-[16/10]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/80 text-bone transition-colors hover:bg-ink"
                aria-label={dict?.remove || "Remove"}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={onFiles}
          className="hidden"
          id={`upload-${label || "image"}`}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-annotation text-ink transition-colors hover:bg-ink hover:text-bone disabled:opacity-60"
        >
          {busy ? (
            dict?.uploading || "Uploading…"
          ) : (
            <>
              {multiple ? <Plus size={14} strokeWidth={2} /> : <Upload size={14} strokeWidth={2} />}
              {dict?.upload || "Upload image"}
            </>
          )}
        </button>

        <div className="flex flex-1 items-center gap-2 border-b border-line pb-1.5">
          <Link2 size={15} strokeWidth={1.5} className="text-ash" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="https://…  (or paste an image URL)"
            className="w-full bg-transparent font-mono text-[12px] text-ink placeholder:text-ash/70 focus:outline-none"
          />
          <button
            type="button"
            onClick={addUrl}
            className="font-mono text-[12px] uppercase tracking-annotation text-blueprint"
          >
            Add
          </button>
        </div>
      </div>

      {error ? <p className="mt-2 text-sm text-blueprint">{error}</p> : null}
    </div>
  );
}
