import { useMemo } from 'react';
import { AlertTriangle, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COURSES, COURSE_COLORS, DAYS, DAY_LABELS, Course, DayKey } from '../data/mockData';

const SLOT_HEIGHT = 60; // px per 30-minute slot
const START_HOUR = 9;
const END_HOUR = 16;
const TOTAL_SLOTS = (END_HOUR - START_HOUR) * 2; // 14 half-hour slots

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function getTop(startTime: string): number {
  const mins = toMinutes(startTime) - START_HOUR * 60;
  return (mins / 30) * SLOT_HEIGHT;
}

function getHeight(startTime: string, endTime: string): number {
  const duration = toMinutes(endTime) - toMinutes(startTime);
  return (duration / 30) * SLOT_HEIGHT;
}

interface LayoutCourse extends Course {
  leftPct: number;
  widthPct: number;
}

function layoutDayCourses(courses: Course[]): LayoutCourse[] {
  if (courses.length === 0) return [];

  const overlaps = (a: Course, b: Course) =>
    toMinutes(a.startTime) < toMinutes(b.endTime) &&
    toMinutes(a.endTime) > toMinutes(b.startTime);

  // Union-find
  const parent = courses.map((_, i) => i);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (x: number, y: number) => { parent[find(x)] = find(y); };

  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      if (overlaps(courses[i], courses[j])) union(i, j);
    }
  }

  const groups = new Map<number, number[]>();
  for (let i = 0; i < courses.length; i++) {
    const p = find(i);
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p)!.push(i);
  }

  const result: LayoutCourse[] = courses.map(c => ({ ...c, leftPct: 0, widthPct: 100 }));

  for (const [, idxs] of groups) {
    // Sort within group by start time for stable column assignment
    const sorted = [...idxs].sort((a, b) => toMinutes(courses[a].startTime) - toMinutes(courses[b].startTime));
    const n = sorted.length;
    sorted.forEach((idx, col) => {
      result[idx].leftPct = (col / n) * 100;
      result[idx].widthPct = (1 / n) * 100;
    });
  }

  return result;
}

const TIME_LABELS: string[] = [];
for (let h = START_HOUR; h <= END_HOUR; h++) {
  TIME_LABELS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < END_HOUR) TIME_LABELS.push(`${String(h).padStart(2, '0')}:30`);
}

interface WeeklyGridProps {
  filterFn?: (course: Course) => boolean;
  highlightDay?: DayKey;
}

