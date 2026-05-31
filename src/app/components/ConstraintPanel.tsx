import { useState } from 'react';
import { X, Plus, Link2, Trash2, Search, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';

export function ConstraintPanel({ onClose }: { onClose: () => void }) {
  const {
    darkMode,
    algorithmCourses,
    linkedGroups,
    addLinkedGroup,
    removeLinkedGroup,
    updateLinkedGroup,
  } = useApp();
  const { t } = useLocale();
  const ct = t.constraints;

  const [isCreating, setIsCreating] = useState(false);
  const [pendingCodes, setPendingCodes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const allLinkedCodes = new Set(linkedGroups.flatMap(g => g.courseCodes));

  const availableCourses = algorithmCourses.filter(c => {
    if (allLinkedCodes.has(c.course_code) && !pendingCodes.includes(c.course_code)) return false;
    if (pendingCodes.includes(c.course_code)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.course_code.toLowerCase().includes(q) ||
      c.course_name.toLowerCase().includes(q) ||
      c.instructor_full_name.toLowerCase().includes(q);
  });

  function handleAddToPending(code: string) {
    setError('');
    if (allLinkedCodes.has(code)) {
      setError(ct.alreadyInGroup);
      return;
    }
    setPendingCodes(prev => [...prev, code]);
    setSearchQuery('');
  }

  function handleRemoveFromPending(code: string) {
    setPendingCodes(prev => prev.filter(c => c !== code));
  }

  function handleSaveGroup() {
    if (pendingCodes.length < 2) {
      setError(ct.minTwoCourses);
      return;
    }
    addLinkedGroup(pendingCodes);
    setPendingCodes([]);
    setIsCreating(false);
    setError('');
  }

  function handleCancelCreate() {
    setPendingCodes([]);
    setIsCreating(false);
    setError('');
    setSearchQuery('');
  }

  function getCourseName(code: string) {
    const c = algorithmCourses.find(a => a.course_code === code);
    return c ? c.course_name : code;
  }

  function getCourseLecturer(code: string) {
    const c = algorithmCourses.find(a => a.course_code === code);
    return c ? c.instructor_full_name : '';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
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
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Link2 className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
              {ct.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
              {ct.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: 'var(--text-faint)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section: Linked Courses */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {ct.linkedCourses}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>
                {ct.linkedDesc}
              </p>
            </div>
            {!isCreating && (
              <button
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'var(--brand-gradient)',
                  color: 'var(--brand-on-primary)',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                {ct.addGroup}
              </button>
            )}
          </div>

          {/* Existing Groups */}
          {linkedGroups.length === 0 && !isCreating && (
            <div
              className="text-center py-10 rounded-xl border-2 border-dashed"
              style={{ borderColor: 'var(--border-light)' }}
            >
              <Link2 className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-faint)', opacity: 0.5 }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-faint)' }}>
                {ct.noGroups}
              </p>
              <p className="text-xs mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-faint)', opacity: 0.7 }}>
                {ct.noGroupsHint}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {linkedGroups.map((group, idx) => (
              <div
                key={group.id}
                className="rounded-xl border p-4"
                style={{
                  borderColor: 'var(--border-light)',
                  backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                    backgroundColor: 'var(--brand-primary)',
                    color: 'var(--brand-on-primary)',
                  }}>
                    {ct.groupLabel} {idx + 1} · {group.courseCodes.length} {ct.coursesInGroup}
                  </span>
                  <button
                    onClick={() => removeLinkedGroup(group.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 className="w-3 h-3" />
                    {ct.removeGroup}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.courseCodes.map(code => (
                    <div
                      key={code}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                      style={{
                        borderColor: 'var(--border-light)',
                        backgroundColor: 'var(--bg-surface)',
                      }}
                    >
                      <div>
                        <span className="text-xs font-bold" style={{ color: 'var(--brand-primary)' }}>
                          {code}
                        </span>
                        <p className="text-[11px] truncate max-w-[180px]" style={{ color: 'var(--text-faint)' }}>
                          {getCourseName(code)}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const updated = group.courseCodes.filter(c => c !== code);
                          updateLinkedGroup(group.id, updated);
                        }}
                        className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        style={{ color: 'var(--text-faint)' }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Create New Group Form */}
          {isCreating && (
            <div
              className="rounded-xl border-2 border-dashed p-4 mt-3"
              style={{
                borderColor: 'var(--brand-primary)',
                backgroundColor: darkMode ? 'rgba(59,130,246,0.05)' : 'rgba(60,141,188,0.05)',
              }}
            >
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                {ct.addGroup}
              </h4>

              {/* Selected courses in pending group */}
              {pendingCodes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {pendingCodes.map(code => (
                    <div
                      key={code}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: 'var(--brand-primary)',
                        color: 'var(--brand-on-primary)',
                      }}
                    >
                      <span className="text-xs font-bold">{code}</span>
                      <span className="text-[10px] opacity-80 max-w-[120px] truncate">{getCourseName(code)}</span>
                      <button
                        onClick={() => handleRemoveFromPending(code)}
                        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search input */}
              <div className="relative mb-2">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-faint)' }}
                />
                <input
                  type="text"
                  placeholder={ct.selectCourse}
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setError(''); }}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-opacity-50 outline-none"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Course list dropdown */}
              {searchQuery && (
                <div
                  className="max-h-40 overflow-y-auto rounded-xl border mb-3"
                  style={{
                    borderColor: 'var(--border-light)',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                >
                  {availableCourses.length === 0 ? (
                    <p className="text-xs text-center py-3" style={{ color: 'var(--text-faint)' }}>
                      {t.courseManage.noCourses}
                    </p>
                  ) : (
                    availableCourses.slice(0, 20).map(c => (
                      <button
                        key={c.course_code}
                        onClick={() => handleAddToPending(c.course_code)}
                        className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between"
                        style={{ borderBottom: '1px solid var(--border-light)' }}
                      >
                        <div>
                          <span className="font-bold text-xs" style={{ color: 'var(--brand-primary)' }}>
                            {c.course_code}
                          </span>
                          <span className="ml-2 text-xs" style={{ color: 'var(--text-primary)' }}>
                            {c.course_name}
                          </span>
                          <span className="ml-2 text-[10px]" style={{ color: 'var(--text-faint)' }}>
                            ({c.instructor_full_name})
                          </span>
                        </div>
                        <Plus className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--brand-primary)' }} />
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-1.5 mb-3 text-xs font-medium" style={{ color: '#ef4444' }}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleCancelCreate}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {t.close}
                </button>
                <button
                  onClick={handleSaveGroup}
                  disabled={pendingCodes.length < 2}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: pendingCodes.length >= 2 ? 'var(--brand-gradient)' : 'var(--bg-mute)',
                    color: pendingCodes.length >= 2 ? 'var(--brand-on-primary)' : 'var(--text-faint)',
                    cursor: pendingCodes.length >= 2 ? 'pointer' : 'not-allowed',
                  }}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  {ct.addGroup}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t shrink-0 flex items-center justify-between"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--bg-mute)',
          }}
        >
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
            {linkedGroups.length} {ct.groupLabel.toLowerCase()} · {linkedGroups.reduce((s, g) => s + g.courseCodes.length, 0)} {ct.coursesInGroup}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'var(--brand-gradient)',
              color: 'var(--brand-on-primary)',
            }}
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
