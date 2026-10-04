import Link from "next/link";
import { Instagram, Linkedin, Facebook } from "lucide-react";
import { site } from "@/lib/site";
import Logo from "@/components/Logo";

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
            <Link href={`/${locale}`} className="inline-block text-ink" aria-label="AURA360LAB — home">
              <Logo className="h-10 w-auto md:h-11" title="AURA360LAB" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-graphite/80">
              {dict.footer.tagline}
            </p>
            <p className="annotation mt-8 text-ash">{dict.footer.coordinates}</p>
          </div>

          <div className="md:col-span-3">
            <h3 className="annotation text-ash">{dict.footer.explore}</h3>
            <ul className="mt-3 md:mt-4">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-block py-3 text-sm text-graphite transition-colors hover:text-ink md:py-1.5"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="annotation text-ash">{dict.footer.connect}</h3>
            <ul className="mt-3 text-sm md:mt-4">
              {site.emails.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="inline-block break-all py-3 text-graphite transition-colors hover:text-ink md:py-1.5"
                  >
                    {email}
                  </a>
                </li>
              ))}
              {site.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="inline-block break-all py-3 text-graphite transition-colors hover:text-ink md:py-1.5"
                  >
                    {phone.label}
                  </a>
                </li>
              ))}
              <li className="py-3 text-graphite/80 md:py-1.5">{site.address}</li>
            </ul>
            <div className="-ml-3 mt-3 flex items-center">
              <a
                href={site.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center text-graphite transition-colors hover:text-ink"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href={site.linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center text-graphite transition-colors hover:text-ink"
              >
                <Linkedin size={18} strokeWidth={1.5} />
              </a>
              <a
                href={site.facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center text-graphite transition-colors hover:text-ink"
              >
                <Facebook size={18} strokeWidth={1.5} />
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
