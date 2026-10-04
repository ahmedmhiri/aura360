import { getDictionary } from "@/i18n/dictionaries";
import { getFeaturedProjects, getProjectBySlug } from "@/lib/projects";
import { getServiceVideos } from "@/lib/service-videos";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutPreview from "@/components/AboutPreview";
import ContactCTA from "@/components/ContactCTA";

// Project whose cover illustrates each service on hover (studio's choice).
const SERVICE_PREVIEW_SLUGS = { interior: "a-apartment", visualization: "classic" };

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
  const previewEntries = await Promise.all(
    Object.entries(SERVICE_PREVIEW_SLUGS).map(async ([key, slug]) => {
      const project = await getProjectBySlug(slug);
      return [key, project?.coverImage || null];
    })
  );
  const servicePreviews = Object.fromEntries(previewEntries.filter(([, src]) => src));
  const serviceVideos = await getServiceVideos();

  const heroImages = featured.length
    ? featured
        .map((p) => ({ src: p.coverImage, is360: p.coverImage360 }))
        .filter((s) => s.src)
        .slice(0, 5)
    : FALLBACK_SLIDES.map((src) => ({ src, is360: false }));

  return (
    <>
      <Hero locale={locale} dict={dict.hero} images={heroImages} />
      <Services locale={locale} dict={dict.services} previews={servicePreviews} videos={serviceVideos} />
      <FeaturedProjects locale={locale} dict={dict.featured} projects={featured} />
      <AboutPreview locale={locale} dict={dict.aboutPreview} />
      <ContactCTA locale={locale} dict={dict.contactCta} />
    </>
  );
}
