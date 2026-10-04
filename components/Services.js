import Link from "next/link";
import Image from "next/image";
import { Building2, Box, Armchair, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion";
import SectionHeading from "@/components/SectionHeading";
import ServiceVideoButton from "@/components/ServiceVideoButton";

const SERVICES = [
  { key: "architecture", Icon: Building2, category: "architecture" },
  { key: "visualization", Icon: Box, category: "visualization" },
  { key: "interior", Icon: Armchair, category: "interior" },
];

// `previews` maps a service key to a render shown on hover; a service without
// one (architecture, until the studio has a logo file) shows the wordmark.
// `videos` maps a service key to the video uploaded in the admin.
// The whole row links to the portfolio through a stretched link, so the
// video button can sit inside it without nesting interactive elements.
export default function Services({ locale, dict, previews = {}, videos = {} }) {
  return (
    <section className="mx-auto max-w-site px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading
        eyebrow={dict.eyebrow}
        title={dict.title}
        intro={dict.intro}
      />

      <div className="mt-16 border-t hairline">
        {SERVICES.map(({ key, Icon, category }, i) => {
          const item = dict.items[key];
          return (
            <Reveal key={key} delay={i * 0.06}>
              <div className="group relative grid grid-cols-1 items-center gap-6 border-b hairline py-10 transition-colors duration-500 ease-smooth hover:bg-ink md:grid-cols-12 md:gap-8 md:py-12">
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
                    <Link
                      href={`/${locale}/portfolio?category=${category}`}
                      className="after:absolute after:inset-0 focus:outline-none focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:outline-blueprint"
                    >
                      {item.name}
                    </Link>
                  </h3>
                </div>

                <div className="max-w-xl md:col-span-6">
                  <p className="text-sm leading-relaxed text-graphite/80 transition-colors duration-500 group-hover:text-bone/70">
                    {item.description}
                  </p>
                  {videos[key] ? (
                    <ServiceVideoButton
                      src={videos[key]}
                      title={item.name}
                      label={dict.watchVideo}
                      closeLabel={dict.closeVideo}
                    />
                  ) : null}
                </div>

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
                  {previews[key] ? (
                    <Image
                      src={previews[key]}
                      alt=""
                      fill
                      sizes="220px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center border border-bone/30 bg-ink">
                      <span className="font-display text-lg font-bold uppercase tracking-tightest text-bone">
                        AURA<span className="text-blueprint-soft">360</span>LAB
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
