import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Premium ServicesPage bileşeni - Modern tasarım sistemi ile
const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = 'Hizmetlerimiz - Endülüs Travel';
  }, []);

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
      <div className="pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-2xl h-80"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !services || services.length === 0) {
    return (
      <div className="pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-red-50 p-8 rounded-2xl">
              <p className="text-red-500 text-lg">Hizmetler yüklenemedi</p>
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
        <div className="absolute inset-0 bg-gradient-to-br from-[color-primary] via-blue-600 to-[color-primary]"></div>
        <div className="absolute inset-0 bg-black/20"></div>
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
              <span className="text-[color-secondary]">Hizmetlerimiz</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Özel Hizmetler
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Hizmetlerimiz
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Her seyahat planınız için hassasiyetlerinizi gözeten ve ihtiyaçlarınıza özel olarak tasarlanmış profesyonel hizmetler sunuyoruz.
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">10+</h3>
                  <p className="text-white/90">Özel Hizmet</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">7/24</h3>
                  <p className="text-white/90">Müşteri Desteği</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">%100</h3>
                  <p className="text-white/90">Hassasiyet Odaklı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Services Grid */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Light Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100/40 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-8 hover-float animate-fade-in transition-all duration-500 hover:bg-white/90 hover:shadow-2xl hover:border-[color-primary]/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Premium Icon Container */}
                <div className="w-20 h-20 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {service.icon ? (
                    <img 
                      src={service.icon} 
                      alt={service.title}
                      className="w-10 h-10 object-contain filter brightness-0 invert"
                    />
                  ) : (
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                
                {/* Card Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[color-text-dark] mb-4 group-hover:text-[color-primary] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[color-text-light] mb-8 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                  
                  {/* Premium CTA Button */}
                  <Link 
                    to={`/hizmetler/${service.id}`}
                    className="group/btn inline-flex items-center px-8 py-4 bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg space-x-2"
                  >
                    <span>Detayları Gör</span>
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Premium CTA Section */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color-primary] via-blue-600 to-[color-primary] text-white">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
              
              <div className="relative z-10 p-8 md:p-12 text-center">
                <div className="max-w-3xl mx-auto">
                  {/* Badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                    <span className="text-[color-secondary] font-semibold mr-2">💫</span>
                    <span className="text-sm font-medium">Size Özel Çözümler</span>
                  </div>
                  
                  {/* Heading */}
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    İhtiyacınıza Uygun
                    <span className="block text-[color-secondary] mt-2">Özel Teklif Alın</span>
                  </h2>
                  
                  {/* Description */}
                  <p className="text-xl mb-8 opacity-90 leading-relaxed">
                    Hangi hizmetimizle ilgilenirseniz ilgilenin, <strong>size özel bir teklif</strong> hazırlayalım. 
                    Uzman ekibimiz en uygun çözümü bulacak.
                  </p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold mb-2">Hızlı Yanıt</h3>
                      <p className="text-sm opacity-80">24 saat içinde geri dönüş</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold mb-2">Ücretsiz Danışmanlık</h3>
                      <p className="text-sm opacity-80">Profesyonel rehberlik</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold mb-2">Kişisel Yaklaşım</h3>
                      <p className="text-sm opacity-80">Size özel çözümler</p>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/teklif-al" 
                      className="group bg-[color-secondary] hover:bg-yellow-500 text-[color-primary] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-2"
                    >
                      <span>Özel Teklif Al</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    
                    <Link 
                      to="/iletisim" 
                      className="group bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 inline-flex items-center space-x-2"
                    >
                      <span>Bize Ulaşın</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage; 