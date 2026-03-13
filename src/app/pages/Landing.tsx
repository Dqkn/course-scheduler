import { useNavigate } from 'react-router';
import { Shield, BookOpen, GraduationCap, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useApp, UserRole } from '../context/AppContext';

const ROLES = [
  {
    role: 'admin' as UserRole,
    path: '/admin',
    icon: Shield,
    label: 'Admin',
    sublabel: 'Faculty Secretariat',
    description: 'View the full programme at a glance, manage conflicts, and publish the final schedule.',
    features: ['Full weekly grid view', 'Conflict detection & resolution', 'Publish & export'],
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glowColor: 'rgba(99,102,241,0.3)',
    tagColor: { bg: '#ede9fe', text: '#5b21b6' },
    tagColorDark: { bg: '#2e1065', text: '#c4b5fd' },
  },
  {
    role: 'academic' as UserRole,
    path: '/academic',
    icon: BookOpen,
    label: 'Academic',
    sublabel: 'Lecturer',
    description: 'View your personal weekly teaching schedule with class timings and room details.',
    features: ['Personal calendar view', 'Class & room information', 'Weekly teaching summary'],
    gradient: 'linear-gradient(135deg, #0891b2, #0d9488)',
    glowColor: 'rgba(8,145,178,0.3)',
    tagColor: { bg: '#ccfbf1', text: '#115e59' },
    tagColorDark: { bg: '#042f2e', text: '#5eead4' },
  },
  {
    role: 'student' as UserRole,
    path: '/student',
    icon: GraduationCap,
    label: 'Student',
    sublabel: '2nd Year CS',
    description: 'Access your class-level course schedule through a clean, mobile-friendly interface.',
    features: ['Class-level schedule', 'Mobile-friendly design', 'Daily view & reminders'],
    gradient: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    glowColor: 'rgba(37,99,235,0.3)',
    tagColor: { bg: '#dbeafe', text: '#1e40af' },
    tagColorDark: { bg: '#172554', text: '#93c5fd' },
  },
];

export function Landing() {
  const navigate = useNavigate();
  const { darkMode, setUserRole } = useApp();

  function enter(role: UserRole, path: string) {
    setUserRole(role);
    navigate(path);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: darkMode ? '#050c1a' : '#f8faff' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: darkMode
            ? 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(8,145,178,0.06) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(8,145,178,0.05) 0%, transparent 60%)',
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(${darkMode ? '#1e293b' : '#e2e8f0'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#1e293b' : '#e2e8f0'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />

      {/* Logo + title */}
      <div className="relative flex flex-col items-center mb-12">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-xl"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <Calendar className="w-8 h-8 text-white" />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: darkMode ? '#f1f5f9' : '#0f172a',
              lineHeight: 1,
            }}
          >
            OptiSched
          </h1>
          <Sparkles className="w-5 h-5 text-violet-500 mb-1" />
        </div>

        <p
          style={{
            fontSize: '1rem',
            color: darkMode ? '#94a3b8' : '#64748b',
            textAlign: 'center',
            maxWidth: 420,
            lineHeight: 1.6,
          }}
        >
          Intelligent Schedule Management for Modern Universities.
          Choose your role to get started.
        </p>

        {/* Term badge */}
        <div
          className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{
            borderColor: darkMode ? '#334155' : '#e2e8f0',
            color: darkMode ? '#94a3b8' : '#64748b',
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Spring Term 2026 · Week 10 of 15
        </div>
      </div>

      {/* Role cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl">
        {ROLES.map(r => {
          const Icon = r.icon;
          const tag = darkMode ? r.tagColorDark : r.tagColor;
          return (
            <button
              key={r.role}
              onClick={() => enter(r.role, r.path)}
              className="group text-left rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                boxShadow: darkMode
                  ? `0 0 0 0 ${r.glowColor}`
                  : '0 1px 3px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${r.glowColor}, 0 0 0 1px ${r.glowColor}`;
                (e.currentTarget as HTMLElement).style.borderColor = r.glowColor;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = darkMode
                  ? `0 0 0 0 ${r.glowColor}`
                  : '0 1px 3px rgba(0,0,0,0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = darkMode ? '#1e293b' : '#e2e8f0';
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md"
                style={{ background: r.gradient }}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Label */}
              <div className="flex items-start justify-between mb-1">
                <div>
                  <span
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: darkMode ? '#f1f5f9' : '#0f172a',
                      display: 'block',
                      lineHeight: 1.2,
                    }}
                  >
                    {r.label}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: darkMode ? '#64748b' : '#94a3b8',
                    }}
                  >
                    {r.sublabel}
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold mt-0.5"
                  style={{ backgroundColor: tag.bg, color: tag.text }}
                >
                  {r.role.toUpperCase()}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '12px',
                  color: darkMode ? '#94a3b8' : '#64748b',
                  lineHeight: 1.6,
                  marginTop: 10,
                  marginBottom: 14,
                }}
              >
                {r.description}
              </p>

              {/* Features */}
              <ul className="space-y-1.5 mb-5">
                {r.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ backgroundColor: tag.text }}
                    />
                    <span style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#64748b' }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div
                className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all"
                style={{ color: tag.text }}
              >
                Enter as {r.label}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <p
        className="relative mt-10 text-center"
        style={{ fontSize: '11px', color: darkMode ? '#334155' : '#cbd5e1' }}
      >
        OptiSched v1.0 · Spring 2026 · Faculty of Computing
      </p>
    </div>
  );
}
