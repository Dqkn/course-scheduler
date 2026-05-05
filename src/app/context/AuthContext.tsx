import React, { createContext, useContext, useState, useCallback } from 'react';
import { Account, ALL_ACCOUNTS } from '../data/mockAccounts';

export type { Account };

interface AuthContextType {
  currentUser: Account | null;
  login: (id: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Account | null>(() => {
    const stored = localStorage.getItem('optisched-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((id: string, pass: string) => {
    const account = ALL_ACCOUNTS.find(a => a.id === id && a.password === pass);
    if (account) {
      setCurrentUser(account);
      localStorage.setItem('optisched-user', JSON.stringify(account));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('optisched-user');
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
