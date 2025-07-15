import { Link } from 'react-router-dom';
import { WhatsAppButton } from '../ui';

const SpecialOffer = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Premium Background with Egypt Theme */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/tours/egypt-bg.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full transform -translate-x-40 translate-y-40"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          {/* Section Title */}
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            Yaklaşan Turlarımız
          </h2>
          
          {/* Special Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-bold rounded-full mb-6 animate-pulse">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <span>ÖZEL FIRSAT!</span>
          </div>
          
          <h3 className="text-2xl md:text-4xl font-bold text-yellow-400 mb-4">
            Her Şey Dahil Mısır Turu
          </h3>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-amber-800/80 backdrop-blur-sm rounded-lg px-6 py-3 border border-amber-600/50">
              <div className="text-yellow-400 font-bold text-2xl">1199 USD</div>
              <div className="text-white/80 text-sm">Kişi Başı</div>
            </div>
            <div className="bg-red-600/90 rounded-lg px-6 py-3 border border-red-500/50">
              <div className="text-white font-bold text-lg">29 Ağustos - 5 Eylül</div>
              <div className="text-white/90 text-sm">Sadece 14 Kişi</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Tour Details */}
          <div className="space-y-6">
            <div className="bg-amber-800/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-600/50">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tur Programı
              </h3>
              
              <div className="space-y-3 text-white/90">
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Şarm el Şeyh'de 4 gece her şey dahil 4 yıldızlı otel konaklaması</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Atv safari turu ve bedevi gecesi</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Ras Muhammed Beyaz Ada Tekne Turu & Tüplü Dalış (Tüm gün öğle yemekli)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Şarm el Şeyh Şehir Turu ve Farsha cafe gezisi</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Kahire'de 3 gece kahvaltı dahil konaklama (Akşam yemekleri restoranlarda fiyata dahil alınacaktır)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Kahire Şehir turu</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Giza Piramitleri ve Sfenks turu (Fayton Turu Dahil)</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Baron Empire Palas & Mısır Müzesi & Papirus Kağıt Müzesi turu ve giriş biletleri</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>Nil nehrinde tekne turu (akşam yemekli)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - CTA */}
          <div className="text-center lg:text-left">
            <div className="bg-amber-800/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-600/50">
              <div className="mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-amber-500/30 rounded-full border border-amber-400/50 mb-4">
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
              
              <div className="mt-6 p-4 bg-amber-700/60 rounded-lg border border-amber-500/40">
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
