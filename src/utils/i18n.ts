import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { AVAILABLE_LANGUAGES } from "@/constant/language";
import EN_US from "@/locales/en-US.json";

const resources = {
  "en-US": { translation: EN_US },
} as const;

i18next.use(initReactI18next).init({
  resources,
  fallbackLng: "en-US",
});

export function checkLanguage(locale: string) {
  return AVAILABLE_LANGUAGES.some((item) => item.value === locale);
}

export function getLanguage(locale = "en-US") {
  if (checkLanguage(locale)) {
    return locale;
  }

  if (locale.startsWith("en")) {
    return "en-US";
  }
}
