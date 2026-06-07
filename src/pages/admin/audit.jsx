import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import { Button, Input, PageHeader, Select, Table } from '../../components/admin/ui';

const ACTIONS = [
  '', 'login.success', 'login.failed', 'logout',
  'refresh.reuse_detected', 'password.changed',
  'user.create', 'user.update', 'user.delete',
  'setting.update', 'media.upload', 'media.delete',
  'tour.create', 'tour.update', 'tour.delete',
  'blogpost.create', 'blogpost.update', 'blogpost.delete',
  'message.update', 'message.delete',
];

const AuditAdminPage = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ action: '', entity: '', userId: '' });
  const [page, setPage] = useState(0);
  const take = 50;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.action) params.set('action', filter.action);
      if (filter.entity) params.set('entity', filter.entity);
      if (filter.userId) params.set('userId', filter.userId);
      params.set('take', take);
      params.set('skip', page * take);
      const res = await api.get(`/audit?${params}`);
      setItems(res?.items ?? []);
      setTotal(res?.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);
  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(total / take));

  const columns = useMemo(() => [
    { key: 'createdAt', label: 'Tarih', render: (r) => new Date(r.createdAt).toLocaleString('tr-TR') },
    { key: 'user', label: 'Kullanıcı', render: (r) => r.user?.email || (r.userId ? r.userId.slice(0, 8) + '…' : '—') },
    { key: 'action', label: 'Eylem', render: (r) => <code className="rounded bg-slate-100 px-1 text-xs">{r.action}</code> },
    { key: 'entity', label: 'Entity', render: (r) => r.entity + (r.entityId ? ` (${r.entityId.slice(0, 10)})` : '') },
    { key: 'ip', label: 'IP' },
    { key: 'meta', label: 'Detay', render: (r) => r.meta ? (
      <details className="text-xs">
        <summary className="cursor-pointer text-slate-500">göster</summary>
        <pre className="mt-1 max-w-xs overflow-x-auto rounded bg-slate-50 p-2">{JSON.stringify(r.meta, null, 2)}</pre>
      </details>
    ) : '—' },
  ], []);

  return (
    <div>
      <PageHeader title="Etkinlik Günlüğü" description={`Toplam ${total} kayıt — kim, ne, ne zaman`} />

      <div className="mb-3 grid gap-2 sm:grid-cols-4">
        <Select value={filter.action} onChange={(e) => { setPage(0); setFilter((f) => ({ ...f, action: e.target.value })); }}>
          {ACTIONS.map((a) => <option key={a} value={a}>{a || 'Tüm eylemler'}</option>)}
        </Select>
        <Input
          value={filter.entity}
          onChange={(e) => { setPage(0); setFilter((f) => ({ ...f, entity: e.target.value })); }}
          placeholder="Entity (örn. Tour)"
        />
        <Input
          value={filter.userId}
          onChange={(e) => { setPage(0); setFilter((f) => ({ ...f, userId: e.target.value })); }}
          placeholder="Kullanıcı ID"
        />
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>← Önceki</Button>
          <span className="text-sm text-slate-500">{page + 1}/{totalPages}</span>
          <Button size="sm" variant="secondary" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page + 1 >= totalPages}>Sonraki →</Button>
        </div>
      </div>

      {loading ? <div className="text-slate-500">Yükleniyor…</div> : <Table columns={columns} rows={items} empty="Henüz kayıt yok" />}
    </div>
  );
};

export default AuditAdminPage;
