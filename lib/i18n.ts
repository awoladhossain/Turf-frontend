'use client';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import bn from '../locales/bn.json';
import en from '../locales/en.json';

// সরাসরি এখানেই কনফিগার করুন, কোনো ফাংশনের ভেতর না
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        bn: { translation: bn },
      },
      fallbackLng: 'en', // স্পোর্টস অ্যাপের জন্য ডিফল্ট ইংলিশ রাখা সেফ
      lng: 'en', 
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false, // নেক্সট জেএস এর জন্য এটি ফলস রাখা ভালো
      },
    });
}

export default i18n;