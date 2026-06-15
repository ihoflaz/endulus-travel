import { useTranslation } from 'react-i18next';
import { useSetting } from '../hooks/useAppData';
import Seo from '../components/Seo';

// Public renderer for /gizlilik /kullanim-kosullari /kvkk. Content comes from
// the matching legal.* setting key. HTML body is sanitized server-side
// (no <script>) but we still render via dangerouslySetInnerHTML — keep this
// in mind if a richer editor is added later.
const LegalPage = ({ settingKey, fallbackTitle, metaTitle, metaDescription }) => {
  const { value, isLoading } = useSetting(settingKey);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">Yükleniyor…</div>
    );
  }
  const title = value?.title || fallbackTitle;
  const body = value?.body || '';
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Seo title={metaTitle} description={metaDescription} />
      <h1 className="mb-6 text-3xl font-bold text-slate-900">{title}</h1>
      {body ? (
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      ) : (
        <p className="text-slate-500">İçerik henüz hazırlanmadı.</p>
      )}
    </article>
  );
};

export const PrivacyPage = () => {
  const { t } = useTranslation();
  return (
    <LegalPage
      settingKey="legal.privacy"
      fallbackTitle="Gizlilik Politikası"
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
      metaTitle={t('legal.kvkkMetaTitle', 'KVKK Aydınlatma Metni - Endülüs Travel')}
      metaDescription={t(
        'legal.kvkkMetaDescription',
        'Endülüs Travel KVKK aydınlatma metni: 6698 sayılı Kanun kapsamında kişisel verilerinizin işlenmesi, haklarınız ve başvuru yöntemleri hakkında ayrıntılı bilgi.'
      )}
    />
  );
};
