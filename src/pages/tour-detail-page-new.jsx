import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LocaleLink as Link } from '../components/LocaleLink';
import { useTourDetail } from '../hooks';
import { WhatsAppButton } from '../components/ui';
import { formatTourPrice, getPriceLabel, formatTourPriceWithDiscount } from '../utils/priceUtils';
import Seo from '../components/Seo';
import { trackViewTour } from '../lib/analytics';
import { localizeTour } from '../utils/localizeTour';
import { isPastTour } from '../utils/tour-status';
import { Accordion, AccordionItem } from '../components/ui/accordion';
import IncludedIcons from '../components/tours/included-icons';
import RefundGuarantee from '../components/tours/refund-guarantee';
import FaqSection from '../components/tours/faq-section';
import ReviewsSection from '../components/tours/reviews-section';
import TourCardX from '../components/tours/TourCardX';
import InstagramEmbed from '../components/tours/InstagramEmbed';
import { Reveal, TextReveal } from '../components/motion';
import { getLenis } from '../components/motion/SmoothScroll';

const FALLBACK_IMG = '/uploads/media/egypt.jpg';

const scrollToId = (id) => (e) => {
  if (e) e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: -96 });
  else el.scrollIntoView({ behavior: 'smooth' });
};

// Sticky in-page section nav — keeps the long detail page easy to navigate.
const SectionNav = ({ sections }) => {
  const [active, setActive] = useState(sections[0]?.id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); }),
      { rootMargin: '-25% 0px -65% 0px' },
    );
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [sections]);
  return (
    <div className="sticky top-16 z-30 border-y border-[var(--ds-line)]" style={{ background: 'rgba(10,14,26,0.82)', backdropFilter: 'blur(12px)' }}>
      <div className="ds-container">
        <nav className="flex gap-1 overflow-x-auto py-3 no-scrollbar">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={scrollToId(s.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${active === s.id ? 'text-[var(--ds-on-gold)]' : 'text-[var(--ds-text-soft)] hover:text-[var(--ds-gold-bright)]'}`}
              style={active === s.id ? { background: 'var(--ds-grad-gold)' } : undefined}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Lightbox-free cinematic gallery (main + thumbs).
const PhotoGallery = ({ images, title }) => {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;
  const next = () => setIdx((p) => (p === images.length - 1 ? 0 : p + 1));
  const prev = () => setIdx((p) => (p === 0 ? images.length - 1 : p - 1));
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="col-span-4 sm:col-span-2 sm:row-span-2 relative group">
        <div className="aspect-square relative overflow-hidden rounded-2xl">
          <img src={images[idx]} alt={t('tourDetail.galleryMainAlt', '{{title}} - Ana fotoğraf', { title })} className="w-full h-full object-cover" loading="lazy" />
          <button onClick={prev} aria-label="prev" className="absolute left-2 top-1/2 -translate-y-1/2 ds-glass p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={next} aria-label="next" className="absolute right-2 top-1/2 -translate-y-1/2 ds-glass p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute top-3 right-3 ds-glass text-white px-2 py-1 rounded-lg text-xs">{idx + 1}/{images.length}</div>
        </div>
      </div>
      {images.slice(1, 5).map((image, i) => (
        <div key={i + 1} className="col-span-2 sm:col-span-1 aspect-square relative">
          <div className="h-full overflow-hidden rounded-xl">
            <img src={image} alt={t('tourDetail.galleryThumbAlt', '{{title}} - Fotoğraf {{num}}', { title, num: i + 2 })} className="w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105" onClick={() => setIdx(i + 1)} loading="lazy" />
          </div>
        </div>
      ))}
    </div>
  );
};

const TourDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const { tour: rawTour, relatedTours, isLoading, error, notFound } = useTourDetail(slug);
  const tour = useMemo(() => localizeTour(rawTour, i18n.language), [rawTour, i18n.language]);
  const past = useMemo(() => isPastTour(tour), [tour]);

  const viewTrackedRef = useRef(null);
  useEffect(() => {
    if (!tour?.slug || viewTrackedRef.current === tour.slug) return;
    viewTrackedRef.current = tour.slug;
    trackViewTour(tour);
  }, [tour]);

  const sections = useMemo(() => {
    if (!tour) return [];
    const s = [{ id: 'genel', label: t('tourDetail.navOverview', 'Genel') }];
    if (tour.instagramUrl) s.push({ id: 'ozet', label: t('tourDetail.navRecap', 'Tur Özeti') });
    if (Array.isArray(tour.itinerary) && tour.itinerary.length) s.push({ id: 'program', label: t('tourDetail.navItinerary', 'Program') });
    if ((tour.included && tour.included.length) || (tour.notIncluded && tour.notIncluded.length)) s.push({ id: 'dahil', label: t('tourDetail.navIncluded', 'Dahil / Hariç') });
    if (Array.isArray(tour.faq) && tour.faq.length) s.push({ id: 'sss', label: t('tourDetail.navFaq', 'SSS') });
    if (Array.isArray(tour.gallery) && tour.gallery.length) s.push({ id: 'galeri', label: t('tourDetail.gallery', 'Galeri') });
    return s;
  }, [tour, t]);

  const tourJsonLd = useMemo(() => {
    if (!tour) return null;
    return {
      '@context': 'https://schema.org', '@type': 'TouristTrip',
      name: tour.title, description: tour.description,
      image: tour.image || tour.gallery?.[0],
      touristType: tour.category,
      itinerary: Array.isArray(tour.itinerary)
        ? tour.itinerary.map((d, i) => ({ '@type': 'TouristAttraction', name: d.title || `${i + 1}. Gün`, description: d.description }))
        : undefined,
      offers: tour.pricePerPerson ? { '@type': 'Offer', price: tour.pricePerPerson, priceCurrency: tour.currency || 'TRY', availability: past ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' } : undefined,
      provider: { '@type': 'TravelAgency', name: 'Endülüs Travel', identifier: 'TURSAB-6739' },
    };
  }, [tour, past]);

  if (isLoading) {
    return (
      <div className="ds-dark min-h-screen pt-32" style={{ background: 'var(--ds-bg)' }}>
        <div className="ds-container animate-pulse">
          <div className="h-10 w-2/3 rounded bg-white/10 mb-6" />
          <div className="h-72 rounded-2xl bg-white/10 mb-6" />
          <div className="space-y-3"><div className="h-4 bg-white/10 rounded w-full" /><div className="h-4 bg-white/10 rounded w-5/6" /></div>
        </div>
      </div>
    );
  }

  if (error || notFound || !tour) {
    return (
      <div className="ds-dark min-h-screen grid place-items-center pt-24" style={{ background: 'var(--ds-bg)' }}>
        <div className="text-center ds-container">
          <h1 className="ds-display text-3xl text-[var(--ds-gold)] mb-4">{t('tourDetail.notFound', 'Tur Bulunamadı')}</h1>
          <Link to="/turlar" className="ds-btn-ghost">{t('tourDetail.backToTours', 'Tüm Turlar')}</Link>
        </div>
      </div>
    );
  }

  const heroImg = tour.image || tour.gallery?.[0] || FALLBACK_IMG;
  const priceInfo = formatTourPriceWithDiscount(tour);

  const sectionCls = 'scroll-mt-28';

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo title={`${tour.title} — Endülüs Travel`} description={tour.description} image={heroImg} type="product" jsonLd={tourJsonLd} />

      {/* ===== Hero (per-tour image) ===== */}
      <section className="relative w-full overflow-hidden ds-vignette ds-grain" style={{ minHeight: '80svh' }}>
        <img src={heroImg} alt={tour.title} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,10,18,0.6) 0%, rgba(7,10,18,0.2) 40%, rgba(7,10,18,0.95) 100%)' }} />
        <div className="relative z-10 ds-container flex flex-col justify-end" style={{ minHeight: '80svh', paddingTop: '8rem', paddingBottom: 'clamp(3rem,7vh,5rem)' }}>
          <nav className="mb-5 flex items-center gap-2 text-sm text-[var(--ds-text-muted)]">
            <Link to="/" className="hover:text-[var(--ds-gold)]">{t('navigation.home', 'Ana Sayfa')}</Link>
            <span className="opacity-40">/</span>
            <Link to="/turlar" className="hover:text-[var(--ds-gold)]">{t('navigation.tours', 'Turlar')}</Link>
          </nav>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {tour.category && <span className="ds-eyebrow">{t('categories.' + tour.category, tour.destination || '')}</span>}
            {past && (
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] px-3 py-1 rounded-full ds-glass text-[var(--ds-text-soft)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-text-muted)]" />
                {t('tourDetail.completed', 'Bu tur tamamlandı')}
              </span>
            )}
          </div>
          <h1 className="ds-display text-[var(--ds-text)] text-balance" style={{ fontSize: 'clamp(2.4rem,6vw,5rem)', maxWidth: '20ch' }}>
            <TextReveal text={tour.title} delay={0.3} />
          </h1>
          <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3 text-[var(--ds-text-soft)]">
            {tour.duration && <Fact label={t('tourDetail.factDuration', 'Süre')} value={tour.duration} />}
            {tour.groupSize && <Fact label={t('tourDetail.factGroup', 'Grup')} value={tour.groupSize} />}
            {tour.dates && <Fact label={t('tourDetail.factDates', 'Tarih')} value={tour.dates} />}
            <Fact label={t('tourDetail.factPrice', 'Fiyat')} value={formatTourPrice(tour)} gold />
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            {past ? (
              <>
                <Link to="/teklif-al" className="ds-btn">{t('tourDetail.pastCta', 'Benzer Tur İçin Teklif Al')}</Link>
                {tour.instagramUrl && <a href="#ozet" onClick={scrollToId('ozet')} className="ds-btn-ghost">{t('tourDetail.watchRecap', 'Tur Özetini İzle')}</a>}
              </>
            ) : (
              <>
                <WhatsAppButton tour={tour} size="lg">{t('tourDetail.heroWhatsapp', 'WhatsApp ile Rezervasyon')}</WhatsAppButton>
                <Link to="/teklif-al" className="ds-btn-ghost">{t('tourDetail.heroOffer', 'Özel Teklif Al')}</Link>
              </>
            )}
          </div>
          {!past && <div className="mt-6"><RefundGuarantee variant="inline" /></div>}
        </div>
      </section>

      {sections.length > 1 && <SectionNav sections={sections} />}

      {/* ===== Body ===== */}
      <div className="ds-container py-16 md:py-24 grid lg:grid-cols-12 gap-12">
        {/* main column */}
        <div className="lg:col-span-8 space-y-16">
          <section id="genel" className={sectionCls}>
            {past && (
              <div className="ds-glass rounded-2xl p-5 mb-8 flex items-start gap-3">
                <svg className="w-5 h-5 text-[var(--ds-gold)] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <p className="text-sm text-[var(--ds-text-soft)]">{t('tourDetail.completedNote', 'Bu tur gerçekleştirildi ve tamamlandı. Benzer bir rota için bize yazabilir veya gelecek turlarımıza göz atabilirsiniz.')}</p>
              </div>
            )}
            {tour.description && (
              <Reveal>
                <span className="ds-eyebrow">{t('tourDetail.aboutTour', 'Tur Hakkında')}</span>
                <p className="ds-lead mt-5 whitespace-pre-line">{tour.description}</p>
              </Reveal>
            )}

            {/* Group participation policy — shown on every tour */}
            <Reveal delay={0.1}>
              <div className="mt-8 rounded-2xl p-6 md:p-7" style={{ borderLeft: '3px solid var(--ds-terracotta)', background: 'rgba(193,98,63,0.10)', border: '1px solid rgba(193,98,63,0.28)', borderLeftWidth: '3px' }}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-9 h-9 rounded-full grid place-items-center shrink-0" style={{ background: 'rgba(193,98,63,0.20)' }}>
                    <svg className="w-5 h-5" style={{ color: 'var(--ds-terracotta)' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                  </span>
                  <h3 className="ds-display text-lg" style={{ color: 'var(--ds-terracotta)' }}>{t('tourDetail.policyTitle', 'Grup Katılım Politikası')}</h3>
                </div>
                <p className="text-[var(--ds-text-soft)] mb-4">{t('tourDetail.policyLead', 'Grup uyumunu ve tüm misafirlerimizin konforunu koruyabilmek adına:')}</p>
                <ul className="space-y-3">
                  {[
                    t('tourDetail.policyItem0', 'Turlarımız aile, çocuk ve hanımların katılımına uygundur.'),
                    t('tourDetail.policyItem1', 'Turlarımızda bireysel katılım sağlayan erkek misafirleri ne yazık ki ağırlayamıyoruz.'),
                    t('tourDetail.policyItem2', 'Erkek misafirlerimizi aile katılımı şeklinde gruplarımıza dâhil edebiliyoruz.'),
                    t('tourDetail.policyItem3', 'Bu yaklaşım, tamamen grup dengesi ve yol arkadaşlığı konforunu sürdürülebilir kılma amacını taşır.'),
                  ].map((it, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--ds-text)]">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--ds-terracotta)' }} />
                      <span className="leading-relaxed">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </section>

          {tour.instagramUrl && (
            <section id="ozet" className={sectionCls}>
              <Reveal>
                <span className="ds-eyebrow">{t('tourDetail.navRecap', 'Tur Özeti')}</span>
                <h2 className="ds-display text-2xl text-[var(--ds-text)] mt-3 mb-6">{t('tourDetail.recapTitle', 'Bu turdan kareler')}</h2>
                <InstagramEmbed url={tour.instagramUrl} />
              </Reveal>
            </section>
          )}

          {Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
            <Reveal>
              <h2 className="ds-display text-2xl text-[var(--ds-text)] mb-6">{t('tourDetail.highlights', 'Öne Çıkanlar')}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {tour.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 ds-glass rounded-xl p-4">
                    <svg className="w-5 h-5 text-[var(--ds-gold)] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.447a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.539 1.118l-3.367-2.447a1 1 0 00-1.176 0l-3.367 2.447c-.784.57-1.838-.196-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.075 10.1c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" /></svg>
                    <span className="text-[var(--ds-text-soft)]">{h}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          {Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
            <section id="program" className={sectionCls}>
              <Reveal>
                <h2 className="ds-display text-2xl text-[var(--ds-text)] mb-6">{t('tourDetail.itineraryTitle', 'Gün Gün Program')}</h2>
                <Accordion>
                  {tour.itinerary.map((d, i) => (
                    <AccordionItem key={i} title={[d.day, d.title].filter(Boolean).join(' — ')} subtitle={d.date} defaultOpen={i === 0}>
                      {d.description && <p className="mb-3">{d.description}</p>}
                      {Array.isArray(d.activities) && d.activities.length > 0 && (
                        <ul className="space-y-1.5">
                          {d.activities.map((a, j) => (
                            <li key={j} className="flex items-start gap-2"><span className="text-[var(--ds-gold)] mt-1">•</span><span>{a}</span></li>
                          ))}
                        </ul>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            </section>
          )}

          {((tour.included && tour.included.length) || (tour.notIncluded && tour.notIncluded.length)) ? (
            <section id="dahil" className={sectionCls}>
              <Reveal><IncludedIcons included={tour.included || []} notIncluded={tour.notIncluded || []} /></Reveal>
            </section>
          ) : null}

          {!past && <RefundGuarantee variant="banner" />}

          {Array.isArray(tour.faq) && tour.faq.length > 0 && (
            <section id="sss" className={sectionCls}>
              <FaqSection faq={tour.faq} />
            </section>
          )}

          {Array.isArray(tour.gallery) && tour.gallery.length > 0 && (
            <section id="galeri" className={sectionCls}>
              <Reveal>
                <h2 className="ds-display text-2xl text-[var(--ds-text)] mb-6">{t('tourDetail.gallery', 'Galeri')}</h2>
                <PhotoGallery images={tour.gallery} title={tour.title} />
              </Reveal>
            </section>
          )}
        </div>

        {/* sticky sidebar */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-5">
            <div className="ds-glass rounded-3xl p-7">
              {past ? (
                <>
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--ds-text-muted)] mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-text-muted)]" />
                    {t('tourDetail.completed', 'Bu tur tamamlandı')}
                  </span>
                  {tour.dates && <div className="ds-display text-2xl text-[var(--ds-text)]">{tour.dates}</div>}
                  <div className="flex items-end gap-3 mt-3">
                    <span className="ds-display text-2xl ds-gold-text">{formatTourPrice(tour)}</span>
                    <span className="text-xs text-[var(--ds-text-muted)] mb-1">{getPriceLabel(tour)}</span>
                  </div>
                  {tour.priceNote && <p className="text-xs text-[var(--ds-text-muted)] mt-3 leading-relaxed">{tour.priceNote}</p>}
                  <div className="mt-6 space-y-3">
                    <Link to="/teklif-al" className="ds-btn w-full justify-center">{t('tourDetail.pastCta', 'Benzer Tur İçin Teklif Al')}</Link>
                    {tour.instagramUrl && <a href="#ozet" onClick={scrollToId('ozet')} className="ds-btn-ghost w-full justify-center">{t('tourDetail.watchRecap', 'Tur Özetini İzle')}</a>}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-end gap-3">
                    <span className="ds-display text-3xl ds-gold-text">{formatTourPrice(tour)}</span>
                    {priceInfo?.hasDiscount && priceInfo.originalPrice && (
                      <span className="text-[var(--ds-text-muted)] line-through mb-1">{priceInfo.originalPrice}</span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--ds-text-muted)] mt-1">{getPriceLabel(tour)}</div>
                  {tour.priceNote && <p className="text-xs text-[var(--ds-text-muted)] mt-3 leading-relaxed">{tour.priceNote}</p>}
                  <div className="mt-6 space-y-3">
                    <WhatsAppButton tour={tour} size="md" className="w-full">{t('tourDetail.sidebarWhatsapp', 'WhatsApp ile İletişim')}</WhatsAppButton>
                    <Link to="/teklif-al" className="ds-btn w-full justify-center">{t('tourDetail.sidebarOffer', 'Özel Teklif Al')}</Link>
                  </div>
                </>
              )}
            </div>
            {!past && <RefundGuarantee variant="card" />}
            <div className="ds-glass rounded-3xl p-7 space-y-3 text-sm">
              {tour.groupSize && <InfoRow label={t('tourDetail.factGroup', 'Grup')} value={tour.groupSize} />}
              {tour.duration && <InfoRow label={t('tourDetail.factDuration', 'Süre')} value={tour.duration} />}
              {tour.dates && <InfoRow label={t('tourDetail.factDates', 'Tarih')} value={tour.dates} />}
              {tour.category && <InfoRow label={t('tourDetail.categoryLabel', 'Kategori')} value={t('categories.' + tour.category, tour.destination || tour.category)} />}
            </div>
          </div>
        </aside>
      </div>

      {/* reviews */}
      <div className="py-8" style={{ background: 'var(--ds-grad-night)' }}>
        <ReviewsSection tourSlug={tour.slug} />
      </div>

      {/* related */}
      {Array.isArray(relatedTours) && relatedTours.length > 0 && (
        <section className="py-20" style={{ background: 'var(--ds-bg)' }}>
          <div className="ds-container">
            <h2 className="ds-display text-2xl md:text-3xl text-[var(--ds-text)] mb-10">{t('tourDetail.related', 'Benzer Turlar')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTours.slice(0, 3).map((rt, i) => <TourCardX key={rt.slug} tour={rt} delay={i * 0.08} past={isPastTour(rt)} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const Fact = ({ label, value, gold }) => (
  <div className="flex flex-col">
    <span className="text-[0.65rem] uppercase tracking-[0.25em] text-[var(--ds-text-muted)]">{label}</span>
    <span className={`text-lg font-medium ${gold ? 'text-[var(--ds-gold)]' : 'text-[var(--ds-text)]'}`}>{value}</span>
  </div>
);
const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-[var(--ds-text-muted)]">{label}</span>
    <span className="text-[var(--ds-text)] text-right font-medium">{value}</span>
  </div>
);

export default TourDetailPage;
