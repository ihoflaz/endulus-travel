import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/main-layout';

// Wraps the public layout for a given locale: syncs i18next + <html lang> to the
// URL prefix (/tr or /en), which is the single source of truth for language.
const LocaleLayout = ({ lang }) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    if (lang && i18n.language !== lang) i18n.changeLanguage(lang);
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
    try { window.localStorage.setItem('i18nextLng', lang); } catch { /* ignore */ }
  }, [lang, i18n]);
  return <MainLayout />;
};

export default LocaleLayout;
