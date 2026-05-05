import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { UIProvider } from './UIContext';
import { SchedulerProvider } from './SchedulerContext';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UIProvider>
          <SchedulerProvider>
            {children}
          </SchedulerProvider>
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
