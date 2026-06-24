import { getDictionary } from "@/i18n/dictionaries";
import { getProjects, getCategories } from "@/lib/projects";
import { Reveal } from "@/components/motion";
import PortfolioGrid from "@/components/PortfolioGrid";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  return {
    title: dict.portfolio.title,
    description: dict.portfolio.intro,
    alternates: {
      canonical: `/${locale}/portfolio`,
      languages: { en: "/en/portfolio", fr: "/fr/portfolio" },
    },
  };
}

export default async function PortfolioPage({ params, searchParams }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const [projects, categories] = await Promise.all([
    getProjects({}),
    getCategories(),
  ]);

  const initialCategory =
    typeof searchParams?.category === "string" ? searchParams.category : "all";

  return (
    <div className="mx-auto max-w-site px-5 pb-24 pt-32 sm:px-8 sm:pt-36 md:pb-32">
      <header className="max-w-3xl">
        <Reveal>
          <span className="annotation text-blueprint">{dict.nav.portfolio}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.98] tracking-tightest text-ink sm:text-6xl md:text-7xl">
            {dict.portfolio.title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite/80 sm:text-lg">
            {dict.portfolio.intro}
          </p>
        </Reveal>
      </header>

      <div className="mt-14">
        <PortfolioGrid
          projects={projects}
          categories={categories}
          locale={locale}
          dict={dict.portfolio}
          initialCategory={initialCategory}
        />
      </div>
    </div>
  );
}
