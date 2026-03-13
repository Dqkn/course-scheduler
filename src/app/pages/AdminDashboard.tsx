import { CheckCircle2, Download, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DynamicFilters } from '../components/DynamicFilters';
import { WeeklyGrid } from '../components/WeeklyGrid';
import { StatusPanel } from '../components/StatusPanel';
import { CourseDetailModal } from '../components/CourseDetailModal';
import { CourseManagementModal } from '../components/CourseManagementModal';
import { STATUS_DATA } from '../data/mockData';

export function AdminDashboard() {
  const { darkMode, publishedAt, setPublishedAt, selectedCourse, setIsManageModalOpen } = useApp();

  function handlePublish() {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    setPublishedAt(formatted);
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: darkMode ? '#050c1a' : '#f8faff' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-2.5 border-b shrink-0"
        style={{
          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
          borderColor: darkMode ? '#1e293b' : '#e2e8f0',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: darkMode ? '#f1f5f9' : '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Weekly Programme
          </h1>
          <p style={{ fontSize: '11px', color: darkMode ? '#64748b' : '#94a3b8' }}>
            Spring 2026 · Week 10 · {STATUS_DATA.totalPlaced} sessions scheduled
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="flex items-center justify-center px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 mr-2"
            style={{
              backgroundColor: darkMode ? '#3b82f6' : '#2563eb',
              color: '#ffffff',
            }}
          >
            Manage Courses
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
              color: darkMode ? '#94a3b8' : '#64748b',
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
              color: darkMode ? '#94a3b8' : '#64748b',
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-run
          </button>
          {publishedAt && (
            <span
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                backgroundColor: darkMode ? '#022c22' : '#f0fdf4',
                color: '#16a34a',
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Published
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <DynamicFilters />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Grid */}
        <WeeklyGrid />

        {/* Status panel */}
        <StatusPanel onPublish={handlePublish} />
      </div>

      {/* Course detail modal */}
      {selectedCourse && <CourseDetailModal />}

      {/* Course management modal for Opening/Closing courses */}
      <CourseManagementModal />
    </div>
  );
}
