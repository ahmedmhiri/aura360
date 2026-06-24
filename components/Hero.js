"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Pano360 from "@/components/Pano360";

const DURATION = 6000;

export default function Hero({ locale, dict, images }) {
  const reduce = useReducedMotion();
  const slides = images && images.length ? images : [];
  const [index, setIndex] = useState(0);
  const [interacting, setInteracting] = useState(false);
  // Bumped every time a fresh countdown starts (slide change or resume from a
  // pause), so the progress bar below can key off it and restart from 0%.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (slides.length <= 1 || interacting) return;
    setTick((t) => t + 1);
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, DURATION);
    return () => clearInterval(id);
  }, [slides.length, interacting, index]);

  const lines = dict.title.split("\n");

  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink text-bone">
      {/* Slideshow */}
      <div className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {slides[index] ? (
              slides[index].is360 ? (
                <Pano360
                  src={slides[index].src}
                  className="absolute inset-0 h-full w-full"
                  onInteractingChange={setInteracting}
                />
              ) : (
                <motion.div
                  className="absolute inset-0"
                  initial={reduce ? false : { scale: 1.08 }}
                  animate={reduce ? false : { scale: 1 }}
                  transition={{ duration: DURATION / 1000 + 1.4, ease: "linear" }}
                >
                  <Image
                    src={slides[index].src}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    unoptimized={slides[index].src.startsWith("data:")}
                    className="object-cover"
                  />
                </motion.div>
              )
            ) : (
              <div className="absolute inset-0 bg-graphite" />
            )}
          </motion.div>
        </AnimatePresence>
        {/* Aura: soft light gradient + bottom shade for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/55" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(0,0,0,0.55),transparent)]" />
      </div>

      {/* Top annotation row */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 pt-24 sm:pt-28">
        <div className="mx-auto flex max-w-site items-center justify-between px-5 sm:px-8">
          <motion.span
            className="annotation text-bone/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {dict.eyebrow}
          </motion.span>
          <motion.span
            className="annotation hidden items-center gap-2 text-bone/70 sm:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span
              className="inline-block h-3 w-3 rounded-full border border-blueprint-soft/80 border-t-transparent"
              style={reduce ? {} : { animation: "spin 3.5s linear infinite" }}
            />
            {dict.panorama}
          </motion.span>
        </div>
      </div>

      {/* Headline + CTAs */}
      <div className="pointer-events-none relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-site px-5 pb-16 sm:px-8 sm:pb-20">
          <h1 className="font-display text-5xl font-bold uppercase text-bone display-tight sm:text-7xl lg:text-8xl">
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? { opacity: 0 } : { y: "110%" }}
                  animate={reduce ? { opacity: 1 } : { y: 0 }}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-lg text-base leading-relaxed text-bone/80 sm:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {dict.subtitle}
          </motion.p>

          <motion.div
            className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
          >
            <Link
              href={`/${locale}/portfolio`}
              className="inline-flex items-center justify-center gap-2 bg-bone px-7 py-3.5 font-mono text-[12px] uppercase tracking-annotation text-ink transition-colors duration-300 hover:bg-mist"
            >
              {dict.viewPortfolio}
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center gap-2 border border-bone/40 px-7 py-3.5 font-mono text-[12px] uppercase tracking-annotation text-bone transition-colors duration-300 hover:bg-bone hover:text-ink"
            >
              {dict.contact}
            </Link>
          </motion.div>

          {/* Slide index + progress */}
          {slides.length > 1 && (
            <div className="mt-12 flex items-center gap-4">
              <span className="annotation text-bone/70">
                {String(index + 1).padStart(3, "0")} / {String(slides.length).padStart(3, "0")}
              </span>
              <div className="h-px flex-1 max-w-[220px] bg-bone/25">
                <motion.div
                  key={tick}
                  className="h-full bg-bone"
                  initial={{ width: reduce ? "100%" : "0%" }}
                  animate={interacting ? undefined : { width: "100%" }}
                  transition={{ duration: reduce ? 0 : DURATION / 1000, ease: "linear" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
