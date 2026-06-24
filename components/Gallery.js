"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Gallery({ images = [], title = "" }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const show = (i) => {
    setCurrent(i);
    setOpen(true);
  };
  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => show(i)}
            className={`group relative w-full overflow-hidden bg-mist ${
              i % 3 === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
            }`}
            aria-label={`Open image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${title} — ${i + 1}`}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              unoptimized={src.startsWith("data:")}
              className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/96 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-5 top-5 text-bone/80 transition-colors hover:text-bone"
              aria-label="Close gallery"
            >
              <X size={26} strokeWidth={1.5} />
            </button>

            <span className="annotation absolute left-5 top-6 text-bone/70">
              {String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 text-bone/70 transition-colors hover:text-bone sm:left-6"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} strokeWidth={1.25} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-bone/70 transition-colors hover:text-bone sm:right-6"
                  aria-label="Next image"
                >
                  <ChevronRight size={32} strokeWidth={1.25} />
                </button>
              </>
            )}

            <motion.div
              key={current}
              className="relative h-[78vh] w-[92vw] max-w-5xl"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[current]}
                alt={`${title} — ${current + 1}`}
                fill
                sizes="92vw"
                unoptimized={images[current].startsWith("data:")}
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
