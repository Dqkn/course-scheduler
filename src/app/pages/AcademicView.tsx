import { ReactNode } from 'react';
import { Clock, Users, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WeeklyGrid } from '../components/WeeklyGrid';
import { DynamicFilters } from '../components/DynamicFilters';
import { CourseDetailModal } from '../components/CourseDetailModal';
import { COURSES, COURSE_COLORS, DAYS, DAY_LABELS, DayKey } from '../data/mockData';

const MY_LECTURER = 'Dr. Maria Garcia';

export function AcademicView() {
  const { darkMode, selectedCourse } = useApp();

  const myCourses = COURSES.filter(c => c.lecturer === MY_LECTURER);
  const totalHours = myCourses.reduce((sum, c) => {
    const [sh, sm] = c.startTime.split(':').map(Number);
    const [eh, em] = c.endTime.split(':').map(Number);
    return sum + (eh * 60 + em - sh * 60 - sm) / 60;
  }, 0);
  const totalStudents = myCourses.reduce((s, c) => s + c.studentsEnrolled, 0);

  const border = darkMode ? '#1e293b' : '#e2e8f0';
  const surface = darkMode ? '#0f172a' : '#ffffff';
  const muted = darkMode ? '#64748b' : '#94a3b8';
  const text = darkMode ? '#f1f5f9' : '#0f172a';

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: darkMode ? '#050c1a' : '#f8faff' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-2.5 border-b shrink-0"
        style={{ backgroundColor: surface, borderColor: border }}
      >
        <div>
          <h1 style={{ fontSize: '15px', fontWeight: 700, color: text, letterSpacing: '-0.02em' }}>
            My Teaching Schedule
          </h1>
          <p style={{ fontSize: '11px', color: muted }}>
            {MY_LECTURER} · Spring 2026 · Week 10
          </p>
        </div>

        {/* Summary chips */}
        <div className="hidden sm:flex items-center gap-2">
          <SummaryChip
            icon={<Clock className="w-3 h-3" />}
            label={`${totalHours}h / week`}
            darkMode={darkMode}
            color="#6366f1"
          />
          <SummaryChip
            icon={<BookOpen className="w-3 h-3" />}
            label={`${myCourses.length} sessions`}
            darkMode={darkMode}
            color="#0891b2"
          />
          <SummaryChip
            icon={<Users className="w-3 h-3" />}
            label={`${totalStudents} students`}
            darkMode={darkMode}
            color="#16a34a"
          />
        </div>
      </div>

      {/* Filters (lecturer locked) */}
      <DynamicFilters showSearch={false} compact />

      {/* Main: sidebar + grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: day-by-day breakdown */}
        <aside
          className="hidden lg:flex flex-col border-r shrink-0 overflow-y-auto"
          style={{ width: 200, backgroundColor: surface, borderColor: border }}
        >
          <div className="px-3 py-2.5 border-b" style={{ borderColor: border }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Daily Summary
            </p>
          </div>
          <div className="p-2 space-y-1.5 flex-1">
            {DAYS.map(day => {
              const dayCourses = myCourses.filter(c => c.day === day);
              return (
                <DaySummaryCard
                  key={day}
                  day={day}
                  courses={dayCourses}
                  darkMode={darkMode}
                />
              );
            })}
          </div>

          {/* Week total */}
          <div
            className="p-3 border-t"
            style={{ borderColor: border }}
          >
            <p style={{ fontSize: '10px', fontWeight: 600, color: muted, marginBottom: 8 }}>
              Weekly Total
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span style={{ fontSize: '11px', color: muted }}>Teaching hours</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: text }}>{totalHours}h</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: '11px', color: muted }}>Sessions</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: text }}>{myCourses.length}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ fontSize: '11px', color: muted }}>Students</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: text }}>{totalStudents}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Weekly Grid filtered to this lecturer */}
        <WeeklyGrid filterFn={c => c.lecturer === MY_LECTURER} />
      </div>

      {selectedCourse && <CourseDetailModal />}
    </div>
  );
}

function SummaryChip({
  icon, label, darkMode, color,
}: {
  icon: ReactNode; label: string; darkMode: boolean; color: string;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
      style={{
        backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
        color: darkMode ? '#e2e8f0' : '#1e293b',
      }}
    >
      <span style={{ color }} className="[&>svg]:w-3 [&>svg]:h-3">{icon}</span>
      <span style={{ fontSize: '11px', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function DaySummaryCard({
  day, courses, darkMode,
}: {
  day: DayKey; courses: typeof COURSES; darkMode: boolean;
}) {
  const text = darkMode ? '#f1f5f9' : '#0f172a';
  const muted = darkMode ? '#64748b' : '#94a3b8';

  if (courses.length === 0) {
    return (
      <div
        className="px-3 py-2.5 rounded-lg"
        style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }}
      >
        <p style={{ fontSize: '11px', fontWeight: 600, color: muted }}>{DAY_LABELS[day].slice(0, 3)}</p>
        <p style={{ fontSize: '10px', color: muted, marginTop: 2 }}>Free day</p>
      </div>
    );
  }

  return (
    <div
      className="px-3 py-2.5 rounded-lg"
      style={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc' }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <p style={{ fontSize: '11px', fontWeight: 700, color: text }}>{DAY_LABELS[day].slice(0, 3)}</p>
        <span
          className="px-1.5 py-0.5 rounded-full text-[9px] font-bold"
          style={{
            backgroundColor: darkMode ? '#172554' : '#dbeafe',
            color: darkMode ? '#93c5fd' : '#1e40af',
          }}
        >
          {courses.length}
        </span>
      </div>
      <div className="space-y-1">
        {courses.map(c => {
          const color = COURSE_COLORS[c.colorIndex];
          return (
            <div
              key={c.id}
              className="flex items-start gap-1.5"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0 mt-1"
                style={{ backgroundColor: darkMode ? color.darkBorder : color.lightBorder }}
              />
              <div>
                <p style={{ fontSize: '9px', fontWeight: 500, color: text, lineHeight: 1.3 }}>
                  {c.name.split(' ').slice(0, 3).join(' ')}
                </p>
                <p style={{ fontSize: '9px', color: muted }}>
                  {c.startTime}–{c.endTime}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}