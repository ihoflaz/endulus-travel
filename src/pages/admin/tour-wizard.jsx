import { useCrudResource } from '../../hooks/useCrudResource';
import CrudPage from '../../components/admin/CrudPage';
import { Button, Checkbox, Input, Textarea } from '../../components/admin/ui';
import { ImagePicker } from '../../components/admin/ImagePicker';

const emptyStep = {
  step: '', title: '', description: '', options: [], order: 0, active: true,
};

const OptionEditor = ({ value = [], onChange }) => {
  const update = (i, patch) => {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const add = () => onChange([...(value || []), { id: '', name: '', description: '', image: '' }]);
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i, d) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {value.map((opt, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>Seçenek {i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="rounded px-1.5 hover:bg-white" disabled={i === 0}>↑</button>
              <button type="button" onClick={() => move(i, 1)} className="rounded px-1.5 hover:bg-white" disabled={i === value.length - 1}>↓</button>
              <button type="button" onClick={() => remove(i)} className="rounded px-1.5 text-red-600 hover:bg-white">Sil</button>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input label="ID" value={opt.id || ''} onChange={(e) => update(i, { id: e.target.value })} />
            <Input label="İsim" value={opt.name || ''} onChange={(e) => update(i, { name: e.target.value })} />
          </div>
          <Textarea label="Açıklama" value={opt.description || ''} onChange={(e) => update(i, { description: e.target.value })} rows={2} className="mt-2" />
          <div className="mt-2">
            <ImagePicker label="Görsel" value={opt.image} onChange={(p) => update(i, { image: p })} />
          </div>
        </div>
      ))}
      <Button variant="secondary" onClick={add}>+ Seçenek ekle</Button>
    </div>
  );
};

const TourWizardAdminPage = () => {
  const r = useCrudResource({ endpoint: '/tour-wizard', empty: emptyStep });

  return (
    <CrudPage
      resource={r}
      title="Tur Planlama Sihirbazı"
      description="/tur-planlama sayfasındaki adımlar ve seçenekleri"
      createLabel="+ Yeni Adım"
      rowKeyLabel="Adım"
      wide
      confirmMessage={(row) => `"${row.title}" adımını silmek istiyor musunuz?`}
      columns={({ openEdit, setConfirm }) => [
        { key: 'step', label: 'Adım', render: (r) => <code className="rounded bg-slate-100 px-1 text-xs">{r.step}</code> },
        { key: 'title', label: 'Başlık' },
        { key: 'options', label: 'Seçenek', render: (r) => `${(r.options || []).length}` },
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
            <Input label="Step (key)" value={editing.step} onChange={(e) => setEditing({ ...editing, step: e.target.value })} required hint="destination, duration, ..." />
            <Input label="Sıra" type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })} />
          </div>
          <Input label="Başlık" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
          <Textarea label="Açıklama" value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Seçenekler</label>
            <OptionEditor value={editing.options || []} onChange={(options) => setEditing({ ...editing, options })} />
          </div>
          <Checkbox label="Aktif" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
        </>
      )}
    />
  );
};

export default TourWizardAdminPage;
