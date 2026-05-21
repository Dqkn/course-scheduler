import { AppProvider } from './AppProvider';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { useUI, type Filters } from './UIContext';
import { useScheduler } from './SchedulerContext';
import type { Account } from '../types/authTypes';

export type { Account, Filters };
export { AppProvider };

export function useApp() {
  const theme = useTheme();
  const auth = useAuth();
  const ui = useUI();
  const scheduler = useScheduler();

  return {
    ...theme,
    ...auth,
    ...ui,
    ...scheduler,
  };
}
