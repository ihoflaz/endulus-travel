import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useMemo, useState } from 'react';

const NAV = [
  { to: '/admin', label: 'Panel', exact: true, group: 'genel' },
  { to: '/admin/messages', label: 'Mesajlar', group: 'genel' },
  { to: '/admin/tours', label: 'Turlar', group: 'icerik' },
  { to: '/admin/blog', label: 'Blog', group: 'icerik' },
  { to: '/admin/services', label: 'Hizmetler', group: 'icerik' },
  { to: '/admin/women-groups', label: 'Kadın Grupları', group: 'icerik' },
  { to: '/admin/budget-routes', label: 'Bütçe Rotaları', group: 'icerik' },
  { to: '/admin/tour-wizard', label: 'Tur Sihirbazı', group: 'icerik' },
  { to: '/admin/hero', label: 'Anasayfa Hero', group: 'sayfalar' },
  { to: '/admin/about', label: 'Hakkımızda', group: 'sayfalar' },
  { to: '/admin/contact', label: 'İletişim', group: 'sayfalar' },
  { to: '/admin/site', label: 'Site & SEO', group: 'sayfalar' },
  { to: '/admin/legal', label: 'Yasal Sayfalar', group: 'sayfalar' },
  { to: '/admin/categories', label: 'Kategoriler', group: 'taksonomi' },
  { to: '/admin/form-options', label: 'Form Seçenekleri', group: 'taksonomi' },
  { to: '/admin/media', label: 'Medya', group: 'taksonomi' },
  { to: '/admin/users', label: 'Kullanıcılar', group: 'sistem', adminOnly: true },
  { to: '/admin/audit', label: 'Etkinlik Günlüğü', group: 'sistem', adminOnly: true },
  { to: '/admin/profile', label: 'Profilim', group: 'sistem' },
];

const GROUP_LABELS = {
  genel: 'Genel',
  icerik: 'İçerik',
  sayfalar: 'Sayfalar & SEO',
  taksonomi: 'Taksonomi',
  sistem: 'Sistem',
};

const AdminLayout = () => {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer on every route change (programmatic or otherwise)
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Esc closes the mobile drawer
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const navItems = useMemo(
    () => NAV.filter((item) => !item.adminOnly || can('ADMIN')),
    [can]
  );

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Menüyü aç/kapat"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-semibold tracking-tight">Endülüs Travel — Admin</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:inline">
              {user?.email} <span className="ml-1 rounded bg-slate-100 px-2 py-0.5 text-xs">{user?.role}</span>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`${open ? 'block' : 'hidden'} fixed inset-y-14 left-0 z-30 w-64 overflow-y-auto border-r border-slate-200 bg-white p-3 md:sticky md:top-14 md:block md:h-[calc(100vh-3.5rem)]`}
        >
          <nav className="flex flex-col gap-3">
            {Object.entries(GROUP_LABELS).map(([groupKey, groupLabel]) => {
              const groupItems = navItems.filter((it) => it.group === groupKey);
              if (groupItems.length === 0) return null;
              return (
                <div key={groupKey}>
                  <div className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {groupLabel}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {groupItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.exact}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `rounded-md px-3 py-2 text-sm transition ${
                            isActive
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
