import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../../lib/api';
import {
  Button, Checkbox, ConfirmDialog, Drawer, Input, PageHeader,
  Select, Table, Textarea, ToastStack, useToast, SmartImage,
} from '../../components/admin/ui';
import { ImagePicker } from '../../components/admin/ImagePicker';

const emptySlide = { image: '', alt: '', order: 0, active: true };
const emptyButton = {
  label: '', labelKey: '', href: '/', style: 'primary', order: 0, active: true,
};

const HeroAdminPage = () => {
  const [data, setData] = useState({ slides: [], buttons: [], slogan: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const { items: toastItems, show, dismiss } = useToast();
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await api.get('/hero');
      if (mounted.current) setData(d);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveSlogan = async () => {
    if (saving) return;
    setSaving(true);
    try {
      // Slogan is a setting under the central registry key "hero.slogan".
      await api.put('/settings/hero.slogan', data.slogan);
      if (mounted.current) show('Slogan güncellendi');
    } catch (e) {
      if (mounted.current) show(e?.body?.error || e.message, 'error');
    } finally {
      if (mounted.current) setSaving(false);
    }
  };

  const saveItem = async () => {
    if (!editing || saving) return;
    setSaving(true);
    try {
      const { kind, value } = editing;
      const path = kind === 'slide' ? '/hero/slides' : '/hero/buttons';
      const payload = { ...value, order: Number(value.order) || 0 };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      if (value.id) await api.put(`${path}/${value.id}`, payload);
      else await api.post(path, payload);
      if (mounted.current) {
        setEditing(null);
        show('Kaydedildi');
      }
      await load();
    } catch (e) {
      if (mounted.current) show(e?.body?.error || e.message, 'error');
    } finally {
      if (mounted.current) setSaving(false);
    }
  };

  const remove = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const path = confirm.kind === 'slide' ? '/hero/slides' : '/hero/buttons';
      await api.delete(`${path}/${confirm.value.id}`);
      if (mounted.current) {
        setConfirm(null);
        show('Silindi');
      }
      await load();
    } catch (e) {
      if (mounted.current) show(e?.body?.error || e.message, 'error');
    } finally {
      if (mounted.current) setSaving(false);
    }
  };

  const slideCols = [
    { key: 'image', label: 'Görsel', render: (row) => (
      <SmartImage src={row.image} alt="" className="h-12 w-20 rounded border border-slate-200 object-cover" />
    )},
    { key: 'alt', label: 'Alt metni' },
    { key: 'order', label: 'Sıra', className: 'w-16 text-center' },
    { key: 'active', label: 'Aktif', className: 'w-16 text-center', render: (r) => (r.active ? '✓' : '—') },
    { key: 'actions', label: '', className: 'text-right whitespace-nowrap', render: (row) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="secondary" onClick={() => setEditing({ kind: 'slide', value: { ...emptySlide, ...row } })}>Düzenle</Button>
        <Button size="sm" variant="danger" onClick={() => setConfirm({ kind: 'slide', value: row })}>Sil</Button>
      </div>
    )},
  ];

  const buttonCols = [
    { key: 'label', label: 'Etiket' },
    { key: 'href', label: 'Bağlantı', render: (r) => <code className="rounded bg-slate-100 px-1 text-xs">{r.href}</code> },
    { key: 'style', label: 'Stil' },
    { key: 'order', label: 'Sıra', className: 'w-16 text-center' },
    { key: 'active', label: 'Aktif', className: 'w-16 text-center', render: (r) => (r.active ? '✓' : '—') },
    { key: 'actions', label: '', className: 'text-right whitespace-nowrap', render: (row) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="secondary" onClick={() => setEditing({ kind: 'button', value: { ...emptyButton, ...row } })}>Düzenle</Button>
        <Button size="sm" variant="danger" onClick={() => setConfirm({ kind: 'button', value: row })}>Sil</Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Anasayfa Hero" description="Slider görselleri, butonlar ve slogan." />

      {loading ? <div className="text-slate-500">Yükleniyor…</div> : (
        <>
          <section className="mb-8 rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-800">Slogan</h2>
            <Textarea
              value={data.slogan || ''}
              onChange={(e) => setData({ ...data, slogan: e.target.value })}
              rows={2}
            />
            <div className="mt-2 flex justify-end">
              <Button onClick={saveSlogan} disabled={saving}>Slogan&apos;ı Kaydet</Button>
            </div>
          </section>

          <section className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Slider Görselleri ({data.slides?.length || 0})</h2>
              <Button onClick={() => setEditing({ kind: 'slide', value: { ...emptySlide, order: data.slides?.length || 0 } })}>
                + Yeni Slide
              </Button>
            </div>
            <Table columns={slideCols} rows={data.slides || []} empty="Henüz slide yok" />
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Çağrı Butonları ({data.buttons?.length || 0})</h2>
              <Button onClick={() => setEditing({ kind: 'button', value: { ...emptyButton, order: data.buttons?.length || 0 } })}>
                + Yeni Buton
              </Button>
            </div>
            <Table columns={buttonCols} rows={data.buttons || []} empty="Henüz buton yok" />
          </section>
        </>
      )}

      <Drawer
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.value?.id ? 'Düzenle' : 'Yeni'}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditing(null)}>Vazgeç</Button>
            <Button onClick={saveItem} disabled={saving}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</Button>
          </div>
        }
      >
        {editing?.kind === 'slide' && (
          <div className="space-y-3">
            <ImagePicker label="Görsel" value={editing.value.image} onChange={(p) => setEditing({ ...editing, value: { ...editing.value, image: p } })} />
            <Input label="Alt metin" value={editing.value.alt || ''} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, alt: e.target.value } })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Sıra" type="number" value={editing.value.order ?? 0} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, order: Number(e.target.value) || 0 } })} />
              <div className="flex items-end">
                <Checkbox label="Aktif" checked={!!editing.value.active} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, active: e.target.checked } })} />
              </div>
            </div>
          </div>
        )}
        {editing?.kind === 'button' && (
          <div className="space-y-3">
            <Input label="Etiket" value={editing.value.label || ''} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, label: e.target.value } })} required />
            <Input label="Çeviri Anahtarı (opsiyonel)" value={editing.value.labelKey || ''} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, labelKey: e.target.value } })} placeholder="home.planTour" />
            <Input label="Bağlantı (href)" value={editing.value.href || ''} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, href: e.target.value } })} required />
            <Select label="Stil" value={editing.value.style || 'primary'} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, style: e.target.value } })}>
              <option value="primary">primary</option>
              <option value="secondary">secondary</option>
              <option value="accent">accent</option>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Sıra" type="number" value={editing.value.order ?? 0} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, order: Number(e.target.value) || 0 } })} />
              <div className="flex items-end">
                <Checkbox label="Aktif" checked={!!editing.value.active} onChange={(e) => setEditing({ ...editing, value: { ...editing.value, active: e.target.checked } })} />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        title="Sil"
        message="Bu öğeyi silmek istediğinize emin misiniz?"
        loading={saving}
      />

      <ToastStack items={toastItems} onDismiss={dismiss} />
    </div>
  );
};

export default HeroAdminPage;
