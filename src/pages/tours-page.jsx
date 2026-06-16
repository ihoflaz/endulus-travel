import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { LocaleLink as Link } from '../components/LocaleLink';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import TourCardX from '../components/tours/TourCardX';
import { Reveal, TextReveal, Magnetic } from '../components/motion';
import { useTours, useCategories } from '../hooks';
import { partitionTours } from '../utils/tour-status';

const MEDIA = '/uploads/media';

const ToursPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { tours, isLoading } = useTours();
  const { categories } = useCategories();
  const [active, setActive] = useState(searchParams.get('category') || 'all');
  const [tab, setTab] = useState('upcoming');

  const cats = Array.isArray(categories) ? categories : [];
  const list = Array.isArray(tours) ? tours : [];
  const { past, upcoming } = useMemo(() => partitionTours(list), [list]);
  const baseList = tab === 'past' ? past : upcoming;
  const isPast = tab === 'past';

  const switchTab = (next) => { setTab(next); setActive('all'); };

  // categories present in the active tab (so we don't show empty filters)
  const usedCats = useMemo(() => {
    const set = new Set(baseList.map((x) => x.category).filter(Boolean));
    return cats.filter((c) => set.has(c.key));
  }, [baseList, cats]);

  const filtered = useMemo(
    () => (active === 'all' ? baseList : baseList.filter((x) => x.category === active)),
    [baseList, active],
  );

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo title={t('toursPage.metaTitle', 'Tur Paketlerimiz - Endülüs Travel')} description={t('toursPage.metaDescription', '')} />

      <PageHero
        video={`${MEDIA}/egypt.mp4`}
        poster={`${MEDIA}/egypt.jpg`}
        eyebrow={t('toursPage.heroEyebrow', 'Mısır · Giza & Nil')}
        title={t('toursPage.heroTitle', 'Tur Paketlerimiz')}
        subtitle={t('toursPage.heroSubtitle', 'Size ve grubunuza özel, özenle planlanmış; namaz vakitlerine ve helal mutfağa uygun seyahat deneyimleri.')}
        breadcrumb={[{ to: '/', label: t('navigation.home', 'Ana Sayfa') }, { label: t('navigation.tours', 'Turlar') }]}
      />

      <section className="py-16 md:py-24">
        <div className="ds-container">
          {/* Upcoming / Past tabs */}
          {past.length > 0 && (
            <Reveal className="mb-8">
              <div className="inline-flex items-center gap-1 p-1 rounded-full ds-glass">
                <button
                  onClick={() => switchTab('upcoming')}
                  className={`px-5 py-2 rounded-full text-sm transition-all ${!isPast ? 'text-[var(--ds-on-gold)]' : 'text-[var(--ds-text-soft)] hover:text-[var(--ds-gold-bright)]'}`}
                  style={!isPast ? { background: 'var(--ds-grad-gold)' } : undefined}
                >
                  {t('toursPage.tabUpcoming', 'Yaklaşan Turlar')}
                </button>
                <button
                  onClick={() => switchTab('past')}
                  className={`px-5 py-2 rounded-full text-sm transition-all ${isPast ? 'text-[var(--ds-on-gold)]' : 'text-[var(--ds-text-soft)] hover:text-[var(--ds-gold-bright)]'}`}
                  style={isPast ? { background: 'var(--ds-grad-gold)' } : undefined}
                >
                  {t('toursPage.tabPast', 'Geçmiş Turlar')} <span className="opacity-70">({past.length})</span>
                </button>
              </div>
            </Reveal>
          )}

          {/* Filters */}
          {usedCats.length > 0 && (
            <Reveal className="mb-12">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActive('all')}
                  className={`px-5 py-2 rounded-full text-sm transition-all ${active === 'all' ? 'text-[var(--ds-on-gold)]' : 'text-[var(--ds-text-soft)] border border-[var(--ds-line-strong)] hover:text-[var(--ds-gold-bright)]'}`}
                  style={active === 'all' ? { background: 'var(--ds-grad-gold)' } : undefined}
                >
                  {t('toursPage.filterAll', 'Tümü')}
                </button>
                {usedCats.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setActive(c.key)}
                    className={`px-5 py-2 rounded-full text-sm transition-all ${active === c.key ? 'text-[var(--ds-on-gold)]' : 'text-[var(--ds-text-soft)] border border-[var(--ds-line-strong)] hover:text-[var(--ds-gold-bright)]'}`}
                    style={active === c.key ? { background: 'var(--ds-grad-gold)' } : undefined}
                  >
                    {t('categories.' + c.key, c.label)}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="rounded-3xl ds-glass animate-pulse" style={{ aspectRatio: '4/5' }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="ds-display text-2xl text-[var(--ds-text)] mb-3">{t('toursPage.emptyTitle', 'Bu kategoride tur bulunamadı')}</h3>
              <p className="text-[var(--ds-text-muted)]">{t('toursPage.emptyDescription', 'Farklı bir kategori seçerek tekrar deneyebilirsiniz')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((tour, i) => (
                <TourCardX key={tour.slug} tour={tour} delay={(i % 3) * 0.08} past={isPast} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden ds-vignette" style={{ minHeight: '52vh' }}>
        <img src={`${MEDIA}/egypt.jpg`} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--ds-bg), rgba(10,14,26,0.55), var(--ds-bg))' }} />
        <div className="relative z-10 ds-container py-24 text-center flex flex-col items-center">
          <Reveal><span className="ds-eyebrow">{t('toursPage.ctaEyebrow', 'Aradığını bulamadın mı?')}</span></Reveal>
          <h2 className="ds-display text-[var(--ds-text)] mt-5 text-balance" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
            <TextReveal text={t('toursPage.ctaTitle', 'Size özel bir rota tasarlayalım')} />
          </h2>
          <Reveal delay={0.2}><p className="ds-lead mt-5 max-w-[46ch] mx-auto">{t('toursPage.ctaBody', 'Hayalinizdeki tatili anlatın, 24 saat içinde kişiye özel teklifinizi hazırlayalım.')}</p></Reveal>
          <Reveal delay={0.3}>
            <div className="mt-9 flex flex-wrap gap-4 justify-center">
              <Magnetic><Link to="/teklif-al" className="ds-btn">{t('toursPage.ctaButton', 'Teklif Al')}</Link></Magnetic>
              <Link to="/tur-planlama" className="ds-btn-ghost">{t('toursPage.ctaPlan', 'Tur Planla')}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ToursPage;
