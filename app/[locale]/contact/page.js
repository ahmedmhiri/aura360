import { Mail, Phone, MessageCircle, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import { Reveal } from "@/components/motion";
import ContactForm from "@/components/ContactForm";

export async function generateMetadata({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  return {
    title: dict.contact.title,
    description: dict.contact.lead,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { en: "/en/contact", fr: "/fr/contact" },
    },
  };
}

function ContactList({ items, external = false }) {
  return (
    <ul className="mt-6 border-t hairline">
      {items.map(({ Icon, label, value, href }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-center justify-between gap-4 border-b hairline py-5 transition-colors hover:bg-ink hover:px-4"
          >
            <span className="flex items-center gap-4">
              <Icon
                size={20}
                strokeWidth={1.5}
                className="text-ash transition-colors group-hover:text-bone"
              />
              <span>
                <span className="annotation block text-ash transition-colors group-hover:text-bone/60">
                  {label}
                </span>
                <span className="mt-1 block text-base text-ink transition-colors group-hover:text-bone">
                  {value}
                </span>
              </span>
            </span>
            <ArrowUpRight
              size={18}
              strokeWidth={1.5}
              className="shrink-0 text-ash transition-all group-hover:text-bone"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default async function ContactPage({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const t = dict.contact;

  const direct = [
    { Icon: Mail, label: t.email, value: site.email, href: `mailto:${site.email}` },
    { Icon: Phone, label: t.phone, value: site.phone, href: site.phoneHref },
    { Icon: MessageCircle, label: t.whatsapp, value: site.whatsapp, href: site.whatsappHref },
  ];

  const social = [
    { Icon: Instagram, label: "Instagram", value: site.instagram, href: site.instagramHref },
    { Icon: Linkedin, label: "LinkedIn", value: site.linkedin, href: site.linkedinHref },
  ];

  return (
    <div className="mx-auto max-w-site px-5 pb-24 pt-32 sm:px-8 sm:pt-36 md:pb-32">
      <header className="max-w-3xl">
        <Reveal>
          <span className="annotation text-blueprint">{dict.nav.contact}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-5 font-display text-5xl font-bold uppercase leading-[0.98] tracking-tightest text-ink sm:text-6xl md:text-7xl">
            {t.title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite/80 sm:text-lg">
            {t.lead}
          </p>
        </Reveal>
      </header>

      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        {/* Form */}
        <div className="md:col-span-7">
          <Reveal>
            <h2 className="annotation mb-8 text-ash">{t.formTitle}</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <ContactForm dict={t} />
          </Reveal>
        </div>

        {/* Direct + social */}
        <aside className="md:col-span-5 md:pl-8">
          <Reveal delay={0.1}>
            <div>
              <span className="annotation text-ash">{t.directTitle}</span>
              <ContactList items={direct} />

              <span className="annotation mt-12 block text-ash">{t.followTitle}</span>
              <ContactList items={social} external />
            </div>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
