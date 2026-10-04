"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Play, X } from "lucide-react";

// "Watch the video" link for a service row; opens a full-screen player.
// The player is portalled to <body> so the row's reveal transform can't trap
// its fixed positioning.
export default function ServiceVideoButton({ src, title, label, closeLabel }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative z-10 mt-5 inline-flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-annotation text-ink transition-colors duration-500 hover:text-blueprint group-hover:text-bone"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current">
          <Play size={12} strokeWidth={2} className="translate-x-px" fill="currentColor" />
        </span>
        {label}
      </button>

      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
              onClick={() => setOpen(false)}
            >
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label={closeLabel}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-bone/40 text-bone transition-colors hover:bg-bone hover:text-ink sm:right-8 sm:top-8"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
              <video
                src={src}
                controls
                autoPlay
                playsInline
                className="aspect-video max-h-full w-full max-w-6xl bg-ink object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
}
