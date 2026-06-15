import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Çeviri dosyalarını doğrudan içe aktar
import trTranslation from './translations/tr/common.json';
import enTranslation from './translations/en/common.json';

// Çoklu dil desteği için i18next yapılandırması
i18n
  // Tarayıcı dilini otomatik algıla
  .use(LanguageDetector)
  // React için i18next başlatma
  .use(initReactI18next)
  // Başlangıç yapılandırması
  .init({
    // Çevirileri doğrudan kaynaklar olarak ekle
    resources: {
      tr: {
        translation: trTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    // Algılama başarısız olursa varsayılan dil
    fallbackLng: 'tr',
    // Dili SABİTLEMİYORUZ. lng: 'tr' verilseydi LanguageDetector'ı ezer ve
    // kullanıcının EN seçimi sayfa yenilemede TR'ye dönerdi. Bunun yerine
    // detector localStorage / ?lng / <html lang> sırasıyla belirler; eşleşme
    // yoksa fallbackLng (tr) kullanılır — yani yeni ziyaretçi yine Türkçe görür.
    detection: {
      // 'path' first: the URL prefix (/tr, /en) is the source of truth, so a
      // deep load of /en/tours initializes in English before React mounts.
      order: ['path', 'querystring', 'localStorage', 'htmlTag'],
      lookupFromPathIndex: 0,
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    // Hata ayıklama modu
    debug: false,
    // Namespace olarak translation kullan (önemli)
    ns: ['translation'],
    defaultNS: 'translation',
    // Keyleri çevirileri olarak kullanma
    keySeparator: '.',
    interpolation: {
      // Kullanıcı girdilerini XSS saldırılarına karşı koruma
      escapeValue: false,
      // React zaten XSS koruması sağlar
      formatSeparator: ',',
    },
    react: {
      // Performans için bileşenlerin yeniden oluşturulmasını engelle
      useSuspense: true,
    },
  });

i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`i18n load failed: ${lng}, ${ns}, ${msg}`);
});

export default i18n;
