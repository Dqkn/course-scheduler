import { Moon, Sun, Calendar, ChevronDown, Bell, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useApp, UserRole } from '../context/AppContext';
import { useState } from 'react';

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Admin · Faculty Secretariat', color: 'bg-violet-500' },
  academic: { label: 'Academic · Dr. Maria Garcia', color: 'bg-teal-500' },
  student: { label: 'Student · 2nd Year CS', color: 'bg-blue-500' },
};

export function Header() {
  const { darkMode, toggleDarkMode, userRole, setUserRole, publishedAt } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const isLanding = location.pathname === '/';

  function switchRole(role: UserRole) {
    setUserRole(role);
    setRoleMenuOpen(false);
    const paths: Record<UserRole, string> = {
      admin: '/admin',
      academic: '/academic',
      student: '/student',
    };
    navigate(paths[role]);
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
        className="flex items-center gap-2.5 select-none"
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
      {!isLanding && (
        <nav className="hidden md:flex items-center gap-1">
          {(['admin', 'academic', 'student'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
              style={{
                backgroundColor:
                  userRole === role
                    ? darkMode ? '#1e293b' : '#f1f5f9'
                    : 'transparent',
                color:
                  userRole === role
                    ? darkMode ? '#f1f5f9' : '#0f172a'
                    : darkMode ? '#94a3b8' : '#64748b',
              }}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
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

        {/* Role switcher (mobile) */}
        {!isLanding && (
          <div className="relative md:hidden">
            <button
              onClick={() => setRoleMenuOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
                color: darkMode ? '#f1f5f9' : '#0f172a',
              }}
            >
              <span
                className={`w-2 h-2 rounded-full ${ROLE_CONFIG[userRole].color}`}
              />
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              <ChevronDown className="w-3 h-3" />
            </button>
            {roleMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-44 rounded-xl shadow-xl border py-1 z-50"
                style={{
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#e2e8f0',
                }}
              >
                {(['admin', 'academic', 'student'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-medium transition-colors hover:opacity-80"
                    style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                  >
                    <span className={`w-2 h-2 rounded-full ${ROLE_CONFIG[role].color}`} />
                    {ROLE_CONFIG[role].label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User avatar */}
        {!isLanding && (
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            style={{
              background: userRole === 'admin'
                ? 'linear-gradient(135deg, #7c3aed, #4f46e5)'
                : userRole === 'academic'
                  ? 'linear-gradient(135deg, #0d9488, #0891b2)'
                  : 'linear-gradient(135deg, #2563eb, #4f46e5)',
            }}
          >
            {userRole === 'admin' ? 'FS' : userRole === 'academic' ? 'MG' : 'S'}
          </button>
        )}
      </div>
    </header>
  );
}
