import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Direct imports of translation files
import enTranslations from '../../../public/locales/en.json';
import esTranslations from '../../../public/locales/es.json';

// Check for browser environment (SSR safety)
const isBrowser = typeof window !== 'undefined';

// Conditionally use LanguageDetector only in browser
if (isBrowser) {
  i18n.use(LanguageDetector);
}

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations
    },
    es: {
      translation: esTranslations
    }
  },
  fallbackLng: 'es', // Spanish as default fallback
  lng: typeof window === 'undefined' ? 'es' : undefined, // Force Spanish during SSR/SSG
  detection: {
    order: ['localStorage', 'navigator'], // Check localStorage first, then browser language
    caches: ['localStorage'] // Persist language selection
  },
  interpolation: {
    escapeValue: false // React already handles XSS protection
  },
  debug: false // Set to true for development debugging
});

export default i18n;
