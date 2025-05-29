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
    // Varsayılan dil
    fallbackLng: 'tr',
    // Başlangıç dili
    lng: 'tr',
    // Hata ayıklama modu
    debug: true,
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

// Hataları konsola yazdır
i18n.on('failedLoading', (lng, ns, msg) => {
  console.error(`i18n yüklemesi başarısız: ${lng}, ${ns}, ${msg}`);
});

i18n.on('loaded', (loaded) => {
  console.log('i18n yüklendi:', loaded);
});

i18n.on('initialized', () => {
  console.log('i18n başlatıldı');
});

export default i18n;
