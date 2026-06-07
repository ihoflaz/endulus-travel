import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';

const Stat = ({ label, value, to, highlight }) => (
  <Link
    to={to}
    className={`rounded-xl border bg-white p-4 transition hover:shadow-sm ${
      highlight ? 'border-amber-300 bg-amber-50 hover:border-amber-400' : 'border-slate-200 hover:border-slate-300'
    }`}
  >
    <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
    <div className="mt-2 text-2xl font-semibold text-slate-900">{value ?? '—'}</div>
  </Link>
);

const ENDPOINTS = [
  ['tours', '/tours', (r) => r?.featured?.length ?? 0],
  ['blog', '/blog', (r) => r?.length ?? 0],
  ['services', '/services?isWomenGroup=false', (r) => r?.length ?? 0],
  ['categories', '/categories', (r) => r?.length ?? 0],
  ['budget', '/budget-routes', (r) => r?.length ?? 0],
  ['wizard', '/tour-wizard', (r) => r?.length ?? 0],
  ['heroSlides', '/hero', (r) => r?.slides?.length ?? 0],
  ['messages', '/messages?status=NEW&take=1', (r) => r?.total ?? 0],
];

const DashboardPage = () => {
  const [counts, setCounts] = useState({});
  const [errors, setErrors] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const results = await Promise.allSettled(
        ENDPOINTS.map(([, path]) => api.get(path))
      );
      if (cancelled) return;
      const next = {};
      const errs = [];
      results.forEach((res, idx) => {
        const [key, path, project] = ENDPOINTS[idx];
        if (res.status === 'fulfilled') next[key] = project(res.value);
        else errs.push({ path, message: res.reason?.message || 'Hata' });
      });
      setCounts(next);
      setErrors(errs);
      // Also try to fetch recent activity for ADMINs (silently ignore if not authorized)
      try {
        const audit = await api.get('/audit?take=8');
        if (!cancelled) setRecent(audit?.items || []);
      } catch { /* viewer/editor — no access */ }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-slate-900">Panel</h1>
      <p className="mb-6 text-sm text-slate-500">
        Sitedeki tüm içerikleri buradan yönetebilirsiniz.
      </p>

      {loading ? (
        <div className="text-slate-500">Yükleniyor…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Stat label="Yeni mesajlar" value={counts.messages} to="/admin/messages" highlight={counts.messages > 0} />
            <Stat label="Tur" value={counts.tours} to="/admin/tours" />
            <Stat label="Blog yazısı" value={counts.blog} to="/admin/blog" />
            <Stat label="Hizmet" value={counts.services} to="/admin/services" />
            <Stat label="Kategori" value={counts.categories} to="/admin/categories" />
            <Stat label="Bütçe Rotası" value={counts.budget} to="/admin/budget-routes" />
            <Stat label="Sihirbaz Adımı" value={counts.wizard} to="/admin/tour-wizard" />
            <Stat label="Hero Slide" value={counts.heroSlides} to="/admin/hero" />
          </div>

          {recent.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Son Etkinlikler</h2>
              <div className="rounded-xl border border-slate-200 bg-white">
                <ul className="divide-y divide-slate-100 text-sm">
                  {recent.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{r.action}</code>
                        <span className="text-slate-700">{r.entity}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{r.user?.email || '—'}</span>
                      </div>
                      <time className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleString('tr-TR')}</time>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {errors.length > 0 && (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <strong>Bazı veriler yüklenemedi:</strong>
              <ul className="mt-1 list-disc pl-5">
                {errors.map((e) => <li key={e.path}>{e.path}: {e.message}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
