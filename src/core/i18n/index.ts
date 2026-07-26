import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';
import { safeStorage } from '@/shared/utils/safeStorage';

const lng = safeStorage.getItem('lang') || 'en';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ar: { translation: ar } },
  lng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = lng;

export default i18n;
