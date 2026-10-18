'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DbUser } from '@/lib/d1';

interface AuthContextType {
  user: DbUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  loginWithGoogleToken: (credential: string) => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  loginWithDemo: () => Promise<{ success: boolean; isNewUser?: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const loginWithGoogleToken = async (credential: string) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setIsLoginModalOpen(false);
        return { success: true, isNewUser: data.isNewUser };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const loginWithDemo = async () => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demoUser: true }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        setIsLoginModalOpen(false);
        return { success: true, isNewUser: data.isNewUser };
      }
      return { success: false, error: data.error || 'Demo login failed' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        loginWithGoogleToken,
        loginWithDemo,
        logout,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
