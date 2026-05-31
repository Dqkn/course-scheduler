import { CheckCircle2, Download, RefreshCw, BarChart2, X, Link2, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';
import { LoginScreen } from '../components/LoginScreen';
import { DynamicFilters } from '../components/DynamicFilters';
import { StatusPanel } from '../components/StatusPanel';
import { CourseDetailModal } from '../components/CourseDetailModal';
import { CourseManagementModal } from '../components/CourseManagementModal';
import { ConstraintPanel } from '../components/ConstraintPanel';
import { ConstraintDefinitionPanel } from '../components/ConstraintDefinitionPanel';
import { ScheduleTableView } from '../components/ScheduleTableView';
import { ProgressStepper } from '../components/ProgressStepper';
import { PublishValidationModal } from '../components/PublishValidationModal';
import { useState } from 'react';

export function AdminDashboard() {
  const { darkMode, publishedAt, setPublishedAt, selectedCourse, setIsManageModalOpen, isCalculating, runAlgorithm, scheduledCourses, selectedTerm, setSelectedTerm, currentUser, linkedGroups, constraints } = useApp();
  const { t, locale } = useLocale();
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isLinkingOpen, setIsLinkingOpen] = useState(false);
  const [isConstraintDefOpen, setIsConstraintDefOpen] = useState(false);
  const [isValidationOpen, setIsValidationOpen] = useState(false);

  if (!currentUser || currentUser.role === 'instructor') {
    return <LoginScreen portalType="admin" />;
  }

  function openPublishValidation() {
    setIsValidationOpen(true);
  }

  function handlePublishConfirm() {
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
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      {/* Top bar */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-3 sm:px-5 py-3 sm:py-2.5 border-b shrink-0"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-light)',
        }}
      >
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div>
            <h1
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              {t.admin.title}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {selectedTerm === 'spring' ? 'Bahar' : 'Güz'} {new Date().getFullYear()} · {scheduledCourses.length} {t.admin.sessions}
            </p>
          </div>

          {/* Mobile Panel Toggle */}
          <button
            onClick={() => setIsMobilePanelOpen(true)}
            className="flex lg:hidden items-center justify-center p-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--bg-mute)',
              color: 'var(--text-primary)',
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
              backgroundColor: 'var(--brand-primary)',
              color: 'var(--brand-on-primary)',
            }}
          >
            {t.admin.manageCourses}
          </button>
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors"
            style={{
              fontSize: '13px',
              backgroundColor: 'var(--bg-mute)',
              color: 'var(--text-muted)',
            }}
          >
            <Download className="w-3.5 h-3.5" />
            {t.admin.export}
          </button>
          <button
            onClick={() => setIsLinkingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              fontSize: '13px',
              backgroundColor: linkedGroups.length > 0
                ? (darkMode ? '#1e3a5f' : '#e0f2fe')
                : 'var(--bg-mute)',
              color: linkedGroups.length > 0
                ? 'var(--brand-primary)'
                : 'var(--text-muted)',
              border: linkedGroups.length > 0 ? '1px solid var(--brand-primary)' : 'none',
            }}
          >
            <Link2 className="w-3.5 h-3.5" />
            {t.constraints.title}
            {linkedGroups.length > 0 && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  color: 'var(--brand-on-primary)',
                }}
              >
                {linkedGroups.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsConstraintDefOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              fontSize: '13px',
              backgroundColor: constraints.length > 0
                ? (darkMode ? '#422006' : '#fef3c7')
                : 'var(--bg-mute)',
              color: constraints.length > 0
                ? '#d97706'
                : 'var(--text-muted)',
              border: constraints.length > 0 ? '1px solid #d97706' : 'none',
            }}
          >
            <Shield className="w-3.5 h-3.5" />
            {t.constraintDef.title}
            {constraints.length > 0 && (
              <span
                className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: '#d97706', color: '#fff' }}
              >
                {constraints.length}
              </span>
            )}
          </button>
          {/* Term selector */}
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as 'fall' | 'spring')}
            className="px-2 py-1.5 rounded-lg text-xs font-medium focus:outline-none"
            style={{
              fontSize: '13px',
              backgroundColor: 'var(--bg-mute)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
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
              background: isCalculating ? 'var(--bg-mute)' : 'var(--brand-gradient)',
              color: isCalculating ? 'var(--text-muted)' : 'var(--brand-on-primary)',
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

      {/* Progress Stepper */}
      <ProgressStepper
        onStepCourses={() => setIsManageModalOpen(true)}
        onStepConstraints={() => {
          if (isLinkingOpen || isConstraintDefOpen) return;
          setIsLinkingOpen(true);
        }}
        onStepAlgorithm={() => {
          if (!isCalculating) runAlgorithm();
        }}
        onStepPublish={openPublishValidation}
      />

      {/* Filters */}
      <DynamicFilters />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden relative">
        <ScheduleTableView />

        {/* Desktop Status panel (lg and up) */}
        <div className="hidden lg:flex shrink-0">
          <StatusPanel onPublish={openPublishValidation} />
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
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
              >
                <X className="w-4 h-4" />
              </button>
              <StatusPanel onPublish={openPublishValidation} isMobile={true} />
            </div>
          </div>
        )}
      </div>

      {/* Course detail modal */}
      {selectedCourse && <CourseDetailModal />}

      {/* Course management modal for Opening/Closing courses */}
      <CourseManagementModal />

      {/* Course linking panel */}
      {isLinkingOpen && <ConstraintPanel onClose={() => setIsLinkingOpen(false)} />}

      {/* Constraint definition panel */}
      {isConstraintDefOpen && <ConstraintDefinitionPanel onClose={() => setIsConstraintDefOpen(false)} />}

      {/* Publish validation modal */}
      {isValidationOpen && (
        <PublishValidationModal
          onClose={() => setIsValidationOpen(false)}
          onConfirm={handlePublishConfirm}
        />
      )}
    </div>
  );
}
