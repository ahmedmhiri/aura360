import "server-only";
import { defaultLocale, isValidLocale } from "./config";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((m) => m.default),
  fr: () => import("./dictionaries/fr.json").then((m) => m.default),
};

export async function getDictionary(locale) {
  const key = isValidLocale(locale) ? locale : defaultLocale;
  return dictionaries[key]();
}
