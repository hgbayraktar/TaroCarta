import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import tr from './locales/tr.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import nl from './locales/nl.json';
import ar from './locales/ar.json';
import fa from './locales/fa.json';

const SUPPORTED_LANGUAGES = ['en', 'tr', 'de', 'fr', 'nl', 'ar', 'fa'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
const lng: SupportedLanguage = (SUPPORTED_LANGUAGES as readonly string[]).includes(deviceLanguage)
  ? (deviceLanguage as SupportedLanguage)
  : 'en';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
    de: { translation: de },
    fr: { translation: fr },
    nl: { translation: nl },
    ar: { translation: ar },
    fa: { translation: fa },
  },
  lng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
