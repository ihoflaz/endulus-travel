import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/layout/navbar';
import Footer from '../components/layout/footer';
import { ScrollToTop, WhatsAppButton } from '../components/ui';

// MainLayout bileşeni - Tüm sayfalar için ortak düzeni sağlar
// Navbar ve Footer gibi ortak bileşenleri içerir
const MainLayout = () => {
  const { t } = useTranslation('translation');

  // Sayfa yüklendiğinde yapılacak işlemler
  useEffect(() => {
    // Sayfa başlığını ayarla
    document.title = `${t('header.title')} - ${t('header.subtitle')}`;
    
    // Google Fonts'tan Roboto fontunu yükle
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    
    // Eğer zaten yüklenmemişse ekle
    const existingLink = document.querySelector('link[href*="Roboto"]');
    if (!existingLink) {
      document.head.appendChild(link);
    }
    
    // Meta viewport kontrolü
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(viewportMeta);
    }
    
    // Cleanup fonksiyonu
    return () => {
      if (link.parentNode) {
        document.head.removeChild(link);
      }
    };
  }, [t]);

  return (
    <div className="flex flex-col min-h-screen w-full font-['Roboto',sans-serif] bg-white overflow-x-hidden">
      {/* Navbar Bileşeni */}
      <Navbar />

      {/* Ana İçerik - React Router'dan gelen sayfa içeriği */}
      <main className="flex-1 w-full pt-16">
        <Outlet />
      </main>

      {/* Footer Bileşeni */}
      <Footer />

      {/* Scroll to Top Butonu */}
      <ScrollToTop />

      {/* WhatsApp Sabit Butonu */}
      <WhatsAppButton 
        variant="fixed"
        message="Merhaba, turlarınız hakkında bilgi almak istiyorum."
      />
    </div>
  );
};

export default MainLayout; 