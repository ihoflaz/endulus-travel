import { useCrudResource } from '../../hooks/useCrudResource';
import CrudPage from '../../components/admin/CrudPage';
import { Button, Checkbox, Input, Textarea } from '../../components/admin/ui';
import { ListEditor } from '../../components/admin/ListEditor';
import { ImagePicker } from '../../components/admin/ImagePicker';

const emptyRoute = {
  persons: 2, budget: 0, destination: '', days: 1, departure: '',
  image: '', description: '', highlights: [], price: 0, order: 0, active: true,
};

const fmtPrice = (n) => n != null ? `${Number(n).toLocaleString('tr-TR')} ₺` : '—';

const BudgetRoutesAdminPage = () => {
  const r = useCrudResource({ endpoint: '/budget-routes', empty: emptyRoute });

  return (
    <CrudPage
      resource={r}
      title="Bütçe Rotaları"
      createLabel="+ Yeni Rota"
      rowKeyLabel="Rota"
      wide
      confirmMessage={(row) => `"${row.destination}" rotasını silmek istiyor musunuz?`}
      columns={({ openEdit, setConfirm }) => [
        { key: 'destination', label: 'Destinasyon' },
        { key: 'persons', label: 'Kişi', className: 'w-16 text-center' },
        { key: 'days', label: 'Gün', className: 'w-16 text-center' },
        { key: 'price', label: 'Fiyat', render: (r) => fmtPrice(r.price) },
        { key: 'budget', label: 'Bütçe', render: (r) => fmtPrice(r.budget) },
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
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Destinasyon" value={editing.destination} onChange={(e) => setEditing({ ...editing, destination: e.target.value })} required />
            <Input label="Kalkış" value={editing.departure || ''} onChange={(e) => setEditing({ ...editing, departure: e.target.value })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <Input label="Kişi sayısı" type="number" value={editing.persons} onChange={(e) => setEditing({ ...editing, persons: Number(e.target.value) || 0 })} required />
            <Input label="Gün" type="number" value={editing.days} onChange={(e) => setEditing({ ...editing, days: Number(e.target.value) || 0 })} required />
            <Input label="Bütçe (₺)" type="number" value={editing.budget} onChange={(e) => setEditing({ ...editing, budget: Number(e.target.value) || 0 })} required />
            <Input label="Fiyat (₺)" type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) || 0 })} required />
          </div>
          <Textarea label="Açıklama" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
          <ImagePicker label="Görsel" value={editing.image} onChange={(p) => setEditing({ ...editing, image: p })} />
          <ListEditor label="Öne çıkanlar" value={editing.highlights || []} onChange={(highlights) => setEditing({ ...editing, highlights })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Sıra" type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })} />
            <div className="flex items-end">
              <Checkbox label="Aktif" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
            </div>
          </div>
        </>
      )}
    />
  );
};

export default BudgetRoutesAdminPage;
