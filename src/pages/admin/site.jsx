import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Button, Input, PageHeader, Textarea, ToastStack, useToast } from '../../components/admin/ui';
import { ListEditor } from '../../components/admin/ListEditor';
import { ImagePicker } from '../../components/admin/ImagePicker';

// Single page that bundles site-wide settings: branding (title/desc/og/favicon),
// WhatsApp channel, and footer text. Each section saves to its own /settings key.

const SettingsBlock = ({ title, defaults, settingKey, fields }) => {
  const [data, setData] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { items: toastItems, show, dismiss } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const v = await api.get(`/settings/${settingKey}`);
        if (!cancelled && v) setData((prev) => ({ ...prev, ...v }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [settingKey]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/settings/${settingKey}`, data);
      show(`${title} kaydedildi`);
    } catch (e) {
      const fe = e?.body?.details?.fieldErrors;
      const first = fe && Object.values(fe).flat()[0];
      show(first || e?.body?.error || e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="rounded-xl border border-slate-200 bg-white p-4 text-slate-400">Yükleniyor…</div>;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        <Button onClick={save} disabled={saving}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</Button>
      </div>
      {fields.map((f) => {
        const props = { value: data[f.key] || '', onChange: (e) => setData({ ...data, [f.key]: typeof e === 'string' ? e : e?.target?.value }) };
        if (f.type === 'textarea')
          return <Textarea key={f.key} label={f.label} rows={f.rows || 3} hint={f.hint} {...props} />;
        if (f.type === 'image')
          return <ImagePicker key={f.key} label={f.label} value={data[f.key] || null} onChange={(p) => setData({ ...data, [f.key]: p })} />;
        if (f.type === 'list')
          return <ListEditor key={f.key} label={f.label} value={data[f.key] || []} onChange={(v) => setData({ ...data, [f.key]: v })} />;
        return <Input key={f.key} label={f.label} hint={f.hint} {...props} />;
      })}
    </section>
  );
};

const SiteAdminPage = () => {
  return (
    <div>
      <PageHeader title="Site Ayarları" description="SEO, marka, WhatsApp, footer metinleri" />
      <div className="grid gap-4 lg:grid-cols-2">
        <SettingsBlock
          title="SEO & Marka"
          settingKey="site"
          defaults={{ title: '', description: '', keywords: [], ogImage: '', favicon: '' }}
          fields={[
            { key: 'title', label: 'Site Başlığı', hint: 'Tarayıcı sekmesinde ve sosyal paylaşımlarda gösterilir' },
            { key: 'description', label: 'Site Açıklaması', type: 'textarea', rows: 3, hint: 'Arama motorlarına çıkan kısa açıklama' },
            { key: 'keywords', label: 'Anahtar Kelimeler', type: 'list' },
            { key: 'ogImage', label: 'Sosyal paylaşım görseli (1200×630)', type: 'image' },
            { key: 'favicon', label: 'Favicon (ico/png)', type: 'image' },
          ]}
        />
        <SettingsBlock
          title="WhatsApp"
          settingKey="whatsapp"
          defaults={{ number: '', defaultMessage: '' }}
          fields={[
            { key: 'number', label: 'Numara (rakamlar)', hint: 'Örn: 905079384508 (uluslararası kod dahil)' },
            { key: 'defaultMessage', label: 'Varsayılan mesaj', type: 'textarea', rows: 2 },
          ]}
        />
        <SettingsBlock
          title="Footer"
          settingKey="footer"
          defaults={{ aboutText: '', legalName: '', licenseNumber: '', copyright: '' }}
          fields={[
            { key: 'aboutText', label: 'Banner metni', type: 'textarea', rows: 2 },
            { key: 'legalName', label: 'Yasal ünvan' },
            { key: 'licenseNumber', label: 'TURSAB / belge no' },
            { key: 'copyright', label: 'Telif satırı' },
          ]}
        />
      </div>
    </div>
  );
};

export default SiteAdminPage;
