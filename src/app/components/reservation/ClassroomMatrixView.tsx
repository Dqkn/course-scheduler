import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarPlus, X, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useLocale } from '../../i18n';
import { verifyCredentials } from '../../services/authService';
import type { DayKey } from '../../data/mockData';
import type { TimeSlot } from '../../types/reservationTypes';
import {
  getWeekDates,
  formatDateTr,
  formatDateEn,
  generateReservationId,
  saveReservation,
  isRoomAvailable,
} from '../../utils/reservationUtils';

const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = Array.from({ length: 9 }, (_, i) => 9 + i); // 9..17

const DAY_INDEX: Record<DayKey, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4 };

/** Map hour number (9-17) to the TimeSlot string */
function hourToTimeSlot(hour: number): TimeSlot {
  const h = String(hour).padStart(2, '0');
  return `${h}:00 - ${h}:50` as TimeSlot;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

interface CellSelection {
  room: string;
  day: DayKey;
  hour: number;
}

interface FormFields {
  courseCode: string;
  instructorName: string;
  description: string;
}

type ModalState = 'form' | 'verify' | 'loading' | 'success' | 'conflict';

interface Props {
  darkMode: boolean;
  onBack: () => void;
}

export function ClassroomMatrixView({ darkMode, onBack }: Props) {
  const { scheduledCourses, openCourseIds, currentUser } = useApp();
  const { t, locale } = useLocale();
  const mt = t.classroomMatrix;
  const rt = t.reservation;

  const [selectedDay, setSelectedDay] = useState<DayKey>('Mon');
  const [selectedCell, setSelectedCell] = useState<CellSelection | null>(null);
  const [modalState, setModalState] = useState<ModalState>('form');
  const [formFields, setFormFields] = useState<FormFields>({ courseCode: '', instructorName: '', description: '' });
  const [formErrors, setFormErrors] = useState<{ courseCode?: boolean; instructorName?: boolean }>({});
  const [verifyUsername, setVerifyUsername] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifyError, setVerifyError] = useState(false);

  /* ── Build room list from scheduled courses ──────────────────── */
  const rooms = useMemo(() => {
    const set = new Set<string>();
    for (const c of scheduledCourses) {
      if (openCourseIds.includes(c.id) && c.room) {
        set.add(c.room);
      }
    }
    return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [scheduledCourses, openCourseIds]);

  /* ── Build occupancy map: "room-day-hour" → course[] ─────────── */
  const occupancyMap = useMemo(() => {
    const map = new Map<string, { code: string; name: string; lecturer: string }[]>();
    for (const c of scheduledCourses) {
      if (!openCourseIds.includes(c.id)) continue;
      const startMin = toMinutes(c.startTime);
      const endMin = toMinutes(c.endTime);
      for (let h = Math.floor(startMin / 60); h < Math.ceil(endMin / 60) && h <= 17; h++) {
        if (h < 9) continue;
        const key = `${c.room}-${c.day}-${h}`;
        if (!map.has(key)) map.set(key, []);
        const arr = map.get(key)!;
        if (!arr.some(x => x.code === c.code)) {
          arr.push({ code: c.code, name: c.name, lecturer: c.lecturer });
        }
      }
    }
    return map;
  }, [scheduledCourses, openCourseIds]);

  /* ── Stats for selected day ──────────────────────────────────── */
  const dayStats = useMemo(() => {
    let occupied = 0;
    let total = 0;
    for (const room of rooms) {
      for (const hour of HOURS) {
        total++;
        const key = `${room}-${selectedDay}-${hour}`;
        if (occupancyMap.has(key)) occupied++;
      }
    }
    return { occupied, total, available: total - occupied };
  }, [rooms, selectedDay, occupancyMap]);

  /* ── Reservation helpers ─────────────────────────────────────── */
  function getDateForDay(day: DayKey): string {
    const dates = getWeekDates(0); // current week
    return dates[DAY_INDEX[day]];
  }

  function handleCellClick(room: string, day: DayKey, hour: number) {
    const key = `${room}-${day}-${hour}`;
    if (occupancyMap.has(key)) return; // occupied, do nothing
    setSelectedCell({ room, day, hour });
    setFormFields({ courseCode: '', instructorName: currentUser?.full_name ?? '', description: '' });
    setFormErrors({});
    setModalState('form');
  }

  function handleFormSubmit() {
    if (!selectedCell || !currentUser) return;

    // Validate required fields
    const errors: { courseCode?: boolean; instructorName?: boolean } = {};
    if (!formFields.courseCode.trim()) errors.courseCode = true;
    if (!formFields.instructorName.trim()) errors.instructorName = true;
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Move to verification step
    setVerifyUsername(currentUser.username);
    setVerifyPassword('');
    setVerifyError(false);
    setModalState('verify');
  }

  async function handleVerifyAndSave() {
    if (!selectedCell || !currentUser) return;

    const ok = await verifyCredentials(verifyUsername, verifyPassword);
    if (!ok) {
      setVerifyError(true);
      return;
    }

    const date = getDateForDay(selectedCell.day);
    const timeSlot = hourToTimeSlot(selectedCell.hour);

    // Check availability
    if (!isRoomAvailable(selectedCell.room, date, [timeSlot])) {
      setModalState('conflict');
      return;
    }

    setModalState('loading');
    setTimeout(() => {
      saveReservation({
        id: generateReservationId(),
        roomCode: selectedCell.room,
        date,
        timeSlots: [timeSlot],
        userId: String(currentUser.user_id),
        userName: currentUser.full_name,
        userRole: currentUser.role,
        createdAt: new Date().toISOString(),
        roomCapacity: 0,
        roomType: 'derslik',
        courseCode: formFields.courseCode.trim(),
        instructorName: formFields.instructorName.trim(),
        description: formFields.description.trim() || undefined,
      });
      setModalState('success');
    }, 800);
  }

  function handleCloseModal() {
    setSelectedCell(null);
    setModalState('form');
    setFormFields({ courseCode: '', instructorName: '', description: '' });
    setFormErrors({});
  }

  /* ── Styles ──────────────────────────────────────────────────── */
  const borderColor = darkMode ? '#334155' : '#d1d5db';
  const headerBg = darkMode ? '#1e293b' : '#f3f4f6';
  const cellBgEmpty = darkMode ? '#0f172a' : '#ffffff';
  const cellBgOccupied = darkMode ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)';
  const cellBgHover = darkMode ? 'rgba(34,197,94,0.10)' : 'rgba(34,197,94,0.08)';
  const textPrimary = darkMode ? '#e2e8f0' : '#1f2937';
  const textMuted = darkMode ? '#94a3b8' : '#6b7280';

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: darkMode ? '#0f172a' : '#f9fafb' }}>
      {/* Header */}
      <div
        className="shrink-0 px-5 py-4 border-b flex items-center gap-4"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-light)' }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          style={{ color: textMuted }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: textPrimary }}>
            {mt.title}
          </h2>
          <p style={{ fontSize: '13px', color: textMuted }}>
            {mt.subtitle}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-xs" style={{ color: textMuted }}>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border" style={{ backgroundColor: cellBgEmpty, borderColor }} />
            {mt.available}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: darkMode ? '#991b1b' : '#fecaca' }} />
            {mt.occupied}
          </span>
          <span className="font-semibold" style={{ color: textPrimary }}>
            {dayStats.available}/{dayStats.total} {mt.availableSlots}
          </span>
        </div>
      </div>

      {/* Day Tabs */}
      <div
        className="shrink-0 flex items-center gap-1 px-5 py-2 border-b"
        style={{
          backgroundColor: darkMode ? '#1e293b' : '#f8fafc',
          borderColor: darkMode ? '#334155' : '#e2e8f0',
        }}
      >
        {DAYS.map(day => {
          const isActive = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: isActive
                  ? (darkMode ? '#3b82f6' : '#3C8DBC')
                  : (darkMode ? '#334155' : '#e5e7eb'),
                color: isActive ? '#fff' : textPrimary,
              }}
            >
              {t.days[day]}
            </button>
          );
        })}
        <span className="ml-2 text-[11px]" style={{ color: textMuted }}>
          {mt.clickToReserve}
        </span>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 overflow-auto p-4">
        {rooms.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: textMuted }}>{mt.noRooms}</p>
              <p className="text-xs mt-1" style={{ color: textMuted }}>{mt.noRoomsDesc}</p>
            </div>
          </div>
        ) : (
          <table
            className="w-full border-collapse"
            style={{ minWidth: 700 }}
          >
            <thead>
              <tr>
                <th
                  className="border p-2 text-center text-xs font-bold sticky left-0 z-10"
                  style={{
                    borderColor,
                    backgroundColor: headerBg,
                    color: textPrimary,
                    minWidth: 90,
                  }}
                >
                  {mt.room}
                </th>
                {HOURS.map(hour => (
                  <th
                    key={hour}
                    className="border p-2 text-center text-xs font-bold"
                    style={{
                      borderColor,
                      backgroundColor: headerBg,
                      color: textPrimary,
                      minWidth: 90,
                    }}
                  >
                    {String(hour).padStart(2, '0')}:00
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room}>
                  <td
                    className="border p-2 text-xs font-semibold text-center sticky left-0 z-10"
                    style={{
                      borderColor,
                      backgroundColor: headerBg,
                      color: textPrimary,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {room}
                  </td>
                  {HOURS.map(hour => {
                    const key = `${room}-${selectedDay}-${hour}`;
                    const courses = occupancyMap.get(key);
                    const isOccupied = !!courses && courses.length > 0;
                    return (
                      <td
                        key={hour}
                        className={`border p-1 text-center align-middle transition-colors ${!isOccupied ? 'cursor-pointer group' : ''}`}
                        style={{
                          borderColor,
                          backgroundColor: isOccupied ? cellBgOccupied : cellBgEmpty,
                          minHeight: 36,
                        }}
                        title={
                          isOccupied
                            ? courses!.map(c => `${c.code} — ${c.lecturer}`).join('\n')
                            : mt.clickToReserveCell
                        }
                        onClick={() => !isOccupied && handleCellClick(room, selectedDay, hour)}
                      >
                        {isOccupied ? (
                          <div className="flex flex-col gap-0.5">
                            {courses!.map((c, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-semibold leading-tight"
                                style={{ color: darkMode ? '#fca5a5' : '#991b1b' }}
                              >
                                {c.code}
                              </span>
                            ))}
                          </div>
                        ) : (
                          /* Hover indicator for empty cells */
                          <div
                            className="w-full h-full min-h-[28px] rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: cellBgHover }}
                          >
                            <CalendarPlus className="w-3.5 h-3.5" style={{ color: '#16a34a' }} />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Quick Reservation Modal ─────────────────────────────── */}
      {selectedCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={modalState !== 'loading' ? handleCloseModal : undefined}
          />
          <div
            className="relative w-full max-w-sm rounded-2xl shadow-2xl border overflow-hidden"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-light)' }}
          >
            {modalState === 'form' && (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center gap-2">
                    <CalendarPlus className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>
                      {mt.quickReserve}
                    </h3>
                  </div>
                  <button onClick={handleCloseModal} className="p-1 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                    <X className="w-4 h-4" style={{ color: textMuted }} />
                  </button>
                </div>

                {/* Slot info bubble */}
                <div
                  className="mx-5 mt-4 px-4 py-3 rounded-xl flex items-center justify-between gap-3"
                  style={{
                    backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  }}
                >
                  <div className="flex items-center gap-3 text-xs" style={{ color: textPrimary }}>
                    <span className="font-bold">{selectedCell.room}</span>
                    <span style={{ color: textMuted }}>·</span>
                    <span>{t.days[selectedCell.day]}</span>
                    <span style={{ color: textMuted }}>·</span>
                    <span className="font-semibold">{hourToTimeSlot(selectedCell.hour)}</span>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: textMuted }}>
                    {locale === 'tr'
                      ? formatDateTr(getDateForDay(selectedCell.day))
                      : formatDateEn(getDateForDay(selectedCell.day))}
                  </span>
                </div>

                {/* Form fields */}
                <div className="px-5 py-4 space-y-3">
                  {/* Course Code */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: textPrimary }}>
                      {mt.courseCodeLabel} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formFields.courseCode}
                      onChange={e => { setFormFields(f => ({ ...f, courseCode: e.target.value })); setFormErrors(e2 => ({ ...e2, courseCode: false })); }}
                      placeholder={mt.courseCodePlaceholder}
                      className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:ring-2 focus:ring-blue-400/40"
                      style={{
                        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                        borderColor: formErrors.courseCode ? '#ef4444' : (darkMode ? '#334155' : '#d1d5db'),
                        color: textPrimary,
                      }}
                    />
                    {formErrors.courseCode && (
                      <p className="text-[11px] mt-0.5" style={{ color: '#ef4444' }}>{mt.errorCourseCode}</p>
                    )}
                  </div>

                  {/* Instructor Name */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: textPrimary }}>
                      {mt.instructorLabel} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formFields.instructorName}
                      onChange={e => { setFormFields(f => ({ ...f, instructorName: e.target.value })); setFormErrors(e2 => ({ ...e2, instructorName: false })); }}
                      placeholder={mt.instructorPlaceholder}
                      className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:ring-2 focus:ring-blue-400/40"
                      style={{
                        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                        borderColor: formErrors.instructorName ? '#ef4444' : (darkMode ? '#334155' : '#d1d5db'),
                        color: textPrimary,
                      }}
                    />
                    {formErrors.instructorName && (
                      <p className="text-[11px] mt-0.5" style={{ color: '#ef4444' }}>{mt.errorInstructor}</p>
                    )}
                  </div>

                  {/* Description (optional) */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: textPrimary }}>
                      {mt.descriptionLabel}
                    </label>
                    <input
                      type="text"
                      value={formFields.description}
                      onChange={e => setFormFields(f => ({ ...f, description: e.target.value }))}
                      placeholder={mt.descriptionPlaceholder}
                      className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:ring-2 focus:ring-blue-400/40"
                      style={{
                        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                        borderColor: darkMode ? '#334155' : '#d1d5db',
                        color: textPrimary,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-5 py-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: 'var(--bg-mute)', color: textMuted }}
                  >
                    {rt.cancel}
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'var(--brand-gradient)', color: '#ffffff' }}
                  >
                    {rt.confirm}
                  </button>
                </div>
              </>
            )}

            {modalState === 'verify' && (
              <>
                <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" style={{ color: '#f59e0b' }} />
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }}>
                      {mt.verifyTitle}
                    </h3>
                  </div>
                  <button onClick={handleCloseModal} className="p-1 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                    <X className="w-4 h-4" style={{ color: textMuted }} />
                  </button>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <p style={{ fontSize: '12px', color: textMuted, lineHeight: 1.5 }}>
                    {mt.verifyDesc}
                  </p>
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: textPrimary }}>
                      {t.login.accountId}
                    </label>
                    <input
                      type="text"
                      value={verifyUsername}
                      onChange={e => { setVerifyUsername(e.target.value); setVerifyError(false); }}
                      className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:ring-2 focus:ring-amber-400/40"
                      style={{
                        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                        borderColor: verifyError ? '#ef4444' : (darkMode ? '#334155' : '#d1d5db'),
                        color: textPrimary,
                      }}
                    />
                  </div>
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: textPrimary }}>
                      {t.login.password}
                    </label>
                    <input
                      type="password"
                      value={verifyPassword}
                      onChange={e => { setVerifyPassword(e.target.value); setVerifyError(false); }}
                      className="w-full px-3 py-2 rounded-lg text-sm border outline-none transition-colors focus:ring-2 focus:ring-amber-400/40"
                      style={{
                        backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                        borderColor: verifyError ? '#ef4444' : (darkMode ? '#334155' : '#d1d5db'),
                        color: textPrimary,
                      }}
                    />
                  </div>
                  {verifyError && (
                    <p className="text-[11px]" style={{ color: '#ef4444' }}>{mt.verifyError}</p>
                  )}
                </div>
                <div className="flex gap-3 px-5 py-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                  <button
                    onClick={() => setModalState('form')}
                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: 'var(--bg-mute)', color: textMuted }}
                  >
                    {rt.back}
                  </button>
                  <button
                    onClick={handleVerifyAndSave}
                    className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff' }}
                  >
                    {mt.verifyButton}
                  </button>
                </div>
              </>
            )}

            {modalState === 'loading' && (
              <div className="flex flex-col items-center justify-center py-14 px-8">
                <Loader2 className="w-10 h-10 animate-spin mb-3" style={{ color: 'var(--brand-primary)' }} />
                <p style={{ fontSize: '14px', fontWeight: 600, color: textPrimary }}>{rt.saving}</p>
              </div>
            )}

            {modalState === 'success' && (
              <div className="flex flex-col items-center justify-center py-14 px-8">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: darkMode ? '#052e16' : '#dcfce7' }}
                >
                  <CheckCircle2 className="w-7 h-7" style={{ color: '#16a34a' }} />
                </div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }} className="mb-1">{rt.successTitle}</p>
                <p style={{ fontSize: '12px', color: textMuted }} className="mb-5 text-center">{rt.successDesc}</p>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', color: '#ffffff' }}
                >
                  {rt.ok}
                </button>
              </div>
            )}

            {modalState === 'conflict' && (
              <div className="flex flex-col items-center justify-center py-14 px-8">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: darkMode ? '#450a0a' : '#fef2f2' }}
                >
                  <X className="w-7 h-7" style={{ color: '#dc2626' }} />
                </div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary }} className="mb-1">{rt.conflictTitle}</p>
                <p style={{ fontSize: '12px', color: textMuted }} className="mb-5 text-center">{rt.conflictDesc}</p>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: 'var(--bg-mute)', color: textPrimary }}
                >
                  {rt.ok}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, color, muted }: { label: string; value: string; color: string; muted: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span style={{ fontSize: '13px', color: muted }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
