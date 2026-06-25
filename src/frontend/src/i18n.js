/**
 * @file i18n.js
 * @description Internationalization configuration using react-i18next.
 * Sets up supported languages, loads translation JSON files, and configures the language detector.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptTranslation from './locales/pt/translation.json';
import enTranslation from './locales/en/translation.json';
import esTranslation from './locales/es/translation.json';

/**
 * Registered translation resources.
 */
const resources = {
  pt: ptTranslation,
  en: enTranslation,
  es: esTranslation
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
