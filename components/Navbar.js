"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { locales, localeNames } from "@/i18n/config";
import Logo from "@/components/Logo";

export default function Navbar({ locale, dict }) {
  const pathname = usePathname() || `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: `/${locale}/portfolio`, label: dict.portfolio },
    { href: `/${locale}/about`, label: dict.about },
    { href: `/${locale}/contact`, label: dict.contact },
  ];

  // At the top of the home page the bar floats over the dark hero photo, so
  // its text switches to light until the page scrolls or the menu opens.
  const overHero = pathname === `/${locale}` && !scrolled && !open;

  const isActive = (href) =>
    pathname === href || (href !== `/${locale}` && pathname.startsWith(href));

  // Swap the locale segment while keeping the rest of the path.
  const swapLocale = (target) => {
    const segments = pathname.split("/");
    segments[1] = target;
    return segments.join("/") || `/${target}`;
  };

  const setLocaleCookie = (target) => {
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-smooth ${
        scrolled || open
          ? "bg-bone/90 backdrop-blur-md border-b hairline"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-site items-center justify-between px-5 py-4 sm:px-8 md:py-5">
        <Link
          href={`/${locale}`}
          className={`-my-3 py-3 transition-colors duration-500 ${
            overHero ? "text-bone" : "text-ink"
          }`}
          aria-label="AURA360LAB — home"
        >
          <Logo className="h-7 w-auto md:h-8" title="AURA360LAB" />
        </Link>

        <div
          className={`hidden items-center gap-9 transition-colors duration-500 md:flex ${
            overHero ? "[&_a]:!text-bone" : ""
          }`}
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`font-mono text-[12px] uppercase tracking-annotation transition-opacity duration-300 hover:opacity-100 ${
                isActive(l.href) ? "text-ink opacity-100" : "text-graphite opacity-70"
              }`}
            >
              {l.label}
            </Link>
          ))}

          <span className="h-4 w-px bg-line-strong" aria-hidden />

          <div className="flex items-center gap-2" role="group" aria-label="Language">
            {locales.map((l) => (
              <Link
                key={l}
                href={swapLocale(l)}
                onClick={() => setLocaleCookie(l)}
                aria-current={locale === l ? "true" : undefined}
                className={`font-mono text-[12px] uppercase tracking-annotation transition-opacity ${
                  locale === l ? "text-ink opacity-100" : "text-ash opacity-60 hover:opacity-100"
                }`}
              >
                {localeNames[l]}
              </Link>
            ))}
          </div>

          <Link href={`/${locale}/contact`} className="btn-primary !px-5 !py-2.5">
            {dict.startProject}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`-mr-2.5 flex h-11 w-11 items-center justify-center transition-colors duration-500 md:hidden ${
            overHero ? "text-bone" : "text-ink"
          }`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden"
          >
            <div className="mx-auto max-w-site px-5 pb-8 pt-2 sm:px-8">
              <div className="flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.4 }}
                  >
                    <Link
                      href={l.href}
                      className="block border-b hairline py-4 font-display text-2xl font-semibold uppercase tracking-tightest text-ink"
                    >
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {locales.map((l) => (
                    <Link
                      key={l}
                      href={swapLocale(l)}
                      onClick={() => setLocaleCookie(l)}
                      className={`font-mono text-[12px] uppercase tracking-annotation ${
                        locale === l ? "text-ink" : "text-ash"
                      }`}
                    >
                      {localeNames[l]}
                    </Link>
                  ))}
                </div>
                <Link href={`/${locale}/contact`} className="btn-primary">
                  {dict.startProject}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
