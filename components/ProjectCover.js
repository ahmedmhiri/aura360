"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Pano360 = dynamic(() => import("@/components/Pano360"), { ssr: false });

export default function ProjectCover({ src, is360, title }) {
  if (!src) return null;
  if (is360) {
    return <Pano360 src={src} className="absolute inset-0 h-full w-full" />;
  }
  return (
    <Image
      src={src}
      alt={title}
      fill
      priority
      sizes="(min-width: 1480px) 1480px, 100vw"
      unoptimized={src.startsWith("data:")}
      className="object-cover"
    />
  );
}
