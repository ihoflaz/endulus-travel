import { LocaleLink as Link } from '../LocaleLink';
import { useTranslation } from 'react-i18next';
import { PhoneLink } from '../ui/phone-link';

// Premium CallToAction bileşeni - Modern tasarım sistemi ile
const CallToAction = () => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color:var(--color-primary)] via-blue-600 to-[color:var(--color-primary)] text-white">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[color:var(--color-secondary)]/20 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
          
          <div className="relative z-10 p-8 md:p-16 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Hero Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fade-in">
                <span className="text-[color:var(--color-secondary)] font-semibold mr-2">🚀</span>
                <span className="text-sm font-medium">{t('homeCta.badge', 'Hayalleriniz Gerçek Oluyor')}</span>
              </div>
              
              {/* Main Heading */}
              <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {t('homeCta.headingLine1', 'Hayalinizdeki tatile')}
                <span className="block text-[color:var(--color-secondary)] mt-2">{t('homeCta.headingLine2', 'bir adım daha yaklaşın!')}</span>
          </h2>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {t('homeCta.subtitlePart1', 'Size özel, unutulmaz seyahat deneyimleri için ')}<strong>{t('homeCta.subtitleStrong', 'bugün adım atın')}</strong>{t('homeCta.subtitlePart2', '. Uzman ekibimiz en uygun planı sizin için hazırlıyor.')}
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-12 h-12 bg-[color:var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">{t('homeCta.feature1Title', 'Ücretsiz Anket')}</h3>
                  <p className="text-sm opacity-80">{t('homeCta.feature1Desc', 'Kişisel tercihlerinizi öğreniyoruz')}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-12 h-12 bg-[color:var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">{t('homeCta.feature2Title', 'Hızlı Planlama')}</h3>
                  <p className="text-sm opacity-80">{t('homeCta.feature2Desc', '24 saat içinde özel teklifiniz')}</p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="w-12 h-12 bg-[color:var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">{t('homeCta.feature3Title', 'Mükemmel Deneyim')}</h3>
                  <p className="text-sm opacity-80">{t('homeCta.feature3Desc', '%100 kişiselleştirilmiş tatil')}</p>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <Link 
              to="/on-anket"
                  className="group bg-[color:var(--color-secondary)] hover:bg-yellow-500 text-[color:var(--color-primary)] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-2"
            >
                  <span>{t('homeCta.btnSurvey', 'Ön Anketi Doldur')}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </Link>
            
                <Link 
              to="/teklif-al"
                  className="group bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 inline-flex items-center space-x-2"
                >
                  <span>{t('homeCta.btnQuote', 'Hemen Teklif Al')}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <Link 
                  to="/tur-planlama" 
                  className="group bg-transparent hover:bg-white/10 text-white font-semibold py-4 px-8 rounded-xl border-2 border-white/50 hover:border-white transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <span>{t('homeCta.btnTourPlanning', 'Tur Planlama')}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 001-1v-1a2 2 0 012-2z" />
                  </svg>
                </Link>
              </div>
              
              {/* Trust Indicators */}
              <div className="mt-10 animate-fade-in" style={{ animationDelay: '1s' }}>
                <p className="text-sm opacity-70 mb-4">{t('homeCta.trustHeading', 'Binlerce memnun müşterimiz var:')}</p>
                <div className="flex justify-center items-center space-x-8 opacity-60">
                  <div className="text-center">
                    <div className="text-2xl font-bold">%98</div>
                    <div className="text-xs">{t('homeCta.statSatisfaction', 'Memnuniyet Oranı')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{t('homeCta.statResponseTime', '24 Sa')}</div>
                    <div className="text-xs">{t('homeCta.statResponseLabel', 'Ortalama Yanıt')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-xs">{t('homeCta.statHappyCustomers', 'Mutlu Müşteri')}</div>
                  </div>
                </div>
              </div>
              
              {/* Contact Info */}
              <PhoneLink
                className="text-sm opacity-70 mt-6 animate-fade-in"
                prefix={t('homeCta.callPrefix', '📞 Hemen aramak isterseniz:')}
              />
              <noscript />
              {/* anim delay restored via wrapper above when applicable */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction; 