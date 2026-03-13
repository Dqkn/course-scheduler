import { ReactNode } from 'react';
import { X, MapPin, Users, Clock, BookOpen, AlertTriangle, GraduationCap, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COURSE_COLORS, DAY_LABELS } from '../data/mockData';

export function CourseDetailModal() {
  const { selectedCourse, setSelectedCourse, darkMode } = useApp();
  if (!selectedCourse) return null;

  const color = COURSE_COLORS[selectedCourse.colorIndex];
  const bg = darkMode ? color.darkBg : color.lightBg;
  const border = darkMode ? color.darkBorder : color.lightBorder;
  const textColor = darkMode ? color.darkText : color.lightText;
  const capacityPct = Math.round((selectedCourse.studentsEnrolled / selectedCourse.totalCapacity) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={() => setSelectedCourse(null)}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Colored top accent */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: border }}
        />

        {/* Header */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide"
                  style={{ backgroundColor: bg, color: textColor }}
                >
                  {selectedCourse.code}
                </span>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                  style={{
                    backgroundColor: darkMode ? '#0f172a' : '#f1f5f9',
                    color: darkMode ? '#94a3b8' : '#64748b',
                  }}
                >
                  {selectedCourse.type}
                </span>
                {selectedCourse.hasConflict && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Conflict
                  </span>
                )}
              </div>
              <h2
                className="pr-2"
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: darkMode ? '#f1f5f9' : '#0f172a',
                  lineHeight: 1.3,
                }}
              >
                {selectedCourse.name}
              </h2>
            </div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{
                backgroundColor: darkMode ? '#0f172a' : '#f1f5f9',
                color: darkMode ? '#64748b' : '#94a3b8',
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: darkMode ? '#334155' : '#f1f5f9' }} />

        {/* Details */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4">
          <Detail
            icon={<User className="w-4 h-4" />}
            label="Lecturer"
            value={selectedCourse.lecturer}
            darkMode={darkMode}
          />
          <Detail
            icon={<BookOpen className="w-4 h-4" />}
            label="Department"
            value={selectedCourse.department}
            darkMode={darkMode}
          />
          <Detail
            icon={<GraduationCap className="w-4 h-4" />}
            label="Class"
            value={selectedCourse.classLevel}
            darkMode={darkMode}
          />
          <Detail
            icon={<MapPin className="w-4 h-4" />}
            label="Room"
            value={selectedCourse.room}
            darkMode={darkMode}
          />
          <Detail
            icon={<Clock className="w-4 h-4" />}
            label="Day & Time"
            value={`${DAY_LABELS[selectedCourse.day]}, ${selectedCourse.startTime}–${selectedCourse.endTime}`}
            darkMode={darkMode}
          />
        </div>

        {/* Capacity */}
        <div
          className="mx-6 mb-5 p-4 rounded-xl"
          style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
              <span className="text-xs font-medium" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                Enrolment
              </span>
            </div>
            <span
              className="text-xs font-semibold"
              style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
            >
              {selectedCourse.studentsEnrolled} / {selectedCourse.totalCapacity}
              <span
                className="ml-1.5 font-normal"
                style={{ color: capacityPct >= 90 ? '#ef4444' : darkMode ? '#64748b' : '#94a3b8' }}
              >
                ({capacityPct}%)
              </span>
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${capacityPct}%`,
                backgroundColor: capacityPct >= 90 ? '#ef4444' : capacityPct >= 70 ? '#f59e0b' : border,
              }}
            />
          </div>
        </div>

        {/* Conflict warning */}
        {selectedCourse.hasConflict && (
          <div
            className="mx-6 mb-5 flex items-start gap-3 p-3.5 rounded-xl border"
            style={{
              backgroundColor: darkMode ? '#450a0a' : '#fef2f2',
              borderColor: darkMode ? '#7f1d1d' : '#fecaca',
            }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-0.5">
                Scheduling Conflict Detected
              </p>
              <p className="text-[11px] text-red-500 dark:text-red-400/80">
                {selectedCourse.conflictReason}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          className="flex items-center justify-end gap-2 px-6 pb-5"
        >
          <button
            onClick={() => setSelectedCourse(null)}
            className="px-4 py-2 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: darkMode ? '#0f172a' : '#f1f5f9',
              color: darkMode ? '#94a3b8' : '#64748b',
            }}
          >
            Close
          </button>
          <button
            className="px-4 py-2 rounded-lg text-xs font-medium text-white transition-colors"
            style={{ backgroundColor: border }}
            onClick={() => setSelectedCourse(null)}
          >
            Edit Course
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  darkMode,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  darkMode: boolean;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 mb-0.5"
        style={{ color: darkMode ? '#64748b' : '#94a3b8' }}
      >
        <span className="[&>svg]:w-3 [&>svg]:h-3">{icon}</span>
        <span style={{ fontSize: '10px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </div>
      <p
        className="text-xs"
        style={{
          fontWeight: 500,
          color: darkMode ? '#e2e8f0' : '#1e293b',
          lineHeight: 1.4,
        }}
      >
        {value}
      </p>
    </div>
  );
}