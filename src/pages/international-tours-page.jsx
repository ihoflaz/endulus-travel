import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WhatsAppButton } from '../components/ui';
import { formatTourPrice, getPriceLabel, getNumericPrice } from '../utils/priceUtils';

// Yurt Dışı Turlar sayfası
const InternationalToursPage = () => {
  const [toursData, setToursData] = useState({
    tours: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTours, setFilteredTours] = useState([]);

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = 'Yurt Dışı Turlar - Endülüs Travel';
  }, []);

  // Tur verilerini yükle
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const toursResponse = await fetch('data/tours.json');
        if (!toursResponse.ok) {
          throw new Error('Tur verileri yüklenemedi');
        }
        const toursData = await toursResponse.json();
        
        // Sadece yurt dışı turları filtrele
        const internationalTours = toursData.featured.filter(tour => tour.type === 'international');
        
        setToursData({
          tours: internationalTours,
          categories: toursData.categories || []
        });
        setFilteredTours(internationalTours);
        setLoading(false);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError('Veriler yüklenemedi');
        setLoading(false);
      }
    };

    fetchTours();
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-2xl h-96"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Hata durumunda
  if (error) {
    return (
      <div className="pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-red-50 p-8 rounded-2xl">
              <h2 className="text-2xl text-red-600 font-semibold mb-4">
                Veri Yükleme Hatası
              </h2>
              <p className="text-gray-700">{error}</p>
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
          style={{ backgroundImage: 'url(/images/destinations/spain.jpg)' }}
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
              <span className="text-[color-secondary]">Yurt Dışı Turlar</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-5xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Dünya'nın En Güzel Destinasyonları
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Yurt Dışı Turlar
              </h1>
              
              <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Dünya'nın en güzel destinasyonlarını keşfedin. Endülüs'ten Fas'a, Balkanlar'dan Portekiz'e kadar hassasiyetlerinizi gözeten özel tur deneyimleri sunuyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Tours Grid */}
      <section className="py-16 relative overflow-hidden">
        {/* Light Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100/40 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {filteredTours.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/60 inline-block">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-600 mb-4">Henüz tur bulunamadı</h3>
                <p className="text-gray-500">Yakında yeni turlar eklenecek</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredTours.map((tour, index) => (
                <div 
                  key={tour.id} 
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden hover-float animate-fade-in transition-all duration-500 hover:bg-white/90 hover:shadow-2xl hover:border-[color-primary]/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Premium Image Container */}
                  <div className="relative overflow-hidden">
                    <Link to={`/turlar/${tour.slug}`}>
                      <img 
                        src={tour.image || 'images/tours/default.jpg'} 
                        alt={tour.title} 
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>
                    
                    {/* Premium Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full border border-white/30">
                        {toursData.categories.find(cat => cat.key === tour.category)?.label || tour.category}
                      </div>
                    </div>
          
                    {/* Premium Price Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-[color-secondary]/90 backdrop-blur-sm text-[color-primary] font-bold px-3 py-1 rounded-full border border-[color-secondary]">
                        {formatTourPrice(tour)}
                      </div>
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Premium Card Content */}
                  <div className="p-6">
                    <Link to={`/turlar/${tour.slug}`}>
                      <h3 className="text-xl font-bold mb-3 text-[color-text-dark] group-hover:text-[color-primary] transition-colors duration-300 line-clamp-2">
                        {tour.title}
                      </h3>
                    </Link>
                    
                    <p className="text-[color-text-light] mb-6 leading-relaxed line-clamp-3">
                      {tour.description}
                    </p>
                    
                    {/* Tour Info */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center text-sm text-[color-text-light]">
                        <div className="w-8 h-8 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-2 group-hover:bg-[color-primary]/20 transition-colors">
                          <svg className="w-4 h-4 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                        </div>
                        <span className="font-medium">{tour.groupSize}</span>
                      </div>
                    </div>
                    
                    {/* Premium CTA Button */}
                    <Link 
                      to={`/turlar/${tour.slug}`} 
                      className="group/btn w-full bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center space-x-2"
                    >
                      <span>Detayları Gör</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Size Özel Tur Paketleri CTA Section */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/60 shadow-xl">
              <div className="max-w-3xl mx-auto">
                {/* Başlık */}
                <h2 className="text-3xl md:text-4xl font-bold text-[color-text-dark] mb-4">
                  Size Özel Tur Paketleri Mi Arıyorsunuz?
                </h2>
                
                {/* Alt Başlık */}
                <p className="text-xl text-[color-text-light] mb-6">
                  İhtiyacınıza Özel Çözümler
                </p>
                
                {/* Açıklama */}
                <p className="text-lg text-[color-text-light] mb-8 leading-relaxed">
                  Siz hayal edin biz planlayalım, gelin birlikte yola çıkalım
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
                    message="Size özel tur paketleri hakkında bilgi almak istiyorum."
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

export default InternationalToursPage;
