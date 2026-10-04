"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2 } from "lucide-react";
import { uploadVideo, isFastStart, VIDEO_ACCEPT } from "@/components/admin/VideoUploader";

// One row per service: preview the current video, upload a new one straight
// to Vercel Blob (with progress), or remove it.
function ServiceVideoRow({ service, name, url, dict, canEdit }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null); // null = idle, 0–100 = uploading
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const save = async (method, body) => {
    const res = await fetch("/api/service-videos", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || "Save failed");
  };

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setWarning("");
    setBusy(true);
    setProgress(0);
    try {
      if (!(await isFastStart(file))) setWarning(dict.videoNotOptimized);
      const url = await uploadVideo(file, `services/${service}`, setProgress);
      await save("PUT", { service, url });
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async () => {
    if (!window.confirm(dict.confirmDelete)) return;
    setError("");
    setBusy(true);
    try {
      await save("DELETE", { service });
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 border-b hairline py-8 md:grid-cols-12">
      <div className="md:col-span-4">
        <h2 className="font-display text-xl font-semibold uppercase tracking-tightest text-ink">
          {name}
        </h2>
        <p className="annotation mt-2 text-ash">{url ? dict.hasVideo : dict.noVideo}</p>
      </div>

      <div className="md:col-span-8">
        {url ? (
          <video
            key={url}
            src={url}
            controls
            preload="metadata"
            className="aspect-video w-full border hairline bg-ink"
          />
        ) : null}

        <div className={`flex flex-wrap items-center gap-3 ${url ? "mt-4" : ""}`}>
          <input
            ref={inputRef}
            type="file"
            accept={VIDEO_ACCEPT}
            onChange={onFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={!canEdit || busy}
            className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-annotation text-ink transition-colors hover:bg-ink hover:text-bone disabled:opacity-60"
          >
            <Upload size={14} strokeWidth={2} />
            {progress !== null
              ? `${dict.uploading} ${progress}%`
              : url
              ? dict.replace
              : dict.upload}
          </button>
          {url ? (
            <button
              type="button"
              onClick={remove}
              disabled={!canEdit || busy}
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-annotation text-ash transition-colors hover:text-blueprint disabled:opacity-60"
            >
              <Trash2 size={14} strokeWidth={1.75} />
              {dict.remove}
            </button>
          ) : null}
        </div>

        {progress !== null ? (
          <div className="mt-3 h-1 w-full bg-line">
            <div className="h-1 bg-blueprint transition-all" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
        {warning ? <p className="mt-3 text-sm text-blueprint">⚠ {warning}</p> : null}
        {error ? <p className="mt-3 text-sm text-blueprint">{error}</p> : null}
      </div>
    </div>
  );
}

export default function ServiceVideoManager({ services, dict, canEdit }) {
  return (
    <div className="border-t hairline">
      {services.map((s) => (
        <ServiceVideoRow key={s.key} service={s.key} name={s.name} url={s.url} dict={dict} canEdit={canEdit} />
      ))}
    </div>
  );
}
