import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, minRole }) => {
  const { user, loading, can } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-500">Yükleniyor…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (minRole && !can(minRole)) {
    // Render the "forbidden" message inline so the user keeps the admin
    // sidebar/nav. Wrapped routes still render below us.
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <h1 className="text-lg font-semibold text-slate-800">Yetki Yok</h1>
        <p className="mt-1 text-sm text-slate-600">
          Bu sayfa için <strong>{minRole}</strong> yetkisi gerekiyor.
        </p>
      </div>
    );
  }

  return children;
};
