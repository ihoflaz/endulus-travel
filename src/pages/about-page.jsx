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

        {/* Turlarımız Hakkında */}
        <section className="mb-16">
          <div className="relative overflow-hidden">
            {/* Arka plan efektleri */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 rounded-2xl"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-200/20 to-transparent rounded-full transform -translate-x-24 translate-y-24"></div>
            
            <div className="relative z-10 p-8 md:p-12 hover-float animate-fade-in rounded-2xl">
              {/* Başlık Bölümü */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-[color-primary]/10 backdrop-blur-sm rounded-full border border-[color-primary]/20 mb-6">
                  <svg className="w-5 h-5 mr-2 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-[color-primary] font-semibold">Değerlerinizle Uyumlu Seyahat</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[color-text-dark]">
                  TURLARIMIZ 
                  <span className="block text-[color-primary] mt-2">HAKKINDA</span>
                </h2>
                
                <div className="w-24 h-1 bg-gradient-to-r from-[color-primary] to-[color-secondary] mx-auto rounded-full"></div>
              </div>
              
              {/* Ana İçerik */}
              <div className="max-w-5xl mx-auto">
                {/* Giriş Metni */}
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 mb-8 border border-white/40">
                  <p className="text-xl text-[color-text-dark] leading-relaxed text-center">
                    Endülüs Travel olarak, seyahat etmeyi sadece gezmekten ibaret görmüyor; 
                    <span className="text-[color-primary] font-semibold"> huzurla, inanç değerleriyle uyumlu, konforlu ve unutulmaz bir deneyime</span> dönüştürüyoruz.
                  </p>
                </div>
                
                {/* Özellikler Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Hassasiyet Odaklı Hizmet */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-[color-text-dark]">Hassasiyetlerinize Özel</h3>
                        <p className="text-[color-text-light] leading-relaxed">
                          Muhafazakâr misafirlerimizin hassasiyetlerini ön planda tutarak, 
                          <strong> namaz vakitlerine uygun programlar, helal yemek hassasiyeti ve mahremiyete önem veren özel grup turları</strong> sunuyoruz.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Her Şey Dahil */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[color-secondary] to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-[color-text-dark]">Her Şey Dahil Anlayışı</h3>
                        <p className="text-[color-text-light] leading-relaxed">
                          Tüm turlarımızda <strong>her şey dahil</strong> anlayışıyla hareket ediyor, 
                          ekstra ücret sürprizlerine yer vermiyoruz. Şeffaf fiyatlandırma garantisi.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Esnek Seçenekler */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-[color-text-dark]">Her Bütçeye Uygun</h3>
                        <p className="text-[color-text-light] leading-relaxed">
                          Yurt içi ve yurt dışı turlarımızda hem <span className="text-[color-primary] font-semibold">uygun fiyatlı</span> 
                          hem de isteğe bağlı <span className="text-[color-secondary] font-semibold">VIP seçenekler</span> sunuyoruz.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Kişiselleştirme */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-2 text-[color-text-dark]">Kişisel Deneyim</h3>
                        <p className="text-[color-text-light] leading-relaxed">
                          Amacımız, seyahatinizi sizin değerlerinize uygun şekilde planlamak ve 
                          <strong> her anının unutulmaz</strong> olmasını sağlamak.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Vurgu Kutusu */}
                <div className="relative overflow-hidden bg-gradient-to-r from-[color-primary] via-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
                  {/* Arka plan efektleri - daha güçlü overlay */}
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/20 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[color-secondary]/30 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
                  
                  <div className="relative z-10 max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-lg">
                      <svg className="w-8 h-8 text-[color-secondary] drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">Bizim Vaadimiz</h3>
                    <p className="text-xl leading-relaxed text-white drop-shadow-lg">
                      "Endülüs Travel ile güvenli, huzurlu ve değerlerinizle uyumlu bir yolculuğa çıkmaya hazır olun."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* İletişim Bilgileri */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-2xl">
            {/* Arka Plan Efektleri */}
            <div className="absolute inset-0 bg-gradient-to-br from-[color-primary] via-blue-600 to-indigo-700"></div>
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-32 translate-y-32"></div>
            
            <div className="relative z-10 p-8 md:p-12 text-white hover-float animate-fade-in">
              {/* Başlık Bölümü */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                  <svg className="w-5 h-5 mr-2 text-[color-secondary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[color-secondary] font-semibold">İletişim & Lokasyon</span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  BİRLİKTE YOLA ÇIKALIM
                </h2>
                <h3 className="text-2xl md:text-3xl font-semibold text-[color-secondary] mb-6">
                  ENDÜLÜS TRAVEL
                </h3>
                
                <div className="w-24 h-1 bg-[color-secondary] mx-auto rounded-full"></div>
              </div>
              
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* İletişim Detayları */}
                  <div className="space-y-6">
                    <h4 className="text-xl font-bold mb-6 text-[color-secondary]">İletişim Bilgileri</h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all duration-300">
                        <div className="w-12 h-12 bg-[color-secondary] rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-white">İletişim Numarası</p>
                          <a href="tel:+905079384508" className="text-[color-secondary] hover:text-yellow-200 transition-colors text-lg font-medium">
                            5079384508
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all duration-300">
                        <div className="w-12 h-12 bg-[color-secondary] rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Mail Adresi</p>
                          <a href="mailto:info@endulustravel.com" className="text-[color-secondary] hover:text-yellow-200 transition-colors font-medium">
                            info@endulustravel.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all duration-300">
                        <div className="w-12 h-12 bg-[color-secondary] rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Website</p>
                          <a href="https://www.endulustravel.com" className="text-[color-secondary] hover:text-yellow-200 transition-colors font-medium">
                            www.endulustravel.com
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/15 transition-all duration-300">
                        <div className="w-12 h-12 bg-[color-secondary] rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Social Media</p>
                          <p className="text-[color-secondary] font-medium">@endulustravel</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Adres Bilgisi */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h4 className="text-xl font-bold mb-6 text-[color-secondary] flex items-center">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m0 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h10m-5 4h2" />
                      </svg>
                      ROTA ATLAS SEYAHAT ACENTASI
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-[color-secondary] rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="leading-relaxed text-white">
                            <span className="font-semibold">Adres:</span><br />
                            Osmanağa mah. Çilek sok. Akel İşhanı<br />
                            No:1 Kat:2 İç kapı no:42 
                            <br />
                            <span className="font-semibold text-[color-secondary]">Kadıköy / İstanbul</span>
                          </p>
                        </div>
                      </div>
                      
                      {/* Harita Placeholder */}
                      <div className="bg-white/5 rounded-lg p-4 mt-4 border border-white/10">
                        <div className="flex items-center justify-center space-x-2 text-white/80">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          <span className="text-sm">Kadıköy merkez konumunda</span>
                        </div>
                      </div>
                    </div>
                  </div>
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