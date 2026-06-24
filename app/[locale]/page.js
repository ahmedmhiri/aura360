import { getDictionary } from "@/i18n/dictionaries";
import { getFeaturedProjects } from "@/lib/projects";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutPreview from "@/components/AboutPreview";
import ContactCTA from "@/components/ContactCTA";

// Fallback renders so the hero always has a slideshow, even before any
// projects exist in the database.
const FALLBACK_SLIDES = [
  "https://picsum.photos/seed/aura-hero-1/1920/1080",
  "https://picsum.photos/seed/aura-hero-2/1920/1080",
  "https://picsum.photos/seed/aura-hero-3/1920/1080",
];

export default async function HomePage({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const featured = await getFeaturedProjects(6);

  const heroImages = featured.length
    ? featured
        .map((p) => ({ src: p.coverImage, is360: p.coverImage360 }))
        .filter((s) => s.src)
        .slice(0, 5)
    : FALLBACK_SLIDES.map((src) => ({ src, is360: false }));

  return (
    <>
      <Hero locale={locale} dict={dict.hero} images={heroImages} />
      <Services locale={locale} dict={dict.services} />
      <FeaturedProjects locale={locale} dict={dict.featured} projects={featured} />
      <AboutPreview locale={locale} dict={dict.aboutPreview} />
      <ContactCTA locale={locale} dict={dict.contactCta} />
    </>
  );
}
