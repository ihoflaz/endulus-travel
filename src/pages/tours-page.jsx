import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { WhatsAppButton } from '../components/ui';
import { formatTourPrice, getPriceLabel, getNumericPrice } from '../utils/priceUtils';

// Premium ToursPage bileşeni - Modern tasarım sistemi ile
const ToursPage = () => {
  const [searchParams] = useSearchParams();
  
  // State tanımları
  const [toursData, setToursData] = useState({
    tours: [],
    categories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredTours, setFilteredTours] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sayfa başlığını ayarla
  useEffect(() => {
    document.title = 'Tur Paketlerimiz - Endülüs Travel';
  }, []);

  // Tur verilerini ve kategorileri yükle
  useEffect(() => {
    const fetchToursAndCategories = async () => {
      try {
        // Turları yükle
        const toursResponse = await fetch('data/tours.json');
        if (!toursResponse.ok) {
          throw new Error('Tur verileri yüklenemedi');
        }
        const toursData = await toursResponse.json();
        setToursData({
          tours: toursData.featured || [],
          categories: toursData.categories || []
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError('Veriler yüklenemedi');
        setLoading(false);
      }
    };

    fetchToursAndCategories();
  }, []);

  // Filtreleri uygula
  useEffect(() => {
    if (!loading && !error && toursData.tours.length > 0) {
      let filtered = [...toursData.tours];
      
      // URL parametrelerinden filtreleri uygula
      const category = searchParams.get('category');
      const priceMin = searchParams.get('priceMin');
      const priceMax = searchParams.get('priceMax');
      
      // Kategori filtresi
      if (category && category !== 'all') {
        filtered = filtered.filter(tour => tour.category === category);
        setSelectedCategory(category);
      }
      
      // Fiyat filtresi
      if (priceMin) {
        filtered = filtered.filter(tour => {
          const numericPrice = getNumericPrice(tour);
          return numericPrice && numericPrice >= Number(priceMin);
        });
      }
      if (priceMax) {
        filtered = filtered.filter(tour => {
          const numericPrice = getNumericPrice(tour);
          return numericPrice && numericPrice <= Number(priceMax);
        });
      }
      
      setFilteredTours(filtered);
    }
  }, [searchParams, loading, error, toursData]);
  
  // Kategori değiştirme işlevi
  const handleCategoryChange = (categoryKey) => {
    setSelectedCategory(categoryKey);
    
    let filtered = [...toursData.tours];
    if (categoryKey !== 'all') {
      filtered = filtered.filter(tour => tour.category === categoryKey);
    }
    setFilteredTours(filtered);
  };
  
  // Yükleme durumunda
  if (loading) {
    return (
      <div className="pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center animate-pulse">
              <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto mb-8"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-gray-200 rounded-2xl h-96"></div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
  // Hata durumunda
  if (error) {
    return (
      <div className="pt-16">
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
            <div className="bg-red-50 p-8 rounded-2xl">
              <h2 className="text-2xl text-red-600 font-semibold mb-4">
                Veri Yükleme Hatası
              </h2>
              <p className="text-gray-700">{error}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/tours/tours-page-bg.jpg)' }}
        ></div>
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[color-primary]/30 via-blue-600/20 to-[color-primary]/30"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
        
        <div className="relative z-10 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Breadcrumb */}
            <div className="mb-6 animate-fade-in">
              <Link to="/" className="text-white/80 hover:text-white transition-colors">
                Ana Sayfa
              </Link>
              <span className="text-white/60 mx-2">&gt;</span>
              <span className="text-[color-secondary]">Turlar</span>
            </div>

            {/* Hero Content */}
            <div className="text-center text-white max-w-4xl mx-auto">
              <div className="mb-6 animate-fade-in">
                <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-[color-secondary] text-sm font-semibold rounded-full border border-white/30">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Benzersiz Deneyimler
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                Tur Paketlerimiz
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Kişiselleştirilmiş tur deneyimlerimizi keşfedin ve hassasiyetlerinize uygun hayalinizdeki tatile katılın.
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">50+</h3>
                  <p className="text-white/90">Aktif Tur</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">10-12</h3>
                  <p className="text-white/90">Kişilik Gruplar</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <h3 className="text-2xl font-bold text-[color-secondary] mb-2">%100</h3>
                  <p className="text-white/90">Kişiselleştirme</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Page Header */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full transform translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-40 translate-y-40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Premium Section Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[color-text-dark] animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Benzersiz
              <span className="block text-[color-primary] mt-2">Tur Deneyimleri</span>
          </h1>
            
            <p className="text-xl text-[color-text-light] max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Kişiselleştirilmiş tur deneyimlerimizi keşfedin ve <strong>hassasiyetlerinize uygun</strong> 
              hayalinizdeki tatile katılın.
            </p>
          </div>
        </div>
      </section>

      {/* Premium Category Filters */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button 
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === 'all' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white/70 hover:bg-white text-blue-600 border border-blue-300 hover:border-blue-600'}`} 
              onClick={() => handleCategoryChange('all')}
            >
              Tümü
            </button>
            
            {toursData.categories.map((category, index) => (
              <button 
                key={category.key}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.key 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white/70 hover:bg-white text-blue-600 border border-blue-300 hover:border-blue-600'}`}
                onClick={() => handleCategoryChange(category.key)}
                style={{ animationDelay: `${(index + 1) * 0.05}s` }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>
        
      {/* Premium Tours Grid */}
      <section className="py-16 relative overflow-hidden">
        {/* Light Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-100/40 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          {filteredTours.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 border border-white/60 inline-block">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-600 mb-4">Bu kategoride tur bulunamadı</h3>
                <p className="text-gray-500">Farklı bir kategori seçerek tekrar deneyebilirsiniz</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredTours.map((tour, index) => (
                <div 
                  key={tour.id} 
                  className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden hover-float animate-fade-in transition-all duration-500 hover:bg-white/90 hover:shadow-2xl hover:border-[color-primary]/20"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Premium Image Container */}
                  <div className="relative overflow-hidden">
                    <Link to={`/turlar/${tour.slug}`}>
                      <img 
                        src={tour.image || 'images/tours/default.jpg'} 
                        alt={tour.title} 
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
            />
                    </Link>
                    
                    {/* Premium Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full border border-white/30">
                        {toursData.categories.find(cat => cat.key === tour.category)?.label || tour.category}
                      </div>
                    </div>
          
                    {/* Premium Price Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-[color-secondary]/90 backdrop-blur-sm text-[color-primary] font-bold px-3 py-1 rounded-full border border-[color-secondary]">
                        {formatTourPrice(tour)}
                      </div>
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Premium Card Content */}
                  <div className="p-6">
                    <Link to={`/turlar/${tour.slug}`}>
                      <h3 className="text-xl font-bold mb-3 text-[color-text-dark] group-hover:text-[color-primary] transition-colors duration-300 line-clamp-2">
                        {tour.title}
                      </h3>
                    </Link>
                    
                    <p className="text-[color-text-light] mb-6 leading-relaxed line-clamp-3">
                      {tour.description}
                    </p>
                    
                    {/* Tour Info */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center text-sm text-[color-text-light]">
                        <div className="w-8 h-8 bg-[color-primary]/10 rounded-full flex items-center justify-center mr-2 group-hover:bg-[color-primary]/20 transition-colors">
                          <svg className="w-4 h-4 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                        </div>
                        <span className="font-medium">{tour.groupSize}</span>
                      </div>
                    </div>
                    
                    {/* Premium CTA Button */}
                    <Link 
                      to={`/turlar/${tour.slug}`} 
                      className="group/btn w-full bg-gradient-to-r from-[color-primary] to-blue-600 hover:from-blue-600 hover:to-[color-primary] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg inline-flex items-center justify-center space-x-2"
                    >
                      <span>Detayları Gör</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Premium CTA Section */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[color-primary] via-blue-600 to-[color-primary] text-white">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[color-secondary]/20 to-transparent rounded-full transform -translate-x-16 translate-y-16"></div>
              
              <div className="relative z-10 p-8 md:p-12 text-center">
                <div className="max-w-3xl mx-auto">
                  {/* Badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                    <span className="text-[color-secondary] font-semibold mr-2">✨</span>
                    <span className="text-sm font-medium">Size Özel Seyahat</span>
                  </div>
                  
                  {/* Heading */}
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Size Özel Tur
                    <span className="block text-[color-secondary] mt-2">Paketleri Arıyorsunuz?</span>
                  </h2>
                  
                  {/* Description */}
                  <p className="text-xl mb-8 opacity-90 leading-relaxed">
                    Kişiselleştirilmiş bir seyahat deneyimi için bizimle iletişime geçin. 
                    <strong>İhtiyaçlarınıza ve tercihlerinize</strong> göre özel tur paketleri hazırlayabiliriz.
                  </p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold mb-2">Kişiselleştirilmiş</h3>
                      <p className="text-sm opacity-80">İhtiyaçlarınıza özel</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold mb-2">Hızlı Planlama</h3>
                      <p className="text-sm opacity-80">Profesyonel organizasyon</p>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="w-12 h-12 bg-[color-secondary] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="font-semibold mb-2">Güvenilir Hizmet</h3>
                      <p className="text-sm opacity-80">Hassasiyetlerinize uygun</p>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/teklif-al" 
                      className="group bg-[color-secondary] hover:bg-yellow-500 text-[color-primary] font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl inline-flex items-center space-x-2"
                    >
                      <span>Özel Teklif Al</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    
                    <Link 
                      to="/on-anket" 
                      className="group bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/30 inline-flex items-center space-x-2"
                    >
                      <span>Ön Anket Doldur</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </Link>

                    <WhatsAppButton
                      message="Turlarınız hakkında bilgi almak istiyorum."
                      size="lg"
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      WhatsApp İletişim
                    </WhatsAppButton>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 pt-6 border-t border-white/20">
                    <a href="tel:+905079384508" className="flex items-center text-white/80 hover:text-white transition-colors group">
                      <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +90 (507) 938 4508
                    </a>
                    <a href="mailto:info@endulustravel.com" className="flex items-center text-white/80 hover:text-white transition-colors group">
                      <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      info@endulustravel.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToursPage; 