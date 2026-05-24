'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.me();
      setUser(res.data as User);
    } catch {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      removeCookie('token');
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    const { token: newToken, user: newUser } = res.data as { token: string; user: User };
    localStorage.setItem('token', newToken);
    setCookie('token', newToken);
    setToken(newToken);
    setUser(newUser);
    window.location.href = '/';
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const res = await api.register({ first_name: firstName, last_name: lastName, email, password });
    const { token: newToken, user: newUser } = res.data as { token: string; user: User };
    localStorage.setItem('token', newToken);
    setCookie('token', newToken);
    setToken(newToken);
    setUser(newUser);
    window.location.href = '/';
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('token');
    removeCookie('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
