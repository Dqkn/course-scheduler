import { useMemo } from 'react';
import { Clock, MapPin, User, Building2, Calendar as CalIcon } from 'lucide-react';
import { useLocale } from '../../i18n';
import type { Reservation, TimeSlot } from '../../types/reservationTypes';
import { ALL_TIME_SLOTS } from '../../types/reservationTypes';
import { getRoomTypeLabel, formatDateTr, formatDateEn } from '../../utils/reservationUtils';

/* ── Day columns ─────────────────────────────────── */
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

interface Props {
  darkMode: boolean;
  reservations: Reservation[];
  /** YYYY-MM-DD strings for Mon–Fri */
  weekDates: string[];
}

export function ReservationWeeklyGrid({ darkMode, reservations, weekDates }: Props) {
  const { t, locale } = useLocale();
  const rt = t.reservation;

  const dayLabelsMap: Record<string, Record<'tr' | 'en', string>> = {
    Mon: { tr: 'Pazartesi', en: 'Monday' },
    Tue: { tr: 'Salı', en: 'Tuesday' },
    Wed: { tr: 'Çarşamba', en: 'Wednesday' },
    Thu: { tr: 'Perşembe', en: 'Thursday' },
    Fri: { tr: 'Cuma', en: 'Friday' },
  };

  // ── Build a lookup: { dateStr -> { timeSlot -> Reservation[] } }
  const grid = useMemo(() => {
    const map: Record<string, Record<TimeSlot, Reservation[]>> = {};
    for (const date of weekDates) {
      map[date] = {} as Record<TimeSlot, Reservation[]>;
      for (const slot of ALL_TIME_SLOTS) {
        map[date][slot] = [];
      }
    }
    for (const r of reservations) {
      if (map[r.date]) {
        for (const slot of r.timeSlots) {
          if (map[r.date][slot]) {
            map[r.date][slot].push(r);
          }
        }
      }
    }
    return map;
  }, [reservations, weekDates]);

  // ── Style tokens ──
  const headerBg = darkMode ? '#0f172a' : '#ffffff';
  const borderClr = darkMode ? '#1e293b' : '#d1d5db';
  const gutterBg = darkMode ? '#0c1425' : '#f5f5f5';
  const cellBg = darkMode ? '#0b1120' : '#fafafa';
  const text = darkMode ? '#f1f5f9' : '#1a1a2e';
  const muted = darkMode ? '#94a3b8' : '#475569';
  const zebraEven = darkMode ? 'rgba(15,23,42,0.35)' : 'rgba(240,240,240,0.55)';

  // Card color palette
  const cardColors = [
    { bg: darkMode ? '#1e1b4b' : '#eef2ff', border: darkMode ? '#4338ca' : '#818cf8', text: darkMode ? '#a5b4fc' : '#4338ca' },
    { bg: darkMode ? '#042f2e' : '#ecfdf5', border: darkMode ? '#0d9488' : '#14b8a6', text: darkMode ? '#5eead4' : '#0d9488' },
    { bg: darkMode ? '#422006' : '#fffbeb', border: darkMode ? '#d97706' : '#f59e0b', text: darkMode ? '#fbbf24' : '#b45309' },
    { bg: darkMode ? '#3b0764' : '#faf5ff', border: darkMode ? '#9333ea' : '#a855f7', text: darkMode ? '#c084fc' : '#7c3aed' },
    { bg: darkMode ? '#7f1d1d' : '#fef2f2', border: darkMode ? '#dc2626' : '#f87171', text: darkMode ? '#fca5a5' : '#dc2626' },
    { bg: darkMode ? '#1e3a5f' : '#eff6ff', border: darkMode ? '#2563eb' : '#60a5fa', text: darkMode ? '#93c5fd' : '#2563eb' },
  ];

  function getCardColor(roomCode: string) {
    let hash = 0;
    for (let i = 0; i < roomCode.length; i++) {
      hash = (hash * 31 + roomCode.charCodeAt(i)) % cardColors.length;
    }
    return cardColors[Math.abs(hash) % cardColors.length];
  }

  return (
    <div className="overflow-auto flex-1" style={{ minHeight: 0 }}>
      <div className="min-w-[740px]">
        {/* ═══ Day Header Row ═══ */}
        <div
          className="sticky top-0 z-20 flex border-b"
          style={{
            backgroundColor: headerBg,
            borderColor: borderClr,
            boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Gutter */}
          <div
            className="shrink-0 w-[80px] sticky left-0 z-30 border-r flex items-center justify-center py-2.5"
            style={{ backgroundColor: headerBg, borderColor: borderClr }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
          </div>

          {WEEKDAYS.map((day, i) => {
            const dateStr = weekDates[i];
            const shortDate = locale === 'tr' ? formatDateTr(dateStr) : formatDateEn(dateStr);
            return (
              <div
                key={day}
                className="flex-1 py-2.5 text-center"
                style={{ borderLeft: `1px solid ${borderClr}` }}
              >
                <p style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.06em', color: text }}>
                  {dayLabelsMap[day][locale].toUpperCase()}
                </p>
                <p style={{ fontSize: '11px', fontWeight: 500, color: muted, marginTop: 1 }}>
                  {shortDate}
                </p>
              </div>
            );
          })}
        </div>

        {/* ═══ Grid Body ═══ */}
        <div className="flex">
          {/* Time gutter */}
          <div
            className="shrink-0 w-[80px] sticky left-0 z-10 border-r"
            style={{ backgroundColor: gutterBg, borderColor: borderClr }}
          >
            {ALL_TIME_SLOTS.map((slot, i) => (
              <div
                key={slot}
                className="flex items-center justify-center border-b"
                style={{
                  height: 100,
                  borderColor: borderClr,
                  backgroundColor: i % 2 === 0 ? 'transparent' : zebraEven,
                }}
              >
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: muted,
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                }}>
                  {slot.replace(' - ', '\n').split('\n')[0]}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {WEEKDAYS.map((day, dayIdx) => {
            const dateStr = weekDates[dayIdx];
            return (
              <div key={day} className="flex-1 flex flex-col" style={{ borderLeft: `1px solid ${borderClr}` }}>
                {ALL_TIME_SLOTS.map((slot, slotIdx) => {
                  const items = grid[dateStr]?.[slot] ?? [];
                  return (
                    <div
                      key={slot}
                      className="border-b relative"
                      style={{
                        height: 100,
                        borderColor: borderClr,
                        backgroundColor: slotIdx % 2 === 0 ? cellBg : zebraEven,
                      }}
                    >
                      {items.length === 0 ? null : (
                        <div className="absolute inset-1 flex flex-col gap-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                          {items.map(r => {
                            const color = getCardColor(r.roomCode);
                            const created = new Date(r.createdAt);
                            const createdStr = locale === 'tr'
                              ? `${String(created.getDate()).padStart(2, '0')}.${String(created.getMonth() + 1).padStart(2, '0')} ${String(created.getHours()).padStart(2, '0')}:${String(created.getMinutes()).padStart(2, '0')}`
                              : `${created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${String(created.getHours()).padStart(2, '0')}:${String(created.getMinutes()).padStart(2, '0')}`;
                            return (
                              <div
                                key={r.id}
                                className="rounded-lg px-2.5 py-1.5 flex flex-col gap-0.5 transition-transform hover:scale-[1.02]"
                                style={{
                                  backgroundColor: color.bg,
                                  border: `1px solid ${color.border}44`,
                                  borderLeft: `3px solid ${color.border}`,
                                }}
                              >
                                {/* Room Code */}
                                <span style={{ fontSize: '12px', fontWeight: 800, color: color.text, letterSpacing: '0.04em' }}>
                                  {r.roomCode}
                                </span>
                                {/* User */}
                                <div className="flex items-center gap-1">
                                  <User className="w-2.5 h-2.5 shrink-0" style={{ color: muted }} />
                                  <span style={{ fontSize: '10px', fontWeight: 600, color: text, lineHeight: 1.2 }}>
                                    {r.userName}
                                  </span>
                                </div>
                                {/* Time */}
                                <div className="flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5 shrink-0" style={{ color: muted }} />
                                  <span style={{ fontSize: '9px', color: muted }}>{slot}</span>
                                </div>
                                {/* Capacity + Type */}
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span style={{ fontSize: '9px', color: muted }}>
                                    {rt.capacityLabel}: {r.roomCapacity}
                                  </span>
                                  <span style={{ fontSize: '9px', color: muted }}>
                                    {getRoomTypeLabel(r.roomType, locale)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
