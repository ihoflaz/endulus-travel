import { useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, PageHeader, ToastStack, useToast } from '../../components/admin/ui';
import { useNavigate } from 'react-router-dom';

const ProfileAdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { items: toastItems, show, dismiss } = useToast();
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (newPassword !== confirmPassword) {
      show('Yeni şifreler eşleşmiyor', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      show('Şifre güncellendi. Tekrar giriş yapın.');
      setTimeout(async () => {
        await logout();
        navigate('/admin/login');
      }, 1200);
    } catch (e) {
      const details = e?.body?.details?.fieldErrors;
      const firstError = details && Object.values(details).flat()[0];
      show(firstError || e?.body?.error || e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Profilim" description="Hesap bilgilerin ve şifre değişikliği" />

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <div className="grid gap-2 sm:grid-cols-3">
          <div><span className="text-slate-500">E-posta:</span> {user?.email}</div>
          <div><span className="text-slate-500">İsim:</span> {user?.name || '—'}</div>
          <div><span className="text-slate-500">Rol:</span> <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{user?.role}</span></div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 max-w-md">
        <h2 className="text-base font-semibold text-slate-800">Şifre Değiştir</h2>
        <Input
          label="Mevcut Şifre"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
        <Input
          label="Yeni Şifre"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          hint="En az 10 karakter, 1 harf, 1 rakam, 1 sembol"
        />
        <Input
          label="Yeni Şifre (tekrar)"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button onClick={submit} disabled={saving || !currentPassword || !newPassword}>
          {saving ? 'Kaydediliyor…' : 'Şifremi Değiştir'}
        </Button>
        <p className="text-xs text-slate-500">
          Şifre değiştikten sonra otomatik çıkış yapılır — tüm aktif oturumların sonlandırılır.
        </p>
      </form>

      <ToastStack items={toastItems} onDismiss={dismiss} />
    </div>
  );
};

export default ProfileAdminPage;
