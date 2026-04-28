import { X, Search, Plus, Minus, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';
import { useState } from 'react';
import { ALGORITHM_COURSES } from '../data/algorithmData';

const ELECTIVE_SUBSTITUTES = [
  { name: 'Görüntü İşleme', lecturer: 'Prof. Dr. Ahmet Yılmaz' },
  { name: 'Bulut Bilişim', lecturer: 'Doç. Dr. Ayşe Kaya' },
  { name: 'Kriptografi Programlama', lecturer: 'Dr. Öğr. Üyesi Mehmet Demir' },
];

export function CourseManagementModal() {
  const { 
    darkMode, 
    isManageModalOpen, 
    setIsManageModalOpen, 
    algorithmCourses,
    updateCourseSection,
    updateCourseContext,
    runAlgorithm,
    currentUser
  } = useApp();
  const { t } = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>(''); // 1, 2, 3, 4
  const [selectedSemester, setSelectedSemester] = useState<string>(''); // 1-8

  if (!isManageModalOpen) return null;

  // Filter local algorithm courses
  const displayedCourses = algorithmCourses.filter(c => {
    // 1. Role-based visibility
    if (currentUser?.role === 'department_secretary' && currentUser.department) {
      if (currentUser.id === 'bil_sekreter' && !c.code.includes('BİL') && !c.code.includes('MAT')) return false;
    }

    // 2. Class Filter Mapping (Academic Year)
    if (selectedClass) {
      const year = parseInt(selectedClass);
      const startSem = (year - 1) * 2 + 1;
      const endSem = year * 2;
      if (c.semester < startSem || c.semester > endSem) return false;
    }

    // 3. Semester Filter
    if (selectedSemester && c.semester !== parseInt(selectedSemester)) return false;

    // 4. Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.lecturer.toLowerCase().includes(q);
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
        style={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: darkMode ? '#1e293b' : '#e2e8f0' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}>
              {t.courseManage.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              {t.courseManage.description}
            </p>
          </div>
          <button
            onClick={() => setIsManageModalOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: darkMode ? '#94a3b8' : '#64748b' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div 
          className="px-6 py-3 border-b shrink-0 flex flex-wrap items-center gap-3"
          style={{ 
            backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
            borderColor: darkMode ? '#334155' : '#e2e8f0' 
          }}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
              style={{ color: darkMode ? '#64748b' : '#94a3b8' }} 
            />
            <input
              type="text"
              placeholder={t.courseManage.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-opacity-50 outline-none"
              style={{
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                borderColor: darkMode ? '#334155' : '#e2e8f0',
                color: darkMode ? '#f1f5f9' : '#0f172a',
              }}
            />
          </div>

          {/* Sınıf Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm font-medium transition-all focus:ring-2 outline-none cursor-pointer"
            style={{
              backgroundColor: darkMode ? '#0f172a' : '#ffffff',
              borderColor: darkMode ? '#334155' : '#e2e8f0',
              color: darkMode ? '#f1f5f9' : '#0f172a',
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
              backgroundColor: darkMode ? '#0f172a' : '#ffffff',
              borderColor: darkMode ? '#334155' : '#e2e8f0',
              color: darkMode ? '#f1f5f9' : '#0f172a',
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
            <div className="text-center py-10" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
              <p className="text-sm font-medium">{t.courseManage.noCourses}</p>
            </div>
          ) : (
            <div className="grid gap-1">
              {displayedCourses.map(course => (
                <div
                  key={course.code}
                  className="flex items-center gap-4 p-3 rounded-xl transition-colors group"
                  style={{
                    backgroundColor: course.section > 0 
                      ? (darkMode ? '#1e293b' : '#ffffff') 
                      : (darkMode ? '#0f172a' : '#f8fafc'),
                    opacity: course.section > 0 ? 1 : 0.6,
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{
                         backgroundColor: darkMode ? '#334155' : '#e2e8f0',
                         color: darkMode ? '#e2e8f0' : '#475569'
                      }}>
                        {course.code}
                      </span>
                      {course.code.startsWith('BİL00') && course.code !== 'BİL007' ? (
                        <div className="relative inline-block w-full max-w-[220px]">
                          <select
                            value={course.name}
                            onChange={(e) => {
                              const selectedName = e.target.value;
                              const selectedSubstitute = ELECTIVE_SUBSTITUTES.find(s => s.name === selectedName);
                              const defaultCourse = ALGORITHM_COURSES.find(c => c.code === course.code);
                              const newLecturer = selectedSubstitute 
                                ? selectedSubstitute.lecturer 
                                : (defaultCourse?.lecturer || 'anonim');
                              
                              updateCourseContext(course.code, selectedName, newLecturer);
                            }}
                            className="appearance-none w-full text-sm font-semibold truncate border rounded-md pl-2 pr-6 py-0.5 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                            style={{ 
                              color: darkMode ? '#f1f5f9' : '#0f172a',
                              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                              borderColor: darkMode ? '#334155' : '#e2e8f0'
                            }}
                          >
                            <option 
                              value={ALGORITHM_COURSES.find(c => c.code === course.code)?.name || course.name}
                              style={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', color: darkMode ? '#f1f5f9' : '#0f172a' }}
                            >
                              {ALGORITHM_COURSES.find(c => c.code === course.code)?.name} (Varsayılan)
                            </option>
                            {ELECTIVE_SUBSTITUTES.map(sub => (
                              <option 
                                key={sub.name} 
                                value={sub.name}
                                style={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', color: darkMode ? '#f1f5f9' : '#0f172a' }}
                              >
                                {sub.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none opacity-50" />
                        </div>
                      ) : (
                        <h3 className="text-sm font-semibold truncate" style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                          {course.name}
                        </h3>
                      )}
                    </div>
                    <p className="text-[11px] truncate flex items-center gap-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      <span>👤 {course.lecturer === 'anonim' ? 'Havuz/Atanmamış' : course.lecturer}</span>
                      <span>•</span>
                      <span>⏳ {course.hour} {t.courseManage.hoursPerWeek}</span>
                      <span>•</span>
                      <span>📚 {course.semester}. {t.courseManage.semester}</span>
                    </p>
                  </div>
                  
                  {/* Section Controls */}
                  <div className="flex flex-col items-center gap-1 shrink-0 px-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                      {t.courseManage.sections}
                    </span>
                    <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 rounded-full p-1" style={{ border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}>
                      <button
                        onClick={() => updateCourseSection(course.code, -1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center" style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                        {course.section}
                      </span>
                      <button
                        onClick={() => updateCourseSection(course.code, 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
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
            backgroundColor: darkMode ? '#0f172a' : '#ffffff',
            borderColor: darkMode ? '#1e293b' : '#e2e8f0' 
          }}
        >
          <p className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
            {t.courseManage.totalActive} {algorithmCourses.filter(c => c.section > 0).length}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsManageModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: darkMode ? '#e2e8f0' : '#475569' }}
            >
              {t.close}
            </button>
            <button
              onClick={() => {
                setIsManageModalOpen(false);
                runAlgorithm();
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
            >
              {t.courseManage.applyAndRun}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
