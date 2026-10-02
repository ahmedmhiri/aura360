import Image from "next/image";
import { getDictionary } from "@/i18n/dictionaries";
import { team } from "@/lib/site";
import { Reveal } from "@/components/motion";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  return {
    title: dict.about.title,
    description: dict.about.lead,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/en/about", fr: "/fr/about", "x-default": "/en/about" },
    },
  };
}

export default async function AboutPage({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const t = dict.about;

  return (
    <div className="pt-32 sm:pt-36">
      {/* Lead */}
      <section className="mx-auto max-w-site px-5 sm:px-8">
        <Reveal>
          <span className="annotation text-blueprint">{dict.nav.about}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-5 max-w-4xl font-display text-3xl font-medium uppercase leading-[1.1] tracking-tight text-ink sm:text-4xl md:text-5xl">
            {t.lead}
          </h1>
        </Reveal>
      </section>

      {/* Story */}
      <section className="mx-auto mt-20 max-w-site px-5 sm:px-8 md:mt-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold uppercase tracking-tightest text-ink sm:text-3xl">
                {t.storyTitle}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="plate relative mt-8 aspect-[4/5] w-full overflow-hidden bg-mist text-ink/40">
                <Image
                  src="/images/studio-founders.jpg"
                  alt={t.storyImageAlt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:pt-14">
            <Reveal delay={0.05}>
              <p className="font-display text-xl font-medium uppercase leading-[1.25] tracking-tight text-ink sm:text-2xl">
                {t.storyHeadline}
              </p>
            </Reveal>
            <div className="mt-8 space-y-5">
              {t.story.map((paragraph, i) => (
                <Reveal key={i} delay={0.05 + i * 0.04}>
                  <p className="text-base leading-relaxed text-graphite/90 sm:text-lg">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="mt-24 bg-ink text-bone md:mt-32">
        <div className="mx-auto max-w-site px-5 py-24 sm:px-8 md:py-32">
          <Reveal>
            <span className="annotation text-blueprint-soft">{t.visionTitle}</span>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-8 max-w-4xl font-display text-2xl font-medium uppercase leading-[1.2] tracking-tight text-bone sm:text-3xl md:text-[2.5rem]">
              {t.visionHeadline}
            </p>
          </Reveal>
          <div className="mt-10 max-w-2xl space-y-5">
            {t.vision.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 + i * 0.04}>
                <p className="text-base leading-relaxed text-bone/75 sm:text-lg">{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto mt-24 max-w-site px-5 pb-24 sm:px-8 md:mt-32 md:pb-32">
        <div className="max-w-3xl">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold uppercase tracking-tightest text-ink sm:text-4xl md:text-5xl">
              {t.teamTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-graphite/80 sm:text-lg">
              {t.teamIntro}
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden border hairline bg-line md:grid-cols-2">
          {team.map((member, i) => (
            <Reveal key={member.bioKey} delay={i * 0.07}>
              <div className="h-full bg-bone p-8 md:p-12">
                <h3 className="font-display text-2xl font-semibold uppercase tracking-tightest text-ink sm:text-3xl">
                  {member.name}
                </h3>
                <p className="annotation mt-3 text-blueprint">{dict.team[member.roleKey]}</p>
                <p className="mt-6 text-base leading-relaxed text-graphite/90">
                  {dict.team.bios[member.bioKey]}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
