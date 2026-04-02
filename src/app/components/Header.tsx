import { Moon, Sun, Calendar, ChevronDown, Bell, LogOut, BookOpen, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { useState } from 'react';

export function Header() {
  const { darkMode, toggleDarkMode, currentUser, logout, publishedAt } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  }

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-5 h-14 border-b"
      style={{
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        borderColor: darkMode ? '#1e293b' : '#e2e8f0',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 select-none transition-transform hover:scale-105"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <Calendar className="w-4 h-4 text-white" />
        </div>
        <span
          className="tracking-tight"
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: darkMode ? '#f1f5f9' : '#0f172a',
          }}
        >
          OptiSched
        </span>
        <span
          className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold"
          style={{
            backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
            color: darkMode ? '#94a3b8' : '#64748b',
          }}
        >
          BETA
        </span>
      </button>

      {/* Nav links (non-landing) */}
      {!isLanding && currentUser && (
        <nav className="hidden md:flex items-center gap-2">
          {/* Dashboard link (Depends on Role) */}
          <button
            onClick={() => {
              if (currentUser.role === 'academic') navigate('/academic');
              else navigate('/admin');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              backgroundColor:
                location.pathname === '/admin' || location.pathname === '/academic'
                  ? darkMode ? '#1e293b' : '#f1f5f9'
                  : 'transparent',
              color:
                location.pathname === '/admin' || location.pathname === '/academic'
                  ? darkMode ? '#f1f5f9' : '#0f172a'
                  : darkMode ? '#94a3b8' : '#64748b',
            }}
          >
            Dashboard
          </button>

          {/* Divider */}
          <div
            className="w-px h-5 mx-1"
            style={{ backgroundColor: darkMode ? '#334155' : '#e2e8f0' }}
          />

          {/* Course Catalog link */}
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              backgroundColor:
                location.pathname === '/courses'
                  ? darkMode ? '#1e3a5f' : '#dbeafe'
                  : 'transparent',
              color:
                location.pathname === '/courses'
                  ? darkMode ? '#60a5fa' : '#2563eb'
                  : darkMode ? '#94a3b8' : '#64748b',
            }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Courses
          </button>
        </nav>
      )}

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Published badge */}
        {publishedAt && (
          <span
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: darkMode ? '#052e16' : '#dcfce7',
              color: darkMode ? '#4ade80' : '#166534',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Published
          </span>
        )}

        {/* Notifications */}
        {!isLanding && currentUser && (
          <button
            className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{
              backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
              color: darkMode ? '#94a3b8' : '#64748b',
            }}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{
            backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
            color: darkMode ? '#94a3b8' : '#64748b',
          }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User avatar & Menu */}
        {!isLanding && currentUser && (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(o => !o)}
              className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full transition-colors group"
              style={{
                 backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
                 border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
              }}
            >
              <span className="text-xs font-semibold max-w-[120px] truncate" style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                {currentUser.name}
              </span>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600"
              >
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border py-1.5 z-50 overflow-hidden"
                style={{
                  backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#e2e8f0',
                }}
              >
                <div className="px-3 py-2 border-b mb-1" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
                  <p className="text-xs font-semibold truncate" style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}>{currentUser.name}</p>
                  <p className="text-[10px] truncate uppercase tracking-wider mt-0.5" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                    {currentUser.role.replace('_', ' ')}
                  </p>
                </div>
                
                {/* Mobile Nav Links Backup */}
                <div className="md:hidden">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (currentUser.role === 'academic') navigate('/academic');
                      else navigate('/admin');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium transition-colors hover:opacity-80"
                    style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); navigate('/courses'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium transition-colors hover:opacity-80"
                    style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Courses
                  </button>
                  <div
                    className="mx-3 my-1 border-t"
                    style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}
                  />
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-3 py-2 text-left text-xs font-semibold transition-colors hover:bg-red-500/10 text-red-500"
                >
                  Sign out
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
