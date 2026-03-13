import { X, Check, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COURSES } from '../data/mockData';
import { useCourseFilters, DepartmentFilter } from '../hooks/useCourseFilters';

export function CourseManagementModal() {
  const { 
    darkMode, 
    isManageModalOpen, 
    setIsManageModalOpen, 
    openCourseIds, 
    toggleCourseOpen 
  } = useApp();

  const {
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    handleDepartmentChange,
    selectedClass,
    setSelectedClass,
    departments,
    classOptions,
    filterCourses,
  } = useCourseFilters();

  if (!isManageModalOpen) return null;

  const filteredCourses = filterCourses(COURSES);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={() => setIsManageModalOpen(false)}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
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
              Manage Courses
            </h2>
            <p className="text-xs mt-0.5" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              Select which courses are open for the current semester. Deselected courses will be hidden from everyone.
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

        {/* Filters */}
        <div 
          className="flex flex-col gap-4 px-6 py-4 border-b shrink-0"
          style={{ 
            borderColor: darkMode ? '#1e293b' : '#e2e8f0',
            backgroundColor: darkMode ? '#1e293b40' : '#f8fafc' 
          }}
        >
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
            </div>
            <input
              type="text"
              placeholder="Search courses by name, code, or lecturer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                borderColor: darkMode ? '#334155' : '#cbd5e1',
                color: darkMode ? '#f1f5f9' : '#0f172a',
                outlineColor: darkMode ? '#3b82f6' : '#2563eb'
              }}
            />
          </div>

          {/* Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                Department
              </label>
              <select
                title="Department Filter"
                value={selectedDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value as DepartmentFilter)}
                className="w-full px-3 py-2 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#cbd5e1',
                  color: darkMode ? '#f1f5f9' : '#0f172a',
                  outlineColor: darkMode ? '#3b82f6' : '#2563eb'
                }}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-xs font-semibold mb-1" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                Class/Year
              </label>
              <select
                title="Class/Year Filter"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={!selectedDepartment}
                className="w-full px-3 py-2 rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                  borderColor: darkMode ? '#334155' : '#cbd5e1',
                  color: darkMode ? '#f1f5f9' : '#0f172a',
                  outlineColor: darkMode ? '#3b82f6' : '#2563eb'
                }}
              >
                <option value="">All Classes</option>
                {classOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* List of courses */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-8" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              No courses match the selected filters.
            </div>
          ) : (
            filteredCourses.map(course => {
              const isOpen = openCourseIds.includes(course.id);
              return (
              <label
                key={course.id}
                className="flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group hover:shadow-sm"
                style={{
                  backgroundColor: darkMode 
                    ? (isOpen ? '#1e293b' : '#1e293b80') 
                    : (isOpen ? '#ffffff' : '#f8fafc'),
                  borderColor: darkMode 
                    ? (isOpen ? '#334155' : '#1e293b') 
                    : (isOpen ? '#e2e8f0' : '#f1f5f9'),
                  opacity: isOpen ? 1 : 0.6,
                }}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-5 h-5 rounded flex items-center justify-center border transition-colors"
                    style={{
                      backgroundColor: isOpen 
                        ? (darkMode ? '#3b82f6' : '#2563eb') 
                        : 'transparent',
                      borderColor: isOpen 
                        ? (darkMode ? '#3b82f6' : '#2563eb')
                        : (darkMode ? '#475569' : '#cbd5e1')
                    }}
                  >
                    {isOpen && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: darkMode ? '#0f172a' : '#f1f5f9',
                          color: darkMode ? '#94a3b8' : '#64748b'
                        }}
                      >
                        {course.code}
                      </span>
                      <span 
                        className="text-[10px] font-medium"
                        style={{ color: darkMode ? '#64748b' : '#94a3b8' }}
                      >
                        {course.type}
                      </span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                      {course.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                      {course.lecturer} • {course.department}
                    </p>
                  </div>
                </div>
                
                {/* Hidden real checkbox for accessibility */}
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isOpen}
                  onChange={() => toggleCourseOpen(course.id)}
                />
              </label>
            );
          })
        )}
        </div>

        {/* Footer actions */}
        <div 
          className="flex justify-end gap-2 px-6 py-4 border-t shrink-0"
          style={{ 
            borderColor: darkMode ? '#1e293b' : '#e2e8f0',
            backgroundColor: darkMode ? '#0f172a' : '#f8fafc'
          }}
        >
          <button
            onClick={() => setIsManageModalOpen(false)}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
            style={{ 
              backgroundColor: darkMode ? '#3b82f6' : '#2563eb',
              color: '#ffffff'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
