import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";
import { locales, isValidLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { site } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChromeGate from "@/components/ChromeGate";
import JsonLd from "@/components/JsonLd";

const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = params;
  const dict = await getDictionary(locale);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: {
      default: dict.meta.defaultTitle,
      template: `%s — ${dict.meta.siteName}`,
    },
    description: dict.meta.defaultDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", fr: "/fr", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      siteName: dict.meta.siteName,
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
      locale: locale === "fr" ? "fr_FR" : "en_US",
    },
    twitter: { card: "summary_large_image", title: dict.meta.defaultTitle },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: base,
    description: dict.meta.defaultDescription,
    sameAs: [site.instagramHref, site.linkedinHref, site.facebookHref].filter(Boolean),
  };

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <JsonLd data={organization} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:text-bone"
        >
          {dict.nav.skipToContent}
        </a>
        <ChromeGate>
          <Navbar locale={locale} dict={dict.nav} />
        </ChromeGate>
        <main id="main">{children}</main>
        <ChromeGate>
          <Footer locale={locale} dict={dict} />
        </ChromeGate>
        <SpeedInsights />
      </body>
    </html>
  );
}
