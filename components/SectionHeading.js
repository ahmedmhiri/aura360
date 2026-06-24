import { Reveal } from "@/components/motion";

/**
 * Section heading with a mono eyebrow and a 360°-style index tick.
 * `index` is optional and only shown when the content is genuinely a catalog.
 */
export default function SectionHeading({ eyebrow, title, intro, index, align = "left" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-3xl"}>
      <Reveal>
        <div
          className={`flex items-center gap-3 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="annotation text-blueprint">{eyebrow}</span>
          {index ? <span className="annotation text-ash/70">{index}</span> : null}
        </div>
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
