"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Plus, Link2 } from "lucide-react";

/**
 * Image field for the admin form. Supports direct file upload (to /api/upload)
 * and pasting an existing image URL. Works as a single field or a multi-image
 * gallery depending on the `multiple` prop.
 *
 * value:    string (single) | string[] (multiple)
 * onChange: (next) => void   // same shape as value
 */
export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  label,
  dict,
}) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");

  const images = multiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];

  const commit = (next) => onChange(multiple ? next : next[0] || "");

  const uploadFiles = async (files) => {
    setError("");
    setBusy(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed");
        uploaded.push(data.url);
      }
      commit(multiple ? [...images, ...uploaded] : uploaded.slice(-1));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) uploadFiles(files);
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

      {/* Previews */}
      {images.length > 0 && (
        <div className={`mb-3 grid gap-3 ${multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1"}`}>
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className={`relative overflow-hidden border hairline bg-mist ${
                multiple ? "aspect-square" : "aspect-[16/10]"
              }`}
            >
              {/* Plain <img> keeps arbitrary upload/remote URLs simple in admin. */}
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

      {/* Upload control */}
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
