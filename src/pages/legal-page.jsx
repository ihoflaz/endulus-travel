import { useTranslation } from 'react-i18next';
import { useSetting } from '../hooks/useAppData';
import { LocaleLink as Link } from '../components/LocaleLink';
import Seo from '../components/Seo';
import { Reveal, TextReveal } from '../components/motion';

// Scoped dark styling for the server-provided HTML body. The typography plugin
// is not installed, so we style the injected markup explicitly here instead of
// relying on Tailwind's `prose`. Keyed to `.legal-prose` so nothing else leaks.
const LEGAL_PROSE_CSS = `
.legal-prose { color: var(--ds-text-soft); line-height: 1.85; font-size: 1.02rem; }
.legal-prose > :first-child { margin-top: 0; }
.legal-prose > :last-child { margin-bottom: 0; }
.legal-prose h1, .legal-prose h2, .legal-prose h3, .legal-prose h4 {
  font-family: var(--ds-font-display); font-weight: 400; color: var(--ds-text);
  letter-spacing: -0.01em; line-height: 1.15; margin: 2.2em 0 0.7em;
}
.legal-prose h1 { font-size: clamp(1.7rem, 3vw, 2.2rem); }
.legal-prose h2 { font-size: clamp(1.4rem, 2.4vw, 1.75rem); }
.legal-prose h3 { font-size: clamp(1.15rem, 2vw, 1.35rem); }
.legal-prose p { margin: 0 0 1.15em; }
.legal-prose a { color: var(--ds-gold-bright); text-decoration: underline; text-underline-offset: 3px; text-decoration-color: var(--ds-line-strong); transition: color .3s, text-decoration-color .3s; }
.legal-prose a:hover { color: var(--ds-gold); text-decoration-color: var(--ds-gold); }
.legal-prose ul, .legal-prose ol { margin: 0 0 1.2em; padding-left: 1.4em; }
.legal-prose li { margin: 0.4em 0; }
.legal-prose li::marker { color: var(--ds-gold); }
.legal-prose strong, .legal-prose b { color: var(--ds-text); font-weight: 600; }
.legal-prose blockquote {
  margin: 1.4em 0; padding: 0.6em 1.2em; border-left: 2px solid var(--ds-gold);
  color: var(--ds-text-soft); font-style: italic; background: rgba(217,178,90,0.05); border-radius: 0 0.6rem 0.6rem 0;
}
.legal-prose hr { border: 0; height: 1px; margin: 2em 0; background: linear-gradient(90deg, transparent, var(--ds-line-strong), transparent); }
.legal-prose table { width: 100%; border-collapse: collapse; margin: 1.4em 0; font-size: 0.95em; display: block; overflow-x: auto; }
.legal-prose th, .legal-prose td { border: 1px solid var(--ds-line); padding: 0.6em 0.9em; text-align: left; }
.legal-prose th { color: var(--ds-text); background: rgba(255,255,255,0.04); font-weight: 600; }
.legal-prose code { font-family: var(--ds-font-sans); background: rgba(255,255,255,0.06); padding: 0.1em 0.4em; border-radius: 0.4rem; font-size: 0.9em; color: var(--ds-gold-bright); }
.legal-prose img { max-width: 100%; height: auto; border-radius: 0.8rem; }
`;

