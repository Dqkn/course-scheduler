import { X, Search, Plus, Minus, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocale } from '../i18n';
import { useState, useRef, useCallback, type DragEvent } from 'react';
import * as XLSX from 'xlsx';
import type { AlgorithmInput } from '../types/schedulerTypes';

// ── Column mapping: map common header variants to our AlgorithmInput fields ──
const COL_MAP: Record<string, keyof AlgorithmInput> = {
  // course_code
  course_code: 'course_code',
  ders_kodu: 'course_code',
  'ders kodu': 'course_code',
  code: 'course_code',
  kod: 'course_code',
  // course_name
  course_name: 'course_name',
  ders_adi: 'course_name',
  'ders adı': 'course_name',
  'ders adi': 'course_name',
  name: 'course_name',
  ad: 'course_name',
  // weekly_hours
  weekly_hours: 'weekly_hours',
  haftalik_saat: 'weekly_hours',
  'haftalık saat': 'weekly_hours',
  'haftalik saat': 'weekly_hours',
  hours: 'weekly_hours',
  saat: 'weekly_hours',
  // course_semester
  course_semester: 'course_semester',
  donem: 'course_semester',
  'dönem': 'course_semester',
  semester: 'course_semester',
  // section_count
  section_count: 'section_count',
  sube_sayisi: 'section_count',
  'şube sayısı': 'section_count',
  'sube sayisi': 'section_count',
  sections: 'section_count',
  sube: 'section_count',
  // instructor_full_name
  instructor_full_name: 'instructor_full_name',
  ogretim_elemani: 'instructor_full_name',
  'öğretim elemanı': 'instructor_full_name',
  'ogretim elemani': 'instructor_full_name',
  instructor: 'instructor_full_name',
  hoca: 'instructor_full_name',
};

interface ParsedRow {
  data: Partial<AlgorithmInput>;
  errors: string[];
  rowIndex: number;
}

type ModalTab = 'list' | 'excel';

