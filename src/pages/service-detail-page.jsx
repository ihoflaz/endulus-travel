import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useServiceDetail } from '../hooks';

// Premium ServiceDetailPage bileşeni - Modern tasarım sistemi ile
const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { service, serviceContent, isLoading, error, notFound } = useServiceDetail(id);

  // Sayfa başlığını ayarla
  useEffect(() => {
    if (service) {
      document.title = `${service.title} - Endülüs Travel`;
    }
  }, [service]);

  if (isLoading) {
    return (
      <div className="pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto mb-8"></div>
              <div className="h-64 bg-gray-200 rounded-2xl mb-8"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || notFound || !service || !serviceContent) {
    return (
      <div className="pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-red-50 p-8 rounded-2xl">
              <h1 className="text-2xl font-bold text-red-500 mb-4">
                {error || 'Hizmet bulunamadı'}
              </h1>
              <p className="text-gray-600 mb-8">Lütfen tekrar deneyiniz</p>
              <button 
                onClick={() => navigate('/hizmetler')}
                className="bg-[color-primary] hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Hizmetlere Geri Dön
              </button>
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
              <Link to="/" className="text-white/80 hover:text-white transition-colors">Ana Sayfa</Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <Link to="/hizmetler" className="text-white/80 hover:text-white transition-colors">Hizmetler</Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <span className="text-[color-secondary]">{service?.title || 'Hizmet Detayı'}</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Özel Hizmet Deneyimi
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {service?.title || 'Hizmet Detayı'}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {service?.description || 'Bu özel hizmet hakkında detaylı bilgiler ve özellikler.'}
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">%100</h3>
                  <p className="text-white/90">Profesyonel</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">24/7</h3>
                  <p className="text-white/90">Destek</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">Özel</h3>
                  <p className="text-white/90">Yaklaşım</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 relative overflow-hidden">
        {/* Light Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-l from-blue-100/40 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
          {/* Premium Service Image */}
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img 
                src={serviceContent.image || 'images/services/default.jpg'} 
                alt={service.title}
                className="w-full h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <h3 className="text-white font-bold text-lg">{service.title}</h3>
                  <p className="text-white/80 text-sm">Premium Hizmet</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Service Description */}
            <div className="lg:col-span-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover-float animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-2xl font-bold mb-6 text-[color-text-dark] flex items-center">
                  <div className="w-8 h-8 bg-[color-primary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Hizmet Detayları
                </h2>
                <div className="prose max-w-none">
                  {serviceContent.fullDescription.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-[color-text-light] leading-relaxed">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Service Features */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 hover-float animate-fade-in h-full" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-xl font-bold mb-6 text-[color-text-dark] flex items-center">
                  <div className="w-6 h-6 bg-[color-secondary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Özellikler
                </h3>
                <ul className="space-y-3">
                  {serviceContent.features.map((feature, index) => (
                    <li key={index} className="flex items-start group">
                      <span className="w-2 h-2 bg-[color-primary] rounded-full mr-3 mt-2 group-hover:scale-125 transition-transform flex-shrink-0"></span>
                      <span className="text-[color-text-light] group-hover:text-[color-text-dark] transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Premium CTA Section */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color-primary] via-blue-600 to-[color-primary] text-white">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
              
              <div className="relative z-10 p-8 md:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  {/* Badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                    <span className="text-[color-secondary] font-semibold mr-2">🚀</span>
                    <span className="text-sm font-medium">Bu Hizmetten Yararlanın</span>
                  </div>
                  
                  {/* Heading */}
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Bu Hizmetle İlgileniyorum
                  </h2>
                  <p className="text-[color-secondary] text-xl font-semibold mb-6">
                    Size Özel Teklif Hazırlayalım
                  </p>
                  
                  {/* Description */}
                  <p className="text-lg mb-8 opacity-90 leading-relaxed">
                    Bu hizmetimizle ilgili <strong>özel bir teklif</strong> hazırlayalım. 
                    İhtiyaçlarınıza göre kişiselleştirilmiş çözümler sunuyoruz.
                  </p>
                  
                  {/* Features Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-10 h-10 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold">Hızlı Yanıt</div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-10 h-10 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold">Ücretsiz Danışma</div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-10 h-10 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold">Kişisel Çözüm</div>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to={`/teklif-al?service=${service.id}`} 
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
          
          {/* Back to Services */}
          <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <Link 
              to="/hizmetler"
              className="inline-flex items-center px-6 py-3 bg-white/80 hover:bg-white text-[color-primary] font-semibold rounded-xl border border-[color-primary]/30 hover:border-[color-primary] transition-all duration-300 transform hover:scale-105 space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Tüm Hizmetleri Gör</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage; 