import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';
import type { Course, DayKey } from '../data/mockData';

const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = Array.from({ length: 9 }, (_, i) => 9 + i); // 9..17

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Format course code for display: "BİL172-1" → "BİL 172 (01)" */
function formatCourseLabel(code: string): { label: string; isBil: boolean } {
  // code is like "BİL172-1" or "MAT151-2"
  const dashIdx = code.lastIndexOf('-');
  const baseCode = dashIdx > 0 ? code.slice(0, dashIdx) : code;
  const section = dashIdx > 0 ? code.slice(dashIdx + 1) : '';

  // Check if it's a BİL course
  const isBil = baseCode.toUpperCase().startsWith('BİL') || baseCode.toUpperCase().startsWith('BIL');

  // Insert space between letters and digits: "BİL172" → "BİL 172"
  const spaced = baseCode.replace(/([A-ZÇĞİÖŞÜa-zçğıöşü]+)(\d+)/, '$1 $2');

  const sectionLabel = section ? ` (${section.padStart(2, '0')})` : '';
  return { label: `${spaced}${sectionLabel}`, isBil };
}

interface ScheduleTableViewProps {
  filterFn?: (c: Course) => boolean;
}

export function ScheduleTableView({ filterFn }: ScheduleTableViewProps = {}) {
  const { darkMode, filters, scheduledCourses, openCourseIds, setSelectedCourse, currentUser } = useApp();
  const { t } = useLocale();

  /* ── Derive class years from data ──────────────────────────── */
  const allClassYears = useMemo(() => {
    const set = new Set(
      scheduledCourses
        .filter(c => openCourseIds.includes(c.id))
        .map(c => c.classLevel)
        .filter(Boolean)
    );
    return [...set].sort();
  }, [scheduledCourses, openCourseIds]);

  const [selectedYear, setSelectedYear] = useState<string>('');

  /* ── Filter visible courses ────────────────────────────────── */
  const visibleCourses = useMemo(() => {
    return scheduledCourses.filter(c => {
      if (!openCourseIds.includes(c.id)) return false;
      if (filterFn && !filterFn(c)) return false;
      if (currentUser?.role === 'secretary' && currentUser.department_name && c.department !== currentUser.department_name) return false;
      if (filters.department && c.department !== filters.department) return false;
      if (filters.lecturer && c.lecturer !== filters.lecturer) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q)) return false;
      }
      if (filters.room && c.room !== filters.room) return false;
      if (!filters.room && filters.block && !c.room.startsWith(filters.block)) return false;
      // Class year filter (from tab or from existing filter)
      const yearFilter = selectedYear || filters.classLevel;
      if (yearFilter && c.classLevel !== yearFilter) return false;
      return true;
    });
  }, [filters, scheduledCourses, openCourseIds, currentUser, selectedYear, filterFn]);

  /* ── Build cell data: day × hour → courses ─────────────────── */
  const cellMap = useMemo(() => {
    const map = new Map<string, Course[]>();
    for (const c of visibleCourses) {
      const startMin = toMinutes(c.startTime);
      const endMin = toMinutes(c.endTime);
      // Place course in each hour slot it occupies
      for (let h = Math.floor(startMin / 60); h < Math.ceil(endMin / 60) && h <= 17; h++) {
        if (h < 9) continue;
        const key = `${c.day}-${h}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(c);
      }
    }
    return map;
  }, [visibleCourses]);

  /* ── Styles ────────────────────────────────────────────────── */
  const borderColor = darkMode ? '#334155' : '#000';
  const headerBg = darkMode ? '#1e293b' : '#f0f0f0';
  const cellBg = darkMode ? '#0f172a' : '#fff';
  const textPrimary = darkMode ? '#e2e8f0' : '#000';
  const textMuted = darkMode ? '#94a3b8' : '#555';

  return (
    <div className="flex-1 overflow-auto" style={{ backgroundColor: darkMode ? '#0f172a' : '#fff' }}>
      {/* Class year tabs */}
      <div
        className="sticky top-0 z-30 flex items-center gap-1 px-4 py-2 border-b"
        style={{
          backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
          borderColor: darkMode ? '#334155' : '#e2e8f0',
        }}
      >
        <span className="text-xs font-semibold mr-2" style={{ color: textMuted }}>
          {t.scheduleTable.classFilter}:
        </span>
        <button
          onClick={() => setSelectedYear('')}
          className="px-3 py-1 rounded text-xs font-semibold transition-colors"
          style={{
            backgroundColor: !selectedYear
              ? (darkMode ? '#3b82f6' : '#3C8DBC')
              : (darkMode ? '#334155' : '#e2e8f0'),
            color: !selectedYear ? '#fff' : textPrimary,
          }}
        >
          {t.scheduleTable.allYears}
        </button>
        {allClassYears.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className="px-3 py-1 rounded text-xs font-semibold transition-colors"
            style={{
              backgroundColor: selectedYear === year
                ? (darkMode ? '#3b82f6' : '#3C8DBC')
                : (darkMode ? '#334155' : '#e2e8f0'),
              color: selectedYear === year ? '#fff' : textPrimary,
            }}
          >
            {year}
          </button>
        ))}
        <span className="ml-auto text-[11px]" style={{ color: textMuted }}>
          {visibleCourses.length} {t.admin.sessions}
        </span>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto">
        <table
          className="w-full border-collapse"
          style={{ borderColor: borderColor, minWidth: 700 }}
        >
          <thead>
            <tr>
              <th
                className="border p-2 text-center text-xs font-bold"
                style={{
                  borderColor: borderColor,
                  backgroundColor: headerBg,
                  color: textPrimary,
                  width: 70,
                }}
              >
                {t.scheduleTable.hour}
              </th>
              {DAYS.map(day => (
                <th
                  key={day}
                  className="border p-2 text-center text-xs font-bold"
                  style={{
                    borderColor: borderColor,
                    backgroundColor: headerBg,
                    color: textPrimary,
                  }}
                >
                  {t.days[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(hour => (
              <tr key={hour}>
                <td
                  className="border p-2 text-center text-xs font-semibold"
                  style={{
                    borderColor: borderColor,
                    backgroundColor: headerBg,
                    color: textPrimary,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {String(hour).padStart(2, '0')}:00
                </td>
                {DAYS.map(day => {
                  const courses = cellMap.get(`${day}-${hour}`) || [];
                  // Deduplicate: a multi-hour course appears in multiple hour slots
                  // Show it in every slot it occupies
                  const uniqueCourses = courses.filter((c, i, arr) =>
                    arr.findIndex(x => x.id === c.id) === i
                  );
                  return (
                    <td
                      key={day}
                      className="border p-1.5 align-top"
                      style={{
                        borderColor: borderColor,
                        backgroundColor: cellBg,
                        minHeight: 40,
                      }}
                    >
                      <div className="flex flex-col gap-0.5">
                        {uniqueCourses.map(course => {
                          const { label, isBil } = formatCourseLabel(course.code);
                          return (
                            <button
                              key={course.id}
                              onClick={() => setSelectedCourse(course)}
                              className="text-left text-[11px] leading-tight px-1 py-0.5 rounded hover:underline transition-colors"
                              style={{
                                color: course.hasConflict ? '#ef4444' : textPrimary,
                                fontWeight: isBil ? 700 : 400,
                                cursor: 'pointer',
                                backgroundColor: course.hasConflict
                                  ? (darkMode ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.1)')
                                  : 'transparent',
                              }}
                              title={`${course.name} — ${course.lecturer}`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