// Public renderer for /gizlilik /kullanim-kosullari /kvkk. Content comes from
// the matching legal.* setting key. HTML body is sanitized server-side
// (no <script>) but we still render via dangerouslySetInnerHTML — keep this
// in mind if a richer editor is added later.
const LegalPage = ({ settingKey, fallbackTitle, metaTitle, metaDescription, eyebrow, crumbLabel }) => {
  const { t } = useTranslation();
  const { value, isLoading } = useSetting(settingKey);

  const title = value?.title || fallbackTitle;
  const body = value?.body || '';

  return (
    <div className="ds-dark" style={{ background: 'var(--ds-bg)' }}>
      <Seo title={metaTitle} description={metaDescription} />
      <style dangerouslySetInnerHTML={{ __html: LEGAL_PROSE_CSS }} />

      {/* Slim dark header — padded clear of the fixed navbar */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(120% 140% at 50% 0%, rgba(217,178,90,0.10) 0%, transparent 55%)' }}
        />
        <div className="relative ds-container" style={{ paddingTop: 'clamp(7rem, 14vh, 10rem)', paddingBottom: 'clamp(1.6rem, 4vh, 2.8rem)' }}>
          <Reveal y={14} duration={0.7}>
            <nav className="mb-5 flex items-center gap-2 text-sm text-[var(--ds-text-muted)]">
              <Link to="/" className="transition-colors hover:text-[var(--ds-gold)]">
                {t('navigation.home', 'Ana Sayfa')}
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-[var(--ds-gold)]">{crumbLabel}</span>
            </nav>
          </Reveal>

          {eyebrow && (
            <Reveal y={14} delay={0.05} duration={0.7}>
              <span className="ds-eyebrow">{eyebrow}</span>
            </Reveal>
          )}

          <h1 className="ds-display text-balance mt-4 text-[var(--ds-text)]" style={{ fontSize: 'clamp(2.1rem, 5vw, 3.6rem)', maxWidth: '20ch' }}>
            <TextReveal text={title} delay={0.1} />
          </h1>

          <div className="ds-hairline mt-8 max-w-md" />
        </div>
      </header>

      {/* Readable prose panel */}
      <section className="ds-container" style={{ paddingBottom: 'clamp(4rem, 10vh, 7rem)' }}>
        <Reveal y={28} delay={0.1}>
          <article className="ds-glass rounded-3xl mx-auto max-w-3xl" style={{ padding: 'clamp(1.5rem, 5vw, 3.25rem)' }}>
            {isLoading ? (
              <div className="space-y-4" aria-hidden>
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 rounded-full animate-pulse"
                    style={{ background: 'rgba(255,255,255,0.07)', width: `${[92, 100, 84, 96, 70, 100, 60][i]}%` }}
                  />
                ))}
                <span className="sr-only">{t('legal.loading', 'Yükleniyor…')}</span>
              </div>
            ) : body ? (
              <div className="legal-prose" dangerouslySetInnerHTML={{ __html: body }} />
            ) : (
              <p className="text-[var(--ds-text-muted)]">{t('legal.emptyBody', 'İçerik henüz hazırlanmadı.')}</p>
            )}
          </article>
        </Reveal>
      </section>
    </div>
  );
};

export const PrivacyPage = () => {
  const { t } = useTranslation();
  return (
    <LegalPage
      settingKey="legal.privacy"
      fallbackTitle="Gizlilik Politikası"
      eyebrow={t('legal.privacyEyebrow', 'Kurtuba · Mezquita')}
      crumbLabel={t('legal.privacyCrumb', 'Gizlilik')}
      metaTitle={t('legal.privacyMetaTitle', 'Gizlilik Politikası - Endülüs Travel')}
      metaDescription={t(
        'legal.privacyMetaDescription',
        'Endülüs Travel gizlilik politikası: Kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu öğrenin. Verilerinizin güvenliği bizim için önceliklidir.'
      )}
    />
  );
};

export const TermsPage = () => {
  const { t } = useTranslation();
  return (
    <LegalPage
      settingKey="legal.terms"
      fallbackTitle="Kullanım Koşulları"
      eyebrow={t('legal.termsEyebrow', 'Gırnata · Elhamra')}
      crumbLabel={t('legal.termsCrumb', 'Kullanım Koşulları')}
      metaTitle={t('legal.termsMetaTitle', 'Kullanım Koşulları - Endülüs Travel')}
      metaDescription={t(
        'legal.termsMetaDescription',
        'Endülüs Travel kullanım koşulları: Web sitemizi ve hizmetlerimizi kullanırken geçerli olan kurallar, hak ve sorumluluklar hakkında bilgi edinin.'
      )}
    />
  );
};

export const KvkkPage = () => {
  const { t } = useTranslation();
  return (
    <LegalPage
      settingKey="legal.kvkk"
      fallbackTitle="KVKK"
      eyebrow={t('legal.kvkkEyebrow', 'İstanbul · Süleymaniye')}
      crumbLabel={t('legal.kvkkCrumb', 'KVKK')}
      metaTitle={t('legal.kvkkMetaTitle', 'KVKK Aydınlatma Metni - Endülüs Travel')}
      metaDescription={t(
        'legal.kvkkMetaDescription',
        'Endülüs Travel KVKK aydınlatma metni: 6698 sayılı Kanun kapsamında kişisel verilerinizin işlenmesi, haklarınız ve başvuru yöntemleri hakkında ayrıntılı bilgi.'
      )}
    />
  );
};
