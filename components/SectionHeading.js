import { Reveal } from "@/components/motion";

/** Section heading with a mono eyebrow, title and optional intro. */
export default function SectionHeading({ eyebrow, title, intro }) {
  return (
    <div className="max-w-3xl">
      <Reveal>
        <span className="annotation text-blueprint">{eyebrow}</span>
      </Reveal>
      {title ? (
        <Reveal delay={0.05}>
          <h2 className="mt-5 font-display text-3xl font-semibold uppercase leading-[1.05] tracking-tightest text-ink sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </Reveal>
      ) : null}
      {intro ? (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite/80 sm:text-lg">
            {intro}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
