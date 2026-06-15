import { useParams } from 'react-router-dom';
import { LocaleLink as Link } from '../components/LocaleLink';
import { useLocaleNavigate } from '../hooks/useLocaleNavigate';
import { useTranslation } from 'react-i18next';
import { useServiceDetail } from '../hooks';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import { Reveal, TextReveal, Magnetic } from '../components/motion';

const MEDIA = '/uploads/media';

// ServiceDetailPage — dark cinematic reskin (Morocco). Presentation only:
// service fetch, dynamic <Seo>, slug/routing and the /teklif-al CTA are untouched.
const ServiceDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useLocaleNavigate();
  const { service, serviceContent, isLoading, error, notFound } = useServiceDetail(id);

  if (isLoading) {
    return (
      <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
        <section className="py-24 md:py-32">
          <div className="ds-container max-w-4xl">
            <div className="animate-pulse space-y-6">
              <div className="h-12 rounded-2xl ds-glass w-3/4" />
              <div className="h-64 rounded-3xl ds-glass" />
              <div className="space-y-4">
                <div className="h-4 rounded-full ds-glass w-full" />
                <div className="h-4 rounded-full ds-glass w-5/6" />
                <div className="h-4 rounded-full ds-glass w-full" />
                <div className="h-4 rounded-full ds-glass w-4/6" />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || notFound || !service || !serviceContent) {
    return (
      <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
        <section className="py-24 md:py-32">
          <div className="ds-container max-w-2xl text-center">
            <div className="ds-glass rounded-3xl p-10 md:p-14">
              <span className="ds-eyebrow">{t('serviceDetail.errorEyebrow', 'Bir sorun oluştu')}</span>
              <h1 className="ds-display text-[var(--ds-text)] mt-4 mb-4" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>
                {error || t('serviceDetail.notFound', 'Hizmet bulunamadı')}
              </h1>
              <p className="text-[var(--ds-text-muted)] mb-8">{t('serviceDetail.tryAgain', 'Lütfen tekrar deneyiniz')}</p>
              <button onClick={() => navigate('/hizmetler')} className="ds-btn">
                {t('serviceDetail.backToServices', 'Hizmetlere Geri Dön')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const paragraphs = String(serviceContent.fullDescription || '')
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  const stats = [
    { value: '%100', label: t('serviceDetail.statProfessional', 'Profesyonel') },
    { value: '24/7', label: t('serviceDetail.statSupport', 'Destek') },
    { value: t('serviceDetail.statSpecialLabel', 'Özel'), label: t('serviceDetail.statApproach', 'Yaklaşım') },
  ];

  const ctaFeatures = [
    t('serviceDetail.featureFastResponse', 'Hızlı Yanıt'),
    t('serviceDetail.featureFreeConsultation', 'Ücretsiz Danışma'),
    t('serviceDetail.featurePersonalSolution', 'Kişisel Çözüm'),
  ];

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo
        title={service?.title ? `${service.title} - Endülüs Travel` : t('serviceDetail.metaTitle', 'Hizmet Detayı - Endülüs Travel')}
        description={service?.summary || service?.description || t('serviceDetail.metaDescription', 'Endülüs Travel hizmetleri hakkında detaylı bilgi alın. Profesyonel ekibimizle size özel, kişiselleştirilmiş seyahat ve organizasyon çözümleri sunuyoruz.')}
        image={serviceContent?.image}
      />

      <PageHero
        video={`${MEDIA}/morocco.mp4`}
        poster={serviceContent?.image || `${MEDIA}/morocco.jpg`}
        eyebrow={t('serviceDetail.heroBadge', 'Özel Hizmet Deneyimi')}
        title={service?.title || t('serviceDetail.serviceDetailFallback', 'Hizmet Detayı')}
        subtitle={service?.description || t('serviceDetail.heroDescriptionFallback', 'Bu özel hizmet hakkında detaylı bilgiler ve özellikler.')}
        breadcrumb={[
          { to: '/', label: t('serviceDetail.breadcrumbHome', 'Ana Sayfa') },
          { to: '/hizmetler', label: t('serviceDetail.breadcrumbServices', 'Hizmetler') },
          { label: service?.title || t('serviceDetail.serviceDetailFallback', 'Hizmet Detayı') },
        ]}
      />

      {/* Stats strip */}
      <section className="py-12 md:py-16">
        <div className="ds-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="ds-glass rounded-2xl p-6 text-center h-full">
                  <div className="ds-display ds-gold-text text-3xl md:text-4xl mb-2">{s.value}</div>
                  <div className="text-[var(--ds-text-soft)] text-sm tracking-wide">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="pb-16 md:pb-24">
        <div className="ds-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Description */}
            <div className="lg:col-span-2">
              <Reveal>
                <div className="ds-glass rounded-3xl p-7 md:p-10 h-full">
                  <span className="ds-eyebrow">{t('serviceDetail.sectionEyebrow', 'Detaylar')}</span>
                  <h2 className="ds-display text-[var(--ds-text)] mt-3 mb-6" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>
                    {t('serviceDetail.serviceDetailsHeading', 'Hizmet Detayları')}
                  </h2>
                  <div className="space-y-4">
                    {paragraphs.map((paragraph, index) => (
                      <p key={index} className="ds-lead text-[var(--ds-text-soft)]">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Features */}
            <div className="lg:col-span-1">
              <Reveal delay={0.12}>
                <div className="ds-glass rounded-3xl p-7 md:p-8 h-full">
                  <h3 className="ds-display text-[var(--ds-text)] mb-6" style={{ fontSize: 'clamp(1.3rem,2.4vw,1.8rem)' }}>
                    {t('serviceDetail.featuresHeading', 'Özellikler')}
                  </h3>
                  <ul className="space-y-4">
                    {serviceContent.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span
                          className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: 'var(--ds-grad-gold)' }}
                        />
                        <span className="text-[var(--ds-text-soft)] leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — cinematic, links to /teklif-al */}
      <section className="relative overflow-hidden ds-vignette" style={{ minHeight: '60vh' }}>
        <img
          src={serviceContent?.image || `${MEDIA}/morocco.jpg`}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--ds-bg), rgba(10,14,26,0.6), var(--ds-bg))' }} />
        <div className="relative z-10 ds-container py-20 md:py-28 text-center flex flex-col items-center">
          <Reveal><span className="ds-eyebrow">{t('serviceDetail.ctaBadge', 'Bu Hizmetten Yararlanın')}</span></Reveal>
          <h2 className="ds-display text-[var(--ds-text)] mt-5 text-balance" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
            <TextReveal text={t('serviceDetail.ctaHeading', 'Bu Hizmetle İlgileniyorum')} />
          </h2>
          <Reveal delay={0.15}>
            <p className="ds-lead ds-gold-text mt-4 font-medium" style={{ fontSize: 'clamp(1.1rem,1.8vw,1.4rem)' }}>
              {t('serviceDetail.ctaSubheading', 'Size Özel Teklif Hazırlayalım')}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="ds-lead mt-5 max-w-[52ch] mx-auto">
              {t('serviceDetail.ctaDescriptionPart1', 'Bu hizmetimizle ilgili')}{' '}
              <strong className="text-[var(--ds-text)]">{t('serviceDetail.ctaDescriptionStrong', 'özel bir teklif')}</strong>{' '}
              {t('serviceDetail.ctaDescriptionPart2', 'hazırlayalım. İhtiyaçlarınıza göre kişiselleştirilmiş çözümler sunuyoruz.')}
            </p>
          </Reveal>

          {/* Feature chips */}
          <Reveal delay={0.28}>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {ctaFeatures.map((label, i) => (
                <span
                  key={i}
                  className="ds-glass rounded-full px-5 py-2 text-sm text-[var(--ds-text-soft)] flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ds-gold)' }} />
                  {label}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.36}>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Magnetic>
                <Link to={`/teklif-al?service=${service.id}`} className="ds-btn">
                  {t('serviceDetail.ctaGetOffer', 'Özel Teklif Al')}
                </Link>
              </Magnetic>
              <Link to="/iletisim" className="ds-btn-ghost">
                {t('serviceDetail.ctaContactUs', 'Bize Ulaşın')}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.44}>
            <Link
              to="/hizmetler"
              className="mt-10 inline-flex items-center gap-2 text-sm text-[var(--ds-text-muted)] hover:text-[var(--ds-gold-bright)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{t('serviceDetail.viewAllServices', 'Tüm Hizmetleri Gör')}</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;
