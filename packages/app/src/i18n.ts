import i18n, { ResourceLanguage } from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "../public/locales/en.json";
import translationPL from "../public/locales/pl.json";

export const SUPPORTED_LANGUAGES = ["pl", "en"] as ["pl", "en"];
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
export const FALLBACK_LANG: SupportedLanguage = "en";

// Polish and English will always be bundled
// Additional languages / customizations
// can be held in localstorage
// if missing, we'll fetch them during SSR
// @see https://react.i18next.com/latest/ssr
const resources: Record<SupportedLanguage, ResourceLanguage> = {
  pl: {
    translation: translationPL,
  },
  en: {
    translation: translationEN,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: FALLBACK_LANG,

  partialBundledLanguages: true,
  keySeparator: false,

  // debug: process.env.NODE_ENV !== "production",

  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
