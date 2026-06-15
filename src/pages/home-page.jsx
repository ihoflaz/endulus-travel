import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../components/LocaleLink';
import Seo from '../components/Seo';
import CinematicHero from '../components/home/CinematicHero';
import { Reveal, TextReveal, Parallax, Counter, Magnetic } from '../components/motion';
import ReviewsSection from '../components/tours/reviews-section';
import { useTours, useServices } from '../hooks';
import { useContactData, useSiteSettings } from '../hooks/useAppData';
import { formatTourPrice, getPriceLabel } from '../utils/priceUtils';

const SITE_URL = 'https://endulustravel.com';
const MEDIA = '/uploads/media';

const PILLARS = [
  { key: 'prayer', t: 'home.pillarPrayerTitle', tf: 'Namaz Vakitlerine Uygun', d: 'home.pillarPrayerDesc', df: 'Programlar ibadet saatleriniz gözetilerek planlanır.', icon: 'M12 3v2m0 14v2M5 12H3m18 0h-2M7.8 7.8 6.4 6.4m11.2 0-1.4 1.4M7.8 16.2l-1.4 1.4m11.2 0-1.4-1.4M12 8a4 4 0 100 8 4 4 0 000-8z' },
  { key: 'halal', t: 'home.pillarHalalTitle', tf: 'Helal Mutfak', d: 'home.pillarHalalDesc', df: 'Her durakta titizlikle seçilmiş helal lezzetler.', icon: 'M12 2c1.5 3 4 4 4 7a4 4 0 11-8 0c0-3 2.5-4 4-7z M6 21h12' },
  { key: 'boutique', t: 'home.pillarBoutiqueTitle', tf: 'Butik Gruplar', d: 'home.pillarBoutiqueDesc', df: 'Maksimum 20 kişilik samimi, özenli gruplar.', icon: 'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4z' },
  { key: 'refund', t: 'trust.refundTitle', tf: 'Mücbir Sebepte Tam İade', d: 'home.pillarRefundDesc', df: 'İçiniz rahat olsun; güvenle rezervasyon yapın.', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const HomePage = () => {
  const { t } = useTranslation('translation');
  const { contactData } = useContactData();
  const { value: site } = useSiteSettings();
  const { tours } = useTours();
  const { services } = useServices();

  const featured = useMemo(() => {
    const list = Array.isArray(tours) ? tours : [];
    const f = list.filter((x) => x.featured);
    return (f.length ? f : list).slice(0, 3);
  }, [tours]);

  const orgJsonLd = useMemo(() => {
    const ig = contactData?.social?.instagram;
    return {
      '@context': 'https://schema.org', '@type': 'TravelAgency',
      name: 'Endülüs Travel', url: SITE_URL,
      logo: `${SITE_URL}/favicon/web-app-manifest-512x512.png`,
      image: `${MEDIA}/samarkand.jpg`,
      description: site?.description || t('home.metaDescription', 'Namaz vakitlerine uygun, helal, her şey dahil butik tur deneyimleri.'),
      ...(contactData?.phone ? { telephone: contactData.phone } : {}),
      ...(contactData?.email ? { email: contactData.email } : {}),
      ...(ig ? { sameAs: [ig] } : {}),
    };
  }, [contactData, site, t]);

  return (
    <div className="ds-dark">
      <Seo title={t('home.pageTitle', 'Endülüs Travel - Kişiselleştirilmiş Tur Deneyimi')} jsonLd={orgJsonLd} />

      {/* ===== Hero — Semerkant, Özbekistan ===== */}
      <CinematicHero
        video={`${MEDIA}/samarkand.mp4`}
        poster={`${MEDIA}/samarkand.jpg`}
        eyebrow={t('home.heroEyebrow', 'Özbekistan · Semerkant')}
        title={t('home.heroTitle', 'Kadim diyarlara, hassasiyetinizle yolculuk')}
        subtitle={t('home.heroSubtitle', 'Namaz vakitlerine uygun, helal mutfaklı, maksimum 20 kişilik butik turlarla İslam coğrafyasının kalbine açılan kapı.')}
        location
        primary={{ to: '/turlar', label: t('home.heroPrimary', 'Turları Keşfet') }}
        secondary={{ to: '/teklif-al', label: t('home.heroSecondary', 'Sana Özel Teklif Al') }}
      />

      {/* ===== Manifesto ===== */}
      <section className="relative ds-dark py-28 md:py-40" style={{ background: 'var(--ds-grad-night)' }}>
        <div className="ds-container grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <Reveal><span className="ds-eyebrow">{t('home.introEyebrow', 'Biz kimiz')}</span></Reveal>
            <h2 className="ds-display ds-h2 mt-6 text-[var(--ds-text)] text-balance">
              <TextReveal text={t('home.introTitle', 'Seyahat bir ibadet kadar incelikli olabilir.')} />
            </h2>
            <Reveal delay={0.15}>
              <p className="ds-lead mt-7 max-w-[54ch]">
                {t('home.introBody', 'Endülüs Travel, hassasiyetlerinizi merkeze alan yeni nesil bir seyahat anlayışıdır. Mısır’ın piramitlerinden Fas’ın mavi sokaklarına, Özbekistan’ın çini kubbelerinden Endülüs’ün saraylarına; her rotayı sizin değerlerinizle uyumlu, kişiye özel tasarlıyoruz.') }
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-9"><Magnetic><Link to="/hakkimizda" className="ds-btn-ghost">{t('home.introCta', 'Hikayemiz')}</Link></Magnetic></div>
            </Reveal>
          </div>
          <div className="md:col-span-5">
            <Parallax speed={0.14}>
              <div className="relative rounded-3xl overflow-hidden ds-glass" style={{ aspectRatio: '3/4' }}>
                <img src={`${MEDIA}/morocco.jpg`} alt="" className="w-full h-full object-cover" loading="lazy"
                  onError={(e) => { e.currentTarget.src = '/images/destinations/spain.jpg'; }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(7,10,18,0.7))' }} />
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* ===== Featured tours (admin/DB-driven) ===== */}
      {featured.length > 0 && (
        <section className="ds-dark py-24 md:py-32" style={{ background: 'var(--ds-bg)' }}>
          <div className="ds-container">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
              <div>
                <Reveal><span className="ds-eyebrow">{t('home.featuredEyebrow', 'Seçkin Rotalar')}</span></Reveal>
                <h2 className="ds-display ds-h2 mt-5 text-[var(--ds-text)]"><TextReveal text={t('home.featuredTitle', 'Öne çıkan tur deneyimleri')} /></h2>
              </div>
              <Reveal><Link to="/turlar" className="ds-btn-ghost">{t('home.featuredAll', 'Tüm Turlar')}</Link></Reveal>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((tour, i) => (
                <Reveal key={tour.slug} delay={i * 0.1} className="h-full">
                  <Link to={`/turlar/${tour.slug}`} className="group block h-full rounded-3xl overflow-hidden ds-glass relative">
                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                      <img
                        src={tour.image || `${MEDIA}/egypt.jpg`}
                        alt={tour.title}
                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(7,10,18,0.92))' }} />
                      <div className="absolute top-4 left-4">
                        <span className="text-[0.7rem] uppercase tracking-[0.25em] px-3 py-1 rounded-full ds-glass text-[var(--ds-gold-bright)]">
                          {t('categories.' + tour.category, tour.destination || '')}
                        </span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-6">
                        <h3 className="ds-display text-2xl text-[var(--ds-text)] leading-tight">{tour.title}</h3>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[var(--ds-gold)] font-medium">{formatTourPrice(tour)}</span>
                          <span className="text-xs text-[var(--ds-text-muted)]">{getPriceLabel(tour)}</span>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--ds-text-soft)] group-hover:text-[var(--ds-gold-bright)] transition-colors">
                          {t('home.featuredView', 'İncele')}
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Pillars + stats ===== */}
      <section className="ds-dark py-24 md:py-32" style={{ background: 'var(--ds-grad-night)' }}>
        <div className="ds-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Reveal><span className="ds-eyebrow">{t('home.whyEyebrow', 'Neden Endülüs')}</span></Reveal>
            <h2 className="ds-display ds-h2 mt-5 text-[var(--ds-text)]"><TextReveal text={t('home.whyTitle', 'Güven veren ayrıntılar')} /></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p, i) => (
              <Reveal key={p.key} delay={i * 0.08} className="h-full">
                <div className="h-full rounded-2xl p-7 ds-glass">
                  <div className="w-12 h-12 rounded-xl grid place-items-center mb-5" style={{ background: 'rgba(217,178,90,0.12)' }}>
                    <svg className="w-6 h-6 text-[var(--ds-gold)]" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={p.icon} /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--ds-text)] mb-2">{t(p.t, p.tf)}</h3>
                  <p className="text-sm text-[var(--ds-text-muted)] leading-relaxed">{t(p.d, p.df)}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="ds-hairline my-16" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { to: 2024, suffix: '', l: t('home.statFounded', 'Kuruluş') },
              { to: 20, suffix: '+', l: t('home.statDestinations', 'Destinasyon') },
              { to: 1000, suffix: '+', l: t('home.statTravelers', 'Mutlu Gezgin') },
              { to: 4.9, suffix: '', decimals: 1, l: t('home.statRating', 'Memnuniyet') },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="ds-display text-4xl md:text-5xl ds-gold-text">
                  <Counter to={s.to} suffix={s.suffix} decimals={s.decimals || 0} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--ds-text-muted)]">{s.l}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Services teaser (admin/DB) ===== */}
      {Array.isArray(services) && services.length > 0 && (
        <section className="ds-dark py-24" style={{ background: 'var(--ds-bg)' }}>
          <div className="ds-container">
            <div className="mb-12">
              <Reveal><span className="ds-eyebrow">{t('home.servicesEyebrow', 'Hizmetlerimiz')}</span></Reveal>
              <h2 className="ds-display ds-h2 mt-5 text-[var(--ds-text)]"><TextReveal text={t('home.servicesTitle', 'Size özel tasarlanan deneyimler')} /></h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-3xl overflow-hidden" style={{ background: 'var(--ds-line)' }}>
              {services.slice(0, 6).map((s, i) => (
                <Reveal key={s.id || i} delay={(i % 3) * 0.08}>
                  <Link to="/hizmetler" className="group flex flex-col gap-3 p-8 h-full transition-colors hover:bg-white/[0.03]" style={{ background: 'var(--ds-bg)' }}>
                    <span className="text-[var(--ds-gold)] text-sm">0{i + 1}</span>
                    <h3 className="text-xl font-semibold text-[var(--ds-text)] group-hover:text-[var(--ds-gold-bright)] transition-colors">{s.title}</h3>
                    <p className="text-sm text-[var(--ds-text-muted)] leading-relaxed line-clamp-3">{s.description}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== Reviews (admin/DB; hidden if none) ===== */}
      <div className="ds-dark py-8" style={{ background: 'var(--ds-grad-night)' }}>
        <ReviewsSection tourSlug={null} />
      </div>

      {/* ===== Final CTA ===== */}
      <section className="relative ds-dark overflow-hidden ds-vignette" style={{ minHeight: '60vh' }}>
        <img src={`${MEDIA}/egypt.jpg`} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-40" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--ds-bg) 0%, rgba(10,14,26,0.6) 50%, var(--ds-bg) 100%)' }} />
        <div className="relative z-10 ds-container py-28 text-center flex flex-col items-center">
          <Reveal><span className="ds-eyebrow">{t('home.ctaEyebrow', 'Yolculuk seninle başlar')}</span></Reveal>
          <h2 className="ds-display text-[var(--ds-text)] mt-6 text-balance" style={{ fontSize: 'clamp(2.2rem,5.5vw,4.5rem)' }}>
            <TextReveal text={t('home.ctaTitle', 'Hayalindeki rotayı birlikte tasarlayalım')} />
          </h2>
          <Reveal delay={0.2}>
            <p className="ds-lead mt-6 max-w-[48ch] mx-auto">{t('home.ctaBody', '24 saat içinde, sana özel hazırlanmış bir teklifle dönüş yapalım.')}</p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10"><Magnetic strength={0.4}><Link to="/teklif-al" className="ds-btn" style={{ padding: '1.1rem 2.4rem', fontSize: '1.05rem' }}>{t('home.ctaButton', 'Rota Pusulasını Başlat')}</Link></Magnetic></div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
