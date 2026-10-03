// ============================================================
// WeGrow Mobile — Auth Context
// ============================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, ApiError } from '../services/api';
import { UserSession, Language } from '../types/api';

interface AuthContextType {
  session: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<UserSession>;
  logout: () => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
  clearSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const stored = await AsyncStorage.getItem('user_session');
      if (!stored) {
        setIsLoading(false);
        return;
      }
      const parsed: UserSession = JSON.parse(stored);

      // Validate session is still alive
      try {
        const me = await api.auth.me();
        // Merge in case role/status changed server-side
        const restored: UserSession = {
          ...parsed,
          role: me.role,
          is_verified: me.is_verified,
          phone_masked: me.phone_masked,
        };
        setSession(restored);
        await AsyncStorage.setItem('user_session', JSON.stringify(restored));
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          await clearSession();
        }
      }
    } catch {
      // Corrupt storage
      await clearSession();
    } finally {
      setIsLoading(false);
    }
  }

  async function login(phone: string) {
    await api.auth.requestOtp(phone);
  }

  async function verifyOtp(phone: string, otp: string): Promise<UserSession> {
    const resp = await api.auth.verifyOtp(phone, otp);

    const lang = (await AsyncStorage.getItem('preferred_language') as Language) ?? 'english';

    const newSession: UserSession = {
      user_id: resp.user_id,
      role: resp.role,
      is_verified: resp.is_verified,
      phone_masked: resp.phone_masked,
      access_token: resp.access_token,
      preferred_language: lang,
    };

    await AsyncStorage.setItem('access_token', resp.access_token);
    await AsyncStorage.setItem('user_session', JSON.stringify(newSession));
    setSession(newSession);
    return newSession;
  }

  async function logout() {
    try {
      await api.auth.logout();
    } catch {
      // best-effort logout
    }
    await clearSession();
  }

  async function setLanguage(lang: Language) {
    await AsyncStorage.setItem('preferred_language', lang);
    if (session) {
      const updated = { ...session, preferred_language: lang };
      setSession(updated);
      await AsyncStorage.setItem('user_session', JSON.stringify(updated));
    }
  }

  async function clearSession() {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user_session');
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isAuthenticated: !!session,
        login,
        verifyOtp,
        logout,
        setLanguage,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
