import { useState } from 'react';
import { Clock, MapPin, User, ChevronRight, GraduationCap, BookOpen, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COURSES, COURSE_COLORS, DAYS, DAY_LABELS, DayKey, Course } from '../data/mockData';
import { CourseDetailModal } from '../components/CourseDetailModal';

const MY_CLASS = '2nd Year CS';

const TYPE_COLORS: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  Lecture: { bg: '#dbeafe', text: '#1e40af', darkBg: '#172554', darkText: '#93c5fd' },
  Lab: { bg: '#d1fae5', text: '#065f46', darkBg: '#022c22', darkText: '#6ee7b7' },
  Seminar: { bg: '#ede9fe', text: '#5b21b6', darkBg: '#2e1065', darkText: '#c4b5fd' },
  Tutorial: { bg: '#fef3c7', text: '#78350f', darkBg: '#451a03', darkText: '#fcd34d' },
};

export function StudentView() {
  const { darkMode, setSelectedCourse, selectedCourse, openCourseIds } = useApp();
  const [activeDay, setActiveDay] = useState<DayKey>('Mon');

  const myCourses = COURSES.filter(c => c.classLevel === MY_CLASS && openCourseIds.includes(c.id));
  const dayCourses = myCourses
    .filter(c => c.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const totalWeekSessions = myCourses.length;
  const totalWeekHours = myCourses.reduce((sum, c) => {
    const [sh, sm] = c.startTime.split(':').map(Number);
    const [eh, em] = c.endTime.split(':').map(Number);
    return sum + (eh * 60 + em - sh * 60 - sm) / 60;
  }, 0);

  const bg = darkMode ? '#050c1a' : '#f8faff';
  const surface = darkMode ? '#0f172a' : '#ffffff';
  const border = darkMode ? '#1e293b' : '#e2e8f0';
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const muted = darkMode ? '#64748b' : '#94a3b8';
  const subSurface = darkMode ? '#1e293b' : '#f1f5f9';

  return (
    <div
      className="flex flex-col min-h-full"
      style={{ backgroundColor: bg }}
    >
      {/* Student info card */}
      <div
        className="px-4 pt-4 pb-3 border-b"
        style={{ backgroundColor: surface, borderColor: border }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563eb, #4f46e5)' }}
          >
            JS
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: text }}>Jamie Smith</p>
            <p style={{ fontSize: '11px', color: muted }}>Student ID: 22CS1047 · {MY_CLASS}</p>
          </div>
          <div className="ml-auto">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: darkMode ? '#172554' : '#dbeafe',
                color: darkMode ? '#93c5fd' : '#1e40af',
              }}
            >
              Spring 2026
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: <BookOpen className="w-3.5 h-3.5" />, value: totalWeekSessions, label: 'Sessions' },
            { icon: <Clock className="w-3.5 h-3.5" />, value: `${totalWeekHours}h`, label: 'Per week' },
            { icon: <GraduationCap className="w-3.5 h-3.5" />, value: '4', label: 'Courses' },
          ].map(s => (
            <div
              key={s.label}
              className="flex flex-col items-center py-2 rounded-xl"
              style={{ backgroundColor: subSurface }}
            >
              <span style={{ color: muted }} className="mb-0.5 [&>svg]:w-3.5 [&>svg]:h-3.5">{s.icon}</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: text }}>{s.value}</span>
              <span style={{ fontSize: '9px', color: muted }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        {/* Day tabs */}
        <div
            className="flex px-3 py-2 gap-1 border-b overflow-x-auto"
            style={{ backgroundColor: surface, borderColor: border }}
          >
            {DAYS.map(day => {
              const count = myCourses.filter(c => c.day === day).length;
              const isActive = activeDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className="flex-1 min-w-[52px] flex flex-col items-center py-2 px-1 rounded-xl transition-all"
                  style={{
                    backgroundColor: isActive
                      ? darkMode ? '#172554' : '#dbeafe'
                      : 'transparent',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive
                        ? darkMode ? '#93c5fd' : '#1e40af'
                        : muted,
                    }}
                  >
                    {day}
                  </span>
                  {count > 0 ? (
                    <span
                      className="mt-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{
                        backgroundColor: isActive
                          ? darkMode ? '#1e40af' : '#2563eb'
                          : darkMode ? '#1e293b' : '#e2e8f0',
                        color: isActive ? '#ffffff' : muted,
                      }}
                    >
                      {count}
                    </span>
                  ) : (
                    <span className="mt-1 w-4 h-4" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Day label */}
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: muted }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: text }}>
                {DAY_LABELS[activeDay]}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
                  color: muted,
                }}
              >
                {dayCourses.length} {dayCourses.length === 1 ? 'session' : 'sessions'}
              </span>
            </div>
          </div>

          {/* Course list */}
          <div className="flex-1 px-4 py-3 space-y-3 pb-8">
            {dayCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: subSurface }}
                >
                  <BookOpen className="w-7 h-7" style={{ color: muted }} />
                </div>
                <div className="text-center">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: text }}>No classes today</p>
                  <p style={{ fontSize: '12px', color: muted, marginTop: 4 }}>
                    Enjoy your free day!
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Timeline */}
                <div className="relative">
                  {/* Timeline line */}
                  <div
                    className="absolute left-[7px] top-4 bottom-4 w-px"
                    style={{ backgroundColor: border }}
                  />

                  <div className="space-y-3">
                    {dayCourses.map((course, idx) => (
                      <StudentCourseCard
                        key={course.id}
                        course={course}
                        darkMode={darkMode}
                        index={idx}
                        onClick={() => setSelectedCourse(course)}
                      />
                    ))}
                  </div>
                </div>

                {/* End of day marker */}
                <div className="flex items-center gap-3 px-1 pt-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 shrink-0"
                    style={{ borderColor: border, backgroundColor: bg }}
                  />
                  <p style={{ fontSize: '11px', color: muted }}>End of day</p>
                </div>
              </>
            )}
        </div>
      </div>

      {selectedCourse && <CourseDetailModal />}
    </div>
  );
}

