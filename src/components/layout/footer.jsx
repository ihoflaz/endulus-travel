import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Footer bileşeni - Tüm sayfalarda görünen alt bilgi alanı
const Footer = () => {
  const { t } = useTranslation();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-20 translate-y-20"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
      </div>
      
      <div className="relative z-10 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Premium Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <span className="text-[color-secondary] font-semibold mr-2">✨</span>
              <span className="text-sm font-medium">Seyahat Yolculuğunuz Burada Başlıyor</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Kadim sokaklardan ihtişamlı saraylara
              </span>
              <span className="block text-[color-secondary] mt-2">sıcak çöllerden derin okyanuslara</span>
            </h2>
          </div>
          
          {/* Ana İçerik */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Premium Company Info */}
            <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover-float">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[color-secondary] to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <img 
                      src="/favicon/favicon.svg" 
                      alt="Endülüs Travel Logo"
                      className="w-10 h-10 object-contain filter brightness-0 invert"
                    />
                  </div>
          <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Endülüs Travel
                    </h3>
                    <p className="text-[color-secondary] font-medium">Hassasiyet Odaklı Seyahat</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Her seyahat planınız için <strong className="text-white">hassasiyetlerinizi gözeten</strong> ve 
                  kişisel ihtiyaçlarınıza özel olarak tasarlanmış profesyonel hizmetler sunuyoruz.
            </p>
            
                {/* Premium Social Media */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white mb-4">Sosyal Medyada Takip Edin:</h4>
                  <div className="flex space-x-4">
                    {[
                      { name: 'Facebook', href: 'https://facebook.com', color: 'hover:bg-blue-600' },
                      { name: 'Instagram', href: 'https://instagram.com', color: 'hover:bg-pink-600' },
                      { name: 'Twitter', href: 'https://twitter.com', color: 'hover:bg-blue-400' },
                      { name: 'LinkedIn', href: 'https://linkedin.com', color: 'hover:bg-blue-700' }
                    ].map((social) => (
                      <a 
                        key={social.name}
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 ${social.color} transition-all duration-300 transform hover:scale-110 hover:shadow-lg group`}
                        aria-label={`${social.name}'da takip edin`}
                      >
                        <svg className="h-6 w-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          {social.name === 'Facebook' && (
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          )}
                          {social.name === 'Instagram' && (
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                          )}
                          {social.name === 'Twitter' && (
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          )}
                          {social.name === 'LinkedIn' && (
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          )}
                </svg>
              </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hızlı Bağlantılar */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-float h-full">
                <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                  <div className="w-8 h-8 bg-[color-secondary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  Hızlı Bağlantılar
                </h3>
                <ul className="space-y-3">
                  {[
                    { path: '/', key: 'navigation.home' },
                    { path: '/hizmetler', key: 'navigation.services' },
                    { path: '/turlar', key: 'navigation.tours' },
                    { path: '/tur-planlama', key: 'navigation.tourPlanning' },
                    { path: '/blog', key: 'navigation.blog' }
                  ].map((link) => (
                    <li key={link.path}>
                      <Link 
                        to={link.path} 
                        className="group flex items-center py-2 px-3 rounded-lg text-gray-300 hover:text-[color-secondary] hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2"
                      >
                        <span className="w-2 h-2 bg-[color-secondary] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                        <span className="group-hover:font-medium transition-all">{t(link.key)}</span>
                        <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* İletişim Bilgileri */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover-float h-full">
                <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                  <div className="w-8 h-8 bg-[color-secondary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  İletişim
                </h3>
                <address className="not-italic text-gray-300 space-y-4">
                  <div className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <svg className="h-5 w-5 text-[color-secondary] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="group-hover:text-white transition-colors">İstanbul, Türkiye</p>
                  </div>
                  <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <svg className="h-5 w-5 text-[color-secondary] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+905551234567" className="text-white group-hover:text-[color-secondary] transition-colors hover:underline font-medium">
                      +90 555 123 4567
                    </a>
                  </div>
                  <div className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <svg className="h-5 w-5 text-[color-secondary] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:info@endulustravel.com" className="text-white group-hover:text-[color-secondary] transition-colors hover:underline font-medium">
                      info@endulustravel.com
                    </a>
                  </div>
                </address>
              </div>
            </div>
          </div>
          
          {/* Telif Hakkı ve Alt Bilgiler */}
          <div className="border-t border-white/20 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                  <p className="text-gray-300 text-sm mb-2">
                    © {currentYear} <span className="font-semibold text-white">Endülüs Travel</span>. Tüm hakları saklıdır.
                  </p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>TURSAB No: <span className="text-[color-secondary] font-medium">6739</span></p>
                    <p>ROTA ATLAS TURİZM SEYAHAT ACENTASI</p>
                    <p>Osmanağa mah. Çilek sok. Akel İşhanı No:1 Kat:2 İç kapı no:42 Kadıköy / İstanbul</p>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                  {[
                    { to: '/gizlilik', text: 'Gizlilik Politikası' },
                    { to: '/kullanim-kosullari', text: 'Kullanım Koşulları' },
                    { to: '/kvkk', text: 'KVKK' }
                  ].map((policy) => (
                    <Link 
                      key={policy.to}
                      to={policy.to} 
                      className="text-gray-300 hover:text-[color-secondary] transition-all duration-300 hover:scale-105 hover:underline"
                    >
                      {policy.text}
                    </Link>
                  ))}
                </div>
              </div>
          </div>
          </div>
        </div>
      </div>
      
      {/* Premium Decorative Bottom Line */}
      <div className="relative z-10 h-2 bg-gradient-to-r from-[color-primary] via-[color-secondary] to-[color-primary] animate-pulse-soft"></div>
    </footer>
  );
};

export default Footer; 