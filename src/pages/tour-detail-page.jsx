import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTourDetail } from '../hooks';

// Premium TourDetailPage bileşeni - Modern tasarım sistemi ile
const TourDetailPage = () => {
  const { slug } = useParams();
  const { tour, relatedTours, isLoading, error, notFound } = useTourDetail(slug);

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = tour 
      ? `${tour.title} - Endülüs Travel`
      : 'Tur Detayı - Endülüs Travel';
  }, [tour]);

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

  if (error || notFound || !tour) {
    return (
      <div className="pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-red-50 p-8 rounded-2xl">
              <h1 className="text-2xl font-bold text-red-500 mb-4">
                Tur Bulunamadı
              </h1>
              <p className="text-gray-700 mb-4">
                Aradığınız tur sayfası bulunamadı. Lütfen tur listesinden tekrar seçim yapınız.
              </p>
              <Link 
                to="/turlar" 
                className="inline-block bg-[color-primary] hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Turlara Geri Dön
              </Link>
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
              <Link to="/turlar" className="text-white/80 hover:text-white transition-colors">Turlar</Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <span className="text-[color-secondary]">{tour?.title || 'Tur Detayı'}</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Özel Tur Deneyimi
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {tour?.title || 'Tur Detayı'}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {tour?.description || 'Bu özel tur deneyimi hakkında detaylı bilgiler ve özellikler.'}
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">{tour?.duration || '7'}</h3>
                  <p className="text-white/90">Gün</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">{tour?.groupSize || '10-12'}</h3>
                  <p className="text-white/90">Kişi</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">{tour?.pricePerPerson?.toLocaleString('tr-TR') || '5.500'}₺</h3>
                  <p className="text-white/90">Kişi Başı</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Hero Image */}
      <section className="py-8 relative">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl group animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <img 
              src={tour.image || 'images/tours/default.jpg'} 
              alt={tour.title}
              className="w-full h-[50vh] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* Premium Info Cards */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-white font-bold text-lg">{tour.pricePerPerson.toLocaleString('tr-TR')} ₺</div>
                  <div className="text-white/80 text-sm">Kişi Başı</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-white font-bold text-lg">{tour.duration || '5 Gün'}</div>
                  <div className="text-white/80 text-sm">Süre</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="text-white font-bold text-lg">{tour.groupSize}</div>
                  <div className="text-white/80 text-sm">Grup Boyutu</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[color-secondary]/50 to-yellow-500/50 rounded-xl blur-lg scale-0 group-hover:scale-110 transition-all duration-500 ease-out opacity-60"></div>
                    
                    <Link 
                      to="/teklif-al" 
                      className="relative z-10 block w-full bg-gradient-to-r from-[color-secondary] to-yellow-500 hover:from-yellow-500 hover:to-[color-secondary] text-[color-primary] font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-center group"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="group-hover:tracking-wide transition-all duration-300">Özel Teklif Al</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                      
                      <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Content Grid */}
      <section className="py-16 relative overflow-hidden">
        {/* Light Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-l from-blue-100/40 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Sol Sütun - Tur Açıklaması (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Tour */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover-float animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-2xl font-bold mb-6 text-[color-text-dark] flex items-center">
                  <div className="w-8 h-8 bg-[color-primary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Tur Hakkında
                </h2>
                <p className="text-[color-text-light] leading-relaxed text-lg">{tour.description}</p>
              </div>

              {/* Tour Features */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover-float animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <h3 className="text-xl font-bold mb-6 text-[color-text-dark] flex items-center">
                  <div className="w-6 h-6 bg-[color-secondary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Tur Özellikleri
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center group">
                    <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-[color-primary]/20 transition-colors">
                      <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[color-text-dark]">Süre</div>
                      <div className="text-[color-text-light]">{tour.duration || '5 Gün'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center group">
                    <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-[color-primary]/20 transition-colors">
                      <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[color-text-dark]">Grup Boyutu</div>
                      <div className="text-[color-text-light]">{tour.groupSize}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center group">
                    <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-[color-primary]/20 transition-colors">
                      <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[color-text-dark]">Kişi Başı Fiyat</div>
                      <div className="text-[color-text-light]">{tour.pricePerPerson.toLocaleString('tr-TR')} ₺</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center group">
                    <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-[color-primary]/20 transition-colors">
                      <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-[color-text-dark]">Kategori</div>
                      <div className="text-[color-text-light]">{tour.category}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tur Planı */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover-float animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <h3 className="text-xl font-bold mb-6 text-[color-text-dark] flex items-center">
                  <div className="w-6 h-6 bg-[color-primary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  Tur Planı
                </h3>
                <div className="space-y-6">
                  <div className="border-l-2 border-[color-primary] pl-6 ml-3 relative group">
                    <div className="absolute w-4 h-4 bg-[color-primary] rounded-full -left-[9px] top-0 group-hover:scale-125 transition-transform"></div>
                    <h4 className="text-lg font-semibold text-[color-text-dark] mb-2">1. Gün</h4>
                    <p className="text-[color-text-light]">Varış, otel check-in ve karşılama. Şehir turu ve yerel kültür tanıtımı.</p>
                  </div>
                  <div className="border-l-2 border-[color-primary] pl-6 ml-3 relative group">
                    <div className="absolute w-4 h-4 bg-[color-primary] rounded-full -left-[9px] top-0 group-hover:scale-125 transition-transform"></div>
                    <h4 className="text-lg font-semibold text-[color-text-dark] mb-2">2. Gün</h4>
                    <p className="text-[color-text-light]">Tarihi mekanları ziyaret ve rehberli tur. Geleneksel yemek deneyimi.</p>
                  </div>
                  <div className="border-l-2 border-[color-primary] pl-6 ml-3 relative group">
                    <div className="absolute w-4 h-4 bg-[color-primary] rounded-full -left-[9px] top-0 group-hover:scale-125 transition-transform"></div>
                    <h4 className="text-lg font-semibold text-[color-text-dark] mb-2">3. Gün</h4>
                    <p className="text-[color-text-light]">Serbest zaman, alışveriş ve kişisel keşif. Akşam etkinlikleri.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sağ Sütun - Premium Contact Card (1/3) */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 hover-float animate-fade-in sticky top-24" style={{ animationDelay: '0.7s' }}>
                <h3 className="text-xl font-bold mb-6 text-[color-text-dark] flex items-center">
                  <div className="w-6 h-6 bg-[color-secondary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  İletişim
                </h3>
                
                <p className="text-[color-text-light] mb-6 leading-relaxed">
                  Bu tur hakkında detaylı bilgi almak veya özel bir teklif için bizimle iletişime geçin.
                </p>
                
                <div className="space-y-4 mb-8">
                  <a href="tel:+905551234567" className="flex items-center group">
                    <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-[color-primary]/20 transition-colors">
                      <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <span className="font-medium text-[color-text-dark] group-hover:text-[color-primary] transition-colors">+90 (555) 123 4567</span>
                  </a>
                  
                  <a href="mailto:info@endulustravel.com" className="flex items-center group">
                    <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-[color-primary]/20 transition-colors">
                      <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <span className="font-medium text-[color-text-dark] group-hover:text-[color-primary] transition-colors">info@endulustravel.com</span>
                  </a>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <span className="font-medium text-[color-text-dark]">İstanbul, Türkiye</span>
                  </div>
                </div>
                
                {/* Premium Action Buttons */}
                <div className="space-y-3">
                  <Link 
                    to="/teklif-al" 
                    className="group w-full bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center space-x-2"
                  >
                    <span>Özel Teklif Al</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  
                  <Link 
                    to="/on-anket" 
                    className="group w-full bg-[color-secondary] hover:bg-yellow-500 text-[color-primary] font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
                  >
                    <span>Ön Anket Doldur</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </Link>
                  
                  <a 
                    href={`https://wa.me/905551234567?text=${encodeURIComponent(`${tour.title} hakkında bilgi almak istiyorum.`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
                  >
                    <span>WhatsApp</span>
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Premium CTA Section */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color-primary] via-blue-600 to-[color-primary] text-white">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
              
              <div className="relative z-10 p-8 md:p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  {/* Badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                    <span className="text-[color-secondary] font-semibold mr-2">🎯</span>
                    <span className="text-sm font-medium">Bu Turla İlgileniyorum</span>
                  </div>
                  
                  {/* Heading */}
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Bu Tur İçin Özel Teklif
                  </h2>
                  <p className="text-[color-secondary] text-xl font-semibold mb-6">
                    Size Uygun Şartlarda Planlayalım
                  </p>
                  
                  {/* Description */}
                  <p className="text-lg mb-8 opacity-90 leading-relaxed">
                    Bu tur hakkında <strong>özel bir teklif</strong> hazırlayalım. 
                    Tarihlerinize ve ihtiyaçlarınıza göre kişiselleştirilmiş çözümler sunuyoruz.
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
                      <div className="text-sm font-semibold">Güvenilir Hizmet</div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-10 h-10 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold">Kişisel Yaklaşım</div>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to={`/teklif-al?tour=${tour.slug}`} 
                      className="group bg-[color-secondary] hover:bg-yellow-500 text-[color-primary] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-2"
                    >
                      <span>Bu Tur İçin Teklif Al</span>
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
          
          {/* Premium Related Tours */}
          {relatedTours.length > 0 && (
            <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <h2 className="text-3xl font-bold text-center mb-12 text-[color-text-dark]">
                Benzer Turlar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedTours.map((relatedTour, index) => (
                  <div key={relatedTour.id} className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden hover-float transition-all duration-500 hover:bg-white/90 hover:shadow-2xl hover:border-[color-primary]/20" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                    <div className="relative overflow-hidden">
                      <Link to={`/turlar/${relatedTour.slug}`}>
                        <img 
                          src={relatedTour.image || 'images/tours/default.jpg'} 
                          alt={relatedTour.title}
                          className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </Link>
                      <div className="absolute top-4 right-4">
                        <div className="bg-[color-secondary]/90 backdrop-blur-sm text-[color-primary] font-bold px-3 py-1 rounded-full border border-[color-secondary]">
                          {relatedTour.pricePerPerson.toLocaleString('tr-TR')} ₺
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <Link to={`/turlar/${relatedTour.slug}`}>
                        <h3 className="text-xl font-bold mb-3 text-[color-text-dark] group-hover:text-[color-primary] transition-colors duration-300 line-clamp-2">
                          {relatedTour.title}
                        </h3>
                      </Link>
                      <p className="text-[color-text-light] mb-4 leading-relaxed line-clamp-3">
                        {relatedTour.description.substring(0, 100)}...
                      </p>
                      <Link 
                        to={`/turlar/${relatedTour.slug}`}
                        className="group/btn w-full bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center space-x-2"
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
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TourDetailPage; 