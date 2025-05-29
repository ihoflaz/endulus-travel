import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Premium FeaturedTours bileşeni - Modern tasarım sistemi ile
const FeaturedTours = () => {
  const [toursData, setToursData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tur verilerini yükle
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch('data/tours.json');
        if (!response.ok) {
          throw new Error('Tur verileri yüklenemedi');
        }
        const data = await response.json();
        setToursData(data);
        setLoading(false);
      } catch (error) {
        console.error('Tur verisi yüklenirken hata:', error);
        setError('Veriler yüklenemedi');
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  // Fiyat formatı
  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-2xl h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !toursData?.featured?.length) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="bg-red-50 p-8 rounded-2xl">
            <p className="text-red-500 text-lg">Turlar yüklenemedi</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Premium Light Container */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-40 translate-y-40"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Premium Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <span className="text-[color-primary] font-semibold mr-2">🌟</span>
            <span className="text-sm font-medium text-[color-primary]">En Popüler Turlarımız</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[color-text-dark]">
            Öne Çıkan
            <span className="block text-[color-primary] mt-2">Tur Deneyimleri</span>
          </h2>
          
          <p className="text-xl text-[color-text-light] max-w-3xl mx-auto leading-relaxed">
            En çok tercih edilen ve <strong>mükemmel puanlara sahip</strong> tur paketlerimizi keşfedin. Her biri özenle tasarlanmış özel deneyimler.
          </p>
        </div>

        {/* Premium Tour Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {toursData.featured.slice(0, 3).map((tour, index) => (
            <div 
              key={tour.id} 
              className="group relative bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 overflow-hidden hover-float animate-fade-in transition-all duration-500 hover:bg-white/80"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Tour Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={tour.image || 'images/tours/default.jpg'} 
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[color-secondary] text-[color-primary] px-3 py-1 rounded-full text-xs font-semibold">
                    {tour.category === 'family' ? 'Aile Turları' : 
                     tour.category === 'romantic' ? 'Romantik' :
                     tour.category === 'adventure' ? 'Macera' : 'Özel'}
                  </span>
                </div>
                
                {/* Price Badge */}
                <div className="absolute bottom-4 right-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
                    <div className="text-white font-bold text-lg">
                      {formatPrice(tour.pricePerPerson)}
                    </div>
                    <div className="text-white/80 text-xs">kişi başı</div>
                  </div>
                </div>
              </div>
              
              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[color-text-dark] mb-3 group-hover:text-[color-primary] transition-colors">
                  {tour.title}
                </h3>
                <p className="text-[color-text-light] mb-4 line-clamp-2">
                  {tour.description}
                </p>
                
                {/* Tour Info */}
                <div className="flex items-center justify-between mb-6 text-sm text-[color-text-light]">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {tour.duration || '5 Gün'}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {tour.groupSize} kişi
                  </div>
                </div>
                
                {/* Premium CTA Button */}
                <Link 
                  to={`/turlar/${tour.slug}`}
                  className="group/btn w-full bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center space-x-2"
                >
                  <span>Detayları İncele</span>
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Premium CTA Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 border border-white/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-[color-text-dark] mb-4">
              Daha Fazla Seçenek mi Arıyorsunuz?
            </h3>
            <p className="text-[color-text-light] mb-6">
              Tüm tur paketlerimizi inceleyin ve size en uygun deneyimi bulun.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/turlar"
                className="group bg-[color-primary] hover:bg-blue-600 text-[color-primary] hover:text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center space-x-2"
              >
                <span>Tüm Turları Gör</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link 
                to="/tur-planlama"
                className="group bg-white/60 hover:bg-white/80 text-[color-primary] font-semibold py-3 px-8 rounded-xl border border-[color-primary]/30 hover:border-[color-primary] transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Özel Tur Tasarla</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1a2 2 0 012-2z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours; 