export function WeeklyGrid({ filterFn, highlightDay }: WeeklyGridProps) {
  const { darkMode, filters, setSelectedCourse, userRole, openCourseIds } = useApp();

  const visibleCourses = useMemo(() => {
    return COURSES.filter(c => {
      // Admin global toggle: if course is not open, nobody sees it
      if (!openCourseIds.includes(c.id)) return false;

      if (filterFn && !filterFn(c)) return false;
      if (filters.department && c.department !== filters.department) return false;
      if (filters.lecturer && c.lecturer !== filters.lecturer) return false;
      if (filters.classLevel && c.classLevel !== filters.classLevel) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q)) return false;
      }
      
      // Blocks / Rooms filter (only applies if role is admin or academic)
      if (userRole === 'admin' || userRole === 'academic') {
        if (filters.room && c.room !== filters.room) return false;
        if (!filters.room && filters.block && !c.room.startsWith(filters.block)) return false;
      } else {
        // Students should absolutely never see the block/room filters, 
        // but if state carried over somehow, explicitly ignore it to prevent data leakage.
      }

      return true;
    });
  }, [filters, filterFn]);

  const coursesByDay = useMemo(() => {
    const map: Record<DayKey, Course[]> = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [] };
    for (const c of visibleCourses) map[c.day].push(c);
    return map;
  }, [visibleCourses]);

  const totalHeight = TOTAL_SLOTS * SLOT_HEIGHT;

  return (
    <div
      className="flex-1 overflow-auto"
      style={{ minHeight: 0 }}
    >
      <div style={{ minWidth: 740 }}>
        {/* Day Header Row */}
        <div
          className="sticky top-0 z-10 flex border-b"
          style={{
            backgroundColor: darkMode ? '#0f172a' : '#ffffff',
            borderColor: darkMode ? '#1e293b' : '#e2e8f0',
          }}
        >
          {/* Time gutter */}
          <div className="shrink-0 w-16" />
          {DAYS.map(day => (
            <div
              key={day}
              className="flex-1 py-2.5 text-center border-l"
              style={{
                borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                backgroundColor: highlightDay === day
                  ? darkMode ? '#172554' : '#eff6ff'
                  : 'transparent',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: darkMode ? '#64748b' : '#94a3b8',
                }}
              >
                {day}
              </p>
              <p
                style={{
                  fontSize: '10px',
                  color: darkMode ? '#475569' : '#cbd5e1',
                }}
              >
                {DAY_LABELS[day]}
              </p>
            </div>
          ))}
        </div>

        {/* Grid body */}
        <div className="flex">
          {/* Time labels */}
          <div className="shrink-0 w-16 relative" style={{ height: totalHeight }}>
            {TIME_LABELS.map((label, i) => (
              <div
                key={label}
                className="absolute w-full flex items-start justify-end pr-2"
                style={{
                  top: i * SLOT_HEIGHT,
                  height: SLOT_HEIGHT,
                }}
              >
                {label.endsWith(':00') && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      color: darkMode ? '#475569' : '#94a3b8',
                      transform: 'translateY(-6px)',
                    }}
                  >
                    {label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {DAYS.map(day => {
            const dayCourses = layoutDayCourses(coursesByDay[day]);
            return (
              <div
                key={day}
                className="flex-1 relative border-l"
                style={{
                  height: totalHeight,
                  borderColor: darkMode ? '#1e293b' : '#e2e8f0',
                  backgroundColor: highlightDay === day
                    ? darkMode ? 'rgba(23,37,84,0.3)' : 'rgba(239,246,255,0.5)'
                    : 'transparent',
                }}
              >
                {/* Horizontal time slot lines */}
                {TIME_LABELS.map((label, i) => (
                  <div
                    key={label}
                    className="absolute w-full border-t"
                    style={{
                      top: i * SLOT_HEIGHT,
                      borderColor: label.endsWith(':00')
                        ? darkMode ? '#1e293b' : '#e2e8f0'
                        : darkMode ? '#0f172a' : '#f8fafc',
                      borderStyle: label.endsWith(':00') ? 'solid' : 'dashed',
                    }}
                  />
                ))}

                {/* Course cards */}
                {dayCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    darkMode={darkMode}
                    onClick={() => setSelectedCourse(course)}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CourseCard({
  course,
  darkMode,
  onClick,
}: {
  course: LayoutCourse;
  darkMode: boolean;
  onClick: () => void;
}) {
  const color = COURSE_COLORS[course.colorIndex];
  const bg = darkMode ? color.darkBg : color.lightBg;
  const borderColor = darkMode ? color.darkBorder : color.lightBorder;
  const textColor = darkMode ? color.darkText : color.lightText;

  const top = getTop(course.startTime);
  const height = getHeight(course.startTime, course.endTime);
  const capacityPct = Math.round((course.studentsEnrolled / course.totalCapacity) * 100);
  const isShort = height < 80;
  const isTiny = height < 55;

  return (
    <div
      className="absolute cursor-pointer select-none group"
      style={{
        top: top + 2,
        height: height - 4,
        left: `calc(${course.leftPct}% + 2px)`,
        width: `calc(${course.widthPct}% - 4px)`,
        zIndex: course.hasConflict ? 2 : 1,
      }}
      onClick={onClick}
    >
      <div
        className="w-full h-full rounded-lg border-l-4 overflow-hidden flex flex-col px-2 py-1.5 transition-all hover:brightness-95 hover:shadow-md"
        style={{
          backgroundColor: bg,
          borderColor: course.hasConflict ? '#ef4444' : borderColor,
          boxShadow: course.hasConflict
            ? `0 0 0 1px rgba(239,68,68,0.3), 0 1px 3px rgba(0,0,0,0.1)`
            : `0 1px 3px rgba(0,0,0,0.08)`,
        }}
      >
        {/* Conflict badge */}
        {course.hasConflict && (
          <div className="absolute top-1 right-1">
            <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shadow">
              <AlertTriangle className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        )}

        {/* Course name */}
        <p
          style={{
            fontSize: isTiny ? '9px' : isShort ? '10px' : '11px',
            fontWeight: 600,
            color: textColor,
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: isShort ? 1 : 2,
            WebkitBoxOrient: 'vertical',
            paddingRight: course.hasConflict ? '16px' : '0',
          }}
        >
          {course.name}
        </p>

        {!isTiny && (
          <>
            {/* Lecturer + room */}
            <p
              style={{
                fontSize: '9px',
                color: textColor,
                opacity: 0.75,
                marginTop: 2,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {isShort ? course.lecturer.split(' ').slice(-1)[0] : course.lecturer}
              {!isShort && ` · ${course.room}`}
            </p>

            {/* Class level */}
            {!isShort && (
              <p
                style={{
                  fontSize: '9px',
                  color: textColor,
                  opacity: 0.6,
                  marginTop: 1,
                }}
              >
                {course.classLevel}
              </p>
            )}

            {/* Capacity bar */}
            {!isShort && height >= 100 && (
              <div className="mt-auto pt-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <Users className="w-2.5 h-2.5" style={{ color: textColor, opacity: 0.6 }} />
                  <span style={{ fontSize: '9px', color: textColor, opacity: 0.7 }}>
                    {course.studentsEnrolled}/{course.totalCapacity}
                  </span>
                </div>
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 3, backgroundColor: `${borderColor}44` }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${capacityPct}%`,
                      backgroundColor: capacityPct >= 90 ? '#ef4444' : borderColor,
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
