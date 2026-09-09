import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  lastLogin: string;
}

export const DEMO_CREDENTIALS = {
  email: 'admin@myplanetservices.com',
  password: 'mps@admin2026',
  name: 'Vivek Kumar (Lead Admin)',
  role: 'Studio Founder & Executive',
};

const STORAGE_KEY = 'mps_admin_session';

export function getAdminSession(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session.user || null;
  } catch (e) {
    console.error('Error reading admin session:', e);
    return null;
  }
}

export function saveAdminSession(user: AdminUser): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user,
        timestamp: Date.now(),
      })
    );
  } catch (e) {
    console.error('Error saving admin session:', e);
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing admin session:', e);
  }
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(() => getAdminSession());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getAdminSession());
    setLoading(false);
  }, []);

  const login = (email: string, pass: string): boolean => {
    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase() &&
      pass === DEMO_CREDENTIALS.password
    ) {
      const newUser: AdminUser = {
        email: DEMO_CREDENTIALS.email,
        name: DEMO_CREDENTIALS.name,
        role: DEMO_CREDENTIALS.role,
        lastLogin: new Date().toISOString(),
      };
      saveAdminSession(newUser);
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearAdminSession();
    setUser(null);
  };

  return { user, isAuthenticated: !!user, loading, login, logout };
}

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-butter border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
