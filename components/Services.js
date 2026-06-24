import Link from "next/link";
import Image from "next/image";
import { Building2, Box, Armchair, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import SectionHeading from "@/components/SectionHeading";

const SERVICES = [
  { key: "architecture", Icon: Building2, category: "architecture", seed: "svc-arch" },
  { key: "visualization", Icon: Box, category: "visualization", seed: "svc-viz" },
  { key: "interior", Icon: Armchair, category: "interior", seed: "svc-int" },
];

export default function Services({ locale, dict }) {
  return (
    <section className="mx-auto max-w-site px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading
        eyebrow={dict.eyebrow}
        title={dict.title}
        intro={dict.intro}
      />

      <div className="mt-16 border-t hairline">
        {SERVICES.map(({ key, Icon, category, seed }, i) => {
          const item = dict.items[key];
          return (
            <Reveal key={key} delay={i * 0.06}>
              <Link
                href={`/${locale}/portfolio?category=${category}`}
                className="group relative grid grid-cols-1 items-center gap-6 border-b hairline py-10 transition-colors duration-500 ease-smooth hover:bg-ink md:grid-cols-12 md:gap-8 md:py-12"
              >
                <div className="flex items-center gap-5 md:col-span-5">
                  <span className="annotation text-ash transition-colors duration-500 group-hover:text-bone/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    size={26}
                    strokeWidth={1.25}
                    className="text-ink transition-colors duration-500 group-hover:text-bone"
                  />
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-tightest text-ink transition-colors duration-500 group-hover:text-bone sm:text-3xl md:text-4xl">
                    {item.name}
                  </h3>
                </div>

                <p className="max-w-xl text-sm leading-relaxed text-graphite/80 transition-colors duration-500 group-hover:text-bone/70 md:col-span-6">
                  {item.description}
                </p>

                <div className="flex items-center justify-start md:col-span-1 md:justify-end">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-all duration-500 group-hover:border-bone group-hover:text-bone">
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                      className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>

                {/* Floating render preview on hover (desktop) */}
                <div className="pointer-events-none absolute right-24 top-1/2 hidden h-28 w-44 -translate-y-1/2 overflow-hidden opacity-0 transition-all duration-500 ease-smooth group-hover:opacity-100 lg:block">
                  <Image
                    src={`https://picsum.photos/seed/${seed}/600/400`}
                    alt=""
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
