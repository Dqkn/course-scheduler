import { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  BookOpen,
  RefreshCw,
  Wifi,
  WifiOff,
  Globe,
  FlaskConical,
  AlertCircle,
} from 'lucide-react';
import type { DbCourse } from '../types/courseTypes';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';
import '../../styles/CourseDataTable.css';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Props                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

interface CourseDataTableProps {
  /** Array of courses to display */
  courses: DbCourse[];
  /** Whether data is currently being fetched */
  isLoading: boolean;
  /** Error message, or null */
  error?: string | null;
  /** Callback to refetch data */
  onRefresh?: () => void;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Sorting                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

type SortField = 'code' | 'name' | 'dept_id' | 'program_semester' | 't_hour' | 'l_hour';
type SortDirection = 'asc' | 'desc';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Component                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */

export function CourseDataTable({
  courses,
  isLoading,
  error = null,
  onRefresh,
}: CourseDataTableProps) {
  const { darkMode } = useApp();
  const { t } = useLocale();

  // ── Local state ──
  const [sortField, setSortField] = useState<SortField>('code');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // ── Derived values ──
  const uniqueDepts = useMemo(
    () => Array.from(new Set(courses.map((c) => c.dept_id))).sort(),
    [courses]
  );

  const filtered = useMemo(() => {
    let result = courses;

    if (deptFilter) {
      result = result.filter((c) => c.dept_id === deptFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.dept_id.toLowerCase().includes(q)
      );
    }

    return result;
  }, [courses, deptFilter, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      const av = a[sortField];
      const bv = b[sortField];

      if (typeof av === 'string' && typeof bv === 'string') {
        cmp = av.localeCompare(bv);
      } else if (typeof av === 'number' && typeof bv === 'number') {
        cmp = av - bv;
      }

      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  // ── Handlers ──
  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (field !== sortField) return <ArrowUpDown className="w-3 h-3" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  }

  // ── Colors ──
  const bg = darkMode ? '#0f172a' : '#ffffff';
  const headerBg = darkMode ? '#1e293b' : '#f5f5f5';
  const textPrimary = darkMode ? '#f1f5f9' : '#1a1a2e';
  const textSecondary = darkMode ? '#94a3b8' : '#475569';
  const hoverBg = darkMode ? '#1e293b' : '#f5f5f5';
  const semesterBg = darkMode ? '#1e293b' : '#f0f0f0';

  /* ──────────────────────────────────────────────────────────────────────── */
  /*  Render                                                                 */
  /* ──────────────────────────────────────────────────────────────────────── */

  return (
    <div className="cdt-container" style={{ background: bg }}>
      {/* ── Header ── */}
      <div className="cdt-header" style={{ background: headerBg }}>
        <div className="cdt-header-left">
          <span className="cdt-header-title" style={{ color: textPrimary }}>
            {t.courseTable.title}
          </span>
          <span className="cdt-header-subtitle" style={{ color: textSecondary }}>
            {isLoading
              ? t.courseTable.loading
              : `${sorted.length} / ${courses.length}`}
          </span>
        </div>
        <div className="cdt-header-actions">
          {onRefresh && (
            <button
              className="cdt-btn"
              onClick={onRefresh}
              disabled={isLoading}
              style={{
                background: darkMode ? '#1e293b' : '#f1f5f9',
                color: textSecondary,
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              {t.courseTable.refresh}
            </button>
          )}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          className="cdt-error"
          style={{
            background: darkMode ? '#450a0a' : '#fef2f2',
            borderColor: darkMode ? '#7f1d1d' : '#fecaca',
            color: darkMode ? '#fca5a5' : '#b91c1c',
          }}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="ml-auto text-xs font-semibold underline hover:no-underline"
            >
              {t.courseTable.retry}
            </button>
          )}
        </div>
      )}

      {/* ── Filter bar ── */}
      {!isLoading && courses.length > 0 && (
        <div className="cdt-filter-bar" style={{ background: headerBg }}>
          <div className="cdt-filter-search-wrapper">
            <Search className="cdt-filter-search-icon w-3.5 h-3.5" style={{ color: textSecondary }} />
            <input
              type="text"
              placeholder={t.courseTable.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cdt-filter-search"
              style={{
                background: bg,
                color: textPrimary,
                borderColor: darkMode ? '#334155' : '#e2e8f0',
              }}
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="cdt-filter-select"
            style={{
              background: bg,
              color: textPrimary,
              borderColor: darkMode ? '#334155' : '#e2e8f0',
            }}
          >
            <option value="">{t.courseTable.allDepartments}</option>
            {uniqueDepts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="cdt-skeleton-row">
              <div
                className="cdt-skeleton-cell"
                style={{ width: 60, background: headerBg }}
              />
              <div
                className="cdt-skeleton-cell"
                style={{ width: 80, background: headerBg }}
              />
              <div
                className="cdt-skeleton-cell"
                style={{ width: 180 + Math.random() * 80, background: headerBg }}
              />
              <div
                className="cdt-skeleton-cell"
                style={{ width: 40, background: headerBg }}
              />
              <div
                className="cdt-skeleton-cell"
                style={{ width: 40, background: headerBg }}
              />
              <div
                className="cdt-skeleton-cell"
                style={{ width: 32, background: headerBg }}
              />
              <div
                className="cdt-skeleton-cell"
                style={{ width: 70, background: headerBg }}
              />
              <div
                className="cdt-skeleton-cell"
                style={{ width: 60, background: headerBg }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoading && !error && courses.length === 0 && (
        <div className="cdt-empty">
          <div
            className="cdt-empty-icon"
            style={{ background: darkMode ? '#1e293b' : '#f1f5f9' }}
          >
            <BookOpen className="w-6 h-6" style={{ color: textSecondary }} />
          </div>
          <span className="cdt-empty-title" style={{ color: textPrimary }}>
            {t.courseTable.noCourses}
          </span>
          <span className="cdt-empty-desc" style={{ color: textSecondary }}>
            {t.courseTable.noCoursesDesc}
          </span>
        </div>
      )}

      {/* ── Filtered-empty state ── */}
      {!isLoading && !error && courses.length > 0 && sorted.length === 0 && (
        <div className="cdt-empty">
          <div
            className="cdt-empty-icon"
            style={{ background: darkMode ? '#1e293b' : '#f1f5f9' }}
          >
            <Search className="w-6 h-6" style={{ color: textSecondary }} />
          </div>
          <span className="cdt-empty-title" style={{ color: textPrimary }}>
            {t.courseTable.noMatching}
          </span>
          <span className="cdt-empty-desc" style={{ color: textSecondary }}>
            {t.courseTable.noMatchingDesc}
          </span>
        </div>
      )}

      {/* ── Data table ── */}
      {!isLoading && sorted.length > 0 && (
        <div className="cdt-scroll">
          <table className="cdt-table">
            <thead>
              <tr style={{ background: headerBg }}>
                <th style={{ color: textSecondary }} onClick={() => handleSort('dept_id')}>
                  <div className="cdt-th-content">
                    {t.courseTable.dept}
                    <span className={`cdt-sort-icon ${sortField === 'dept_id' ? 'active' : ''}`}>
                      <SortIcon field="dept_id" />
                    </span>
                  </div>
                </th>
                <th style={{ color: textSecondary }} onClick={() => handleSort('code')}>
                  <div className="cdt-th-content">
                    {t.courseTable.code}
                    <span className={`cdt-sort-icon ${sortField === 'code' ? 'active' : ''}`}>
                      <SortIcon field="code" />
                    </span>
                  </div>
                </th>
                <th style={{ color: textSecondary }} onClick={() => handleSort('name')}>
                  <div className="cdt-th-content">
                    {t.courseTable.courseName}
                    <span className={`cdt-sort-icon ${sortField === 'name' ? 'active' : ''}`}>
                      <SortIcon field="name" />
                    </span>
                  </div>
                </th>
                <th style={{ color: textSecondary }} onClick={() => handleSort('t_hour')}>
                  <div className="cdt-th-content">
                    {t.courseTable.theory}
                    <span className={`cdt-sort-icon ${sortField === 't_hour' ? 'active' : ''}`}>
                      <SortIcon field="t_hour" />
                    </span>
                  </div>
                </th>
                <th style={{ color: textSecondary }} onClick={() => handleSort('l_hour')}>
                  <div className="cdt-th-content">
                    {t.courseTable.lab}
                    <span className={`cdt-sort-icon ${sortField === 'l_hour' ? 'active' : ''}`}>
                      <SortIcon field="l_hour" />
                    </span>
                  </div>
                </th>
                <th style={{ color: textSecondary }} onClick={() => handleSort('program_semester')}>
                  <div className="cdt-th-content">
                    {t.courseTable.sem}
                    <span className={`cdt-sort-icon ${sortField === 'program_semester' ? 'active' : ''}`}>
                      <SortIcon field="program_semester" />
                    </span>
                  </div>
                </th>
                <th style={{ color: textSecondary }}>
                  <div className="cdt-th-content">{t.courseTable.statusLabel}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((course, idx) => (
                <tr
                  key={`${course.dept_id}-${course.code}-${idx}`}
                  style={{ cursor: 'default' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Dept */}
                  <td>
                    <span
                      className="cdt-badge-dept"
                      style={(() => {
                        const colors: Record<string, { bg: string; text: string }> = {
                          'BİL':  { bg: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(79,70,229,0.1))', text: '#6366f1' },
                          'CSE':  { bg: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.1))', text: '#3b82f6' },
                          'EEM':  { bg: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(139,92,246,0.1))', text: '#a855f7' },
                          'EEE':  { bg: 'linear-gradient(135deg, rgba(192,38,211,0.15), rgba(168,85,247,0.1))', text: '#c026d3' },
                          'END':  { bg: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.1))', text: '#f59e0b' },
                          'IND':  { bg: 'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(202,138,4,0.1))', text: '#eab308' },
                          'MAK':  { bg: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(220,38,38,0.1))', text: '#ef4444' },
                          'ME':   { bg: 'linear-gradient(135deg, rgba(244,63,94,0.15), rgba(225,29,72,0.1))', text: '#f43f5e' },
                          'BME':  { bg: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))', text: '#10b981' },
                          'BENG': { bg: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(13,148,136,0.1))', text: '#14b8a6' },
                          'AI':   { bg: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(8,145,178,0.1))', text: '#06b6d4' },
                          'CE':   { bg: 'linear-gradient(135deg, rgba(107,114,128,0.15), rgba(75,85,99,0.1))', text: '#6b7280' },
                        };
                        const c = colors[course.dept_id] || { bg: 'linear-gradient(135deg, rgba(107,114,128,0.15), rgba(75,85,99,0.1))', text: '#6b7280' };
                        return { background: c.bg, color: c.text };
                      })()}
                    >
                      {course.dept_id}
                    </span>
                  </td>

                  {/* Code */}
                  <td>
                    <span className="cdt-code" style={{ color: textPrimary }}>
                      {course.code}
                    </span>
                  </td>

                  {/* Name */}
                  <td>
                    <span className="cdt-course-name" style={{ color: textPrimary }}>
                      {course.name}
                    </span>
                  </td>

                  {/* Theory hours */}
                  <td>
                    <div className="cdt-hours" style={{ color: textPrimary }}>
                      <span className="cdt-hours-value">{course.t_hour}</span>
                      <span className="cdt-hours-label" style={{ color: textSecondary }}>
                        {t.courseTable.hr}
                      </span>
                    </div>
                  </td>

                  {/* Lab hours */}
                  <td>
                    <div className="cdt-hours" style={{ color: textPrimary }}>
                      <span className="cdt-hours-value">{course.l_hour}</span>
                      <span className="cdt-hours-label" style={{ color: textSecondary }}>
                        {t.courseTable.hr}
                      </span>
                    </div>
                  </td>

                  {/* Semester */}
                  <td>
                    <span
                      className="cdt-semester"
                      style={{
                        background: semesterBg,
                        color: textPrimary,
                      }}
                    >
                      {course.program_semester}
                    </span>
                  </td>

                  {/* Status badges */}
                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {course.is_online ? (
                        <span className="cdt-badge cdt-badge-online">
                          <Globe className="w-3 h-3" />
                          {t.courseTable.online}
                        </span>
                      ) : (
                        <span className="cdt-badge cdt-badge-offline" style={{ color: textSecondary }}>
                          <WifiOff className="w-3 h-3" />
                          {t.courseTable.inClass}
                        </span>
                      )}
                      {course.is_service_course && (
                        <span className="cdt-badge cdt-badge-service">
                          <FlaskConical className="w-3 h-3" />
                          {t.courseTable.service}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Footer ── */}
      {!isLoading && sorted.length > 0 && (
        <div className="cdt-footer" style={{ color: textSecondary }}>
          <span>
            {sorted.length} / {courses.length}
          </span>
          <span>
            {uniqueDepts.length} {t.courseTable.departments}
          </span>
        </div>
      )}
    </div>
  );
}
