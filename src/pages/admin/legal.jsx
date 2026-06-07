import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Button, Input, PageHeader, Textarea, ToastStack, useToast } from '../../components/admin/ui';

const LEGAL = [
  { key: 'legal.privacy', title: 'Gizlilik Politikası', path: '/gizlilik' },
  { key: 'legal.terms', title: 'Kullanım Koşulları', path: '/kullanim-kosullari' },
  { key: 'legal.kvkk', title: 'KVKK', path: '/kvkk' },
];

const LegalBlock = ({ entry, show }) => {
  const [data, setData] = useState({ title: entry.title, body: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const v = await api.get(`/settings/${entry.key}`);
        if (!cancelled && v) setData((p) => ({ ...p, ...v }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [entry.key]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/settings/${entry.key}`, data);
      show(`${entry.title} kaydedildi`);
    } catch (e) {
      const fe = e?.body?.details?.fieldErrors;
      const first = fe && Object.values(fe).flat()[0];
      show(first || e?.body?.error || e.message, 'error');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-400">Yükleniyor…</div>;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800">{entry.title}</h2>
          <p className="text-xs text-slate-500">Public URL: <code className="rounded bg-slate-100 px-1">{entry.path}</code></p>
        </div>
        <Button onClick={save} disabled={saving}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</Button>
      </div>
      <Input label="Başlık" value={data.title || ''} onChange={(e) => setData({ ...data, title: e.target.value })} />
      <Textarea
        label="İçerik (HTML destekli — script etiketleri reddedilir)"
        rows={14}
        value={data.body || ''}
        onChange={(e) => setData({ ...data, body: e.target.value })}
      />
    </section>
  );
};

const LegalAdminPage = () => {
  const { items: toastItems, show, dismiss } = useToast();
  return (
    <div>
      <PageHeader title="Yasal Sayfalar" description="Gizlilik, kullanım koşulları, KVKK metinleri" />
      <div className="grid gap-4 lg:grid-cols-2">
        {LEGAL.map((entry) => <LegalBlock key={entry.key} entry={entry} show={show} />)}
      </div>
      <ToastStack items={toastItems} onDismiss={dismiss} />
    </div>
  );
};

export default LegalAdminPage;
