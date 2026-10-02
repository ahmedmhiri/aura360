import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";

export default function AboutPreview({ locale, dict }) {
  return (
    <section className="bg-ink text-bone">
      <div className="mx-auto grid max-w-site grid-cols-1 gap-12 px-5 py-24 sm:px-8 md:grid-cols-12 md:gap-16 md:py-32">
        <div className="md:col-span-7">
          <Reveal>
            <span className="annotation text-blueprint-soft">{dict.eyebrow}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-7 font-display text-2xl font-medium uppercase leading-[1.18] tracking-tight text-bone sm:text-3xl md:text-[2.5rem]">
              {dict.statement}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href={`/${locale}/about`} className="link-underline mt-10 text-bone">
              {dict.more}
              <ArrowRight size={15} strokeWidth={1.75} />
            </Link>
          </Reveal>
        </div>

        <div className="md:col-span-5">
          <Reveal delay={0.1}>
            <div className="plate relative aspect-[4/5] w-full overflow-hidden text-bone/70">
              <Image
                src="/images/studio-plans.jpg"
                alt={dict.imageAlt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
