import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type User = { email: string } | null;
type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER = { email: 'user@example.com', password: 'password123' };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Inicializamos desde localStorage sincrónicamente para persistir sesión tras recarga
  const [user, setUser] = useState<User>(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });

  // Sincroniza sesión entre pestañas/ventanas
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_user') {
        try {
          setUser(e.newValue ? (JSON.parse(e.newValue) as User) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock auth: accept stored user or default user
    const registered = JSON.parse(localStorage.getItem('registered_user') || 'null') as { email: string; password: string } | null;
    const match = (registered && registered.email === email && registered.password === password) ||
      (email === DEFAULT_USER.email && password === DEFAULT_USER.password);
    await new Promise((r) => setTimeout(r, 400));
    if (!match) throw new Error('Invalid credentials');
    const u = { email };
    setUser(u);
    localStorage.setItem('auth_user', JSON.stringify(u));
  };

  const register = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    localStorage.setItem('registered_user', JSON.stringify({ email, password }));
    // auto-login for better UX
    const u = { email };
    setUser(u);
    localStorage.setItem('auth_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const value = useMemo<AuthContextType>(() => ({ user, login, register, logout, isAuthenticated: !!user }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
