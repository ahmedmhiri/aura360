import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";
import { site } from "@/lib/site";

export default function Footer({ locale, dict }) {
  const year = new Date().getFullYear();

  const explore = [
    { href: `/${locale}/portfolio`, label: dict.nav.portfolio },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="border-t hairline bg-bone">
      <div className="mx-auto max-w-site px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link
              href={`/${locale}`}
              className="font-display text-2xl font-bold uppercase tracking-tightest text-ink"
            >
              AURA<span className="text-blueprint">360</span>LAB
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-graphite/80">
              {dict.footer.tagline}
            </p>
            <p className="annotation mt-8 text-ash">{dict.footer.coordinates}</p>
          </div>

          <div className="md:col-span-3">
            <h3 className="annotation text-ash">{dict.footer.explore}</h3>
            <ul className="mt-5 space-y-3">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-graphite transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="annotation text-ash">{dict.footer.connect}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-graphite transition-colors hover:text-ink"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={site.phoneHref}
                  className="text-graphite transition-colors hover:text-ink"
                >
                  {site.phone}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={site.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-graphite transition-colors hover:text-ink"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href={site.linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-graphite transition-colors hover:text-ink"
              >
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="annotation text-ash">
            © {year} {site.name} — {dict.footer.rights}
          </p>
          <p className="annotation text-ash/70">{dict.footer.builtBy}</p>
        </div>
      </div>
    </footer>
  );
}
