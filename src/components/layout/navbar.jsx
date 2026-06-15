import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LocaleLink as Link } from '../LocaleLink';
import { localizedPath, alternates } from '../../utils/locale-routes';
import AnimatedLogo from '../brand/AnimatedLogo';
import { Magnetic } from '../motion';

const LINKS = [
  { path: '/', key: 'navigation.home', fallback: 'Ana Sayfa' },
  { path: '/turlar', key: 'navigation.tours', fallback: 'Turlar', children: [
    { path: '/yurt-disi-turlar', key: 'navbar.internationalTours', fallback: 'Yurt Dışı Turlar' },
    { path: '/yurt-ici-turlar', key: 'navbar.domesticTours', fallback: 'Yurt İçi Turlar' },
    { path: '/turlar', key: 'navbar.allTours', fallback: 'Tüm Turlar' },
  ] },
  { path: '/blog', key: 'navigation.blog', fallback: 'Blog' },
  { path: '/hakkimizda', key: 'navigation.about', fallback: 'Hakkımızda' },
  { path: '/iletisim', key: 'navigation.contact', fallback: 'İletişim' },
];

const Navbar = () => {
  const { t, i18n } = useTranslation('translation');
  const [open, setOpen] = useState(false);     // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [toursOpen, setToursOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // close mobile menu on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const changeLanguage = (lng) => {
    const target = alternates(location.pathname)[lng];
    i18n.changeLanguage(lng);
    try { localStorage.setItem('i18nextLng', lng); } catch { /* ignore */ }
    navigate(target);
  };

  const isActive = (path) => location.pathname === localizedPath(path, i18n.language);
  const lang = i18n.language === 'en' ? 'en' : 'tr';

  const LangPill = ({ compact = false }) => (
    <div className={`flex items-center rounded-full border border-[var(--ds-line-strong)] ${compact ? 'p-0.5' : 'p-1'}`}>
      {['tr', 'en'].map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`rounded-full font-medium transition-all duration-300 ${compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1 text-xs'} ${
            lang === lng ? 'text-[var(--ds-on-gold)]' : 'text-[var(--ds-text-soft)] hover:text-[var(--ds-gold-bright)]'
          }`}
          style={lang === lng ? { background: 'var(--ds-grad-gold)' } : undefined}
          aria-label={lng === 'tr' ? 'Türkçe' : 'English'}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <nav
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(10,14,26,0.82)' : 'rgba(10,14,26,0.30)',
          backdropFilter: 'blur(14px) saturate(130%)',
          WebkitBackdropFilter: 'blur(14px) saturate(130%)',
          borderBottom: `1px solid ${scrolled ? 'var(--ds-line)' : 'transparent'}`,
        }}
        role="navigation"
        aria-label={t('navbar.ariaMainNav', 'Ana navigasyon')}
      >
        <div className="ds-container">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
            {/* Logo */}
            <Link to="/" aria-label={t('navbar.ariaGoHome', 'Ana sayfaya git')} className="shrink-0">
              <AnimatedLogo size={scrolled ? 34 : 40} variant="gold" withWordmark loop loopEvery={8000} className="[&_*]:transition-all" />
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {LINKS.map((item) => (
                item.children ? (
                  <div key={item.path} className="relative" onMouseEnter={() => setToursOpen(true)} onMouseLeave={() => setToursOpen(false)}>
                    <button className={`nav-pill group ${isActive('/turlar') || isActive('/yurt-ici-turlar') || isActive('/yurt-disi-turlar') ? 'is-active' : ''}`}>
                      <span>{t(item.key, item.fallback)}</span>
                      <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${toursOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <AnimatePresence>
                      {toursOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full left-0 pt-3 w-64"
                        >
                          <div className="ds-glass rounded-2xl overflow-hidden p-2" style={{ background: 'rgba(15,21,37,0.92)' }}>
                            {item.children.map((c) => (
                              <Link key={c.path} to={c.path} className="flex items-center justify-between px-4 py-3 rounded-xl text-[var(--ds-text-soft)] hover:text-[var(--ds-gold-bright)] hover:bg-white/5 transition-colors">
                                <span className="font-medium">{t(c.key, c.fallback)}</span>
                                <svg className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link key={item.path} to={item.path} className={`nav-pill ${isActive(item.path) ? 'is-active' : ''}`}>
                    {t(item.key, item.fallback)}
                  </Link>
                )
              ))}
            </div>

            {/* Right cluster */}
            <div className="hidden lg:flex items-center gap-4">
              <LangPill />
              <Magnetic strength={0.4}>
                <Link to="/teklif-al" className="ds-btn" style={{ padding: '0.7rem 1.5rem' }}>
                  {t('nav.getOffer', 'Teklif Al')}
                </Link>
              </Magnetic>
            </div>

            {/* Mobile cluster */}
            <div className="lg:hidden flex items-center gap-3">
              <LangPill compact />
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={t('navbar.ariaToggleMenu', 'Menüyü aç/kapat')}
                aria-expanded={open}
                className="relative w-11 h-11 grid place-items-center rounded-full border border-[var(--ds-line-strong)] text-[var(--ds-text)]"
              >
                <span className="sr-only">menu</span>
                <div className="relative w-5 h-4">
                  <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                  <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-all duration-300 ${open ? 'opacity-0' : 'opacity-100'}`} />
                  <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden fixed inset-0 z-40 ds-grain"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: 'var(--ds-grad-night)' }}
          >
            <div className="h-full flex flex-col justify-center px-8 pt-24 pb-10">
              <nav className="flex flex-col gap-1">
                {LINKS.map((item, i) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className="ds-display block py-2 text-[var(--ds-text)]"
                      style={{ fontSize: 'clamp(2rem,9vw,3.2rem)', fontWeight: 300 }}
                    >
                      <span className={isActive(item.path) ? 'ds-gold-text' : ''}>{t(item.key, item.fallback)}</span>
                    </Link>
                    {item.children && (
                      <div className="pl-1 -mt-1 mb-2 flex flex-wrap gap-x-5 gap-y-1">
                        {item.children.slice(0, 2).map((c) => (
                          <Link key={c.path} to={c.path} onClick={() => setOpen(false)} className="text-sm text-[var(--ds-text-muted)] hover:text-[var(--ds-gold)]">
                            {t(c.key, c.fallback)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-10"
              >
                <Link to="/teklif-al" onClick={() => setOpen(false)} className="ds-btn w-full justify-center" style={{ padding: '1rem' }}>
                  {t('nav.getOffer', 'Teklif Al')}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
