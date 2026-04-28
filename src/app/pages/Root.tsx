import { Outlet } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { LocaleProvider } from '../i18n';
import { Header } from '../components/Header';

export function Root() {
  return (
    <LocaleProvider>
      <AppProvider>
        <div className="h-screen flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
            <Outlet />
          </main>
        </div>
      </AppProvider>
    </LocaleProvider>
  );
}
