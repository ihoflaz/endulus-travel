import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HeroSection,
  ServicesSection,
  SpecialOffer,
  FeaturedTours
} from '../components/home';
import Seo from '../components/Seo';
import { useContactData, useSiteSettings } from '../hooks/useAppData';

const SITE_URL = 'https://endulustravel.com';

// HomePage bileşeni - Ana sayfa
const HomePage = () => {
  const { t } = useTranslation('translation');
  const { contactData } = useContactData();
  const { value: site } = useSiteSettings();

  // Organization / TravelAgency JSON-LD for the home page (rich results +
  // knowledge panel). Memoized so <Seo> doesn't rewrite the tag every render.
  const orgJsonLd = useMemo(() => {
    const ig = contactData?.social?.instagram;
    return {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: 'Endülüs Travel',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon/web-app-manifest-512x512.png`,
      image: `${SITE_URL}/favicon/web-app-manifest-512x512.png`,
      description:
        site?.description ||
        t('home.metaDescription', 'Hassasiyetlerinizi gözeten, namaz vakitlerine uygun, her şey dahil butik tur deneyimleri.'),
      ...(contactData?.phone ? { telephone: contactData.phone } : {}),
      ...(contactData?.email ? { email: contactData.email } : {}),
      ...(contactData?.address
        ? {
            address: {
              '@type': 'PostalAddress',
              streetAddress: contactData.address,
              addressLocality: 'Kadıköy',
              addressRegion: 'İstanbul',
              addressCountry: 'TR',
            },
          }
        : {}),
      ...(ig ? { sameAs: [ig] } : {}),
    };
  }, [contactData, site, t]);

  return (
    <div className="page-transition">
      <Seo
        title={t('home.pageTitle', 'Endülüs Travel - Kişiselleştirilmiş Tur Deneyimi')}
        jsonLd={orgJsonLd}
      />
      {/* Hero Bölümü */}
      <div className="animate-fade-in -mb-16">
        <HeroSection />
      </div>

      {/* Özel Fırsat - Mısır Turu */}
      <div className="animate-fade-in pt-16" style={{ animationDelay: '0.1s' }}>
        <SpecialOffer />
      </div>

      {/* Hizmetler Bölümü */}
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <ServicesSection />
      </div>

      {/* Öne Çıkan Turlar */}
      <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <FeaturedTours />
      </div>
    </div>
  );
};

export default HomePage;
