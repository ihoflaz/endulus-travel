import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Premium WomenGroupsSection bileşeni - Kadınlara özel gruplar
const ServicesSection = () => {
  const [womenGroups, setWomenGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Kadın grupları verilerini yükle
  useEffect(() => {
    const fetchWomenGroups = async () => {
      try {
        const response = await fetch('data/women-groups.json');
        if (!response.ok) {
          throw new Error('Kadın grupları verileri yüklenemedi');
        }
        const data = await response.json();
        setWomenGroups(data);
        setLoading(false);
      } catch (error) {
        console.error('Kadın grupları verisi yüklenirken hata:', error);
        setError('Kadın grupları yüklenemedi');
        setLoading(false);
      }
    };

    fetchWomenGroups();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-2xl h-72"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !womenGroups || womenGroups.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="bg-red-50 p-8 rounded-2xl">
            <p className="text-red-500 text-lg">Kadın grupları yüklenemedi</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Premium Light Container - Kadınlara özel pembe tonları */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-100/40 to-transparent rounded-full transform -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full transform translate-x-40 translate-y-40"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Premium Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-pink-200/50 mb-6">
            <span className="text-[color-primary] font-semibold mr-2">👩‍🤝‍👩</span>
            <span className="text-sm font-medium text-[color-primary]">Kadınlara Özel Gruplar</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[color-text-dark]">
            Kadın Dostu
            <span className="block text-[color-primary] mt-2">Grup Turları</span>
          </h2>
          
          <p className="text-xl text-[color-text-light] max-w-3xl mx-auto leading-relaxed">
            <strong>Sadece kadınlara özel gruplarla güvenli, konforlu ve keyifli yolculuklar</strong> deneyimleyin.
          </p>
        </div>



        {/* Premium CTA Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-white/60 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-[color-text-dark] mb-4">
              Kadın Dostu Güvenli Seyahatler
            </h3>
            <p className="text-[color-text-light] mb-6 leading-relaxed">
              Kadınlara özel grup turlarımızı inceleyin veya <strong>size özel bir kadın grubu planı</strong> hazırlamamızı isteyin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/hizmetler"
                className="group bg-gradient-to-r from-pink-500 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center space-x-2"
              >
                <span>Tüm Hizmetlerimiz</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link 
                to="/teklif-al"
                className="group bg-white/80 hover:bg-white text-pink-600 font-semibold py-3 px-8 rounded-xl border border-pink-300/50 hover:border-pink-400 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Kadın Grubu Talebi</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 