function StudentCourseCard({
  course,
  darkMode,
  index,
  onClick,
}: {
  course: Course;
  darkMode: boolean;
  index: number;
  onClick: () => void;
}) {
  const color = COURSE_COLORS[course.colorIndex];
  const bg = darkMode ? color.darkBg : color.lightBg;
  const borderColor = darkMode ? color.darkBorder : color.lightBorder;
  const textColor = darkMode ? color.darkText : color.lightText;
  const surface = darkMode ? '#0f172a' : '#ffffff';
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const muted = darkMode ? '#64748b' : '#94a3b8';

  const typeColor = TYPE_COLORS[course.type] ?? TYPE_COLORS['Lecture'];

  const [sh, sm] = course.startTime.split(':').map(Number);
  const [eh, em] = course.endTime.split(':').map(Number);
  const durationMin = (eh * 60 + em) - (sh * 60 + sm);
  const durationStr = durationMin >= 60
    ? `${Math.floor(durationMin / 60)}h${durationMin % 60 > 0 ? ` ${durationMin % 60}m` : ''}`
    : `${durationMin}m`;

  return (
    <div className="flex items-start gap-3">
      {/* Timeline dot */}
      <div className="flex flex-col items-center pt-1 shrink-0 z-10">
        <div
          className="w-3.5 h-3.5 rounded-full border-2"
          style={{ borderColor, backgroundColor: bg }}
        />
      </div>

      {/* Card */}
      <button
        onClick={onClick}
        className="flex-1 text-left rounded-2xl overflow-hidden border shadow-sm active:scale-[0.98] transition-transform"
        style={{
          backgroundColor: surface,
          borderColor: darkMode ? '#1e293b' : '#e2e8f0',
        }}
      >
        {/* Colored top strip */}
        <div className="h-1" style={{ backgroundColor: borderColor }} />

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                  style={{
                    backgroundColor: bg,
                    color: textColor,
                  }}
                >
                  {course.code}
                </span>
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                  style={{
                    backgroundColor: darkMode ? typeColor.darkBg : typeColor.bg,
                    color: darkMode ? typeColor.darkText : typeColor.text,
                  }}
                >
                  {course.type}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: text, lineHeight: 1.3 }}>
                {course.name}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0 mt-1" style={{ color: muted }} />
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: muted }} />
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: text }}>
                  {course.startTime} – {course.endTime}
                </p>
                <p style={{ fontSize: '10px', color: muted }}>{durationStr}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: muted }} />
              <div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: text }}>{course.room}</p>
                <p style={{ fontSize: '10px', color: muted }}>Room</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <User className="w-3.5 h-3.5 shrink-0" style={{ color: muted }} />
              <p style={{ fontSize: '11px', color: muted }}>
                <span style={{ fontWeight: 500, color: text }}>{course.lecturer}</span>
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
