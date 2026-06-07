import { useCrudResource } from '../../hooks/useCrudResource';
import CrudPage from '../../components/admin/CrudPage';
import { Button, Checkbox, Input, Textarea } from '../../components/admin/ui';
import { ListEditor } from '../../components/admin/ListEditor';
import { ImagePicker } from '../../components/admin/ImagePicker';

const emptyService = {
  serviceId: '', title: '', description: '', icon: '', image: '',
  fullDescription: '', features: [], isWomenGroup: false, active: true, order: 0,
};

const ServicesAdminPage = ({ womenOnly = false } = {}) => {
  const r = useCrudResource({
    endpoint: '/services',
    listParams: `?isWomenGroup=${womenOnly ? 'true' : 'false'}`,
    empty: { ...emptyService, isWomenGroup: womenOnly },
  });

  return (
    <CrudPage
      resource={r}
      title={womenOnly ? 'Kadın Grupları' : 'Hizmetler'}
      description={
        womenOnly
          ? 'Sadece kadınlara yönelik tur kategorileri'
          : 'Anasayfada listelenen hizmetler ve detay sayfa içerikleri'
      }
      createLabel={womenOnly ? '+ Yeni Grup' : '+ Yeni Hizmet'}
      rowKeyLabel={womenOnly ? 'Grup' : 'Hizmet'}
      wide
      confirmMessage={(row) => `"${row.title}" kaydını silmek istiyor musunuz?`}
      columns={({ openEdit, setConfirm }) => [
        { key: 'title', label: 'Başlık', render: (r) => (
          <div>
            <div className="font-medium text-slate-800">{r.title}</div>
            <div className="text-xs text-slate-500">{r.serviceId}</div>
          </div>
        )},
        { key: 'description', label: 'Açıklama', render: (r) => <span className="line-clamp-2 text-slate-600">{r.description}</span> },
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
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Başlık" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
            <Input label="Slug / ID" value={editing.serviceId} onChange={(e) => setEditing({ ...editing, serviceId: e.target.value })} required hint="URL'de görünür" />
          </div>
          <Textarea label="Kısa açıklama" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} />
          <ImagePicker label="İkon (SVG/PNG)" value={editing.icon} onChange={(p) => setEditing({ ...editing, icon: p })} />
          <ImagePicker label="Kapak görseli" value={editing.image} onChange={(p) => setEditing({ ...editing, image: p })} />
          <Textarea label="Tam açıklama" value={editing.fullDescription || ''} onChange={(e) => setEditing({ ...editing, fullDescription: e.target.value })} rows={8} />
          <ListEditor label="Özellikler" value={editing.features || []} onChange={(features) => setEditing({ ...editing, features })} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input label="Sıra" type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })} />
            <div className="flex items-end gap-4">
              <Checkbox label="Aktif" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
              <Checkbox label="Kadın grubu" checked={!!editing.isWomenGroup} onChange={(e) => setEditing({ ...editing, isWomenGroup: e.target.checked })} />
            </div>
          </div>
        </>
      )}
    />
  );
};

export default ServicesAdminPage;
