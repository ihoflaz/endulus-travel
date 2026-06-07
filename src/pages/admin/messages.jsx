import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../../lib/api';
import {
  Button, ConfirmDialog, Drawer, PageHeader, Select, Table,
  ToastStack, useToast,
} from '../../components/admin/ui';

const KIND_LABELS = {
  CONTACT: 'İletişim',
  OFFER: 'Teklif',
  SURVEY: 'Anket',
};
const STATUS_LABELS = {
  NEW: 'Yeni',
  READ: 'Okundu',
  ARCHIVED: 'Arşiv',
};

const STATUS_BADGE = {
  NEW: 'bg-amber-100 text-amber-800',
  READ: 'bg-slate-100 text-slate-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};

const MessagesAdminPage = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ kind: '', status: '' });
  const [open, setOpen] = useState(null); // active message
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const { items: toastItems, show, dismiss } = useToast();
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.kind) params.set('kind', filter.kind);
      if (filter.status) params.set('status', filter.status);
      const res = await api.get(`/messages${params.toString() ? '?' + params : ''}`);
      if (!mounted.current) return;
      setItems(res?.items ?? []);
      setTotal(res?.total ?? 0);
    } catch (e) {
      if (mounted.current) show(e?.body?.error || e.message, 'error');
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [filter.kind, filter.status, show]);
  useEffect(() => { load(); }, [load]);

  const openMessage = async (m) => {
    setOpen(m);
    // marks as read server-side
    try {
      const fresh = await api.get(`/messages/${m.id}`);
      if (mounted.current) setOpen(fresh);
      await load();
    } catch { /* ignore */ }
  };

  const updateStatus = async (status) => {
    if (!open) return;
    setSaving(true);
    try {
      const updated = await api.patch(`/messages/${open.id}`, { status });
      if (mounted.current) setOpen(updated);
      await load();
      show('Durum güncellendi');
    } catch (e) {
      show(e?.body?.error || e.message, 'error');
    } finally {
      if (mounted.current) setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm) return;
    setSaving(true);
    try {
      await api.delete(`/messages/${confirm.id}`);
      setConfirm(null);
      setOpen(null);
      show('Silindi');
      await load();
    } catch (e) {
      show(e?.body?.error || e.message, 'error');
    } finally {
      if (mounted.current) setSaving(false);
    }
  };

  const columns = useMemo(() => [
    { key: 'createdAt', label: 'Tarih', render: (r) => new Date(r.createdAt).toLocaleString('tr-TR') },
    { key: 'kind', label: 'Tür', render: (r) => KIND_LABELS[r.kind] || r.kind },
    { key: 'from', label: 'Gönderen', render: (r) => (
      <div>
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-slate-500">{r.email}</div>
      </div>
    )},
    { key: 'subject', label: 'Konu', render: (r) => r.subject || '—' },
    { key: 'status', label: 'Durum', render: (r) => (
      <span className={`rounded px-1.5 py-0.5 text-xs ${STATUS_BADGE[r.status] || ''}`}>
        {STATUS_LABELS[r.status]}
      </span>
    )},
    { key: 'actions', label: '', className: 'text-right whitespace-nowrap', render: (r) => (
      <Button size="sm" variant="secondary" onClick={() => openMessage(r)}>Aç</Button>
    )},
  ], []);

  return (
    <div>
      <PageHeader
        title="Mesajlar"
        description={`Toplam ${total} mesaj — iletişim formu, teklif istekleri ve anket yanıtları`}
        actions={null}
      />

      <div className="mb-3 flex flex-wrap gap-3">
        <Select
          value={filter.kind}
          onChange={(e) => setFilter((f) => ({ ...f, kind: e.target.value }))}
        >
          <option value="">Tüm Türler</option>
          {Object.entries(KIND_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
        <Select
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="">Tüm Durumlar</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
      </div>

      {loading ? (
        <div className="text-slate-500">Yükleniyor…</div>
      ) : (
        <Table columns={columns} rows={items} empty="Henüz mesaj yok" />
      )}

      <Drawer
        wide
        open={!!open}
        onClose={() => setOpen(null)}
        title={open ? `${KIND_LABELS[open.kind]} — ${open.name}` : ''}
        footer={
          open && (
            <div className="flex flex-wrap justify-between gap-2">
              <Button variant="danger" onClick={() => setConfirm(open)} disabled={saving}>Sil</Button>
              <div className="flex gap-2">
                {open.status !== 'NEW' && (
                  <Button variant="secondary" onClick={() => updateStatus('NEW')} disabled={saving}>Yeni İşaretle</Button>
                )}
                {open.status !== 'ARCHIVED' && (
                  <Button onClick={() => updateStatus('ARCHIVED')} disabled={saving}>Arşivle</Button>
                )}
              </div>
            </div>
          )
        }
      >
        {open && (
          <div className="space-y-4 text-sm">
            <div className="grid gap-2 sm:grid-cols-2">
              <div><span className="text-slate-500">Tarih:</span> {new Date(open.createdAt).toLocaleString('tr-TR')}</div>
              <div><span className="text-slate-500">Durum:</span> {STATUS_LABELS[open.status]}</div>
              <div><span className="text-slate-500">E-posta:</span> <a className="text-blue-700 hover:underline" href={`mailto:${open.email}`}>{open.email}</a></div>
              {open.phone && <div><span className="text-slate-500">Telefon:</span> <a className="text-blue-700 hover:underline" href={`tel:${open.phone}`}>{open.phone}</a></div>}
              {open.subject && <div className="sm:col-span-2"><span className="text-slate-500">Konu:</span> {open.subject}</div>}
            </div>
            {open.message && (
              <div>
                <div className="mb-1 text-slate-500">Mesaj:</div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 whitespace-pre-wrap">
                  {open.message}
                </div>
              </div>
            )}
            {open.meta && Object.keys(open.meta).length > 0 && (
              <div>
                <div className="mb-1 text-slate-500">Form detayları:</div>
                <pre className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs overflow-x-auto">
                  {JSON.stringify(open.meta, null, 2)}
                </pre>
              </div>
            )}
            <div className="text-xs text-slate-400">
              IP: {open.ip || '—'} · UA: {open.userAgent ? open.userAgent.slice(0, 80) + '…' : '—'}
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        title="Mesajı sil"
        message={`Bu mesajı silmek istiyor musunuz? Bu işlem geri alınamaz.`}
        loading={saving}
      />

      <ToastStack items={toastItems} onDismiss={dismiss} />
    </div>
  );
};

export default MessagesAdminPage;
