import { useCrudResource } from '../../hooks/useCrudResource';
import CrudPage from '../../components/admin/CrudPage';
import { Button, Checkbox, Input, Select, Textarea } from '../../components/admin/ui';

const emptyReview = {
  authorName: '',
  location: '',
  tourSlug: '',
  rating: 5,
  content: '',
  isPublished: false,
  order: 0,
};

const ReviewsAdmin = () => {
  const r = useCrudResource({ endpoint: '/reviews', empty: emptyReview });

  return (
    <CrudPage
      resource={r}
      title="Yorumlar"
      description="Müşteri yorumları (değerlendirmeler)"
      createLabel="+ Yeni Yorum"
      rowKeyLabel="Yorum"
      confirmMessage={(row) => `"${row.authorName}" yorumunu silmek istiyor musunuz?`}
      transformPayload={(rec) => ({
        ...rec,
        rating: Number(rec.rating) || 0,
        order: Number(rec.order) || 0,
      })}
      columns={({ openEdit, setConfirm }) => [
        { key: 'authorName', label: 'Yazar', render: (r) => (
          <div>
            <div className="font-medium">{r.authorName}</div>
            {r.location && <div className="text-xs text-slate-500">{r.location}</div>}
          </div>
        )},
        { key: 'rating', label: 'Puan', className: 'w-20 text-center', render: (r) => `${r.rating} ★` },
        { key: 'tourSlug', label: 'Tur', render: (r) => (r.tourSlug ? r.tourSlug : 'Genel') },
        { key: 'isPublished', label: 'Yayında', className: 'w-20 text-center', render: (r) => (r.isPublished ? '✓' : '—') },
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
            label="Yazar adı"
            value={editing.authorName}
            onChange={(e) => setEditing({ ...editing, authorName: e.target.value })}
            required
          />
          <Input
            label="Konum"
            value={editing.location || ''}
            onChange={(e) => setEditing({ ...editing, location: e.target.value })}
            hint="ör. İstanbul, Türkiye"
          />
          <Input
            label="Tur (slug)"
            value={editing.tourSlug || ''}
            onChange={(e) => setEditing({ ...editing, tourSlug: e.target.value })}
            hint="Boş bırakılırsa yorum site genelinde gösterilir"
          />
          <Select
            label="Puan"
            value={editing.rating ?? 5}
            onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </Select>
          <Textarea
            label="Yorum"
            value={editing.content || ''}
            onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            rows={4}
            required
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
                label="Yayında"
                checked={!!editing.isPublished}
                onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
              />
            </div>
          </div>
        </>
      )}
    />
  );
};

export default ReviewsAdmin;