export function CourseManagementModal() {
  const {
    darkMode,
    isManageModalOpen,
    setIsManageModalOpen,
    algorithmCourses,
    updateCourseSection,
    importCourses,
    runAlgorithm
  } = useApp();
  const { t } = useLocale();
  const cm = t.courseManage;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');

  // Tab state
  const [activeTab, setActiveTab] = useState<ModalTab>('list');

  // Excel upload state
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importDone, setImportDone] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isManageModalOpen) return null;

  const errorCount = parsedRows.filter(r => r.errors.length > 0).length;
  const validRows = parsedRows.filter(r => r.errors.length === 0);

  // ── Course list filter (existing functionality, unchanged) ──
  const displayedCourses = algorithmCourses.filter(c => {
    if (selectedClass) {
      const year = parseInt(selectedClass);
      const startSem = (year - 1) * 2 + 1;
      const endSem = year * 2;
      if (c.course_semester < startSem || c.course_semester > endSem) return false;
    }
    if (selectedSemester && c.course_semester !== parseInt(selectedSemester)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.course_code.toLowerCase().includes(q) ||
        c.course_name.toLowerCase().includes(q) ||
        c.instructor_full_name.toLowerCase().includes(q);
    }
    return true;
  });

  // ── Excel parsing ──
  function parseFile(file: File) {
    setIsParsing(true);
    setImportDone(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

        const rows: ParsedRow[] = json.map((raw, idx) => {
          const mapped: Partial<AlgorithmInput> = {};
          const errors: string[] = [];

          // Map columns
          for (const [key, value] of Object.entries(raw)) {
            const normalized = key.trim().toLowerCase().replace(/\s+/g, ' ');
            const field = COL_MAP[normalized];
            if (field) {
              if (field === 'weekly_hours' || field === 'course_semester' || field === 'section_count' || field === 'course_id') {
                (mapped as Record<string, unknown>)[field] = parseInt(String(value)) || 0;
              } else {
                (mapped as Record<string, unknown>)[field] = String(value).trim();
              }
            }
          }

          // Validate required fields
          if (!mapped.course_code) errors.push('course_code');
          if (!mapped.course_name) errors.push('course_name');
          if (!mapped.weekly_hours || mapped.weekly_hours <= 0) errors.push('weekly_hours');
          if (!mapped.course_semester || mapped.course_semester <= 0) errors.push('course_semester');

          // Defaults
          if (!mapped.section_count || mapped.section_count <= 0) mapped.section_count = 1;
          if (!mapped.instructor_full_name) mapped.instructor_full_name = 'anonim';
          if (mapped.course_id === undefined) mapped.course_id = 0;
          if (mapped.is_online === undefined) mapped.is_online = false;
          if (mapped.is_service === undefined) mapped.is_service = false;

          return { data: mapped, errors, rowIndex: idx + 2 }; // +2 for Excel row (header=1)
        });

        setParsedRows(rows);
      } catch {
        setParsedRows([]);
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      parseFile(file);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  }

  function handleImport() {
    const toImport = validRows.map(r => r.data as AlgorithmInput);
    importCourses(toImport);
    setImportCount(toImport.length);
    setImportDone(true);
    // Switch to list tab after a brief delay
    setTimeout(() => {
      setActiveTab('list');
      setParsedRows([]);
      setImportDone(false);
    }, 2000);
  }

  function handleClear() {
    setParsedRows([]);
    setImportDone(false);
  }

  function downloadTemplate() {
    const headers = ['course_code', 'course_name', 'weekly_hours', 'course_semester', 'section_count', 'instructor_full_name'];
    const example = ['BIL101', 'Bilgisayar Bilimine Giris', '4', '1', '2', 'Prof. Dr. Ahmet Yilmaz'];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Courses');
    XLSX.writeFile(wb, 'course_template.xlsx');
  }

  const border = 'var(--border-light)';
  const surface = 'var(--bg-surface)';
  const text = 'var(--text-primary)';
  const muted = 'var(--text-muted)';
  const faint = 'var(--text-faint)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={() => setIsManageModalOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: surface }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--bg-mute)' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: text }}>
              {cm.title}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: faint }}>
              {cm.description}
            </p>
          </div>
          <button
            onClick={() => setIsManageModalOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: faint }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b shrink-0"
          style={{ borderColor: border }}
        >
          <button
            onClick={() => setActiveTab('list')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{
              color: activeTab === 'list' ? 'var(--brand-primary)' : muted,
              borderBottom: activeTab === 'list' ? '2px solid var(--brand-primary)' : '2px solid transparent',
              backgroundColor: activeTab === 'list'
                ? (darkMode ? 'rgba(59,130,246,0.08)' : 'rgba(60,141,188,0.06)')
                : 'transparent',
            }}
          >
            <Search className="w-4 h-4" />
            {cm.tabCourseList}
          </button>
          <button
            onClick={() => setActiveTab('excel')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{
              color: activeTab === 'excel' ? '#16a34a' : muted,
              borderBottom: activeTab === 'excel' ? '2px solid #16a34a' : '2px solid transparent',
              backgroundColor: activeTab === 'excel'
                ? (darkMode ? 'rgba(22,163,74,0.08)' : 'rgba(22,163,74,0.06)')
                : 'transparent',
            }}
          >
            <FileSpreadsheet className="w-4 h-4" />
            {cm.tabExcelUpload}
          </button>
        </div>

        {/* ═══════════════════════ TAB: Course List (existing) ═══════════════════════ */}
        {activeTab === 'list' && (
          <>
            {/* Toolbar */}
            <div
              className="px-6 py-3 border-b shrink-0 flex flex-wrap items-center gap-3"
              style={{ backgroundColor: 'var(--bg-mute)', borderColor: border }}
            >
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: faint }}
                />
                <input
                  type="text"
                  placeholder={cm.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-opacity-50 outline-none"
                  style={{ backgroundColor: surface, borderColor: border, color: text }}
                />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 rounded-xl border text-sm font-medium transition-all focus:ring-2 outline-none cursor-pointer"
                style={{ backgroundColor: surface, borderColor: border, color: text }}
              >
                <option value="">Tüm Sınıflar</option>
                <option value="1">1. Sınıf (Sem 1-2)</option>
                <option value="2">2. Sınıf (Sem 3-4)</option>
                <option value="3">3. Sınıf (Sem 5-6)</option>
                <option value="4">4. Sınıf (Sem 7-8)</option>
              </select>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-3 py-2 rounded-xl border text-sm font-medium transition-all focus:ring-2 outline-none cursor-pointer"
                style={{ backgroundColor: surface, borderColor: border, color: text }}
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
                <div className="text-center py-10" style={{ color: faint }}>
                  <p className="text-sm font-medium">{cm.noCourses}</p>
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
                        border: `1px solid ${border}`,
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{
                             backgroundColor: 'var(--border-light)',
                             color: muted
                          }}>
                            {course.course_code}
                          </span>
                          <h3 className="text-sm font-semibold truncate" style={{ color: text }}>
                            {course.course_name}
                          </h3>
                        </div>
                        <p className="text-[11px] truncate flex items-center gap-2" style={{ color: faint }}>
                          <span>👤 {course.instructor_full_name === 'anonim' ? 'Havuz/Atanmamış' : course.instructor_full_name}</span>
                          <span>•</span>
                          <span>⏳ {course.weekly_hours} {cm.hoursPerWeek}</span>
                          <span>•</span>
                          <span>📚 {course.course_semester}. {cm.semester}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1 shrink-0 px-2">
                        <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: faint }}>
                          {cm.sections}
                        </span>
                        <div className="flex items-center gap-3 bg-black/5 dark:bg-white/5 rounded-full p-1" style={{ border: `1px solid ${border}` }}>
                          <button
                            onClick={() => updateCourseSection(course.course_code, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            style={{ color: text }}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center" style={{ color: text }}>
                            {course.section_count}
                          </span>
                          <button
                            onClick={() => updateCourseSection(course.course_code, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            style={{ color: text }}
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
          </>
        )}

        {/* ═══════════════════════ TAB: Excel Upload (new) ═══════════════════════ */}
        {activeTab === 'excel' && (
          <div className="flex-1 overflow-y-auto p-6">
            {/* Import success banner */}
            {importDone && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
                style={{
                  backgroundColor: darkMode ? '#052e16' : '#f0fdf4',
                  color: '#16a34a',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                {cm.excelImportSuccess.replace('{n}', String(importCount))}
              </div>
            )}

            {/* No data yet → show drop zone */}
            {parsedRows.length === 0 && !isParsing && !importDone && (
              <>
                {/* Drop zone */}
                <div
                  className="relative rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer"
                  style={{
                    borderColor: isDragging ? '#16a34a' : border,
                    backgroundColor: isDragging
                      ? (darkMode ? 'rgba(22,163,74,0.08)' : 'rgba(22,163,74,0.04)')
                      : (darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'),
                  }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      backgroundColor: isDragging
                        ? (darkMode ? 'rgba(22,163,74,0.2)' : '#dcfce7')
                        : (darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                    }}
                  >
                    <Upload
                      className="w-7 h-7"
                      style={{ color: isDragging ? '#16a34a' : muted }}
                    />
                  </div>
                  <h3 className="text-base font-bold mb-1" style={{ color: text }}>
                    {cm.excelDropTitle}
                  </h3>
                  <p className="text-sm mb-2" style={{ color: muted }}>
                    {cm.excelDropDesc}
                  </p>
                  <p className="text-xs" style={{ color: faint }}>
                    {cm.excelAccepted}
                  </p>
                </div>

                {/* Download template button */}
                <button
                  onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
                  className="flex items-center gap-2 mx-auto mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                    color: muted,
                    border: `1px solid ${border}`,
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  {cm.excelDownloadTemplate}
                </button>
              </>
            )}

            {/* Parsing spinner */}
            {isParsing && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mr-3" style={{ borderColor: '#16a34a', borderTopColor: 'transparent' }} />
                <span className="text-sm font-medium" style={{ color: muted }}>{cm.excelParsing}</span>
              </div>
            )}

            {/* Preview table */}
            {parsedRows.length > 0 && !isParsing && !importDone && (
              <>
                {/* Stats bar */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold" style={{ color: text }}>
                    {cm.excelPreviewTitle}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{
                      backgroundColor: darkMode ? 'rgba(59,130,246,0.15)' : '#eff6ff',
                      color: '#3b82f6',
                    }}>
                      {cm.excelRowsRead.replace('{n}', String(parsedRows.length))}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{
                      backgroundColor: errorCount > 0
                        ? (darkMode ? 'rgba(239,68,68,0.15)' : '#fef2f2')
                        : (darkMode ? 'rgba(22,163,74,0.15)' : '#f0fdf4'),
                      color: errorCount > 0 ? '#ef4444' : '#16a34a',
                    }}>
                      {errorCount > 0
                        ? cm.excelErrors.replace('{n}', String(errorCount))
                        : cm.excelNoErrors}
                    </span>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-xl border overflow-hidden mb-4" style={{ borderColor: border }}>
                  <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ backgroundColor: 'var(--bg-mute)' }}>
                          <th className="px-3 py-2 text-left font-semibold" style={{ color: muted }}>#</th>
                          <th className="px-3 py-2 text-left font-semibold" style={{ color: muted }}>{cm.excelColCode}</th>
                          <th className="px-3 py-2 text-left font-semibold" style={{ color: muted }}>{cm.excelColName}</th>
                          <th className="px-3 py-2 text-center font-semibold" style={{ color: muted }}>{cm.excelColHours}</th>
                          <th className="px-3 py-2 text-center font-semibold" style={{ color: muted }}>{cm.excelColSemester}</th>
                          <th className="px-3 py-2 text-center font-semibold" style={{ color: muted }}>{cm.excelColSections}</th>
                          <th className="px-3 py-2 text-left font-semibold" style={{ color: muted }}>{cm.excelColInstructor}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedRows.map((row, i) => {
                          const hasError = row.errors.length > 0;
                          return (
                            <tr
                              key={i}
                              style={{
                                backgroundColor: hasError
                                  ? (darkMode ? 'rgba(239,68,68,0.08)' : '#fef2f2')
                                  : (i % 2 === 0 ? 'transparent' : (darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)')),
                                borderBottom: `1px solid ${border}`,
                              }}
                            >
                              <td className="px-3 py-2" style={{ color: faint }}>
                                <div className="flex items-center gap-1">
                                  {hasError && <AlertCircle className="w-3 h-3 shrink-0" style={{ color: '#ef4444' }} />}
                                  {row.rowIndex}
                                </div>
                              </td>
                              <td className="px-3 py-2 font-bold" style={{
                                color: row.errors.includes('course_code') ? '#ef4444' : text,
                              }}>
                                {row.data.course_code || '—'}
                              </td>
                              <td className="px-3 py-2" style={{
                                color: row.errors.includes('course_name') ? '#ef4444' : text,
                              }}>
                                {row.data.course_name || '—'}
                              </td>
                              <td className="px-3 py-2 text-center" style={{
                                color: row.errors.includes('weekly_hours') ? '#ef4444' : text,
                              }}>
                                {row.data.weekly_hours || '—'}
                              </td>
                              <td className="px-3 py-2 text-center" style={{
                                color: row.errors.includes('course_semester') ? '#ef4444' : text,
                              }}>
                                {row.data.course_semester || '—'}
                              </td>
                              <td className="px-3 py-2 text-center" style={{ color: text }}>
                                {row.data.section_count || 1}
                              </td>
                              <td className="px-3 py-2" style={{ color: faint }}>
                                {row.data.instructor_full_name || 'anonim'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: muted }}
                  >
                    {cm.excelClear}
                  </button>
                  <button
                    onClick={handleImport}
                    disabled={validRows.length === 0}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: validRows.length > 0
                        ? 'linear-gradient(135deg, #16a34a, #15803d)'
                        : '#9ca3af',
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    {cm.excelImport} ({validRows.length})
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          className="px-6 py-4 border-t shrink-0 flex items-center justify-between"
          style={{ backgroundColor: surface, borderColor: 'var(--bg-mute)' }}
        >
          <p className="text-xs" style={{ color: faint }}>
            {cm.totalActive} {algorithmCourses.filter(c => c.section_count > 0).length}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsManageModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: muted }}
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
              {cm.applyAndRun}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
