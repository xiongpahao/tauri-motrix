import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";

const resources = {
  en: { translation: en },
} as const;

i18next.use(initReactI18next).init({
  resources,
});
