import { useMemo, useState } from 'react';
import { useCrudResource } from '../../hooks/useCrudResource';
import CrudPage from '../../components/admin/CrudPage';
import { Button, Checkbox, Input } from '../../components/admin/ui';

const emptyOpt = { groupName: '', value: '', label: '', order: 0, active: true };

const FormOptionsAdminPage = () => {
  const r = useCrudResource({
    endpoint: '/form-options',
    listParams: '/flat',
    empty: emptyOpt,
  });
  const [filter, setFilter] = useState('');

  const groups = useMemo(
    () => Array.from(new Set(r.items.map((i) => i.groupName))).sort(),
    [r.items]
  );
  const filteredItems = useMemo(
    () => (filter ? r.items.filter((i) => i.groupName === filter) : r.items),
    [r.items, filter]
  );
  // Override items shown to the table without changing the source list.
  // Memoized so CrudPage doesn't see a brand-new resource object every render.
  const resourceForUI = useMemo(
    () => ({ ...r, items: filteredItems }),
    [r, filteredItems]
  );

  return (
    <>
      <CrudPage
        resource={resourceForUI}
        title="Form Seçenekleri"
        description="Teklif, anket ve sihirbaz formlarındaki seçenekler"
        createLabel="+ Yeni Seçenek"
        rowKeyLabel="Seçenek"
        confirmMessage={(row) => `"${row.label}" seçeneğini silmek istiyor musunuz?`}
        extraActions={
          <div className="hidden flex-wrap items-center gap-2 text-xs md:flex">
            <span className="text-slate-500">Grup:</span>
            <button onClick={() => setFilter('')} className={`rounded px-2 py-0.5 ${!filter ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>Hepsi</button>
            {groups.map((g) => (
              <button key={g} onClick={() => setFilter(g)} className={`rounded px-2 py-0.5 ${filter === g ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>{g}</button>
            ))}
          </div>
        }
        columns={({ openEdit, setConfirm }) => [
          { key: 'groupName', label: 'Grup', render: (r) => <code className="rounded bg-slate-100 px-1 text-xs">{r.groupName}</code> },
          { key: 'value', label: 'Değer', render: (r) => <code className="text-xs">{r.value}</code> },
          { key: 'label', label: 'Etiket' },
          { key: 'order', label: 'Sıra', className: 'w-16 text-center' },
          { key: 'active', label: 'Aktif', className: 'w-16 text-center', render: (r) => (r.active ? '✓' : '—') },
          { key: 'actions', label: '', className: 'text-right whitespace-nowrap', render: (row) => (
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="secondary" onClick={() => openEdit(row)}>Düzenle</Button>
              <Button size="sm" variant="danger" onClick={() => setConfirm(row)}>Sil</Button>
            </div>
          )},
        ]}
        renderForm={(editing, setEditing) => (
          <>
            <Input
              label="Grup adı"
              value={editing.groupName}
              onChange={(e) => setEditing({ ...editing, groupName: e.target.value })}
              required
              hint="destinations, preferences, durations, budgetRanges, contactPreferences veya survey.groupTypes, survey.travelPreferences, survey.otherPreferences"
              list="form-option-groups"
            />
            <datalist id="form-option-groups">
              {groups.map((g) => <option key={g} value={g} />)}
            </datalist>
            <Input label="Değer (value)" value={editing.value} onChange={(e) => setEditing({ ...editing, value: e.target.value })} required hint="kodda kullanılır, ör. spain" />
            <Input label="Etiket" value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Sıra" type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })} />
              <div className="flex items-end">
                <Checkbox label="Aktif" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
              </div>
            </div>
          </>
        )}
      />
    </>
  );
};

export default FormOptionsAdminPage;
