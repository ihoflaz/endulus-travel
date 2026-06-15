import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../components/LocaleLink';
import { useLocaleNavigate } from '../hooks/useLocaleNavigate';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import { Reveal, TextReveal, Magnetic } from '../components/motion';

const MEDIA = '/uploads/media';

const BudgetRoutesPage = () => {
  const { t } = useTranslation();
  const navigate = useLocaleNavigate();

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

  // Rota verilerini yükle
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('/data/budget-routes.json');
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

  const hero = (
    <PageHero
      video={`${MEDIA}/desert.mp4`}
      poster={`${MEDIA}/desert.jpg`}
      eyebrow={t('budgetRoutes.heroEyebrow', 'Çöl Kervanı · Değerli Rotalar')}
      title={t('budgetRoutes.title', 'Bütçenize Göre Rotalar')}
      subtitle={t('budgetRoutes.description', 'Seyahat bütçenize, sürenize ve kişi sayınıza göre sizin için ideal rotaları keşfedin. Filtreleri kullanarak sizin için en uygun seyahat planını bulun.')}
      breadcrumb={[
        { to: '/', label: t('navigation.home', 'Ana Sayfa') },
        { label: t('budgetRoutes.title', 'Bütçeye Göre Rotalar') },
      ]}
    />
  );

  const seo = (
    <Seo
      title={t('budgetRoutes.pageTitle', 'Bütçeye Göre Rotalar - Endülüs Travel')}
      description={t('budgetRoutes.metaDescription', 'Seyahat bütçenize, sürenize ve kişi sayınıza göre hazırlanmış ideal tur rotalarını keşfedin. Filtreleyin, karşılaştırın ve size en uygun seyahat planı için hemen teklif alın.')}
    />
  );

  if (loading) {
    return (
      <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
        {seo}
        {hero}
        <section className="py-16 md:py-24">
          <div className="ds-container">
            <div className="rounded-3xl ds-glass h-40 animate-pulse mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl ds-glass animate-pulse" style={{ aspectRatio: '4/5' }} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
        {seo}
        {hero}
        <section className="py-16 md:py-24">
          <div className="ds-container">
            <div
              className="ds-glass rounded-3xl p-8 md:p-10 text-center max-w-2xl mx-auto"
              style={{ borderColor: 'var(--ds-terracotta)' }}
            >
              <p className="ds-display text-2xl mb-3" style={{ color: 'var(--ds-terracotta)' }}>
                {t('budgetRoutes.noResults', 'Kriterlere uygun rota bulunamadı')}
              </p>
              <p className="text-[var(--ds-text-soft)] break-words">{error}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      {seo}
      {hero}

      <section className="py-16 md:py-24">
        <div className="ds-container">

          {/* Filter Card */}
          <Reveal className="mb-12">
            <div className="ds-glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="ds-eyebrow">{t('budgetRoutes.heroBadge', 'Akıllı Rota Önerileri')}</span>
              </div>
              <h2 className="ds-display text-2xl md:text-3xl text-[var(--ds-text)] mb-6">
                {t('budgetRoutes.filters.title', 'Rotaları Filtrele')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Bütçe Filtresi */}
                <div className="min-w-0">
                  <label htmlFor="budget" className="block text-sm font-medium text-[var(--ds-text-soft)] mb-2">
                    {t('budgetRoutes.filters.maxBudget', 'Maksimum Bütçe (₺)')}
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={filters.budget}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-2xl bg-transparent border border-[var(--ds-line-strong)] text-[var(--ds-text)] outline-none transition-colors duration-300 hover:border-[var(--ds-gold)] focus:border-[var(--ds-gold-bright)]"
                  >
                    <option value="" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">{t('budgetRoutes.filters.any', 'Tümü')}</option>
                    <option value="10000" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">10.000₺</option>
                    <option value="15000" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">15.000₺</option>
                    <option value="20000" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">20.000₺</option>
                    <option value="30000" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">30.000₺</option>
                    <option value="50000" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">50.000₺</option>
                    <option value="100000" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">100.000₺</option>
                  </select>
                </div>

                {/* Kişi Sayısı Filtresi */}
                <div className="min-w-0">
                  <label htmlFor="persons" className="block text-sm font-medium text-[var(--ds-text-soft)] mb-2">
                    {t('budgetRoutes.filters.minPersons', 'Minimum Kişi Sayısı')}
                  </label>
                  <select
                    id="persons"
                    name="persons"
                    value={filters.persons}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-2xl bg-transparent border border-[var(--ds-line-strong)] text-[var(--ds-text)] outline-none transition-colors duration-300 hover:border-[var(--ds-gold)] focus:border-[var(--ds-gold-bright)]"
                  >
                    <option value="" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">{t('budgetRoutes.filters.any', 'Tümü')}</option>
                    <option value="1" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">1 Kişi</option>
                    <option value="2" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">2 Kişi</option>
                    <option value="3" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">3 Kişi</option>
                    <option value="4" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">4 Kişi</option>
                    <option value="5" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">5+ Kişi</option>
                  </select>
                </div>

                {/* Süre Filtresi */}
                <div className="min-w-0">
                  <label htmlFor="days" className="block text-sm font-medium text-[var(--ds-text-soft)] mb-2">
                    {t('budgetRoutes.filters.maxDays', 'Maksimum Süre (Gün)')}
                  </label>
                  <select
                    id="days"
                    name="days"
                    value={filters.days}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 rounded-2xl bg-transparent border border-[var(--ds-line-strong)] text-[var(--ds-text)] outline-none transition-colors duration-300 hover:border-[var(--ds-gold)] focus:border-[var(--ds-gold-bright)]"
                  >
                    <option value="" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">{t('budgetRoutes.filters.any', 'Tümü')}</option>
                    <option value="5" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">5 Gün</option>
                    <option value="7" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">7 Gün</option>
                    <option value="10" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">10 Gün</option>
                    <option value="14" className="bg-[var(--ds-surface)] text-[var(--ds-text)]">14 Gün</option>
                  </select>
                </div>

                {/* Kalkış Yeri Filtresi */}
                <div className="min-w-0">
                  <label htmlFor="departure" className="block text-sm font-medium text-[var(--ds-text-soft)] mb-2">
                    {t('budgetRoutes.filters.departure', 'Kalkış Yeri')}
                  </label>
                  <input
                    type="text"
                    id="departure"
                    name="departure"
                    value={filters.departure}
                    onChange={handleFilterChange}
                    placeholder={t('budgetRoutes.filters.enterDeparture', 'Kalkış şehri yazın')}
                    className="w-full px-4 py-3 rounded-2xl bg-transparent border border-[var(--ds-line-strong)] text-[var(--ds-text)] placeholder:text-[var(--ds-text-muted)] outline-none transition-colors duration-300 hover:border-[var(--ds-gold)] focus:border-[var(--ds-gold-bright)]"
                  />
                </div>
              </div>

              <div className="ds-hairline my-7" />

              {/* Filtre Butonları */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <button
                  onClick={resetFilters}
                  className="ds-btn-ghost"
                >
                  {t('budgetRoutes.filters.reset', 'Filtreleri Sıfırla')}
                </button>

                {/* Sonuç Sayısı */}
                <div className="text-[var(--ds-text-soft)] font-medium">
                  {filteredRoutes.length === 0 ? (
                    t('budgetRoutes.noResults', 'Kriterlere uygun rota bulunamadı')
                  ) : (
                    <span className="ds-gold-text">
                      {t('budgetRoutes.resultCount', 'Toplam {{count}} uygun rota', { count: filteredRoutes.length })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Route Cards */}
          {filteredRoutes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredRoutes.map((route, index) => (
                <Reveal key={route.id} delay={(index % 3) * 0.08}>
                  <div className="group ds-glass rounded-3xl overflow-hidden h-full flex flex-col transition-transform duration-500 hover:-translate-y-1.5">

                    {/* Image Container */}
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={route.image}
                        alt={route.destination}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,10,18,0) 40%, rgba(7,10,18,0.85) 100%)' }} />

                      {/* Price Badge */}
                      <div className="absolute top-4 right-4">
                        <span
                          className="inline-flex items-center px-3 py-1.5 text-sm font-bold rounded-full"
                          style={{ background: 'var(--ds-grad-gold)', color: 'var(--ds-on-gold)' }}
                        >
                          {route.budget.toLocaleString('tr-TR')}₺
                        </span>
                      </div>

                      {/* Days Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1.5 ds-glass text-[var(--ds-text)] text-sm font-medium rounded-full">
                          {t('budgetRoutes.card.daysCount', '{{count}} Gün', { count: route.days })}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="ds-display text-xl text-[var(--ds-text)] mb-3 transition-colors duration-300 group-hover:text-[var(--ds-gold-bright)] break-words">
                        {route.destination}
                      </h3>
                      <p className="text-[var(--ds-text-muted)] mb-4 line-clamp-2 leading-relaxed">
                        {route.description}
                      </p>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center min-w-0">
                          <svg className="w-4 h-4 text-[var(--ds-gold)] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          <span className="text-[var(--ds-text-soft)] text-sm truncate">{t('budgetRoutes.card.personsCount', '{{count}} Kişi', { count: route.persons })}</span>
                        </div>
                        <div className="flex items-center min-w-0">
                          <svg className="w-4 h-4 text-[var(--ds-gold)] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[var(--ds-text-soft)] text-sm truncate">{route.departure}</span>
                        </div>
                        <div className="flex items-center col-span-2 min-w-0">
                          <svg className="w-4 h-4 text-[var(--ds-gold)] mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[var(--ds-text-soft)] text-sm truncate">
                            {t('budgetRoutes.card.perPerson', 'Kişi başı:')} <span className="ds-gold-text font-semibold">{route.price.toLocaleString('tr-TR')}₺</span>
                          </span>
                        </div>
                      </div>

                      {/* Highlights */}
                      {route.highlights && (
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-[var(--ds-text-soft)] mb-2">
                            {t('budgetRoutes.card.highlights', 'Öne Çıkan Yerler')}:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {route.highlights.slice(0, 3).map((highlight, idx) => (
                              <span
                                key={idx}
                                className="inline-block text-xs px-3 py-1 rounded-full font-medium border border-[var(--ds-line)] text-[var(--ds-gold-bright)] break-words"
                              >
                                {highlight}
                              </span>
                            ))}
                            {route.highlights.length > 3 && (
                              <span className="inline-block text-xs text-[var(--ds-text-muted)] px-2 py-1">
                                +{route.highlights.length - 3} {t('budgetRoutes.card.more', 'daha')}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => handleRequestOffer(route)}
                        className="ds-btn w-full justify-center mt-auto"
                      >
                        {t('budgetRoutes.card.requestOffer', 'Teklif Al')}
                      </button>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Reveal>
              <div className="ds-glass rounded-3xl p-10 md:p-14 text-center max-w-2xl mx-auto mb-16">
                <h3 className="ds-display text-2xl text-[var(--ds-text)] mb-4">
                  {t('budgetRoutes.noRoutes', 'Kriterlere uygun rota bulunamadı')}
                </h3>
                <p className="text-[var(--ds-text-muted)] mb-7 max-w-md mx-auto">
                  {t('budgetRoutes.noRoutesDescription', 'Lütfen filtrelerinizi değiştirin veya özel bir teklif için bizimle iletişime geçin.')}
                </p>
                <button
                  onClick={resetFilters}
                  className="ds-btn-ghost"
                >
                  {t('budgetRoutes.filters.reset', 'Filtreleri Sıfırla')}
                </button>
              </div>
            </Reveal>
          )}

          {/* CTA Section */}
          <section className="relative overflow-hidden rounded-3xl ds-vignette">
            <img src={`${MEDIA}/desert.jpg`} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25" loading="lazy" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,14,26,0.85), rgba(10,14,26,0.6), rgba(10,14,26,0.92))' }} />
            <div className="relative z-10 p-8 md:p-14 text-center flex flex-col items-center">
              <h2 className="ds-display text-[var(--ds-text)] text-balance" style={{ fontSize: 'clamp(1.8rem,4.5vw,3rem)' }}>
                <TextReveal text={t('budgetRoutes.contact.title', 'Özel Tur Teklifi Alın')} />
              </h2>
              <Reveal delay={0.15}>
                <p className="ds-lead mt-5 max-w-[52ch] mx-auto">
                  {t('budgetRoutes.contact.description', 'İstediğiniz kriterlere uygun bir rota bulamadınız mı? Bizimle iletişime geçin, size özel bir teklif hazırlayalım.')}
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
                  <Magnetic>
                    <Link to="/teklif-al" className="ds-btn">
                      {t('budgetRoutes.contact.requestButton', 'Teklif İste')}
                    </Link>
                  </Magnetic>
                  <Link to="/iletisim" className="ds-btn-ghost">
                    {t('budgetRoutes.contact.contactButton', 'İletişime Geç')}
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default BudgetRoutesPage;
