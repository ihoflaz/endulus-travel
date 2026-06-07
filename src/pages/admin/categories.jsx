import { useCrudResource } from '../../hooks/useCrudResource';
import CrudPage from '../../components/admin/CrudPage';
import { Button, Checkbox, Input, Textarea } from '../../components/admin/ui';

const emptyCategory = { key: '', label: '', description: '', order: 0, active: true };

const CategoriesAdminPage = () => {
  const r = useCrudResource({ endpoint: '/categories', empty: emptyCategory });

  return (
    <CrudPage
      resource={r}
      title="Kategoriler"
      description="Tur kategorileri (luxury, spiritual, family...)"
      createLabel="+ Yeni Kategori"
      rowKeyLabel="Kategori"
      confirmMessage={(row) => `"${row.label}" kategorisini silmek istiyor musunuz?`}
      columns={({ openEdit, setConfirm }) => [
        { key: 'label', label: 'Etiket', render: (r) => (
          <div>
            <div className="font-medium">{r.label}</div>
            <div className="text-xs text-slate-500">{r.key}</div>
          </div>
        )},
        { key: 'description', label: 'Açıklama' },
        { key: 'order', label: 'Sıra', className: 'w-16 text-center' },
        { key: 'active', label: 'Aktif', className: 'w-16 text-center', render: (r) => (r.active ? '✓' : '—') },
        { key: 'actions', label: '', className: 'text-right whitespace-nowrap', render: (r) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => openEdit(r)}>Düzenle</Button>
            <Button size="sm" variant="danger" onClick={() => setConfirm(r)}>Sil</Button>
          </div>
        )},
      ]}
      renderForm={(editing, setEditing) => (
        <>
          <Input
            label="Anahtar (key)"
            value={editing.key}
            onChange={(e) => setEditing({ ...editing, key: e.target.value })}
            required
            disabled={!!editing.id}
            hint={editing.id ? 'Mevcut kategorinin anahtarı değiştirilemez' : 'ör. luxury'}
          />
          <Input
            label="Etiket"
            value={editing.label}
            onChange={(e) => setEditing({ ...editing, label: e.target.value })}
            required
          />
          <Textarea
            label="Açıklama"
            value={editing.description || ''}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Sıra"
              type="number"
              value={editing.order ?? 0}
              onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })}
            />
            <div className="flex items-end">
              <Checkbox
                label="Aktif"
                checked={!!editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
              />
            </div>
          </div>
        </>
      )}
    />
  );
};

export default CategoriesAdminPage;
