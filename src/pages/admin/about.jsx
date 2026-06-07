import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { Button, Input, PageHeader, Textarea, ToastStack, useToast } from '../../components/admin/ui';
import { ListEditor } from '../../components/admin/ListEditor';

const AboutAdminPage = () => {
  const [data, setData] = useState({ title: '', description: '', slogan: '', values: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { items: toastItems, show, dismiss } = useToast();
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  useEffect(() => {
    (async () => {
      try {
        const d = await api.get('/settings/about');
        if (mounted.current) {
          setData({ title: '', description: '', slogan: '', values: [], ...(d || {}) });
        }
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings/about', data);
      show('Hakkımızda kaydedildi');
    } catch (e) {
      show(e?.body?.error || e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Hakkımızda"
        description="/hakkimizda sayfasının içeriği."
        actions={<Button onClick={save} disabled={saving}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</Button>}
      />
      {loading ? <div className="text-slate-500">Yükleniyor…</div> : (
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
          <Input label="Başlık" value={data.title || ''} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Textarea label="Açıklama" value={data.description || ''} onChange={(e) => setData({ ...data, description: e.target.value })} rows={8} />
          <Input label="Slogan" value={data.slogan || ''} onChange={(e) => setData({ ...data, slogan: e.target.value })} />
          <ListEditor label="Değerler" value={data.values || []} onChange={(values) => setData({ ...data, values })} />
        </div>
      )}
      <ToastStack items={toastItems} onDismiss={dismiss} />
    </div>
  );
};

export default AboutAdminPage;
