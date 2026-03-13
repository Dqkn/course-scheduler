import { Outlet } from 'react-router';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/Header';

export function Root() {
  return (
    <AppProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </AppProvider>
  );
}
