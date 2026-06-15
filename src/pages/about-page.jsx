import { useTranslation } from 'react-i18next';
import Seo from '../components/Seo';
import { LocaleLink as Link } from '../components/LocaleLink';
import { PhoneLink } from '../components/ui/phone-link';
import PageHero from '../components/redesign/PageHero';
import { Reveal, TextReveal, Magnetic } from '../components/motion';
import { useContactData } from '../hooks/useAppData';

const MEDIA = '/uploads/media';

// Hakkımızda sayfası bileşeni — Endülüs / Alhambra concept (dark cinematic)
const AboutPage = () => {
  const { t } = useTranslation();
  const { contactData } = useContactData();
  // Contact details from /api/settings/contact, production values as fallback.
  const phone = contactData?.phone || '+90 507 938 45 08';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;
  const email = contactData?.email || 'info@endulustravel.com';
  const igUrl = contactData?.social?.instagram || 'https://www.instagram.com/endulustravell/';
  const igHandle = '@' + (igUrl.replace(/\/+$/, '').split('/').pop() || 'endulustravell');
  const address = contactData?.address
    || 'Osmanağa Mah. Çilek Sok. Akel İşhanı No:1 Kat:2 İç Kapı No:42, Kadıköy / İstanbul';

  // Brand-story features (icons kept inline so the section reads as a journey).
  const features = [
    {
      title: t('aboutPage.featureSensitivityTitle', 'Hassasiyetlerinize Özel'),
      body: (
        <>
          {t('aboutPage.featureSensitivityPre', 'Muhafazakâr misafirlerimizin hassasiyetlerini ön planda tutarak, ')}
          <strong className="ds-gold-text font-semibold">{t('aboutPage.featureSensitivityStrong', ' namaz vakitlerine uygun programlar, helal yemek hassasiyeti ve mahremiyete önem veren özel grup turları')}</strong>
          {t('aboutPage.featureSensitivityPost', ' sunuyoruz.')}
        </>
      ),
      d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    },
    {
      title: t('aboutPage.featureAllInclusiveTitle', 'Her Şey Dahil Anlayışı'),
      body: (
        <>
          {t('aboutPage.featureAllInclusivePre', 'Tüm turlarımızda ')}
          <strong className="ds-gold-text font-semibold">{t('aboutPage.featureAllInclusiveStrong', 'her şey dahil')}</strong>
          {t('aboutPage.featureAllInclusivePost', ' anlayışıyla hareket ediyor, ekstra ücret sürprizlerine yer vermiyoruz. Şeffaf fiyatlandırma garantisi.')}
        </>
      ),
      d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: t('aboutPage.featureBudgetTitle', 'Her Bütçeye Uygun'),
      body: (
        <>
          {t('aboutPage.featureBudgetPre', 'Yurt içi ve yurt dışı turlarımızda hem ')}
          <span className="ds-gold-text font-semibold">{t('aboutPage.featureBudgetStrong1', 'uygun fiyatlı')}</span>
          {t('aboutPage.featureBudgetMid', ' hem de isteğe bağlı ')}
          <span className="ds-gold-text font-semibold">{t('aboutPage.featureBudgetStrong2', 'VIP seçenekler')}</span>
          {t('aboutPage.featureBudgetPost', ' sunuyoruz.')}
        </>
      ),
      d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    },
    {
      title: t('aboutPage.featurePersonalTitle', 'Kişisel Deneyim'),
      body: (
        <>
          {t('aboutPage.featurePersonalPre', 'Amacımız, seyahatinizi sizin değerlerinize uygun şekilde planlamak ve ')}
          <strong className="ds-gold-text font-semibold">{t('aboutPage.featurePersonalStrong', ' her anının unutulmaz')}</strong>
          {t('aboutPage.featurePersonalPost', ' olmasını sağlamak.')}
        </>
      ),
      d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    },
  ];

  const ctaFeatures = [
    {
      title: t('aboutPage.ctaFeatureFastTitle', 'Hızlı Yanıt'),
      desc: t('aboutPage.ctaFeatureFastDesc', '24 saat içinde size dönüş'),
      d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: t('aboutPage.ctaFeatureFreeTitle', 'Ücretsiz Planlama'),
      desc: t('aboutPage.ctaFeatureFreeDesc', 'İlk görüşme tamamen ücretsiz'),
      d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: t('aboutPage.ctaFeaturePersonalTitle', '%100 Kişisel'),
      desc: t('aboutPage.ctaFeaturePersonalDesc', 'Tamamen size özel tasarım'),
      d: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    },
  ];

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo
        title={t('aboutPage.metaTitle', 'Hakkımızda - Endülüs Travel')}
        description={t('aboutPage.metaDescription', '2024 yılında kurulan Endülüs Travel; namaz vakitlerine uygun, helal hassasiyetli ve her şey dahil yurt içi & yurt dışı turlar sunan güvenilir seyahat ortağınızdır.')}
      />

      {/* Cinematic hero — Endülüs / Alhambra */}
      <PageHero
        video={`${MEDIA}/alhambra.mp4`}
        poster={`${MEDIA}/alhambra.jpg`}
        eyebrow={t('aboutPage.heroBadge', 'Endülüs Travel Hikayesi')}
        title={t('about.title', 'Hakkımızda')}
        subtitle={t('about.subtitle', 'Seyahatlerinizi hassasiyetlerinize göre kişiselleştiren, güvenilir seyahat deneyimi ortağınız.')}
        breadcrumb={[
          { to: '/', label: t('navigation.home', 'Ana Sayfa') },
          { label: t('navigation.about', 'Hakkımızda') },
        ]}
      />

      {/* Açılış misyonu + istatistik kartları */}
      <section className="py-16 md:py-24">
        <div className="ds-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-2">
              <Reveal>
                <span className="ds-eyebrow">{t('aboutPage.toursBadge', 'Değerlerinizle Uyumlu Seyahat')}</span>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="ds-lead mt-6 text-[var(--ds-text-soft)]">
                  {t('aboutPage.missionP1Pre', 'Endülüs Travel, ')}
                  <strong className="text-[var(--ds-text)] font-semibold">{t('aboutPage.missionP1Strong1', '2024 yılında kurulan genç ve dinamik bir turizm markasıdır.')}</strong>
                  {t('aboutPage.missionP1Mid', ' Klasik tur anlayışının ötesinde, ')}
                  <strong className="ds-gold-text font-semibold">{t('aboutPage.missionP1Strong2', 'kişiye ve gruba özel, hassasiyet odaklı seyahat deneyimleri')}</strong>
                  {t('aboutPage.missionP1Post', ' sunan yenilikçi yaklaşımımızla sektörde fark yaratıyoruz.')}
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="ds-lead mt-5 text-[var(--ds-text-muted)]">
                  {t('aboutPage.missionP2Pre', 'Yeni nesil seyahat anlayışıyla, modern teknoloji ve geleneksel değerleri harmanlayarak, ')}
                  <strong className="text-[var(--ds-text)] font-semibold">{t('aboutPage.missionP2Strong', 'her müşterimize eşsiz ve unutulmaz deneyimler')}</strong>
                  {t('aboutPage.missionP2Post', ' yaşatmayı hedefliyoruz.')}
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              {[
                { v: '2024', l: t('aboutPage.statFoundedLabel', 'Kuruluş Yılı') },
                { v: t('aboutPage.statTrustTitle', 'Güven'), l: t('aboutPage.statTrustLabel', 'Odaklı Hizmet') },
                { v: t('aboutPage.statInnovationTitle', 'Yenilik'), l: t('aboutPage.statInnovationLabel', '& İnovasyon') },
              ].map((s, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="ds-glass rounded-2xl p-6 text-center lg:text-left">
                    <div className="ds-display ds-gold-text text-3xl md:text-4xl">{s.v}</div>
                    <p className="mt-2 text-[var(--ds-text-soft)] text-sm">{s.l}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Turlarımız hakkında */}
      <section className="pb-16 md:pb-24">
        <div className="ds-container">
          <div className="text-center max-w-3xl mx-auto">
            <Reveal><span className="ds-eyebrow">{t('aboutPage.toursBadge', 'Değerlerinizle Uyumlu Seyahat')}</span></Reveal>
            <h2 className="ds-display text-[var(--ds-text)] mt-5 text-balance" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
              <TextReveal text={t('aboutPage.toursHeadingLine1', 'TURLARIMIZ')} />{' '}
              <span className="ds-gold-text"><TextReveal text={t('aboutPage.toursHeadingLine2', 'HAKKINDA')} delay={0.1} /></span>
            </h2>
            <Reveal delay={0.2}>
              <p className="ds-lead mt-6">
                {t('aboutPage.toursIntroPre', 'Endülüs Travel olarak, seyahat etmeyi sadece gezmekten ibaret görmüyor; ')}
                <span className="ds-gold-text font-semibold">{t('aboutPage.toursIntroStrong', ' huzurla, inanç değerleriyle uyumlu, konforlu ve unutulmaz bir deneyime')}</span>
                {t('aboutPage.toursIntroPost', ' dönüştürüyoruz.')}
              </p>
            </Reveal>
          </div>

          {/* Özellikler grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <Reveal key={i} delay={(i % 2) * 0.08}>
                <div className="ds-glass rounded-3xl p-7 h-full transition-colors hover:border-[var(--ds-line-strong)]">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--ds-grad-gold)' }}
                    >
                      <svg className="w-6 h-6 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.d} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="ds-display text-xl text-[var(--ds-text)] mb-2">{f.title}</h3>
                      <p className="text-[var(--ds-text-muted)] leading-relaxed">{f.body}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Vaadimiz — vurgu kutusu */}
          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-3xl mt-12 max-w-5xl mx-auto ds-vignette">
              <img src={`${MEDIA}/alhambra.jpg`} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-25" loading="lazy" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,14,26,0.85), rgba(10,14,26,0.55), rgba(10,14,26,0.9))' }} />
              <div className="relative z-10 p-8 md:p-14 text-center max-w-3xl mx-auto">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'var(--ds-grad-gold)' }}
                >
                  <svg className="w-8 h-8 text-[var(--ds-on-gold)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="ds-eyebrow mb-4">{t('aboutPage.promiseTitle', 'Bizim Vaadimiz')}</h3>
                <p className="ds-display text-[var(--ds-text)] text-balance" style={{ fontSize: 'clamp(1.4rem,3vw,2.2rem)' }}>
                  {t('aboutPage.promiseText', '"Endülüs Travel ile güvenli, huzurlu ve değerlerinizle uyumlu bir yolculuğa çıkmaya hazır olun."')}
                </p>
                <p className="mt-6 text-[var(--ds-text-soft)] text-sm" style={{ letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                  {t('aboutPage.promiseAttribution', '— İki Kız Kardeş · Endülüs Travel')}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* İletişim & lokasyon */}
      <section className="pb-16 md:pb-24">
        <div className="ds-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Reveal><span className="ds-eyebrow">{t('aboutPage.contactBadge', 'İletişim & Lokasyon')}</span></Reveal>
            <h2 className="ds-display text-[var(--ds-text)] mt-5 text-balance" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
              <TextReveal text={t('aboutPage.contactHeading', 'BİRLİKTE YOLA ÇIKALIM')} />
            </h2>
            <Reveal delay={0.15}>
              <p className="ds-gold-text ds-display text-2xl md:text-3xl mt-3">ENDÜLÜS TRAVEL</p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* İletişim detayları */}
            <Reveal>
              <div className="ds-glass rounded-3xl p-7 md:p-8 h-full">
                <h4 className="ds-eyebrow mb-6">{t('aboutPage.contactInfoTitle', 'İletişim Bilgileri')}</h4>
                <div className="space-y-3">
                  {/* Telefon */}
                  <a href={phoneHref} className="group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-white/5">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ds-grad-gold)' }}>
                      <svg className="w-5 h-5 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-[var(--ds-text-muted)]">{t('aboutPage.contactPhoneLabel', 'İletişim Numarası')}</span>
                      <span className="block text-[var(--ds-text)] font-medium group-hover:text-[var(--ds-gold-bright)] transition-colors truncate">{phone}</span>
                    </span>
                  </a>

                  {/* E-posta */}
                  <a href={`mailto:${email}`} className="group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-white/5">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ds-grad-gold)' }}>
                      <svg className="w-5 h-5 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-[var(--ds-text-muted)]">{t('aboutPage.contactEmailLabel', 'Mail Adresi')}</span>
                      <span className="block text-[var(--ds-text)] font-medium group-hover:text-[var(--ds-gold-bright)] transition-colors truncate">{email}</span>
                    </span>
                  </a>

                  {/* Website */}
                  <a href="https://www.endulustravel.com" className="group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-white/5">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ds-grad-gold)' }}>
                      <svg className="w-5 h-5 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-[var(--ds-text-muted)]">Website</span>
                      <span className="block text-[var(--ds-text)] font-medium group-hover:text-[var(--ds-gold-bright)] transition-colors truncate">www.endulustravel.com</span>
                    </span>
                  </a>

                  {/* Instagram */}
                  <a href={igUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-white/5">
                    <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--ds-grad-gold)' }}>
                      <svg className="w-5 h-5 text-[var(--ds-on-gold)]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-[var(--ds-text-muted)]">Instagram</span>
                      <span className="block text-[var(--ds-text)] font-medium group-hover:text-[var(--ds-gold-bright)] transition-colors truncate">{igHandle}</span>
                    </span>
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Adres bilgisi */}
            <Reveal delay={0.12}>
              <div className="ds-glass rounded-3xl p-7 md:p-8 h-full">
                <h4 className="ds-display text-xl text-[var(--ds-text)] mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-[var(--ds-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m0 0v-4a1 1 0 011-1h2a1 1 0 011 1v4M7 7h10M7 11h10m-5 4h2" />
                  </svg>
                  {t('aboutPage.agencyName', 'ROTA ATLAS SEYAHAT ACENTASI')}
                </h4>

                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ background: 'var(--ds-grad-gold)' }}>
                    <svg className="w-4 h-4 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <p className="leading-relaxed text-[var(--ds-text-soft)]">
                    <span className="font-semibold text-[var(--ds-text)]">{t('aboutPage.addressLabel', 'Adres:')}</span><br />
                    {address}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl p-4 border border-[var(--ds-line)]">
                  <div className="flex items-center justify-center gap-2 text-[var(--ds-text-muted)]">
                    <svg className="w-5 h-5 text-[var(--ds-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="text-sm">{t('aboutPage.mapLocation', 'Kadıköy merkez konumunda')}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Güçlü CTA alanı */}
      <section className="relative overflow-hidden ds-vignette" style={{ minHeight: '60vh' }}>
        <img src={`${MEDIA}/alhambra.jpg`} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, var(--ds-bg), rgba(10,14,26,0.55), var(--ds-bg))' }} />
        <div className="relative z-10 ds-container py-20 md:py-28 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="ds-display text-[var(--ds-text)] text-balance" style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}>
              <TextReveal text={t('aboutPage.ctaHeadingLine1', 'Hayalinizdeki tatili')} />{' '}
              <span className="ds-gold-text"><TextReveal text={t('aboutPage.ctaHeadingLine2', 'birlikte planlayalım!')} delay={0.1} /></span>
            </h2>
            <Reveal delay={0.2}>
              <p className="ds-lead mt-6 max-w-[48ch] mx-auto">{t('aboutPage.ctaSubtitle', 'Size özel, unutulmaz seyahat deneyimleri için bugün adım atın.')}</p>
            </Reveal>

            {/* Özellikler */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto">
              {ctaFeatures.map((f, i) => (
                <Reveal key={i} delay={0.25 + i * 0.08}>
                  <div className="ds-glass rounded-2xl p-5 h-full text-center">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'var(--ds-grad-gold)' }}>
                      <svg className="w-6 h-6 text-[var(--ds-on-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.d} />
                      </svg>
                    </div>
                    <h3 className="text-[var(--ds-text)] font-semibold mb-1">{f.title}</h3>
                    <p className="text-sm text-[var(--ds-text-muted)]">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* CTA butonları */}
            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Magnetic>
                  <Link to="/teklif-al" className="ds-btn">
                    <span>{t('aboutPage.ctaButtonQuote', 'Hemen Teklif Alın')}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </Magnetic>
                <Link to="/on-anket" className="ds-btn-ghost">
                  <span>{t('aboutPage.ctaButtonSurvey', 'Önce Anket Doldurun')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </Link>
              </div>
            </Reveal>

            {/* Alt bilgi */}
            <Reveal delay={0.5}>
              <PhoneLink className="text-sm text-[var(--ds-text-muted)] mt-7" />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
