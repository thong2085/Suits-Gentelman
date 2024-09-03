import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import viTranslations from "./locales/vi.json";

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: viTranslations },
  },
  lng: "vi",
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
