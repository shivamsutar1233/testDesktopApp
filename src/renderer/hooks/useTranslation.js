import { useSelector } from "react-redux";
import { translations } from "../locales/translations.js";

export const useTranslation = () => {
  const { language } = useSelector((state) => state.userPreferences);

  const t = (key, defaultValue = "") => {
    try {
      const keys = key.split(".");
      let value = translations[language] || translations.en;

      for (const k of keys) {
        value = value[k];
        if (value === undefined) {
          break;
        }
      }

      return value || defaultValue || key;
    } catch (error) {
      console.warn(
        `Translation key "${key}" not found for language "${language}"`
      );
      return defaultValue || key;
    }
  };

  const getCurrentLanguage = () => language;

  const getAvailableLanguages = () => [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
  ];

  return {
    t,
    getCurrentLanguage,
    getAvailableLanguages,
    language,
  };
};

export default useTranslation;
