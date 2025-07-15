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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Sol Taraf - Ofis Adresi */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover-float h-full">
                <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                  <div className="w-8 h-8 bg-[color-secondary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Ofis Adresimiz
                </h3>
                <address className="not-italic text-gray-300 space-y-4">
                  <div className="group flex items-start space-x-3 p-4 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <svg className="h-5 w-5 text-[color-secondary] mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div className="leading-relaxed">
                      <p className="text-white font-medium mb-2">Endülüs Travel</p>
                      <p className="group-hover:text-white transition-colors text-sm">
                        Osmanağa mah. Çilek sok. Akel İşhanı<br/>
                        No:1 Kat:2 İç kapı no:42<br/>
                        Kadıköy / İstanbul
                      </p>
                    </div>
                  </div>
                </address>
                
                {/* Firma Bilgileri */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>TURSAB No: <span className="text-[color-secondary] font-medium">6739</span></p>
                    <p className="font-medium text-gray-300">ROTA ATLAS TURİZM SEYAHAT ACENTASI</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sağ Taraf - İletişim Bilgileri */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover-float h-full">
                <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                  <div className="w-8 h-8 bg-[color-secondary] rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  İletişim Bilgileri
                </h3>
                <address className="not-italic text-gray-300 space-y-4">
                  <div className="group flex items-center space-x-3 p-4 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <svg className="h-5 w-5 text-[color-secondary] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href="tel:+905079384508" className="text-white group-hover:text-[color-secondary] transition-colors hover:underline font-medium text-lg">
                      +90 507 938 45 08
                    </a>
                  </div>
                  <div className="group flex items-center space-x-3 p-4 rounded-lg hover:bg-white/10 transition-all duration-300">
                    <svg className="h-5 w-5 text-[color-secondary] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:info@endulustravel.com" className="text-white group-hover:text-[color-secondary] transition-colors hover:underline font-medium">
                      info@endulustravel.com
                    </a>
                  </div>
                </address>
                
                {/* WhatsApp Butonu */}
                <div className="mt-6">
                  <a 
                    href="https://wa.me/905079384508?text=Merhaba, tur planlaması hakkında bilgi almak istiyorum." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center space-x-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span>WhatsApp ile İletişim</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Telif Hakkı ve Alt Bilgiler */}
          <div className="border-t border-white/20 pt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex flex-col md:flex-row justify-center md:justify-between items-center space-y-4 md:space-y-0">
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">
                    © {currentYear} <span className="font-semibold text-white">Endülüs Travel</span>. Tüm hakları saklıdır.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center space-x-6 text-sm">
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