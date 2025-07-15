import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HeroSection, 
  ServicesSection, 
  SpecialOffer,
  FeaturedTours
} from '../components/home';

// HomePage bileşeni - Ana sayfa
const HomePage = () => {
  const { t } = useTranslation('translation');

  // Sayfa yüklendiğinde başlık değiştirme
  useEffect(() => {
    document.title = t('home.pageTitle', 'Endülüs Travel - Kişiselleştirilmiş Tur Deneyimi');
  }, [t]);

  return (
    <div className="page-transition">
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