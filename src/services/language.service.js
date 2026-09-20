
import i18n from "../i18n";

export const changeLanguage = async (language) => {
  if (!["ar", "en"].includes(language)) return;

  await i18n.changeLanguage(language);

  localStorage.setItem("language", language);

  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
};
