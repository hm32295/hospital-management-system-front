
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { ar } from "./ar";

const savedLanguage = localStorage.getItem("language") || "en";

const resources = {
  en: en,
  ar:ar
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

document.documentElement.lang = savedLanguage;
document.documentElement.dir =
  savedLanguage === "ar" ? "rtl" : "ltr";

export default i18n;