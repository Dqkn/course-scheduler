import { useNavigate } from 'react-router';
import { Shield, BookOpen, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';

type PortalRole = 'admin' | 'academic';

export function Landing() {
  const navigate = useNavigate();
  const { darkMode } = useApp();
  const { t } = useLocale();

  const ROLES = [
    {
      role: 'admin' as PortalRole,
      path: '/admin',
      icon: Shield,
      label: t.landing.adminLabel,
      sublabel: t.landing.adminSublabel,
      description: t.landing.adminDesc,
      features: t.landing.adminFeatures,
      enterLabel: t.landing.adminEnter,
      tag: t.landing.adminTag,
      gradient: 'var(--brand-gradient)',
      glowColor: 'var(--brand-glow)',
      tagColor: { bg: 'var(--brand-primary-soft)', text: 'var(--brand-primary-active)' },
      tagColorDark: { bg: '#2e1065', text: '#c4b5fd' },
    },
    {
      role: 'academic' as PortalRole,
      path: '/academic',
      icon: BookOpen,
      label: t.landing.academicLabel,
      sublabel: t.landing.academicSublabel,
      description: t.landing.academicDesc,
      features: t.landing.academicFeatures,
      enterLabel: t.landing.academicEnter,
      tag: t.landing.academicTag,
      gradient: 'var(--brand-gradient-accent)',
      glowColor: 'var(--brand-glow-accent)',
      tagColor: { bg: 'var(--brand-accent-soft)', text: 'var(--brand-accent)' },
      tagColorDark: { bg: '#042f2e', text: '#5eead4' },
    },
  ];

  function enter(path: string) {
    navigate(path);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-x-hidden overflow-y-auto"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: darkMode
            ? 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(8,145,178,0.06) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(8,145,178,0.03) 0%, transparent 60%)',
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(${darkMode ? '#1e293b' : '#e5e7eb'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? '#1e293b' : '#e5e7eb'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />

      {/* Logo + title */}
      <div className="relative flex flex-col items-center mb-12">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-xl"
          style={{ background: 'var(--logo-gradient)' }}
        >
          <Calendar className="w-8 h-8 text-white" />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            OptiSched
          </h1>
          <Sparkles
            className="w-5 h-5 mb-1"
            style={{ color: darkMode ? '#8b5cf6' : 'var(--brand-primary)' }}
          />
        </div>

        <p
          style={{
            fontSize: '1.05rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            maxWidth: 420,
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }}
        >
          {t.landing.subtitle}
        </p>

        {/* Term badge */}
        <div
          className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-medium"
          style={{
            borderColor: 'var(--border-light)',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-surface)',
            fontSize: '13px',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {t.landing.termBadge}
        </div>
      </div>

      {/* Role cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl">
        {ROLES.map(r => {
          const Icon = r.icon;
          const tag = darkMode ? r.tagColorDark : r.tagColor;
          return (
            <button
              key={r.role}
              onClick={() => enter(r.path)}
              className="group text-left rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-light)',
                boxShadow: darkMode
                  ? `0 0 0 0 ${r.glowColor}`
                  : '0 1px 4px rgba(0,0,0,0.08)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${r.glowColor}, 0 0 0 1px ${r.glowColor}`;
                (e.currentTarget as HTMLElement).style.borderColor = r.glowColor;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = darkMode
                  ? `0 0 0 0 ${r.glowColor}`
                  : '0 1px 4px rgba(0,0,0,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)';
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
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      display: 'block',
                      lineHeight: 1.2,
                    }}
                  >
                    {r.label}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-faint)',
                    }}
                  >
                    {r.sublabel}
                  </span>
                </div>
                <span
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold mt-0.5"
                  style={{ backgroundColor: tag.bg, color: tag.text }}
                >
                  {r.tag}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
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
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div
                className="flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all"
                style={{ color: tag.text, fontSize: '13px' }}
              >
                {r.enterLabel}
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Course Catalog quick-access */}
      <button
        onClick={() => navigate('/courses')}
        className="relative mt-6 w-full max-w-3xl group"
      >
        <div
          className="flex items-center justify-between rounded-xl border px-5 py-4 transition-all duration-300 hover:-translate-y-0.5"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-light)',
            boxShadow: darkMode ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = darkMode
              ? '0 8px 30px rgba(59,130,246,0.15), 0 0 0 1px rgba(59,130,246,0.2)'
              : '0 8px 30px var(--brand-glow), 0 0 0 1px var(--brand-glow)';
            (e.currentTarget as HTMLElement).style.borderColor = darkMode ? 'rgba(59,130,246,0.3)' : 'var(--brand-primary)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = darkMode ? 'none' : '0 1px 4px rgba(0,0,0,0.08)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)';
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: darkMode
                  ? 'linear-gradient(135deg, #1e3a5f, #172554)'
                  : 'var(--brand-primary-soft)',
              }}
            >
              <BookOpen
                className="w-4.5 h-4.5"
                style={{ color: darkMode ? '#60a5fa' : 'var(--brand-primary)' }}
              />
            </div>
            <div className="text-left">
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  display: 'block',
                }}
              >
                {t.landing.courseCatalog}
              </span>
              <span
                style={{ fontSize: '13px', color: 'var(--text-faint)' }}
              >
                {t.landing.courseCatalogDesc}
              </span>
            </div>
          </div>
          <ArrowRight
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            style={{ color: darkMode ? '#60a5fa' : 'var(--brand-primary)' }}
          />
        </div>
      </button>

      {/* Footer */}
      <p
        className="relative mt-10 text-center"
        style={{ fontSize: '12px', color: 'var(--text-very-faint)' }}
      >
        {t.landing.footer}
      </p>
    </div>
  );
}
