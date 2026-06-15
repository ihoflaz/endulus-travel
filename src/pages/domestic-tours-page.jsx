import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../components/LocaleLink';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import TourCardX from '../components/tours/TourCardX';
import { Reveal, TextReveal, Magnetic } from '../components/motion';
import { useTours } from '../hooks';

const MEDIA = '/uploads/media';

const DomesticToursPage = () => {
  const { t } = useTranslation();
  const { tours, isLoading } = useTours();
  const list = useMemo(() => (Array.isArray(tours) ? tours.filter((x) => x.type === 'domestic') : []), [tours]);

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo title={t('domesticTours.metaTitle', 'Yurt İçi Turlar - Endülüs Travel')} description={t('domesticTours.metaDescription', '')} />
      <PageHero
        video={`${MEDIA}/cappadocia.mp4`}
        poster={`${MEDIA}/cappadocia.jpg`}
        eyebrow={t('domesticTours.heroEyebrow', 'Türkiye · Kapadokya')}
        title={t('domesticTours.heroTitle', 'Yurt İçi Turlar')}
        subtitle={t('domesticTours.heroSubtitle', 'Kapadokya’nın peribacalarından İstanbul’un zarafetine; Türkiye’nin en güzel rotaları sizin değerlerinizle.')}
        breadcrumb={[{ to: '/', label: t('navigation.home', 'Ana Sayfa') }, { label: t('navbar.domesticTours', 'Yurt İçi Turlar') }]}
      />
      <section className="py-16 md:py-24">
        <div className="ds-container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <div key={i} className="rounded-3xl ds-glass animate-pulse" style={{ aspectRatio: '4/5' }} />)}</div>
          ) : list.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="ds-display text-2xl text-[var(--ds-text)] mb-3">{t('domesticTours.emptyTitle', 'Henüz tur bulunamadı')}</h3>
              <p className="text-[var(--ds-text-muted)]">{t('domesticTours.emptyDesc', 'Yakında yeni rotalar eklenecek')}</p>
              <Link to="/teklif-al" className="ds-btn mt-8 inline-flex">{t('toursPage.ctaButton', 'Teklif Al')}</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((tour, i) => <TourCardX key={tour.slug} tour={tour} delay={(i % 3) * 0.08} />)}
            </div>
          )}
        </div>
      </section>
      <section className="relative overflow-hidden ds-vignette" style={{ minHeight: '46vh' }}>
        <img src={`${MEDIA}/cappadocia.jpg`} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--ds-bg), rgba(10,14,26,0.55), var(--ds-bg))' }} />
        <div className="relative z-10 ds-container py-20 text-center flex flex-col items-center">
          <h2 className="ds-display text-[var(--ds-text)] text-balance" style={{ fontSize: 'clamp(1.8rem,4.5vw,3.2rem)' }}><TextReveal text={t('domesticTours.ctaTitle', 'Size özel bir Türkiye rotası tasarlayalım')} /></h2>
          <Reveal delay={0.2}><div className="mt-8"><Magnetic><Link to="/teklif-al" className="ds-btn">{t('toursPage.ctaButton', 'Teklif Al')}</Link></Magnetic></div></Reveal>
        </div>
      </section>
    </div>
  );
};

export default DomesticToursPage;
