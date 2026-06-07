import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

const ROLE_RANK = { VIEWER: 1, EDITOR: 2, ADMIN: 3 };
// Marker in sessionStorage so anonymous public visitors don't poll /auth/me.
const LOGGED_IN_HINT = 'endulus.session';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  const fetchMe = useCallback(async () => {
    // We can't read HttpOnly cookies from JS, but we can leave a tiny hint in
    // sessionStorage after a successful login so subsequent page-loads will
    // skip /auth/me when the user has never logged in.
    const hint = typeof window !== 'undefined' && sessionStorage.getItem(LOGGED_IN_HINT);
    if (!hint) {
      if (mounted.current) setUser(null);
      return null;
    }
    try {
      const { user: me } = await api.get('/auth/me', { skipRefresh: true });
      if (mounted.current) setUser(me);
      return me;
    } catch {
      try { sessionStorage.removeItem(LOGGED_IN_HINT); } catch { /* ignore */ }
      if (mounted.current) setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchMe().finally(() => mounted.current && setLoading(false));
  }, [fetchMe]);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setUser(data.user);
    try { sessionStorage.setItem(LOGGED_IN_HINT, '1'); } catch { /* ignore */ }
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout', {}); } catch { /* ignore */ }
    try { sessionStorage.removeItem(LOGGED_IN_HINT); } catch { /* ignore */ }
    setUser(null);
  }, []);

  const can = useCallback(
    (minRole) => {
      if (!user) return false;
      return (ROLE_RANK[user.role] || 0) >= (ROLE_RANK[minRole] || 0);
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh: fetchMe, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
