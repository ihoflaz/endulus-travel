import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTourDetail } from '../hooks';
import { WhatsAppButton } from '../components/ui';
import { formatTourPrice, getPriceLabel } from '../utils/priceUtils';

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
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={tour?.image || "/images/tours-page-bg.jpg"} 
            alt={tour?.title || "Tour Background"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[color-primary]/80 via-blue-600/80 to-[color-primary]/80"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
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
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">{tour?.groupSize || '10-12'}</h3>
                  <p className="text-white/90">Kişi</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">
                    {formatTourPrice(tour)}
                  </h3>
                  <p className="text-white/90">
                    {getPriceLabel(tour)}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">{tour?.duration || '5 Gün'}</h3>
                  <p className="text-white/90">Süre</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content Section */}
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
                      <div className="font-semibold text-[color-text-dark]">
                        {tour.pricePerPerson ? 'Kişi Başı Fiyat' : 'Durum'}
                      </div>
                      <div className="text-[color-text-light]">
                        {tour.pricePerPerson 
                          ? `${tour.pricePerPerson.toLocaleString('tr-TR')} ₺`
                          : (tour.priceStatus || 'Beklemede Kalın')
                        }
                      </div>
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
              
              {/* Tur Planı - Sadece Mısır Turu için detaylar */}
              {tour.slug === 'misir-turu-ozel' && tour.itinerary ? (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover-float animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <h3 className="text-xl font-bold mb-6 text-[color-text-dark] flex items-center">
                    <div className="w-6 h-6 bg-[color-primary] rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    Tur Programı Detayları
                  </h3>
                  <div className="space-y-6">
                    {tour.itinerary.map((day, index) => (
                      <div key={index} className="border-l-2 border-[color-primary] pl-6 ml-3 relative group">
                        <div className="absolute w-4 h-4 bg-[color-primary] rounded-full -left-[9px] top-0 group-hover:scale-125 transition-transform"></div>
                        <h4 className="text-lg font-semibold text-[color-text-dark] mb-2">
                          {day.day} - {day.date}
                        </h4>
                        <h5 className="text-md font-medium text-[color-primary] mb-2">{day.title}</h5>
                        <p className="text-[color-text-light] mb-3">{day.description}</p>
                        {day.activities && (
                          <ul className="list-disc list-inside text-sm text-[color-text-light] space-y-1">
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex}>{activity}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Diğer turlar için genel bilgi
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover-float animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <h3 className="text-xl font-bold mb-6 text-[color-text-dark] flex items-center">
                    <div className="w-6 h-6 bg-[color-primary] rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Tur Bilgileri
                  </h3>
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-[color-primary]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-[color-text-dark] mb-4">Yakında Sizlerle!</h4>
                    <p className="text-[color-text-light] mb-6 max-w-md mx-auto">
                      Bu özel tur için detaylı program hazırlığımız devam ediyor. 
                      Bizimle iletişime geçerek ön rezervasyon yaptırabilir ve güncel bilgiler alabilirsiniz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <WhatsAppButton 
                        tour={tour}
                        className="bg-[color-primary] hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                      />
                      <Link 
                        to="/teklif-al" 
                        className="bg-white/50 hover:bg-white text-[color-primary] hover:text-[color-primary] font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-[color-primary]/20"
                      >
                        Özel Teklif Al
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dahil Olan/Olmayan Hizmetler - Sadece Mısır Turu için */}
              {tour.slug === 'misir-turu-ozel' && (tour.included || tour.notIncluded) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dahil Olan Hizmetler */}
                  {tour.included && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover-float animate-fade-in" style={{ animationDelay: '0.7s' }}>
                      <h3 className="text-xl font-bold mb-6 text-[color-text-dark] flex items-center">
                        <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        Dahil Olan Hizmetler
                      </h3>
                      <ul className="space-y-3">
                        {tour.included.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-[color-text-light]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Dahil Olmayan Hizmetler */}
                  {tour.notIncluded && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/60 hover-float animate-fade-in" style={{ animationDelay: '0.8s' }}>
                      <h3 className="text-xl font-bold mb-6 text-[color-text-dark] flex items-center">
                        <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        Dahil Olmayan Hizmetler
                      </h3>
                      <ul className="space-y-3">
                        {tour.notIncluded.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-[color-text-light]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sağ Sütun - CTA ve Bilgiler (1/3) */}
            <div className="space-y-6">
              {/* Premium CTA Card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 sticky top-24 hover-float animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-xl font-bold mb-4 text-[color-text-dark]">Hemen Rezervasyon Yapın</h3>
                <p className="text-[color-text-light] mb-6">Size özel fiyat teklifi ve detaylı bilgi için bizimle iletişime geçin.</p>
                
                <div className="space-y-4">
                  <WhatsAppButton 
                    tour={tour}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  />
                  
                  <Link 
                    to="/teklif-al" 
                    className="w-full bg-[color-primary] hover:bg-blue-600 text-white hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
                  >
                    Özel Teklif Al
                  </Link>
                </div>
              </div>

              {/* Tour Info Card */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 hover-float animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <h3 className="text-lg font-bold mb-4 text-[color-text-dark]">Tur Bilgileri</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[color-text-light]">Grup Boyutu:</span>
                    <span className="font-semibold text-[color-text-dark]">{tour.groupSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[color-text-light]">Kategori:</span>
                    <span className="font-semibold text-[color-text-dark]">{tour.category}</span>
                  </div>
                  {tour.dates && (
                    <div className="flex items-center justify-between">
                      <span className="text-[color-text-light]">Tarihler:</span>
                      <span className="font-semibold text-[color-text-dark]">{tour.dates}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-[color-text-light]">
                      {tour.pricePerPerson ? 'Kişi Başı:' : 'Durum:'}
                    </span>
                    <span className="font-bold text-lg text-[color-primary]">
                      {tour.pricePerPerson 
                        ? `${tour.pricePerPerson.toLocaleString('tr-TR')} ₺`
                        : (tour.priceStatus || 'Beklemede Kalın')
                      }
                    </span>
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
                          {relatedTour.pricePerPerson 
                            ? `${relatedTour.pricePerPerson.toLocaleString('tr-TR')} ₺`
                            : (relatedTour.priceStatus || 'Beklemede Kalın')
                          }
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
                        {relatedTour.description}
                      </p>
                      <Link 
                        to={`/turlar/${relatedTour.slug}`} 
                        className="w-full bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center space-x-2"
                      >
                        <span>Detayları Gör</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
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
