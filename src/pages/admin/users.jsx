import { useCrudResource } from '../../hooks/useCrudResource';
import CrudPage from '../../components/admin/CrudPage';
import { Button, Checkbox, Input, Select } from '../../components/admin/ui';
import { useAuth } from '../../context/AuthContext';

const emptyUser = { email: '', name: '', role: 'VIEWER', active: true, password: '' };

const UsersAdminPage = () => {
  const { user: me } = useAuth();
  const r = useCrudResource({
    endpoint: '/users',
    empty: emptyUser,
    stripFields: ['id', 'createdAt', 'updatedAt', 'lastLogin', 'lastLoginIp', 'failedLogins', 'lockedUntil'],
  });

  // On update, strip empty password so we don't send a blank field that the
  // backend would either reject or hash into a useless value.
  const transformPayload = (record) => {
    const next = { ...record };
    if (next.id && !next.password) delete next.password;
    return next;
  };

  return (
    <CrudPage
      resource={r}
      transformPayload={transformPayload}
      title="Kullanıcılar"
      description="Admin paneli kullanıcıları. VIEWER okur, EDITOR içerik düzenler, ADMIN her şey."
      createLabel="+ Yeni Kullanıcı"
      rowKeyLabel="Kullanıcı"
      confirmMessage={(row) => `"${row.email}" kullanıcısını silmek istiyor musunuz?`}
      columns={({ openEdit, setConfirm }) => [
        { key: 'email', label: 'E-posta' },
        { key: 'name', label: 'İsim' },
        { key: 'role', label: 'Rol', render: (r) => <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{r.role}</span> },
        { key: 'active', label: 'Aktif', className: 'w-16 text-center', render: (r) => (
          <span className="flex flex-col items-center">
            <span>{r.active ? '✓' : '—'}</span>
            {r.lockedUntil && new Date(r.lockedUntil) > new Date() && (
              <span className="text-xs text-red-500">kilitli</span>
            )}
          </span>
        )},
        { key: 'lastLogin', label: 'Son giriş', render: (r) => r.lastLogin ? new Date(r.lastLogin).toLocaleString('tr-TR') : '—' },
        { key: 'actions', label: '', className: 'text-right whitespace-nowrap', render: (r) => (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="secondary" onClick={() => openEdit({ ...r, password: '' })}>Düzenle</Button>
            <Button size="sm" variant="danger" onClick={() => setConfirm(r)} disabled={r.id === me?.id}>Sil</Button>
          </div>
        )},
      ]}
      renderForm={(editing, setEditing) => (
        <>
          <Input label="E-posta" type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} required />
          <Input label="İsim" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          <Select label="Rol" value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })}>
            <option value="VIEWER">VIEWER — Sadece okur</option>
            <option value="EDITOR">EDITOR — İçerik düzenler</option>
            <option value="ADMIN">ADMIN — Tüm yetkiler</option>
          </Select>
          <Input
            label={editing.id ? 'Yeni şifre (boş bırak değiştirme)' : 'Şifre'}
            type="password"
            value={editing.password || ''}
            onChange={(e) => setEditing({ ...editing, password: e.target.value })}
            required={!editing.id}
            minLength={8}
            autoComplete="new-password"
          />
          <Checkbox label="Aktif" checked={!!editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
          {editing.id && editing.lockedUntil && new Date(editing.lockedUntil) > new Date() && (
            <Checkbox
              label={`Kilidi aç (şu an kilitli: ${new Date(editing.lockedUntil).toLocaleString('tr-TR')})`}
              checked={!!editing.unlock}
              onChange={(e) => setEditing({ ...editing, unlock: e.target.checked })}
            />
          )}
        </>
      )}
    />
  );
};

export default UsersAdminPage;
