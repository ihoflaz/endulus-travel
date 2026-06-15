import { useState, useEffect } from 'react';
import { LocaleLink as Link } from '../components/LocaleLink';
import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import PageHero from '../components/redesign/PageHero';
import { Reveal, TextReveal, Magnetic } from '../components/motion';

const MEDIA = '/uploads/media';

// Premium ServicesPage — dark cinematic reskin. Concept: Morocco.
const ServicesPage = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hizmet verilerini yükle
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/data/services.json');
        if (!response.ok) {
          throw new Error('Hizmet verileri yüklenemedi');
        }
        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        console.error('Hizmet verisi yüklenirken hata:', error);
        setError('Hizmetler yüklenemedi');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const hero = (
    <PageHero
      video={`${MEDIA}/morocco.mp4`}
      poster={`${MEDIA}/morocco.jpg`}
      eyebrow={t('servicesPage.heroEyebrow', 'Fas · Marakeş & Çöl')}
      title={t('servicesPage.heroTitle', 'Hizmetlerimiz')}
      subtitle={t('servicesPage.heroSubtitle', 'Her seyahat planınız için hassasiyetlerinizi gözeten ve ihtiyaçlarınıza özel olarak tasarlanmış profesyonel hizmetler sunuyoruz.')}
      breadcrumb={[
        { to: '/', label: t('servicesPage.breadcrumbHome', 'Ana Sayfa') },
        { label: t('servicesPage.breadcrumbServices', 'Hizmetlerimiz') },
      ]}
    />
  );

  if (loading) {
    return (
      <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
        <Seo
          title={t('servicesPage.documentTitle', 'Hizmetlerimiz - Endülüs Travel')}
          description={t('servicesPage.metaDescription', 'Endülüs Travel ile özel rehberlik, ücretsiz danışmanlık ve kişiye özel seyahat çözümleri. İhtiyacınıza uygun profesyonel hizmetleri keşfedin ve size özel teklif alın.')}
        />
        {hero}
        <section className="py-16 md:py-24">
          <div className="ds-container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-3xl ds-glass animate-pulse" style={{ aspectRatio: '4/5' }} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !services || services.length === 0) {
    return (
      <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
        <Seo
          title={t('servicesPage.documentTitle', 'Hizmetlerimiz - Endülüs Travel')}
          description={t('servicesPage.metaDescription', 'Endülüs Travel ile özel rehberlik, ücretsiz danışmanlık ve kişiye özel seyahat çözümleri. İhtiyacınıza uygun profesyonel hizmetleri keşfedin ve size özel teklif alın.')}
        />
        {hero}
        <section className="py-24">
          <div className="ds-container text-center">
            <div className="ds-glass rounded-3xl p-10 max-w-xl mx-auto">
              <p className="ds-lead text-[var(--ds-text-soft)]">{t('servicesPage.errorLoading', 'Hizmetler yüklenemedi')}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo
        title={t('servicesPage.documentTitle', 'Hizmetlerimiz - Endülüs Travel')}
        description={t('servicesPage.metaDescription', 'Endülüs Travel ile özel rehberlik, ücretsiz danışmanlık ve kişiye özel seyahat çözümleri. İhtiyacınıza uygun profesyonel hizmetleri keşfedin ve size özel teklif alın.')}
      />

      {hero}

      {/* Stats strip */}
      <section className="py-14 md:py-20">
        <div className="ds-container">
          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              {[
                { value: '10+', label: t('servicesPage.statSpecialServices', 'Özel Hizmet') },
                { value: '7/24', label: t('servicesPage.statSupport', 'Müşteri Desteği') },
                { value: '%100', label: t('servicesPage.statPrecision', 'Hassasiyet Odaklı') },
              ].map((s, i) => (
                <div key={i} className="ds-glass rounded-2xl px-6 py-7 text-center">
                  <div className="ds-display ds-gold-text" style={{ fontSize: 'clamp(1.9rem,4vw,2.8rem)' }}>{s.value}</div>
                  <p className="mt-2 text-sm tracking-wide text-[var(--ds-text-muted)]">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Numbered service grid */}
      <section className="pb-16 md:pb-24">
        <div className="ds-container">
          <Reveal className="mb-10 md:mb-14 max-w-[52ch]">
            <span className="ds-eyebrow">{t('servicesPage.heroBadge', 'Özel Hizmetler')}</span>
            <h2 className="ds-display text-[var(--ds-text)] mt-4 text-balance" style={{ fontSize: 'clamp(1.8rem,4.4vw,3.2rem)' }}>
              <TextReveal text={t('servicesPage.gridHeading', 'Size uygun çözümü seçin')} />
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={(index % 3) * 0.08}>
                <Link
                  to={`/hizmetler/${service.id}`}
                  className="group ds-glass rounded-3xl p-7 md:p-8 h-full flex flex-col transition-all duration-500 hover:border-[var(--ds-line-strong)]"
                  style={{ display: 'flex' }}
                >
                  {/* Index + icon row */}
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="ds-display leading-none ds-gold-text opacity-90"
                      style={{ fontSize: 'clamp(2.4rem,5vw,3.4rem)' }}
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {service.icon && (
                      <span className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center border border-[var(--ds-line)] bg-[var(--ds-surface-2)] transition-transform duration-500 group-hover:-translate-y-1">
                        <img
                          src={service.icon}
                          alt=""
                          aria-hidden
                          className="w-6 h-6 object-contain"
                          style={{ filter: 'brightness(0) saturate(100%) invert(78%) sepia(34%) saturate(560%) hue-rotate(2deg) brightness(95%) contrast(89%)' }}
                          loading="lazy"
                        />
                      </span>
                    )}
                  </div>

                  <div className="ds-hairline my-6" />

                  {/* Content */}
                  <h3 className="ds-display text-[var(--ds-text)] text-balance group-hover:text-[var(--ds-gold-bright)] transition-colors" style={{ fontSize: 'clamp(1.3rem,2.4vw,1.7rem)' }}>
                    {service.title}
                  </h3>
                  <p className="mt-3 text-[var(--ds-text-soft)] leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <span className="mt-auto pt-7 inline-flex items-center gap-2 text-sm font-medium text-[var(--ds-gold)] group-hover:text-[var(--ds-gold-bright)] transition-colors">
                    {t('servicesPage.viewDetails', 'Detayları Gör')}
                    <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden ds-vignette" style={{ minHeight: '58vh' }}>
        <img src={`${MEDIA}/morocco.jpg`} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--ds-bg), rgba(10,14,26,0.55), var(--ds-bg))' }} />

        <div className="relative z-10 ds-container py-20 md:py-24 flex flex-col items-center text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 ds-eyebrow">{t('servicesPage.ctaBadge', 'Size Özel Çözümler')}</span>
          </Reveal>

          <h2 className="ds-display text-[var(--ds-text)] mt-5 text-balance" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
            <TextReveal text={t('servicesPage.ctaHeadingLine1', 'İhtiyacınıza Uygun')} />
            <span className="block ds-gold-text mt-2">
              <TextReveal text={t('servicesPage.ctaHeadingLine2', 'Özel Teklif Alın')} delay={0.15} />
            </span>
          </h2>

          <Reveal delay={0.2}>
            <p className="ds-lead mt-5 max-w-[52ch] mx-auto">
              {t('servicesPage.ctaDescPart1', 'Hangi hizmetimizle ilgilenirseniz ilgilenin,')}{' '}
              <strong className="text-[var(--ds-text)] font-semibold">{t('servicesPage.ctaDescStrong', 'size özel bir teklif')}</strong>{' '}
              {t('servicesPage.ctaDescPart2', 'hazırlayalım. Uzman ekibimiz en uygun çözümü bulacak.')}
            </p>
          </Reveal>

          {/* Feature chips */}
          <Reveal delay={0.3}>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
              {[
                { title: t('servicesPage.featureFastTitle', 'Hızlı Yanıt'), desc: t('servicesPage.featureFastDesc', '24 saat içinde geri dönüş') },
                { title: t('servicesPage.featureFreeTitle', 'Ücretsiz Danışmanlık'), desc: t('servicesPage.featureFreeDesc', 'Profesyonel rehberlik') },
                { title: t('servicesPage.featurePersonalTitle', 'Kişisel Yaklaşım'), desc: t('servicesPage.featurePersonalDesc', 'Size özel çözümler') },
              ].map((f, i) => (
                <div key={i} className="ds-glass rounded-2xl px-5 py-5 text-center">
                  <h3 className="font-semibold text-[var(--ds-text)]">{f.title}</h3>
                  <p className="mt-1 text-sm text-[var(--ds-text-muted)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* CTA Buttons */}
          <Reveal delay={0.4}>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Magnetic>
                <Link to="/teklif-al" className="ds-btn">
                  {t('servicesPage.ctaGetOffer', 'Özel Teklif Al')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </Magnetic>
              <Link to="/iletisim" className="ds-btn-ghost">
                {t('servicesPage.ctaContact', 'Bize Ulaşın')}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
