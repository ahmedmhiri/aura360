import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";

export default function ContactCTA({ locale, dict }) {
  return (
    <section className="border-t hairline bg-bone">
      <div className="mx-auto max-w-site px-5 py-24 sm:px-8 md:py-32">
        <Reveal>
          <span className="annotation text-blueprint">{dict.eyebrow}</span>
        </Reveal>
        <div className="mt-6 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <Reveal delay={0.05}>
            <h2 className="max-w-2xl font-display text-4xl font-bold uppercase leading-[0.98] tracking-tightest text-ink sm:text-6xl md:text-7xl">
              {dict.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="max-w-sm">
              <p className="text-base leading-relaxed text-graphite/80">{dict.body}</p>
              <Link href={`/${locale}/contact`} className="btn-primary mt-7">
                {dict.button}
                <ArrowRight size={15} strokeWidth={1.75} />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
