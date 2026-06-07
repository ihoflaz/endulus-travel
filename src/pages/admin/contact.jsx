import { useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import { Button, Input, PageHeader, Textarea, ToastStack, useToast } from '../../components/admin/ui';

const DEFAULT = {
  address: '', phone: '', email: '',
  workingHours: '', weekendHours: '',
  social: { facebook: '', twitter: '', instagram: '', youtube: '' },
  mapLocation: '', mapEmbedCode: '',
};

const ContactAdminPage = () => {
  const [data, setData] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { items: toastItems, show, dismiss } = useToast();
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  useEffect(() => {
    (async () => {
      try {
        const d = await api.get('/settings/contact');
        if (d && mounted.current) {
          setData((prev) => ({
            ...prev,
            ...d,
            social: { ...prev.social, ...(d.social || {}) },
          }));
        }
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/settings/contact', data);
      show('İletişim bilgileri kaydedildi');
    } catch (e) {
      show(e?.body?.error || e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="İletişim"
        description="/iletisim sayfası ve footer bilgileri."
        actions={<Button onClick={save} disabled={saving}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</Button>}
      />
      {loading ? <div className="text-slate-500">Yükleniyor…</div> : (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Adres" value={data.address || ''} onChange={(e) => setData({ ...data, address: e.target.value })} />
            <Input label="Telefon" value={data.phone || ''} onChange={(e) => setData({ ...data, phone: e.target.value })} />
            <Input label="E-posta" type="email" value={data.email || ''} onChange={(e) => setData({ ...data, email: e.target.value })} />
            <Input label="Çalışma saatleri" value={data.workingHours || ''} onChange={(e) => setData({ ...data, workingHours: e.target.value })} />
            <Input label="Hafta sonu saatleri" value={data.weekendHours || ''} onChange={(e) => setData({ ...data, weekendHours: e.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Facebook" value={data.social?.facebook || ''} onChange={(e) => setData({ ...data, social: { ...data.social, facebook: e.target.value } })} />
            <Input label="Twitter" value={data.social?.twitter || ''} onChange={(e) => setData({ ...data, social: { ...data.social, twitter: e.target.value } })} />
            <Input label="Instagram" value={data.social?.instagram || ''} onChange={(e) => setData({ ...data, social: { ...data.social, instagram: e.target.value } })} />
            <Input label="YouTube" value={data.social?.youtube || ''} onChange={(e) => setData({ ...data, social: { ...data.social, youtube: e.target.value } })} />
          </div>
          <Input label="Harita konumu (URL)" value={data.mapLocation || ''} onChange={(e) => setData({ ...data, mapLocation: e.target.value })} />
          <Textarea label="Harita embed kodu (iframe URL)" value={data.mapEmbedCode || ''} onChange={(e) => setData({ ...data, mapEmbedCode: e.target.value })} rows={3} />
        </div>
      )}
      <ToastStack items={toastItems} onDismiss={dismiss} />
    </div>
  );
};

export default ContactAdminPage;
