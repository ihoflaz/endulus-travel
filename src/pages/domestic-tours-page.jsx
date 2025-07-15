import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WhatsAppButton } from '../components/ui';

// Yurt İçi Turlar sayfası
const DomesticToursPage = () => {
  const [loading, setLoading] = useState(true);

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = 'Yurt İçi Turlar - Endülüs Travel';
    setLoading(false);
  }, []);

  // Yükleme durumunda
  if (loading) {
    return (
      <div className="pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/destinations/turkey.jpg)' }}
        ></div>
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[color-primary]/30 via-blue-600/20 to-[color-primary]/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
        
        <div className="relative z-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Breadcrumb */}
            <div className="mb-6 animate-fade-in">
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <span className="text-[color-secondary]">Yurt İçi Turlar</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-5xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Türkiye'nin En Güzel Rotaları
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Yurt İçi Turlar
              </h1>
              
              <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Türkiye'nin eşsiz güzelliklerini keşfedin. Kapadokya'dan Pamukkale'ye, İstanbul'dan Antalya'ya kadar her köşesinde tarih, doğa ve kültürün buluştuğu unutulmaz yolculuklar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Yakında Gelecek Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Light Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100/40 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center py-16 animate-fade-in">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/60 inline-block max-w-2xl mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[color-text-dark] mb-6">
                Yurt İçi Turlarımız Yakında!
              </h2>
              <p className="text-xl text-[color-text-light] mb-8 leading-relaxed">
                Türkiye'nin en güzel destinasyonlarını kapsayan özel tur paketlerimizi hazırlıyoruz. Kapadokya'nın büyülü vadilerinden Pamukkale'nin beyaz teraslarına, İstanbul'un tarihi dokusundan Akdeniz'in masmavi kıyılarına kadar birbirinden güzel rotalar sizi bekliyor.
              </p>
              <div className="bg-gradient-to-r from-[color-primary]/10 to-blue-600/10 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-[color-primary] mb-3">Planlanan Destinasyonlar:</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[color-secondary] rounded-full mr-2"></span>
                    Kapadokya
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[color-secondary] rounded-full mr-2"></span>
                    Pamukkale
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[color-secondary] rounded-full mr-2"></span>
                    Antalya
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[color-secondary] rounded-full mr-2"></span>
                    İstanbul
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[color-secondary] rounded-full mr-2"></span>
                    Trabzon
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-[color-secondary] rounded-full mr-2"></span>
                    Rize
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                Bizimle iletişime geçerek hangi destinasyonları tercih ettiğinizi öğrenebilir ve size özel tur planlaması yaptırabiliirsiniz.
              </p>
            </div>
          </div>

          {/* Size Özel Tur Paketleri CTA Section */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/60 shadow-xl">
              <div className="max-w-3xl mx-auto">
                {/* Başlık */}
                <h2 className="text-3xl md:text-4xl font-bold text-[color-text-dark] mb-4">
                  Size Özel Yurt İçi Tur Planlaması
                </h2>
                
                {/* Alt Başlık */}
                <p className="text-xl text-[color-text-light] mb-6">
                  İhtiyacınıza Özel Çözümler
                </p>
                
                {/* Açıklama */}
                <p className="text-lg text-[color-text-light] mb-8 leading-relaxed">
                  Türkiye'nin hangi güzelliklerini keşfetmek istediğinizi belirtin, gelin birlikte mükemmel rotayı planlayalım
                </p>
                
                {/* Butonlar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/teklif-al" 
                    className="group bg-white border-2 border-[color-primary] text-[color-primary] hover:bg-[color-primary] hover:text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center space-x-2"
                  >
                    <span>Özel Teklif Al</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  
                  <WhatsAppButton
                    message="Yurt içi tur paketleri hakkında bilgi almak istiyorum."
                    size="lg"
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    WhatsApp İletişim
                  </WhatsAppButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DomesticToursPage;
