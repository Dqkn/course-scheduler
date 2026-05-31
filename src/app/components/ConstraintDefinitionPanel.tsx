import { useState, useMemo } from 'react';
import { X, Shield, Clock, Ban, Search, Lock, Users, BookOpen, Building2, Timer, Wifi, CalendarCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';
import type { ConstraintType, DayOfWeek } from '../types/schedulerTypes';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = Array.from({ length: 9 }, (_, i) => 9 + i); // 9..17

type TabType = 'system' | 'instructor_unavailable' | 'course_fixed' | 'course_blocked';

export function ConstraintDefinitionPanel({ onClose }: { onClose: () => void }) {
  const {
    darkMode,
    algorithmCourses,
    constraints,
    addConstraint,
    removeConstraint,
    clearConstraints,
  } = useApp();
  const { t } = useLocale();
  const cd = t.constraintDef;

  const [activeTab, setActiveTab] = useState<TabType>('system');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const instructors = useMemo(() => {
    const set = new Set(algorithmCourses.map(c => c.instructor_full_name).filter(n => n !== 'anonim'));
    return [...set].sort();
  }, [algorithmCourses]);

  const courses = useMemo(() => {
    return algorithmCourses.filter(c => c.section_count > 0);
  }, [algorithmCourses]);

  const filteredList = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (activeTab === 'instructor_unavailable') {
      return instructors.filter(n => !q || n.toLowerCase().includes(q));
    }
    return courses.filter(c =>
      !q || c.course_code.toLowerCase().includes(q) || c.course_name.toLowerCase().includes(q)
    );
  }, [activeTab, instructors, courses, searchQuery]);

  const targetConstraints = useMemo(() => {
    if (!selectedTarget) return [];
    return constraints.filter(c => c.type === activeTab && c.target === selectedTarget);
  }, [constraints, activeTab, selectedTarget]);

  function isSlotActive(day: DayOfWeek, hour: number) {
    return targetConstraints.some(c => c.day === day && c.hour === hour);
  }

  function toggleSlot(day: DayOfWeek, hour: number) {
    if (!selectedTarget) return;
    const existing = targetConstraints.find(c => c.day === day && c.hour === hour);
    if (existing) {
      removeConstraint(existing.id);
    } else {
      if (activeTab !== 'system') addConstraint(activeTab, selectedTarget, day, hour);
    }
  }

  function handleTargetSelect(target: string) {
    setSelectedTarget(target);
    setSearchQuery('');
  }

  const tabConfig: Record<TabType, { icon: typeof Shield; label: string; desc: string; color: string; slotLabel: string }> = {
    system: { icon: Lock, label: cd.tabSystem, desc: cd.systemDesc, color: '#6366f1', slotLabel: '' },
    instructor_unavailable: { icon: Clock, label: cd.tabInstructor, desc: cd.instructorDesc, color: '#ef4444', slotLabel: cd.unavailable },
    course_fixed: { icon: Shield, label: cd.tabCourseFixed, desc: cd.fixedDesc, color: '#22c55e', slotLabel: cd.fixed },
    course_blocked: { icon: Ban, label: cd.tabCourseBlocked, desc: cd.blockedDesc, color: '#f59e0b', slotLabel: cd.blocked },
  };

  const systemRules = [
    { icon: Users, title: cd.sysInstructorClash, desc: cd.sysInstructorClashDesc, color: '#ef4444' },
    { icon: BookOpen, title: cd.sysSemesterClash, desc: cd.sysSemesterClashDesc, color: '#f59e0b' },
    { icon: Building2, title: cd.sysRoomClash, desc: cd.sysRoomClashDesc, color: '#3b82f6' },
    { icon: Timer, title: cd.sysConsecutiveLimit, desc: cd.sysConsecutiveLimitDesc, color: '#8b5cf6' },
    { icon: Wifi, title: cd.sysOnlineExemption, desc: cd.sysOnlineExemptionDesc, color: '#06b6d4' },
    { icon: CalendarCheck, title: cd.sysWeeklyHours, desc: cd.sysWeeklyHoursDesc, color: '#22c55e' },
  ];

  const currentTab = tabConfig[activeTab];
  const totalConstraints = constraints.length;

  function getTargetLabel(target: string) {
    if (activeTab === 'instructor_unavailable') return target;
    const c = algorithmCourses.find(a => a.course_code === target);
    return c ? `${c.course_code} — ${c.course_name}` : target;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--bg-mute)' }}
        >
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Shield className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
              {cd.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
              {cd.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: 'var(--text-faint)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b shrink-0 px-6"
          style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-mute)' }}
        >
          {(Object.keys(tabConfig) as TabType[]).map(tab => {
            const cfg = tabConfig[tab];
            const isActive = activeTab === tab;
            const count = tab === 'system' ? 0 : constraints.filter(c => c.type === tab).length;
            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSelectedTarget(''); setSearchQuery(''); }}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition-colors relative"
                style={{
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                  borderBottom: isActive ? `2px solid var(--brand-primary)` : '2px solid transparent',
                }}
              >
                <cfg.icon className="w-3.5 h-3.5" />
                {cfg.label}
                {tab === 'system' && (
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: '#6366f1', color: '#fff' }}
                  >
                    6
                  </span>
                )}
                {count > 0 && (
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ backgroundColor: cfg.color, color: '#fff' }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* System constraints tab */}
          {activeTab === 'system' && (
            <div className="flex-1 overflow-y-auto p-5">
              <p className="text-xs mb-4" style={{ color: 'var(--text-faint)' }}>
                {cd.systemDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {systemRules.map(rule => (
                  <div
                    key={rule.title}
                    className="flex items-start gap-3 p-4 rounded-xl border"
                    style={{
                      borderColor: 'var(--border-light)',
                      backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${rule.color}18`,
                      }}
                    >
                      <rule.icon className="w-4.5 h-4.5" style={{ color: rule.color, width: 18, height: 18 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          {rule.title}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0"
                          style={{ backgroundColor: '#22c55e22', color: '#22c55e' }}
                        >
                          {cd.systemBadge}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {rule.desc}
                      </p>
                    </div>
                    <Lock className="w-3.5 h-3.5 shrink-0 mt-1" style={{ color: 'var(--text-faint)', opacity: 0.4 }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Left: target selector (user constraint tabs only) */}
          {activeTab !== 'system' && (<>
          <div
            className="w-56 shrink-0 border-r flex flex-col overflow-hidden"
            style={{ borderColor: 'var(--border-light)', backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }}
          >
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-faint)' }} />
                <input
                  type="text"
                  placeholder={activeTab === 'instructor_unavailable' ? cd.selectInstructor : cd.selectCourse}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs outline-none transition-all focus:ring-1"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-2 pb-2">
              {filteredList.map(item => {
                const key = typeof item === 'string' ? item : item.course_code;
                const label = typeof item === 'string' ? item : item.course_code;
                const sub = typeof item === 'string' ? null : item.course_name;
                const isSelected = selectedTarget === key;
                const count = constraints.filter(c => c.type === activeTab && c.target === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => handleTargetSelect(key)}
                    className="w-full text-left px-3 py-2 rounded-lg mb-0.5 text-xs transition-colors"
                    style={{
                      backgroundColor: isSelected ? (darkMode ? 'rgba(59,130,246,0.15)' : 'rgba(60,141,188,0.1)') : 'transparent',
                      color: isSelected ? 'var(--brand-primary)' : 'var(--text-primary)',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{label}</span>
                      {count > 0 && (
                        <span
                          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: currentTab.color, color: '#fff' }}
                        >
                          {count}
                        </span>
                      )}
                    </div>
                    {sub && (
                      <p className="truncate mt-0.5" style={{ color: 'var(--text-faint)', fontSize: '10px' }}>
                        {sub}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: time grid */}
          <div className="flex-1 overflow-auto p-4">
            {!selectedTarget ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm" style={{ color: 'var(--text-faint)' }}>{cd.noTarget}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {getTargetLabel(selectedTarget)}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-faint)' }}>
                      {currentTab.desc}
                    </p>
                  </div>
                  {targetConstraints.length > 0 && (
                    <button
                      onClick={() => clearConstraints(selectedTarget)}
                      className="text-[11px] font-medium px-2 py-1 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                      style={{ color: '#ef4444' }}
                    >
                      {cd.clearAll} ({targetConstraints.length})
                    </button>
                  )}
                </div>

                {/* Grid */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse" style={{ minWidth: 400 }}>
                    <thead>
                      <tr>
                        <th className="w-16 p-1.5 text-[11px] font-semibold text-right" style={{ color: 'var(--text-faint)' }}>
                          {/* empty corner */}
                        </th>
                        {DAYS.map(day => (
                          <th key={day} className="p-1.5 text-[11px] font-semibold text-center" style={{ color: 'var(--text-muted)' }}>
                            {t.days[day]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HOURS.map(hour => (
                        <tr key={hour}>
                          <td className="p-1.5 text-[11px] font-medium text-right whitespace-nowrap" style={{ color: 'var(--text-faint)' }}>
                            {String(hour).padStart(2, '0')}:00
                          </td>
                          {DAYS.map(day => {
                            const active = isSlotActive(day, hour);
                            return (
                              <td key={day} className="p-0.5">
                                <button
                                  onClick={() => toggleSlot(day, hour)}
                                  className="w-full h-9 rounded-lg border-2 transition-all text-[10px] font-bold"
                                  style={{
                                    backgroundColor: active
                                      ? currentTab.color
                                      : (darkMode ? '#1e293b' : '#f1f5f9'),
                                    borderColor: active
                                      ? currentTab.color
                                      : 'var(--border-light)',
                                    color: active ? '#fff' : 'transparent',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {active ? currentTab.slotLabel : ''}
                                </button>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
          </>)}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t shrink-0 flex items-center justify-between"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--bg-mute)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {cd.summary.replace('{n}', String(totalConstraints))}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--brand-gradient)', color: 'var(--brand-on-primary)' }}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
