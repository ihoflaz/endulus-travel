import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  HeroSection, 
  ServicesSection, 
  FeaturedTours, 
  CallToAction 
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
      
      {/* Hizmetler Bölümü */}
      <div className="animate-fade-in pt-16" style={{ animationDelay: '0.2s' }}>
        <ServicesSection />
      </div>
      
      {/* Öne Çıkan Turlar */}
      <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <FeaturedTours />
      </div>
      
      {/* Çağrı Aksiyonu */}
      <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <CallToAction />
      </div>
    </div>
  );
};

export default HomePage; 