import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import knTranslations from './locales/kn.json';
import teTranslations from './locales/te.json';

// Get saved language preference from localStorage, default to English
const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations
            },
            hi: {
                translation: hiTranslations
            },
            kn: {
                translation: knTranslations
            },
            te: {
                translation: teTranslations
            }
        },
        lng: savedLanguage, // Default language
        fallbackLng: 'en', // Fallback language if translation not found
        interpolation: {
            escapeValue: false // React already escapes values
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

// Function to change language and persist preference
export const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
};

// Get current language
export const getCurrentLanguage = () => i18n.language;

// Available languages
export const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' }
];

export default i18n;
