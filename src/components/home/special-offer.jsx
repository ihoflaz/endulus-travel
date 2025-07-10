import { Link } from 'react-router-dom';
import { WhatsAppButton } from '../ui';

const SpecialOffer = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Premium Background with Egypt Theme */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-yellow-800 to-orange-900"></div>
        <div className="absolute inset-0 bg-[url('/images/tours/egypt-bg.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full transform -translate-x-40 translate-y-40"></div>
        
        {/* Egyptian Patterns */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-yellow-400/30 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-amber-400/30 rotate-12"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          {/* Special Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-bold rounded-full mb-6 animate-pulse">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <span>ÖZEL FIRSAT!</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Her Şey Dahil
            <span className="block text-yellow-400 mt-2">Mısır Turu</span>
          </h2>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
              <div className="text-yellow-400 font-bold text-2xl">1199 USD</div>
              <div className="text-white/80 text-sm">Kişi Başı</div>
            </div>
            <div className="bg-red-600 rounded-lg px-6 py-3">
              <div className="text-white font-bold text-lg">29 Ağustos - 5 Eylül</div>
              <div className="text-white/90 text-sm">Sadece 14 Kişi</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Tour Highlights */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">✨ Tur Özellikleri</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center bg-white/5 rounded-lg p-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.4 4.4 0 003 15z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Nil'de</div>
                    <div className="text-white/80 text-xs">Tekne Turu</div>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-lg p-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Safari</div>
                    <div className="text-white/80 text-xs">Turu</div>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-lg p-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Kızıldeniz'de</div>
                    <div className="text-white/80 text-xs">Dalış</div>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/5 rounded-lg p-3">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">Giza</div>
                    <div className="text-white/80 text-xs">Piramitleri</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Features */}
            <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-white font-bold text-lg">VIP Kalitesinde Tur</h4>
              </div>
              <ul className="text-white/90 space-y-2 text-sm">
                <li>• Namaz saatlerine göre düzenlenmiş program</li>
                <li>• Şarm el Şeyh'de 4 gece her şey dahil konaklama</li>
                <li>• Kahire'de 3 gece kahvaltı dahil konaklama</li>
                <li>• Tüm aktivite ve akşam yemekleri dahil</li>
                <li>• Ekstra ücret yok!</li>
              </ul>
            </div>
          </div>

          {/* Right Side - CTA */}
          <div className="text-center lg:text-left">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
              <div className="mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-amber-500/20 rounded-full border border-amber-400/30 mb-4">
                  <svg className="w-4 h-4 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-amber-300 text-sm font-medium">Sınırlı Kontenjan</span>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  Bildiğiniz Tüm Turları
                  <span className="block text-yellow-400">Unutun!</span>
                </h3>
                
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  Ekonomik fiyatlarla VIP kalitesinde bir Mısır deneyimi yaşayın. 
                  <strong className="text-yellow-400"> Sadece 14 kişilik</strong> özel grupla unutulmaz bir yolculuk.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link 
                  to="/turlar/misir-turu-ozel"
                  className="group w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-500 text-black font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center space-x-3"
                >
                  <span>Detayları Gör & Rezervasyon</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                
                <WhatsAppButton
                  message="Merhaba! 29 Ağustos - 5 Eylül tarihleri arasındaki Her Şey Dahil Mısır Turu (1199 USD) hakkında detaylı bilgi almak istiyorum."
                  className="w-full"
                  size="lg"
                  fullWidth={true}
                >
                  WhatsApp ile Hemen Ara - +90 507 938 45 08
                </WhatsAppButton>
              </div>
              
              <div className="mt-6 p-4 bg-white/10 rounded-lg border border-white/20">
                <p className="text-white/80 text-sm text-center">
                  <svg className="w-4 h-4 inline mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Bu özel fırsatı kaçırmayın! Sınırlı kontenjan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffer;
