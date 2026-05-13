import { Moon, Sun, Calendar, Bell, LogOut, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';
import { useState } from 'react';

export function Header() {
  const { darkMode, toggleDarkMode, currentUser, logout, publishedAt } = useApp();
  const { locale, setLocale, t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  }

  // ── Light-mode friendly colors ──
  const border = darkMode ? '#1e293b' : '#d1d5db';
  const surface = darkMode ? '#0f172a' : '#ffffff';
  const textPrimary = darkMode ? '#f1f5f9' : '#1a1a2e';
  const textMuted = darkMode ? '#94a3b8' : '#475569';
  const pillBg = darkMode ? '#1e293b' : '#f0f0f0';

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-5 h-14 border-b"
      style={{ backgroundColor: surface, borderColor: border }}
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
          style={{ fontSize: '1rem', fontWeight: 700, color: textPrimary }}
        >
          OptiSched
        </span>
        <span
          className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold"
          style={{ backgroundColor: pillBg, color: textMuted }}
        >
          {t.beta}
        </span>
      </button>

      {/* Nav links (non-landing) */}
      {!isLanding && currentUser && (
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => {
              if (currentUser.role === 'academic') navigate('/academic');
              else navigate('/admin');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              fontSize: '13px',
              backgroundColor:
                location.pathname === '/admin' || location.pathname === '/academic'
                  ? darkMode ? '#1e293b' : '#f0f0f0'
                  : 'transparent',
              color:
                location.pathname === '/admin' || location.pathname === '/academic'
                  ? textPrimary : textMuted,
            }}
          >
            {t.header.dashboard}
          </button>

          <div className="w-px h-5 mx-1" style={{ backgroundColor: border }} />

          <button
            onClick={() => navigate('/reservations')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              fontSize: '13px',
              backgroundColor:
                location.pathname === '/reservations'
                  ? darkMode ? '#312e81' : '#e0e7ff'
                  : 'transparent',
              color:
                location.pathname === '/reservations'
                  ? darkMode ? '#a5b4fc' : '#4338ca'
                  : textMuted,
            }}
          >
            <Calendar className="w-3.5 h-3.5" />
            {t.header.reservations}
          </button>

          <div className="w-px h-5 mx-1" style={{ backgroundColor: border }} />

          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              fontSize: '13px',
              backgroundColor:
                location.pathname === '/courses'
                  ? darkMode ? '#1e3a5f' : '#dbeafe'
                  : 'transparent',
              color:
                location.pathname === '/courses'
                  ? darkMode ? '#60a5fa' : '#2563eb'
                  : textMuted,
            }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t.header.courses}
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
              fontSize: '13px',
              backgroundColor: darkMode ? '#052e16' : '#dcfce7',
              color: darkMode ? '#4ade80' : '#166534',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {t.published}
          </span>
        )}

        {/* Notifications */}
        {!isLanding && currentUser && (
          <button
            className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: pillBg, color: textMuted }}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          </button>
        )}

        {/* Language toggle */}
        <button
          onClick={() => setLocale(locale === 'tr' ? 'en' : 'tr')}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-[11px] font-bold"
          style={{ backgroundColor: pillBg, color: textMuted }}
          title={locale === 'tr' ? 'Switch to English' : 'Türkçeye Geç'}
        >
          {locale === 'tr' ? 'EN' : 'TR'}
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: pillBg, color: textMuted }}
          title={darkMode ? t.header.lightMode : t.header.darkMode}
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
                backgroundColor: pillBg,
                border: `1px solid ${border}`,
              }}
            >
              <span className="text-xs font-semibold max-w-[120px] truncate" style={{ color: textPrimary, fontSize: '13px' }}>
                {currentUser.name}
              </span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border py-1.5 z-50 overflow-hidden"
                style={{ backgroundColor: surface, borderColor: border }}
              >
                <div className="px-3 py-2 border-b mb-1" style={{ borderColor: border }}>
                  <p className="text-xs font-semibold truncate" style={{ color: textPrimary, fontSize: '13px' }}>{currentUser.name}</p>
                  <p className="truncate uppercase tracking-wider mt-0.5" style={{ fontSize: '11px', color: textMuted }}>
                    {currentUser.role.replace('_', ' ')}
                  </p>
                </div>
                
                {/* Mobile Nav Links */}
                <div className="md:hidden">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      if (currentUser.role === 'academic') navigate('/academic');
                      else navigate('/admin');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left font-medium transition-colors hover:opacity-80"
                    style={{ color: textPrimary, fontSize: '13px' }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {t.header.dashboard}
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); navigate('/reservations'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left font-medium transition-colors hover:opacity-80"
                    style={{ color: textPrimary, fontSize: '13px' }}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {t.header.reservations}
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); navigate('/courses'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left font-medium transition-colors hover:opacity-80"
                    style={{ color: textPrimary, fontSize: '13px' }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {t.header.courses}
                  </button>
                  <div className="mx-3 my-1 border-t" style={{ borderColor: border }} />
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold transition-colors hover:bg-red-500/10 text-red-500"
                  style={{ fontSize: '13px' }}
                >
                  {t.header.signOut}
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
