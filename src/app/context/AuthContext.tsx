import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Account } from '../types/authTypes';
import * as authService from '../services/authService';

export type { Account };

interface AuthContextType {
  currentUser: Account | null;
  /** Resolves true on success, false on bad credentials. Throws on network errors. */
  login: (id: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const USER_CACHE_KEY = 'optisched-user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Restore the cached account for instant UI on refresh. The auth token lives
  // separately (see apiClient) and is what actually authorizes API requests.
  const [currentUser, setCurrentUser] = useState<Account | null>(() => {
    try {
      const stored = localStorage.getItem(USER_CACHE_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Reject stale/incompatible cached shapes (e.g. pre-backend-alignment
      // accounts that lack user_id/full_name) so a bad cache can never crash the app.
      if (parsed && typeof parsed.user_id === 'number' && typeof parsed.full_name === 'string') {
        return parsed as Account;
      }
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    } catch {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }
  });

  const login = useCallback(async (id: string, pass: string) => {
    const account = await authService.login(id, pass);
    if (account) {
      setCurrentUser(account);
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(account));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
    localStorage.removeItem(USER_CACHE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
