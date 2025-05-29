import { Link } from 'react-router-dom';

// Premium HeroSection bileşeni - Modern tasarım sistemi ile
const HeroSection = () => {
    return (
    <section className="relative h-screen w-full overflow-hidden -mt-16">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[color-primary] via-blue-600 to-[color-primary]">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-20 translate-y-20"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
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
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 drop-shadow-2xl animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            Her yolculuk bir
            <span className="block text-[color-secondary] mt-1 md:mt-2">niyetle başlar</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.4s' }}>
            Kişiye ve gruba özel, <strong>hassasiyet odaklı seyahat deneyimleri</strong> ile hayalinizdeki tatili gerçekleştiriyoruz.
          </p>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 max-w-4xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.6s' }}>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20 hover-float">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">10-12 Kişilik Gruplar</h3>
              <p className="text-xs md:text-sm opacity-80">Sınırlı katılımcıyla özel deneyim</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20 hover-float">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Hassasiyet Odaklı</h3>
              <p className="text-xs md:text-sm opacity-80">Her grubun özel ihtiyaçları</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-white/20 hover-float">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h3 className="font-semibold mb-1 md:mb-2 text-sm md:text-base">Kişisel Planlama</h3>
              <p className="text-xs md:text-sm opacity-80">Size özel rota tasarımı</p>
            </div>
          </div>
          
          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center animate-fade-in px-4" style={{ animationDelay: '0.8s' }}>
            <Link 
              to="/tur-planlama" 
              className="group bg-[color-secondary] hover:bg-yellow-500 text-[color-primary] font-bold py-3 px-6 md:py-4 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <span className="text-sm md:text-base">Tur Planlama</span>
              <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            
            <Link 
              to="/butceye-gore-rota" 
              className="group bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 md:py-4 md:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 inline-flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <span className="text-sm md:text-base">Bütçe Rotası</span>
              <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </Link>
            
            <Link 
              to="/on-anket" 
              className="group bg-transparent hover:bg-white/10 text-white font-semibold py-3 px-6 md:py-4 md:px-8 rounded-xl border-2 border-white/50 hover:border-white transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <span className="text-sm md:text-base">Ön Anket</span>
              <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-8 md:mt-10 animate-fade-in px-4" style={{ animationDelay: '1s' }}>
            <p className="text-xs md:text-sm opacity-70 mb-3 md:mb-4">Güvenilir tercih:</p>
            <div className="flex justify-center items-center space-x-4 md:space-x-8 opacity-60">
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold">1000+</div>
                <div className="text-xs">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold">50+</div>
                <div className="text-xs">Destinasyon</div>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-2xl font-bold">10+</div>
                <div className="text-xs">Yıl Deneyim</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 