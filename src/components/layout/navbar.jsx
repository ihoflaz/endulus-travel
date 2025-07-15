import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Premium Navbar bileşeni - Modern tasarım sistemi ile
const Navbar = () => {
  const { t, i18n } = useTranslation('translation');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toursDropdownOpen, setToursDropdownOpen] = useState(false);
  const location = useLocation();

  // Scroll efekti için
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobil menü açıldığında body scroll'unu kapat
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Mevcut dili değiştir
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  // Aktif menü öğesini belirle
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Mobil menüyü aç/kapat
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Mobil menü kapanması için link tıklamalarında
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Premium Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out w-full bg-white ${
          isScrolled 
            ? 'shadow-2xl border-b border-gray-200' 
            : 'shadow-lg border-b border-gray-100'
        }`}
        role="navigation"
        aria-label="Ana navigasyon"
      >
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
              {/* Premium Logo */}
              <Link 
                to="/" 
                className="flex items-center space-x-3 group transform hover:scale-105 transition-all duration-300 ease-out"
                aria-label="Ana sayfaya git"
              >
                {/* Simple Logo Container */}
                <div className="relative">
                  <img 
                    src="/favicon/favicon2.svg" 
                    alt="Endülüs Travel Logo"
                    className="w-10 h-10 group-hover:scale-110 transition-transform duration-300 ease-out"
                  />
                </div>

                {/* Brand Text */}
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-bold group-hover:text-blue-600 transition-colors duration-300 ease-out" style={{ color: 'rgb(23, 49, 80)' }}>
                    Endülüs Travel
                  </h1>
                  <p className="text-xs font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300 ease-out tracking-wide">
                    Premium Travel Experience
                  </p>
                </div>

                {/* Mobile Logo Text */}
                <div className="sm:hidden">
                  <span className="text-lg font-bold group-hover:text-blue-600 transition-colors duration-300 ease-out" style={{ color: 'rgb(23, 49, 80)' }}>
                    Endülüs
                  </span>
                </div>
          </Link>

              {/* Premium Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-1">
                {[
                  { path: '/', key: 'navigation.home' }
                ].map((item, index) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-out hover:scale-105 hover:translate-y-[-2px] group ${
                      isActive(item.path) 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-md'
                    }`}
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      backgroundColor: isActive(item.path) ? 'rgb(23, 49, 80)' : undefined,
                      color: isActive(item.path) ? 'white' : !isActive(item.path) ? 'rgb(23, 49, 80)' : undefined
                    }}
                  >
                    <span className="relative z-10">{t(item.key)}</span>
                    {!isActive(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[color-primary]/10 to-blue-600/10 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                    )}
                  </Link>
                ))}

                {/* Turlar Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setToursDropdownOpen(true)}
                  onMouseLeave={() => setToursDropdownOpen(false)}
                >
                  <button 
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-out hover:scale-105 hover:translate-y-[-2px] group flex items-center space-x-1 ${
                      (isActive('/turlar') || isActive('/yurt-ici-turlar') || isActive('/yurt-disi-turlar'))
                        ? 'text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-md'
                    }`}
                    style={{ 
                      backgroundColor: (isActive('/turlar') || isActive('/yurt-ici-turlar') || isActive('/yurt-disi-turlar')) ? 'rgb(23, 49, 80)' : undefined,
                      color: (isActive('/turlar') || isActive('/yurt-ici-turlar') || isActive('/yurt-disi-turlar')) ? 'white' : 'rgb(23, 49, 80)'
                    }}
                  >
                    <span className="relative z-10">{t('navigation.tours')}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${toursDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    {!(isActive('/turlar') || isActive('/yurt-ici-turlar') || isActive('/yurt-disi-turlar')) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[color-primary]/10 to-blue-600/10 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  <div 
                    className={`absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 transition-all duration-300 ease-out ${
                      toursDropdownOpen 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible translate-y-2'
                    }`}
                  >
                    <div className="py-2">
                      <Link
                        to="/yurt-disi-turlar"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-[color-primary]/10 hover:text-[color-primary] transition-all duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <div className="font-medium">Yurt Dışı Turlar</div>
                          <div className="text-sm text-gray-500">Dünya turları</div>
                        </div>
                        <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link
                        to="/yurt-ici-turlar"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-[color-primary]/10 hover:text-[color-primary] transition-all duration-200 group"
                      >
                        <svg className="w-5 h-5 mr-3 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                          <div className="font-medium">Yurt İçi Turlar</div>
                          <div className="text-sm text-gray-500">Türkiye turları</div>
                        </div>
                        <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>

                {[
                  { path: '/blog', key: 'navigation.blog' },
                  { path: '/hakkimizda', key: 'navigation.about' },
                  { path: '/iletisim', key: 'navigation.contact' }
                ].map((item, index) => (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ease-out hover:scale-105 hover:translate-y-[-2px] group ${
                      isActive(item.path) 
                        ? 'text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-white/60 hover:backdrop-blur-sm hover:shadow-md'
                    }`}
                    style={{ 
                      animationDelay: `${(index + 3) * 0.05}s`,
                      backgroundColor: isActive(item.path) ? 'rgb(23, 49, 80)' : undefined,
                      color: isActive(item.path) ? 'white' : !isActive(item.path) ? 'rgb(23, 49, 80)' : undefined
                    }}
                  >
                    <span className="relative z-10">{t(item.key)}</span>
                    {!isActive(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[color-primary]/10 to-blue-600/10 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                    )}
            </Link>
                ))}

                {/* Premium Language Selector */}
                <div className="ml-6 relative">
                  <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/30 shadow-lg">
              <button
                onClick={() => changeLanguage('tr')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-out hover:scale-105 ${
                        i18n.language === 'tr' 
                          ? 'bg-gradient-to-r from-[color-primary] to-blue-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:text-[color-primary] hover:bg-white/80'
                      }`}
                      aria-label="Türkçe dil seçeneği"
              >
                TR
              </button>
              <button
                onClick={() => changeLanguage('en')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-out hover:scale-105 ${
                        i18n.language === 'en' 
                          ? 'bg-gradient-to-r from-[color-primary] to-blue-600 text-white shadow-lg' 
                          : 'text-gray-600 hover:text-[color-primary] hover:bg-white/80'
                      }`}
                      aria-label="English language option"
              >
                EN
              </button>
            </div>
          </div>
        </div>

              {/* Premium Mobile Menu Section */}
              <div className="lg:hidden flex items-center space-x-3">
                {/* Mobile Language Selector */}
                <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-white/30 shadow-md">
              <button
                onClick={() => changeLanguage('tr')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 hover:scale-105 ${
                      i18n.language === 'tr' 
                        ? 'bg-gradient-to-r from-[color-primary] to-blue-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-[color-primary]'
                    }`}
              >
                TR
              </button>
              <button
                onClick={() => changeLanguage('en')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 hover:scale-105 ${
                      i18n.language === 'en' 
                        ? 'bg-gradient-to-r from-[color-primary] to-blue-600 text-white shadow-md' 
                        : 'text-gray-600 hover:text-[color-primary]'
                    }`}
              >
                EN
              </button>
                </div>

                {/* Premium Hamburger Button */}
                <button 
                  onClick={toggleMobileMenu} 
                  className="relative p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/30 text-gray-700 hover:text-[color-primary] hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[color-primary]/50 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg group"
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label="Menüyü aç/kapat"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 transition-all duration-400 ease-out ${mobileMenuOpen ? 'rotate-180 scale-110' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} 
                    />
                  </svg>
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[color-primary]/10 to-blue-600/10 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300 ease-out -z-10"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Mobile Menu */}
        <div 
          id="mobile-menu"
          className={`lg:hidden transition-all duration-400 ease-in-out w-full overflow-hidden ${
            mobileMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="relative backdrop-blur-xl bg-white/95 border-t border-white/20 shadow-2xl">
            {/* Mobile menu background effects */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-white/30"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[color-primary] to-blue-600"></div>
            
            <div className="relative z-10 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="py-6 space-y-2">
                  {[
                    { path: '/', key: 'navigation.home' }
                  ].map((item, index) => (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className={`block px-6 py-4 rounded-xl font-medium transition-all duration-300 ease-out hover:scale-[1.02] hover:translate-x-2 group relative ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-[color-primary] to-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-white/80 hover:text-[color-primary] hover:shadow-md'
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={handleMobileLinkClick}
                    >
                      <span className="relative z-10 flex items-center">
                        {t(item.key)}
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      {!isActive(item.path) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[color-primary]/10 to-blue-600/10 rounded-xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
                      )}
                    </Link>
                  ))}

                  {/* Mobile Turlar Section */}
                  <div className="px-6 py-2">
                    <div className="text-sm font-semibold text-gray-500 mb-2">Turlar</div>
                    <div className="ml-4 space-y-2">
                      <Link
                        to="/yurt-disi-turlar"
                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-white/80 hover:text-[color-primary] transition-all duration-200 group"
                        onClick={handleMobileLinkClick}
                      >
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Yurt Dışı Turlar
                          <svg className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Link>
                      <Link
                        to="/yurt-ici-turlar"
                        className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-white/80 hover:text-[color-primary] transition-all duration-200 group"
                        onClick={handleMobileLinkClick}
                      >
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-[color-primary]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Yurt İçi Turlar
                          <svg className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>

                  {[
                    { path: '/blog', key: 'navigation.blog' },
                    { path: '/hakkimizda', key: 'navigation.about' },
                    { path: '/iletisim', key: 'navigation.contact' }
                  ].map((item, index) => (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className={`block px-6 py-4 rounded-xl font-medium transition-all duration-300 ease-out hover:scale-[1.02] hover:translate-x-2 group relative ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-[color-primary] to-blue-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-white/80 hover:text-[color-primary] hover:shadow-md'
                      }`}
                      style={{ animationDelay: `${(index + 5) * 0.05}s` }}
                      onClick={handleMobileLinkClick}
                    >
                      <span className="relative z-10 flex items-center">
                        {t(item.key)}
                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      {!isActive(item.path) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[color-primary]/10 to-blue-600/10 rounded-xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    </nav>

      {/* Premium Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fade-in"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Navbar; 