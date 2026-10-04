"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const Pano360 = dynamic(() => import("@/components/Pano360"), { ssr: false });

// Inline (non-modal) viewer for one or more 360° panoramas. A modal lightbox
// would conflict with drag-to-look: releasing a drag on the backdrop would
// read as a "close" click, so this renders directly in the page flow instead.
export default function PanoramaGallery({ images = [], title = "" }) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  return (
    <div>
      {/* Taller on phones: a 16:9 strip is only ~220px high on a portrait
          screen, too small to look around in. */}
      <div className="plate relative aspect-[4/5] w-full overflow-hidden bg-mist sm:aspect-[16/9] lg:aspect-[2/1]">
        <Pano360 src={images[active]} className="absolute inset-0 h-full w-full" />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-16 w-28 shrink-0 overflow-hidden border transition-colors ${
                i === active ? "border-ink" : "border-line hover:border-ash"
              }`}
              aria-label={`${title} — panorama ${i + 1}`}
            >
              {/* Small optimized thumbnail — not the full 8192px panorama. */}
              <Image src={src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
