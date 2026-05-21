import { X, Search, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';
import { useState } from 'react';

// NOTE: The hardcoded elective-substitute list was removed for the backend
// handoff. Courses now render their name as plain text. If elective swapping is
// needed later, source the alternatives from a service (e.g.
// GET /api/courses/:code/electives) and restore the <select> here.

export function CourseManagementModal() {
  const { 
    darkMode, 
    isManageModalOpen, 
    setIsManageModalOpen, 
    algorithmCourses,
    updateCourseSection,
    runAlgorithm
  } = useApp();
  const { t } = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>(''); // 1, 2, 3, 4
  const [selectedSemester, setSelectedSemester] = useState<string>(''); // 1-8

  if (!isManageModalOpen) return null;

  // Filter local algorithm courses. NOTE: the backend already scopes
  // /scheduler/inputs by the secretary's department, so no client-side
  // role/department special-casing is needed here.
  const displayedCourses = algorithmCourses.filter(c => {
    // 1. Class Filter Mapping (Academic Year)
    if (selectedClass) {
      const year = parseInt(selectedClass);
      const startSem = (year - 1) * 2 + 1;
      const endSem = year * 2;
      if (c.course_semester < startSem || c.course_semester > endSem) return false;
    }

    // 2. Semester Filter
    if (selectedSemester && c.course_semester !== parseInt(selectedSemester)) return false;

    // 3. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.course_code.toLowerCase().includes(q) ||
        c.course_name.toLowerCase().includes(q) ||
        c.instructor_full_name.toLowerCase().includes(q);
    }

    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={() => setIsManageModalOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--bg-mute)' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {t.courseManage.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
              {t.courseManage.description}
            </p>
          </div>
          <button
            onClick={() => setIsManageModalOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: 'var(--text-faint)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div 
          className="px-6 py-3 border-b shrink-0 flex flex-wrap items-center gap-3"
          style={{ 
            backgroundColor: 'var(--bg-mute)',
            borderColor: 'var(--border-light)' 
          }}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
              style={{ color: 'var(--text-faint)' }} 
            />
            <input
              type="text"
              placeholder={t.courseManage.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-opacity-50 outline-none"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Sınıf Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm font-medium transition-all focus:ring-2 outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-light)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="">Tüm Sınıflar</option>
            <option value="1">1. Sınıf (Sem 1-2)</option>
            <option value="2">2. Sınıf (Sem 3-4)</option>
            <option value="3">3. Sınıf (Sem 5-6)</option>
            <option value="4">4. Sınıf (Sem 7-8)</option>
          </select>

          {/* Semester Filter */}
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm font-medium transition-all focus:ring-2 outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-light)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="">Tüm Dönemler</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>{s}. Dönem</option>
            ))}
          </select>
        </div>

        {/* Course List */}
        <div className="flex-1 overflow-y-auto p-2">
          {displayedCourses.length === 0 ? (
            <div className="text-center py-10" style={{ color: 'var(--text-faint)' }}>
              <p className="text-sm font-medium">{t.courseManage.noCourses}</p>
            </div>
          ) : (
            <div className="grid gap-1">
              {displayedCourses.map(course => (
                <div
                  key={course.course_code}
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors group"
                  style={{
                    backgroundColor: course.section_count > 0
                      ? (darkMode ? '#1e293b' : '#ffffff')
                      : ('var(--bg-soft)'),
                    opacity: course.section_count > 0 ? 1 : 0.6,
                    border: `1px solid ${'var(--border-light)'}`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{
                         backgroundColor: 'var(--border-light)',
                         color: 'var(--text-muted)'
                      }}>
                        {course.course_code}
                      </span>
                      <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {course.course_name}
                      </h3>
                    </div>
                    <p className="text-[11px] truncate flex items-center gap-2" style={{ color: 'var(--text-faint)' }}>
                      <span>👤 {course.instructor_full_name === 'anonim' ? 'Havuz/Atanmamış' : course.instructor_full_name}</span>
                      <span>•</span>
                      <span>⏳ {course.weekly_hours} {t.courseManage.hoursPerWeek}</span>
                      <span>•</span>
                      <span>📚 {course.course_semester}. {t.courseManage.semester}</span>
                    </p>
                  </div>

                  {/* Section Controls */}
                  <div className="flex flex-col items-center gap-1 shrink-0 px-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-faint)' }}>
                      {t.courseManage.sections}
                    </span>
                    <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 rounded-full p-1" style={{ border: `1px solid ${'var(--border-light)'}` }}>
                      <button
                        onClick={() => updateCourseSection(course.course_code, -1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center" style={{ color: 'var(--text-primary)' }}>
                        {course.section_count}
                      </span>
                      <button
                        onClick={() => updateCourseSection(course.course_code, 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 border-t shrink-0 flex items-center justify-between"
          style={{ 
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--bg-mute)' 
          }}
        >
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {t.courseManage.totalActive} {algorithmCourses.filter(c => c.section_count > 0).length}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsManageModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: 'var(--text-muted)' }}
            >
              {t.close}
            </button>
            <button
              onClick={() => {
                setIsManageModalOpen(false);
                runAlgorithm();
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
              style={{ background: 'var(--brand-gradient)' }}
            >
              {t.courseManage.applyAndRun}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
