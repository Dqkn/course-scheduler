import { CheckCircle2, AlertTriangle, Clock, BookOpen, Users, Building2, ChevronRight, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_DATA, COURSES, COURSE_COLORS, LECTURERS } from '../data/mockData';
import { useState, ReactNode } from 'react';

interface StatusPanelProps {
  onPublish?: () => void;
}

export function StatusPanel({ onPublish }: StatusPanelProps) {
  const { darkMode, publishedAt, setSelectedCourse } = useApp();
  const [expanded, setExpanded] = useState<string | null>('stats');

  const totalStudents = COURSES.reduce((sum, c) => sum + c.studentsEnrolled, 0);

  const surface = darkMode ? '#1e293b' : '#f8fafc';
  const border = darkMode ? '#334155' : '#e2e8f0';
  const muted = darkMode ? '#64748b' : '#94a3b8';
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const subText = darkMode ? '#94a3b8' : '#64748b';

  function toggle(key: string) {
    setExpanded(prev => prev === key ? null : key);
  }

  return (
    <aside
      className="flex flex-col border-l overflow-y-auto shrink-0"
      style={{
        width: 256,
        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
        borderColor: border,
      }}
    >
      {/* Panel header */}
      <div
        className="px-4 py-3 border-b flex items-center gap-2"
        style={{ borderColor: border }}
      >
        <Zap className="w-4 h-4" style={{ color: '#6366f1' }} />
        <span style={{ fontSize: '12px', fontWeight: 700, color: text, letterSpacing: '-0.01em' }}>
          Status Panel
        </span>
        <span
          className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{
            backgroundColor: STATUS_DATA.conflictCount > 0
              ? darkMode ? '#450a0a' : '#fee2e2'
              : darkMode ? '#022c22' : '#dcfce7',
            color: STATUS_DATA.conflictCount > 0 ? '#ef4444' : '#16a34a',
          }}
        >
          {STATUS_DATA.conflictCount > 0 ? `${STATUS_DATA.conflictCount} issue${STATUS_DATA.conflictCount > 1 ? 's' : ''}` : 'Clear'}
        </span>
      </div>

      {/* Algorithm result */}
      <div
        className="mx-3 mt-3 mb-2 p-3 rounded-xl"
        style={{ backgroundColor: surface }}
      >
        <p style={{ fontSize: '10px', fontWeight: 500, color: muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
          Algorithm Result
        </p>
        <div className="flex items-center gap-2 mb-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: darkMode ? '#1e3a5f' : '#dbeafe' }}
          >
            <Clock className="w-4 h-4" style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <p style={{ fontSize: '18px', fontWeight: 700, color: text, lineHeight: 1 }}>
              {STATUS_DATA.algorithmTime}s
            </p>
            <p style={{ fontSize: '10px', color: muted }}>Solution time</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <MetricChip
            label="Placed"
            value={`${STATUS_DATA.totalPlaced}/${STATUS_DATA.totalCourses}`}
            color="#22c55e"
            darkMode={darkMode}
          />
          <MetricChip
            label="Conflicts"
            value={String(STATUS_DATA.conflictCount)}
            color={STATUS_DATA.conflictCount > 0 ? '#ef4444' : '#22c55e'}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Warnings */}
      {STATUS_DATA.warnings.length > 0 && (
        <div className="mx-3 mb-2">
          <SectionHeader
            title="Warnings"
            count={STATUS_DATA.warnings.length}
            open={expanded === 'warnings'}
            onClick={() => toggle('warnings')}
            darkMode={darkMode}
            color="#ef4444"
          />
          {expanded === 'warnings' && (
            <div className="space-y-1.5 mt-1.5">
              {STATUS_DATA.warnings.map(w => (
                <div
                  key={w.id}
                  className="p-2.5 rounded-lg border"
                  style={{
                    backgroundColor: darkMode ? '#450a0a' : '#fef2f2',
                    borderColor: darkMode ? '#7f1d1d' : '#fecaca',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <p style={{ fontSize: '10px', color: darkMode ? '#fca5a5' : '#b91c1c', lineHeight: 1.4 }}>
                      {w.message}
                    </p>
                  </div>
                  <div className="mt-2 flex gap-1 flex-wrap">
                    {w.courses.map(cid => {
                      const course = COURSES.find(c => c.id === cid);
                      if (!course) return null;
                      const color = COURSE_COLORS[course.colorIndex];
                      return (
                        <button
                          key={cid}
                          className="px-1.5 py-0.5 rounded text-[9px] font-semibold hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: darkMode ? color.darkBg : color.lightBg,
                            color: darkMode ? color.darkText : color.lightText,
                          }}
                          onClick={() => setSelectedCourse(course)}
                        >
                          {course.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule stats */}
      <div className="mx-3 mb-2">
        <SectionHeader
          title="Schedule Stats"
          open={expanded === 'stats'}
          onClick={() => toggle('stats')}
          darkMode={darkMode}
          color="#6366f1"
        />
        {expanded === 'stats' && (
          <div className="mt-1.5 space-y-1.5">
            <StatRow
              icon={<BookOpen className="w-3.5 h-3.5" />}
              label="Total Sessions"
              value={`${STATUS_DATA.totalPlaced}`}
              darkMode={darkMode}
            />
            <StatRow
              icon={<Users className="w-3.5 h-3.5" />}
              label="Student Sessions"
              value={totalStudents.toLocaleString()}
              darkMode={darkMode}
            />
            <StatRow
              icon={<Building2 className="w-3.5 h-3.5" />}
              label="Rooms Used"
              value={`${STATUS_DATA.stats.roomsUsed}/${STATUS_DATA.stats.totalRooms}`}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>

      {/* Lecturer hours */}
      <div className="mx-3 mb-2">
        <SectionHeader
          title="Lecturer Hours"
          open={expanded === 'lecturers'}
          onClick={() => toggle('lecturers')}
          darkMode={darkMode}
          color="#0891b2"
        />
        {expanded === 'lecturers' && (
          <div className="mt-1.5 space-y-2">
            {LECTURERS.map(l => {
              const hours = (STATUS_DATA.stats.lecturerHours as Record<string, number>)[l.name] ?? 0;
              const maxHours = 16;
              return (
                <div key={l.id}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span style={{ fontSize: '10px', fontWeight: 500, color: subText }}>
                      {l.name.split('. ')[1] ?? l.name}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: text }}>{hours}h</span>
                  </div>
                  <div
                    className="w-full rounded-full overflow-hidden"
                    style={{ height: 4, backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(hours / maxHours) * 100}%`,
                        backgroundColor: '#6366f1',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Publish button */}
      <div className="p-3 border-t" style={{ borderColor: border }}>
        {publishedAt ? (
          <div
            className="flex items-center gap-2 p-2.5 rounded-xl"
            style={{ backgroundColor: darkMode ? '#022c22' : '#f0fdf4' }}
          >
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
            <div>
              <p style={{ fontSize: '10px', fontWeight: 600, color: '#16a34a' }}>Published</p>
              <p style={{ fontSize: '9px', color: darkMode ? '#4ade80' : '#15803d' }}>{publishedAt}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={onPublish}
            disabled={STATUS_DATA.conflictCount > 0}
            className="w-full py-2.5 rounded-xl text-white text-xs font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: STATUS_DATA.conflictCount > 0
                ? darkMode ? '#334155' : '#e2e8f0'
                : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: STATUS_DATA.conflictCount > 0 ? muted : 'white',
            }}
          >
            {STATUS_DATA.conflictCount > 0 ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                Resolve conflicts first
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Publish Programme
              </>
            )}
          </button>
        )}
        {STATUS_DATA.conflictCount > 0 && (
          <p style={{ fontSize: '9px', color: muted, textAlign: 'center', marginTop: 6 }}>
            Fix {STATUS_DATA.conflictCount} conflict{STATUS_DATA.conflictCount > 1 ? 's' : ''} to enable publishing
          </p>
        )}
      </div>
    </aside>
  );
}

function MetricChip({ label, value, color, darkMode }: { label: string; value: string; color: string; darkMode: boolean }) {
  return (
    <div
      className="flex flex-col items-center py-2 rounded-lg"
      style={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', border: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}` }}
    >
      <span style={{ fontSize: '14px', fontWeight: 700, color }}>{value}</span>
      <span style={{ fontSize: '9px', color: darkMode ? '#64748b' : '#94a3b8', marginTop: 1 }}>{label}</span>
    </div>
  );
}

function SectionHeader({
  title, open, onClick, darkMode, color, count,
}: {
  title: string; open: boolean; onClick: () => void; darkMode: boolean; color: string; count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-1.5 py-1.5 group"
    >
      <ChevronRight
        className="w-3 h-3 transition-transform"
        style={{
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          color,
        }}
      />
      <span style={{ fontSize: '10px', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {title}
      </span>
      {count !== undefined && (
        <span
          className="ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold"
          style={{ backgroundColor: `${color}22`, color }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function StatRow({ icon, label, value, darkMode }: { icon: ReactNode; label: string; value: string; darkMode: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
      style={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc' }}
    >
      <span style={{ color: darkMode ? '#64748b' : '#94a3b8' }} className="[&>svg]:w-3.5 [&>svg]:h-3.5">
        {icon}
      </span>
      <span style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#64748b', flex: 1 }}>{label}</span>
      <span style={{ fontSize: '11px', fontWeight: 600, color: darkMode ? '#f1f5f9' : '#0f172a' }}>{value}</span>
    </div>
  );
}