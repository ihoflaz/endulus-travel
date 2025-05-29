import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';

const BudgetRoutesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    budget: '',
    persons: '',
    days: '',
    departure: ''
  });
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  
  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = t('budgetRoutes.pageTitle', 'Bütçeye Göre Rotalar - Endülüs Travel');
  }, [t]);
  
  // Rota verilerini yükle
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('data/budget-routes.json');
        if (!response.ok) {
          throw new Error('Rota verileri yüklenemedi');
        }
        const data = await response.json();
        setRoutes(data);
        setFilteredRoutes(data);
        setLoading(false);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchRoutes();
  }, []);
  
  // Filtreleme işlemi
  useEffect(() => {
    if (routes.length === 0) return;
    
    const applyFilters = () => {
      let result = [...routes];
      
      // Bütçe filtresi
      if (filters.budget) {
        const budgetValue = parseInt(filters.budget);
        result = result.filter(route => route.budget <= budgetValue);
      }
      
      // Kişi sayısı filtresi
      if (filters.persons) {
        const personsValue = parseInt(filters.persons);
        result = result.filter(route => route.persons >= personsValue);
      }
      
      // Gün sayısı filtresi
      if (filters.days) {
        const daysValue = parseInt(filters.days);
        result = result.filter(route => route.days <= daysValue);
      }
      
      // Kalkış yeri filtresi
      if (filters.departure) {
        result = result.filter(route => 
          route.departure.toLowerCase().includes(filters.departure.toLowerCase())
        );
      }
      
      setFilteredRoutes(result);
    };
    
    applyFilters();
  }, [filters, routes]);
  
  // Filtre değişikliklerini işle
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Filtreleri sıfırla
  const resetFilters = () => {
    setFilters({
      budget: '',
      persons: '',
      days: '',
      departure: ''
    });
  };
  
  // Teklif sayfasına yönlendirme yap
  const handleRequestOffer = (route) => {
    navigate(`/teklif-al?destination=${route.destination}&budget=${route.budget}&persons=${route.persons}&days=${route.days}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[color-primary]/30 border-t-[color-primary] rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[color-secondary] rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="page-transition">
        <div className="py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-red-600 p-8 text-white animate-shake">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10 flex items-center justify-center">
                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                {t('navigation.home', 'Ana Sayfa')}
              </Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <span className="text-[color-secondary]">{t('budgetRoutes.title', 'Bütçeye Göre Rotalar')}</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Akıllı Rota Önerileri
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {t('budgetRoutes.title', 'Bütçenize Göre Rotalar')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {t('budgetRoutes.description', 'Seyahat bütçenize, sürenize ve kişi sayınıza göre sizin için ideal rotaları keşfedin. Filtreleri kullanarak sizin için en uygun seyahat planını bulun.')}
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">500+</h3>
                  <p className="text-white/90">Hazır Rota</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">50+</h3>
                  <p className="text-white/90">Destinasyon</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">1000+</h3>
                  <p className="text-white/90">Mutlu Müşteri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Content Section */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Premium Filter Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 mb-12 animate-fade-in">
            <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent"></div>
            <div className="relative z-10 p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[color-primary] to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t('budgetRoutes.filters.title', 'Rotaları Filtrele')}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Bütçe Filtresi */}
                <div>
                  <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('budgetRoutes.filters.maxBudget', 'Maksimum Bütçe (₺)')}
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={filters.budget}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50"
                  >
                    <option value="">{t('budgetRoutes.filters.any', 'Tümü')}</option>
                    <option value="10000">10.000₺</option>
                    <option value="15000">15.000₺</option>
                    <option value="20000">20.000₺</option>
                    <option value="30000">30.000₺</option>
                    <option value="50000">50.000₺</option>
                    <option value="100000">100.000₺</option>
                  </select>
                </div>
                
                {/* Kişi Sayısı Filtresi */}
                <div>
                  <label htmlFor="persons" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('budgetRoutes.filters.minPersons', 'Minimum Kişi Sayısı')}
                  </label>
                  <select
                    id="persons"
                    name="persons"
                    value={filters.persons}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50"
                  >
                    <option value="">{t('budgetRoutes.filters.any', 'Tümü')}</option>
                    <option value="1">1 Kişi</option>
                    <option value="2">2 Kişi</option>
                    <option value="3">3 Kişi</option>
                    <option value="4">4 Kişi</option>
                    <option value="5">5+ Kişi</option>
                  </select>
                </div>
                
                {/* Süre Filtresi */}
                <div>
                  <label htmlFor="days" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('budgetRoutes.filters.maxDays', 'Maksimum Süre (Gün)')}
                  </label>
                  <select
                    id="days"
                    name="days"
                    value={filters.days}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50"
                  >
                    <option value="">{t('budgetRoutes.filters.any', 'Tümü')}</option>
                    <option value="5">5 Gün</option>
                    <option value="7">7 Gün</option>
                    <option value="10">10 Gün</option>
                    <option value="14">14 Gün</option>
                  </select>
                </div>
                
                {/* Kalkış Yeri Filtresi */}
                <div>
                  <label htmlFor="departure" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('budgetRoutes.filters.departure', 'Kalkış Yeri')}
                  </label>
                  <input
                    type="text"
                    id="departure"
                    name="departure"
                    value={filters.departure}
                    onChange={handleFilterChange}
                    placeholder={t('budgetRoutes.filters.enterDeparture', 'Kalkış şehri yazın')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[color-primary] focus:border-transparent outline-none transition-all duration-300 hover:border-[color-primary]/50"
                  />
                </div>
              </div>
              
              {/* Filtre Butonları */}
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={resetFilters}
                  className="group bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{t('budgetRoutes.filters.reset', 'Filtreleri Sıfırla')}</span>
                </button>

                {/* Sonuç Sayısı */}
                <div className="text-gray-600 font-medium">
                  {filteredRoutes.length === 0 ? (
                    t('budgetRoutes.noResults', 'Kriterlere uygun rota bulunamadı')
                  ) : (
                    t('budgetRoutes.resultCount', 'Toplam {{count}} uygun rota', { count: filteredRoutes.length })
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium Route Cards */}
          {filteredRoutes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredRoutes.map((route, index) => (
                <div 
                  key={route.id}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Premium Glass Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 h-full">
                    
                    {/* Background Effects */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[color-primary]/10 to-transparent rounded-full transform -translate-x-6 translate-y-6"></div>

                    {/* Image Container */}
                    <div className="relative overflow-hidden h-56">
                      <img 
                        src={route.image} 
                        alt={route.destination} 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Price Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-2 bg-[color-secondary] text-[color-primary] text-sm font-bold rounded-full shadow-lg">
                          {route.budget.toLocaleString('tr-TR')}₺
                        </span>
                      </div>

                      {/* Days Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-2 bg-black/50 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                          {route.days} Gün
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[color-primary] transition-colors duration-300">
                        {route.destination}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {route.description}
                      </p>
                      
                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-[color-primary] mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          <span className="text-gray-700 text-sm font-medium">{route.persons} Kişi</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-[color-primary] mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm font-medium">{route.departure}</span>
                        </div>
                        <div className="flex items-center col-span-2">
                          <svg className="w-4 h-4 text-[color-primary] mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm font-medium">Kişi başı: {route.price.toLocaleString('tr-TR')}₺</span>
                        </div>
                      </div>
                      
                      {/* Highlights */}
                      {route.highlights && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">
                            {t('budgetRoutes.card.highlights', 'Öne Çıkan Yerler')}:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {route.highlights.slice(0, 3).map((highlight, idx) => (
                              <span 
                                key={idx} 
                                className="inline-block bg-gradient-to-r from-[color-primary]/10 to-blue-600/10 text-[color-primary] text-xs px-3 py-1 rounded-full font-medium"
                              >
                                {highlight}
                              </span>
                            ))}
                            {route.highlights.length > 3 && (
                              <span className="inline-block text-xs text-gray-500 px-3 py-1">
                                +{route.highlights.length - 3} {t('budgetRoutes.card.more', 'daha')}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <button
                        onClick={() => handleRequestOffer(route)}
                        className="group w-full bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-flex items-center justify-center space-x-2"
                      >
                        <span>{t('budgetRoutes.card.requestOffer', 'Teklif Al')}</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[color-primary]/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 animate-fade-in">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.881-6.08 2.33l-.528-.002L5 15.299a8.962 8.962 0 01-1.81-5.31V8.53A3.984 3.984 0 013 8c0-.552.448-1 1-1s1 .448 1 1a2 2 0 104 0c0-.552.448-1 1-1s1 .448 1 1a2 2 0 104 0c0-.552.448-1 1-1s1 .448 1 1a3.984 3.984 0 01-.19 1.532V10c0 .852-.129 1.675-.369 2.45z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t('budgetRoutes.noRoutes', 'Kriterlere uygun rota bulunamadı')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('budgetRoutes.noRoutesDescription', 'Lütfen filtrelerinizi değiştirin veya özel bir teklif için bizimle iletişime geçin.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetFilters}
                    className="group bg-[color-primary] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center space-x-2"
                  >
                    <span>{t('budgetRoutes.filters.reset', 'Filtreleri Sıfırla')}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Premium CTA Section */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-blue-900">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
              
              <div className="relative z-10 p-8 md:p-12 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t('budgetRoutes.contact.title', 'Özel Tur Teklifi Alın')}
                </h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  {t('budgetRoutes.contact.description', 'İstediğiniz kriterlere uygun bir rota bulamadınız mı? Bizimle iletişime geçin, size özel bir teklif hazırlayalım.')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/teklif-al"
                    className="group bg-[color-secondary] hover:bg-yellow-500 text-[color-primary] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center justify-center space-x-2"
                  >
                    <span>{t('budgetRoutes.contact.requestButton', 'Teklif İste')}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link 
                    to="/iletisim"
                    className="group bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 inline-flex items-center justify-center space-x-2"
                  >
                    <span>{t('budgetRoutes.contact.contactButton', 'İletişime Geç')}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetRoutesPage; 