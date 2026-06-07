import { useEffect } from 'react';
import { useSetting } from '../hooks/useAppData';

// Public renderer for /gizlilik /kullanim-kosullari /kvkk. Content comes from
// the matching legal.* setting key. HTML body is sanitized server-side
// (no <script>) but we still render via dangerouslySetInnerHTML — keep this
// in mind if a richer editor is added later.
const LegalPage = ({ settingKey, fallbackTitle }) => {
  const { value, isLoading } = useSetting(settingKey);
  useEffect(() => {
    document.title = `${value?.title || fallbackTitle} — Endülüs Travel`;
  }, [value, fallbackTitle]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-slate-400">Yükleniyor…</div>
    );
  }
  const title = value?.title || fallbackTitle;
  const body = value?.body || '';
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
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

export const PrivacyPage = () => <LegalPage settingKey="legal.privacy" fallbackTitle="Gizlilik Politikası" />;
export const TermsPage = () => <LegalPage settingKey="legal.terms" fallbackTitle="Kullanım Koşulları" />;
export const KvkkPage = () => <LegalPage settingKey="legal.kvkk" fallbackTitle="KVKK" />;
