import { useState, useCallback } from 'react';

interface AuthUser {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const accessToken = localStorage.getItem('admin_access_token');
      const refreshToken = localStorage.getItem('admin_refresh_token');
      const userStr = localStorage.getItem('admin_user');
      const user = userStr ? JSON.parse(userStr) : null;
      return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken && !!user,
        isLoading: false,
      };
    } catch {
      // Corrupted localStorage — clear and start fresh
      localStorage.removeItem('admin_access_token');
      localStorage.removeItem('admin_refresh_token');
      localStorage.removeItem('admin_user');
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    }
  });

  const login = useCallback(async (email: string, password: string) => {
    setState(s => ({ ...s, isLoading: true }));
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(body.error || 'Login failed');
      }
      const data = await res.json();
      localStorage.setItem('admin_access_token', data.accessToken);
      localStorage.setItem('admin_refresh_token', data.refreshToken);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      setState({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err) {
      setState(s => ({ ...s, isLoading: false }));
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('admin_refresh_token');
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
    } catch { /* ignore */ }
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('admin_access_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    let res = await fetch(url, { ...options, headers });

    // If 401, try refreshing the token
    if (res.status === 401) {
      const rToken = localStorage.getItem('admin_refresh_token');
      if (rToken) {
        const refreshRes = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: rToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem('admin_access_token', data.accessToken);
          headers.Authorization = `Bearer ${data.accessToken}`;
          res = await fetch(url, { ...options, headers });
        } else {
          await logout();
          throw new Error('Session expired');
        }
      }
    }
    return res;
  }, [logout]);

  return { ...state, login, logout, authFetch };
}
