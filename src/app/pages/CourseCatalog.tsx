import { BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCourseData } from '../hooks/useCourseData';
import { CourseDataTable } from '../components/CourseDataTable';
import { LoginScreen } from '../components/LoginScreen';
import { useMemo } from 'react';

/**
 * ─── CourseCatalog Page ─────────────────────────────────────────────────────
 *
 * Assembles the useCourseData hook with the CourseDataTable component.
 * This page knows *what* to display, but not *how* or *where* data comes from.
 *
 * Architecture:
 *   fetchCourseData (service) → useCourseData (hook) → CourseCatalog (page) → CourseDataTable (UI)
 * ────────────────────────────────────────────────────────────────────────────
 */
export function CourseCatalog() {
  const { darkMode, currentUser } = useApp();
  const { courses, isLoading, error, refetch } = useCourseData();

  const filteredCourses = useMemo(() => {
    if (!currentUser) return [];
    
    // Dean sees everything
    if (currentUser.role === 'dean') return courses;
    
    // Secretary only sees their own department.
    // Map Secretary "department" name to dept_id (e.g. 'Bilgisayar Mühendisliği' -> 'BİL')
    if (currentUser.role === 'department_secretary' && currentUser.department) {
      return courses.filter(c => {
         if (currentUser.id === 'bil_sekreter') return c.dept_id === 'BİL';
         if (currentUser.id === 'yaz_sekreter') return c.dept_id === 'CSE'; // Map Yazılım to CSE for mock data
         return true;
      });
    }
    
    // Academic sees all courses in the catalog reference
    return courses;
  }, [courses, currentUser]);

  if (!currentUser) {
    return <LoginScreen portalType="academic" />;
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: darkMode ? '#050c1a' : '#f8faff' }}
    >
      {/* ── Page Header ── */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{
          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
          borderColor: darkMode ? '#1e293b' : '#e2e8f0',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, #1e3a5f, #172554)'
                : 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
            }}
          >
            <BookOpen
              className="w-4.5 h-4.5"
              style={{ color: darkMode ? '#60a5fa' : '#2563eb' }}
            />
          </div>
          <div>
            <h1
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: darkMode ? '#f1f5f9' : '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              Course Catalog
            </h1>
            <p style={{ fontSize: '11px', color: darkMode ? '#64748b' : '#94a3b8' }}>
              University course database · Welcome {currentUser.name}
            </p>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <CourseDataTable
          courses={filteredCourses}
          isLoading={isLoading}
          error={error}
          onRefresh={refetch}
        />
      </div>
    </div>
  );
}
