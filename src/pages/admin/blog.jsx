import { useCrudResource } from '../../hooks/useCrudResource';
import CrudPage from '../../components/admin/CrudPage';
import { Button, Checkbox, Input, Textarea } from '../../components/admin/ui';
import { ImagePicker } from '../../components/admin/ImagePicker';

const emptyPost = {
  slug: '', title: '', summary: '', content: '', coverImage: '',
  category: '', date: '', author: '', active: true, order: 0,
};

const BlogAdminPage = () => {
  const r = useCrudResource({ endpoint: '/blog', empty: emptyPost });

  return (
    <CrudPage
      resource={r}
      title="Blog"
      description="Blog yazıları"
      createLabel="+ Yeni Yazı"
      rowKeyLabel="Yazı"
      wide
      confirmMessage={(row) => `"${row.title}" yazısını silmek istiyor musunuz?`}
      columns={({ openEdit, setConfirm }) => [
        { key: 'title', label: 'Başlık', render: (r) => (
          <div>
            <div className="font-medium text-slate-800">{r.title}</div>
            <div className="text-xs text-slate-500">/{r.slug}</div>
          </div>
        )},
        { key: 'category', label: 'Kategori' },
        { key: 'author', label: 'Yazar' },
        { key: 'date', label: 'Tarih' },
        { key: 'active', label: 'Aktif', render: (r) => (r.active ? '✓' : '—') },
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
            <Input label="Slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} required />
          </div>
          <Textarea label="Özet" value={editing.summary || ''} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} rows={2} />
          <Textarea label="İçerik (markdown desteklenir)" value={editing.content || ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={10} />
          <ImagePicker label="Kapak görseli" value={editing.coverImage} onChange={(p) => setEditing({ ...editing, coverImage: p })} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Input label="Kategori" value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            <Input label="Yazar" value={editing.author || ''} onChange={(e) => setEditing({ ...editing, author: e.target.value })} />
            <Input label="Tarih (görünüm)" value={editing.date || ''} onChange={(e) => setEditing({ ...editing, date: e.target.value })} placeholder="15 Mayıs 2023" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
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

export default BlogAdminPage;
