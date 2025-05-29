import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Hakkımızda sayfası bileşeni
const AboutPage = () => {
  const { t } = useTranslation();

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
                {t('navigation.home')}
              </Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <span className="text-[color-secondary]">{t('navigation.about')}</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Endülüs Travel Hikayesi
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('about.title', 'Hakkımızda')}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {t('about.subtitle', 'Seyahatlerinizi hassasiyetlerinize göre kişiselleştiren, güvenilir seyahat deneyimi ortağınız.')}
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">10+</h3>
                  <p className="text-white/90">Yıl Deneyim</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">1000+</h3>
                  <p className="text-white/90">Mutlu Müşteri</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">50+</h3>
                  <p className="text-white/90">Destinasyon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="page-content">
        {/* Açılış Misyonu */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 md:p-12 hover-float animate-fade-in">
            <p className="text-lg text-[color-text-dark] leading-relaxed mb-6">
              Endülüs Travel, klasik tur anlayışının ötesinde, <strong>kişiye ve gruba özel, hassasiyet odaklı seyahat deneyimleri</strong> sunan bir turizm markasıdır. Bizimle çıktığınız hiçbir yolculuk "herkes için aynı" değildir.
            </p>
            <p className="text-lg text-[color-text-dark] leading-relaxed">
              Çünkü biliyoruz ki, herkesin beklentisi, önceliği ve konfor alanı farklıdır.
            </p>
      </div>
      </section>

        {/* Özelleştirme Felsefemiz */}
      <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-3xl font-bold mb-6 text-[color-text-dark]">
                Size özel, size uygun…
              </h2>
              <p className="text-lg text-[color-text-light] leading-relaxed mb-6">
                Turlarımız maksimum <span className="text-[color-primary] font-semibold">10-12 kişilik gruplar</span> hâlinde gerçekleşir veya yalnızca sizin grubunuza özel olarak planlanır.
              </p>
              <p className="text-lg text-[color-text-light] leading-relaxed">
                Gruplar <strong>asla karışmaz</strong>; orta yaşlı hanımlar veya beyler, genç kız ve erkek grupları ya da aileler, kendi hassasiyetlerine göre tamamen özelleştirilmiş turlarla seyahat eder.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 hover-float animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-semibold mb-6 text-[color-text-dark]">Kimler için özelleştiriyoruz?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[color-primary] rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-[color-text-light]">Bebekli aileler</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[color-primary] rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-[color-text-light]">Öğrenci grupları</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[color-primary] rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-[color-text-light]">Helal yemek isteyen muhafazakâr gezginler</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[color-primary] rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  </div>
                  <p className="text-[color-text-light]">Romantik tatil hayal eden çiftler</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[color-primary] rounded-full flex-shrink-0 flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  </div>
                  <p className="text-[color-text-light]">Ekstrem spor tutkunu gençler</p>
                </div>
              </div>
              <p className="text-sm text-[color-text-light] mt-6 italic">
                Biz, her gruba özel rota, içerik, yeme-içme düzeni, konaklama, transfer ve aktivite planlaması yapıyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Sürecimiz */}
        <section className="mb-16">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-[color-text-dark]">
              Seyahatinizi siz anlatın, biz planlayalım.
            </h2>
            <p className="text-lg text-[color-text-light] max-w-3xl mx-auto leading-relaxed">
              Web sitemizdeki ön anketler, talep formları ve "bütçene göre rota oluştur" sistemimiz sayesinde önce sizi tanıyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover-float animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-[color-primary] to-[color-primary-light] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[color-text-dark] group-hover:text-[color-primary] transition-colors">1. Sizi Tanıyoruz</h3>
              <p className="text-[color-text-light] leading-relaxed">
                Ön anketler ve talep formlarıyla beklentilerinizi, hassasiyetlerinizi ve bütçenizi öğreniyoruz.
              </p>
            </div>
            
            <div className="text-center group hover-float animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-[color-secondary] to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[color-text-dark] group-hover:text-[color-primary] transition-colors">2. Özel Planlama</h3>
              <p className="text-[color-text-light] leading-relaxed">
                Bütçenize, grup yapınıza, zamanınıza göre size özel rota ve aktiviteler planlıyoruz.
              </p>
            </div>
            
            <div className="text-center group hover-float animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-[color-accent] to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[color-text-dark] group-hover:text-[color-primary] transition-colors">3. Hayaliniz Gerçek</h3>
              <p className="text-[color-text-light] leading-relaxed">
                Rotayı size göre çizerek, hayalinizdeki tatili birlikte oluşturuyoruz.
              </p>
          </div>
        </div>
      </section>

        {/* Küresel Kapsam */}
      <section className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl p-8 md:p-12 text-white hover-float animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Dünyanın her yerine tur düzenleyebiliriz
              </h2>
              <p className="text-xl opacity-90">
                Yeter ki bir niyet, bir istek olsun…
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-lg leading-relaxed mb-6 opacity-90">
                  İstanbul merkezli seyahat acentemizle; Dubai'den Endülüs'e, Asya'dan Balkanlar'a kadar dünyanın dört bir yanına turlar düzenliyoruz.
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <p className="text-xl font-medium text-center">
                    "Hayal ettiğiniz tatil, standartlara uymak zorunda değil. <br />
                    <span className="text-[color-secondary]">Biz onu size uydururuz.</span>"
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-[color-secondary] mb-1">10+</div>
                  <div className="text-sm opacity-80">Yıllık Deneyim</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-[color-secondary] mb-1">50+</div>
                  <div className="text-sm opacity-80">Destinasyon</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-[color-secondary] mb-1">1000+</div>
                  <div className="text-sm opacity-80">Mutlu Müşteri</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold text-[color-secondary] mb-1">%100</div>
                  <div className="text-sm opacity-80">Kişiselleştirme</div>
                </div>
              </div>
            </div>
        </div>
      </section>

        {/* Güçlü CTA Alanı */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color-primary] via-blue-600 to-[color-primary] text-white">
            {/* Arka plan efektleri */}
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
            
            <div className="relative z-10 p-8 md:p-16 text-center">
              <div className="max-w-4xl mx-auto">
                {/* Ana Başlık */}
                <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in">
                  Hayalinizdeki tatili
                  <span className="block text-[color-secondary] mt-2">birlikte planlayalım!</span>
                </h2>
                
                {/* Alt başlık */}
                <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  Size özel, unutulmaz seyahat deneyimleri için bugün adım atın.
                </p>
                
                {/* Özellikler */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">Hızlı Yanıt</h3>
                    <p className="text-sm opacity-80">24 saat içinde size dönüş</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">Ücretsiz Planlama</h3>
                    <p className="text-sm opacity-80">İlk görüşme tamamen ücretsiz</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2">%100 Kişisel</h3>
                    <p className="text-sm opacity-80">Tamamen size özel tasarım</p>
                  </div>
                </div>
                
                {/* CTA Butonları */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <Link 
                    to="/teklif-al" 
                    className="group bg-[color-secondary] hover:bg-yellow-500 text-[color-primary] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-2"
                  >
                    <span>Hemen Teklif Alın</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  
                  <Link 
                    to="/on-anket" 
                    className="group bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 inline-flex items-center space-x-2"
                  >
                    <span>Önce Anket Doldurun</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </Link>
                </div>
                
                {/* Alt bilgi */}
                <p className="text-sm opacity-70 mt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                  📞 Hemen aramak isterseniz: <a href="tel:+905551234567" className="underline hover:text-[color-secondary] transition-colors">+90 555 123 4567</a>
                </p>
              </div>
            </div>
          </div>
      </section>
      </div>
    </div>
  );
};

export default AboutPage; 