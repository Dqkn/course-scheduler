import { CheckCircle2, Download, RefreshCw, BarChart2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';
import { Navigate } from 'react-router';
import { LoginScreen } from '../components/LoginScreen';
import { DynamicFilters } from '../components/DynamicFilters';
import { WeeklyGrid } from '../components/WeeklyGrid';
import { StatusPanel } from '../components/StatusPanel';
import { CourseDetailModal } from '../components/CourseDetailModal';
import { CourseManagementModal } from '../components/CourseManagementModal';
import { useState } from 'react';

export function AdminDashboard() {
  const { darkMode, publishedAt, setPublishedAt, selectedCourse, setIsManageModalOpen, isCalculating, runAlgorithm, scheduledCourses, selectedTerm, setSelectedTerm, currentUser } = useApp();
  const { t, locale } = useLocale();
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  if (!currentUser || currentUser.role === 'academic') {
    return <LoginScreen portalType="admin" />;
  }

  function handlePublish() {
    const now = new Date();
    const formatted = now.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    setPublishedAt(formatted);
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: darkMode ? '#050c1a' : '#fafafa' }}
    >
      {/* Top bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-3 sm:px-5 py-3 sm:py-2.5 border-b shrink-0"
        style={{
          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
          borderColor: darkMode ? '#1e293b' : '#d1d5db',
        }}
      >
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h1
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: darkMode ? '#f1f5f9' : '#1a1a2e',
                letterSpacing: '-0.02em',
              }}
            >
              {t.admin.title}
            </h1>
            <p style={{ fontSize: '13px', color: darkMode ? '#64748b' : '#475569' }}>
              {selectedTerm === 'spring' ? 'Bahar' : 'Güz'} 2026 · {scheduledCourses.length} {t.admin.sessions}
            </p>
          </div>
          
          {/* Mobile Panel Toggle */}
          <button
            onClick={() => setIsMobilePanelOpen(true)}
            className="flex lg:hidden items-center justify-center p-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: darkMode ? '#1e293b' : '#f0f0f0',
              color: darkMode ? '#f1f5f9' : '#1a1a2e',
            }}
          >
            <BarChart2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setIsManageModalOpen(true)}
            className="flex-1 sm:flex-none justify-center px-4 py-1.5 rounded-lg font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
            style={{
              fontSize: '13px',
              backgroundColor: darkMode ? '#3b82f6' : '#2563eb',
              color: '#ffffff',
            }}
          >
            {t.admin.manageCourses}
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors"
            style={{
              fontSize: '13px',
              backgroundColor: darkMode ? '#1e293b' : '#f0f0f0',
              color: darkMode ? '#94a3b8' : '#475569',
            }}
          >
            <Download className="w-3.5 h-3.5" />
            {t.admin.export}
          </button>
          {/* Term selector */}
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as 'fall' | 'spring')}
            className="px-2 py-1.5 rounded-lg text-xs font-medium focus:outline-none"
            style={{
              fontSize: '13px',
              backgroundColor: darkMode ? '#1e293b' : '#f0f0f0',
              color: darkMode ? '#e2e8f0' : '#1a1a2e',
              border: `1px solid ${darkMode ? '#334155' : '#d1d5db'}`,
            }}
          >
            <option value="spring">Bahar (Çift Dönem)</option>
            <option value="fall">Güz (Tek Dönem)</option>
          </select>
          <button
            onClick={runAlgorithm}
            disabled={isCalculating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              fontSize: '13px',
              background: isCalculating ? (darkMode ? '#1e293b' : '#f0f0f0') : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: isCalculating ? (darkMode ? '#94a3b8' : '#475569') : '#ffffff',
              opacity: isCalculating ? 0.7 : 1,
              cursor: isCalculating ? 'not-allowed' : 'pointer'
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? t.admin.running : t.admin.runAlgorithm}
          </button>
          {publishedAt && (
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold ml-auto sm:ml-0"
              style={{
                fontSize: '13px',
                backgroundColor: darkMode ? '#022c22' : '#f0fdf4',
                color: '#16a34a',
              }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t.published}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <DynamicFilters />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Grid */}
        <WeeklyGrid />

        {/* Desktop Status panel (lg and up) */}
        <div className="hidden lg:flex shrink-0">
          <StatusPanel onPublish={handlePublish} />
        </div>
        
        {/* Mobile Status panel overlay */}
        {isMobilePanelOpen && (
          <div className="lg:hidden absolute inset-0 z-50 flex justify-end">
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
              onClick={() => setIsMobilePanelOpen(false)}
            />
            <div className="relative h-full animate-in slide-in-from-right duration-200 ease-out shadow-2xl">
              <button
                onClick={() => setIsMobilePanelOpen(false)}
                className="absolute top-3 left-[-40px] p-2 rounded-full shadow-lg border border-white/20"
                style={{ backgroundColor: darkMode ? '#0f172a' : '#ffffff', color: darkMode ? '#f1f5f9' : '#0f172a' }}
              >
                <X className="w-4 h-4" />
              </button>
              <StatusPanel onPublish={handlePublish} isMobile={true} />
            </div>
          </div>
        )}
      </div>

      {/* Course detail modal */}
      {selectedCourse && <CourseDetailModal />}

      {/* Course management modal for Opening/Closing courses */}
      <CourseManagementModal />
    </div>
  );
}
