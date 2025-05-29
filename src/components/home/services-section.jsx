import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Premium ServicesSection bileşeni - Modern tasarım sistemi ile
const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hizmet verilerini yükle
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('data/services.json');
        if (!response.ok) {
          throw new Error('Hizmet verileri yüklenemedi');
        }
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error('Hizmet verisi yüklenirken hata:', error);
        setError('Hizmetler yüklenemedi');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-2xl h-72"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !services || services.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="bg-red-50 p-8 rounded-2xl">
            <p className="text-red-500 text-lg">Hizmetler yüklenemedi</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Premium Light Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-100/40 to-transparent rounded-full transform -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-[color-secondary]/10 to-transparent rounded-full transform translate-x-40 translate-y-40"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Premium Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <span className="text-[color-primary] font-semibold mr-2">🎯</span>
            <span className="text-sm font-medium text-[color-primary]">Özel Hizmetlerimiz</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[color-text-dark]">
            Size Özel
            <span className="block text-[color-primary] mt-2">Seyahat Çözümleri</span>
          </h2>
          
          <p className="text-xl text-[color-text-light] max-w-3xl mx-auto leading-relaxed">
            Her seyahat planınız için <strong>hassasiyetlerinizi gözeten</strong> ve ihtiyaçlarınıza özel olarak tasarlanmış hizmetler sunuyoruz.
          </p>
        </div>

        {/* Premium Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.slice(0, 6).map((service, index) => (
            <div 
              key={service.id} 
              className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-8 hover-float animate-fade-in transition-all duration-500 hover:bg-white/90 hover:border-[color-primary]/20"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Premium Icon Container */}
              <div className="w-16 h-16 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                {service.icon ? (
                  <img 
                    src={service.icon} 
                    alt={service.title}
                    className="w-8 h-8 object-contain filter brightness-0 invert"
                  />
                ) : (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              
              {/* Card Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-[color-text-dark] mb-4 group-hover:text-[color-primary] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[color-text-light] mb-6 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                
                {/* Premium CTA Button */}
                <Link 
                  to={`/hizmetler#${service.id}`}
                  className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg space-x-2"
                >
                  <span>Detayları Gör</span>
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
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/60 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-[color-text-dark] mb-4">
              İhtiyacınıza Özel Çözümler
            </h3>
            <p className="text-[color-text-light] mb-6 leading-relaxed">
              Bütün hizmetlerimizi inceleyin veya <strong>size özel bir plan</strong> hazırlamamızı isteyin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/hizmetler"
                className="group bg-[color-primary] hover:bg-blue-600 text-[color-primary] hover:text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center space-x-2"
              >
                <span>Tüm Hizmetleri Gör</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link 
                to="/teklif-al"
                className="group bg-white/80 hover:bg-white text-[color-primary] font-semibold py-3 px-8 rounded-xl border border-[color-primary]/30 hover:border-[color-primary] transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Özel Teklif Al</span>
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

export default ServicesSection; 