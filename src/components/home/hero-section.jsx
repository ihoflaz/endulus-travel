import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Premium HeroSection bileşeni - Modern tasarım sistemi ile slider
const HeroSection = () => {
  // Slider resimleri
  const sliderImages = [
    '/images/slider/1.jpg',
    '/images/slider/2.jpg',
    '/images/slider/3.jpg',
    '/images/slider/4.jpg',
    '/images/slider/5.jpg',
    '/images/slider/6.jpg',
    '/images/slider/7.jpg',
    '/images/slider/8.jpg',
    '/images/slider/9.jpg',
    '/images/slider/10.jpg',
    '/images/slider/11.jpg',
    '/images/slider/12.jpg',
    '/images/slider/13.jpg',
    '/images/slider/14.jpg',
    '/images/slider/15.jpg',
    '/images/slider/16.jpg',
    '/images/slider/17.jpg',
    '/images/slider/18.jpg',
    '/images/slider/19.jpg',
    '/images/slider/20.jpg',
    '/images/slider/21.jpg',
    '/images/slider/22.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Otomatik slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5 saniyede bir değişir

    return () => clearInterval(timer);
  }, [sliderImages.length]);

    return (
    <section className="relative h-screen w-full overflow-hidden -mt-16">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {sliderImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image}
              alt={`Endülüs Travel Slider ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Premium Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 pt-16">
        <div className="max-w-5xl mx-auto text-center text-white">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-3 py-2 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 md:mb-8 animate-fade-in">
            <span className="text-[color-secondary] font-semibold mr-2">✨</span>
            <span className="text-xs md:text-sm font-medium">Hassasiyetlerinizi gözeten özel tur deneyimleri</span>
      </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 drop-shadow-2xl animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            Bizimle çıktığınız hiçbir yolculuk
            <span className="block text-[color-secondary] mt-1 md:mt-2">"herkes için aynı"</span>
            <span className="block mt-1 md:mt-2">değildir.</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90 leading-relaxed max-w-4xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.4s' }}>
            Çünkü biliyoruz ki, herkesin beklentisi, önceliği ve konfor alanı farklıdır.
            <br />
            Kişiye ve gruba özel, hassasiyet odaklı seyahat deneyimleri ile hayalinizdeki tatili gerçekleştiriyoruz.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-8 md:mb-12 animate-fade-in px-4" style={{ animationDelay: '0.5s' }}>
            {/* 15 Kişilik Gruplar */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-4 text-white">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm6 0c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM6 18v-2c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2h2v2H4v-2h2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">15 Kişilik Gruplar</h3>
              <p className="text-sm text-white/90">Sınırlı katılımcıyla özel deneyim</p>
            </div>

            {/* Hassasiyet Odaklı */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-4 text-white">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Hassasiyet Odaklı</h3>
              <p className="text-sm text-white/90">Her grubun özel ihtiyaçları</p>
            </div>

            {/* Kişisel Planlama */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 mx-auto mb-4 text-white">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M21,16V4H3V16H21M21,2A2,2 0 0,1 23,4V16A2,2 0 0,1 21,18H3A2,2 0 0,1 1,16V4A2,2 0 0,1 3,2H21M10.5,7.5L16,12L10.5,16.5V7.5Z"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Kişisel Planlama</h3>
              <p className="text-sm text-white/90">Size özel rota tasarımı</p>
            </div>
          </div>
          
          {/* İletişim Bilgileri ve WhatsApp */}
          <div className="flex flex-col items-center space-y-4 md:space-y-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {/* İletişim Bilgileri */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-8 items-center">
              {/* Telefon */}
              <a 
                href="tel:+905079384508" 
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/30 inline-flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+90 507 938 45 08</span>
              </a>
              
              {/* E-posta */}
              <a 
                href="mailto:info@endulustravel.com" 
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/30 inline-flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@endulustravel.com</span>
              </a>
            </div>
            
            {/* WhatsApp Butonu */}
            <a 
              href="https://wa.me/905079384508?text=Merhaba, tur planlaması hakkında bilgi almak istiyorum." 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>WhatsApp ile İletişim</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 