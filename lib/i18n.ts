import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import bn from '../locales/bn.json';
import en from '../locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bn: { translation: bn },
    },
    fallbackLng: 'bn', // ডিফল্ট বাংলা থাকবে
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
