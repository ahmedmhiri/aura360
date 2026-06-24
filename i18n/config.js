export const locales = ["en", "fr"];
export const defaultLocale = "en";

export const localeNames = {
  en: "EN",
  fr: "FR",
};

export function isValidLocale(locale) {
  return locales.includes(locale);
}

// Pick a localized value from a { en, fr } object, with graceful fallback.
export function pick(value, locale) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value[defaultLocale] ?? "";
}
