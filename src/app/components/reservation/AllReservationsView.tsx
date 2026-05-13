import { useState, useMemo } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CalendarDays, Filter, X, Building2, User, SlidersHorizontal } from 'lucide-react';
import { useLocale } from '../../i18n';
import { ReservationWeeklyGrid } from './ReservationWeeklyGrid';
import type { Reservation } from '../../types/reservationTypes';
import { ROOM_TYPE_OPTIONS } from '../../types/reservationTypes';
import { getReservationsForWeek, getWeekDates, getWeekRangeLabel, getRoomTypeLabel } from '../../utils/reservationUtils';

interface Props {
  darkMode: boolean;
  onBack: () => void;
}

export function AllReservationsView({ darkMode, onBack }: Props) {
  const { t, locale } = useLocale();
  const rt = t.reservation;

  const [weekOffset, setWeekOffset] = useState(0);
  const [lecturerFilter, setLecturerFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('');

  // ── Style tokens ──
  const border = darkMode ? '#1e293b' : '#d1d5db';
  const surface = darkMode ? '#0f172a' : '#ffffff';
  const text = darkMode ? '#f1f5f9' : '#1a1a2e';
  const muted = darkMode ? '#94a3b8' : '#475569';
  const pillBg = darkMode ? '#1e293b' : '#f0f0f0';

  // ── Data ──
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const allWeekReservations = useMemo(() => getReservationsForWeek(weekOffset), [weekOffset]);
  const weekLabel = useMemo(() => getWeekRangeLabel(weekOffset, locale), [weekOffset, locale]);

  // ── Unique filter values (from ALL localStorage reservations, not just this week) ──
  const allLecturers = useMemo(() => {
    const names = new Set(allWeekReservations.map(r => r.userName));
    return Array.from(names).sort();
  }, [allWeekReservations]);

  const allRooms = useMemo(() => {
    const rooms = new Set(allWeekReservations.map(r => r.roomCode));
    return Array.from(rooms).sort();
  }, [allWeekReservations]);

  // ── Filtered reservations ──
  const filteredReservations = useMemo(() => {
    return allWeekReservations.filter(r => {
      if (lecturerFilter && r.userName !== lecturerFilter) return false;
      if (roomFilter && r.roomCode !== roomFilter) return false;
      if (roomTypeFilter && r.roomType !== roomTypeFilter) return false;
      return true;
    });
  }, [allWeekReservations, lecturerFilter, roomFilter, roomTypeFilter]);

  const hasFilters = lecturerFilter || roomFilter || roomTypeFilter;

  function clearFilters() {
    setLecturerFilter('');
    setRoomFilter('');
    setRoomTypeFilter('');
  }

  const selectStyle = {
    backgroundColor: pillBg,
    color: text,
    borderColor: border,
    fontSize: '12px',
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* ═══ Header ═══ */}
      <div
        className="px-4 sm:px-6 py-4 border-b shrink-0"
        style={{ backgroundColor: surface, borderColor: border }}
      >
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
            style={{ backgroundColor: pillBg, color: muted, fontSize: '12px' }}
          >
            <span className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              {rt.back}
            </span>
          </button>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: text, letterSpacing: '-0.02em' }}>
              {rt.allReservationsTitle}
            </h2>
            <p style={{ fontSize: '12px', color: muted, marginTop: 2 }}>
              {rt.allReservationsSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ Week Navigation ═══ */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b shrink-0"
        style={{ backgroundColor: darkMode ? '#0c1425' : '#f8fafc', borderColor: border }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(w => w - 1)}
            className="p-1.5 rounded-lg transition-colors hover:opacity-80"
            style={{ backgroundColor: pillBg, color: text }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors hover:opacity-80"
            style={{
              backgroundColor: weekOffset === 0
                ? darkMode ? '#312e81' : '#e0e7ff'
                : pillBg,
              color: weekOffset === 0
                ? darkMode ? '#a5b4fc' : '#4338ca'
                : muted,
              fontSize: '12px',
            }}
          >
            {rt.thisWeek}
          </button>
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="p-1.5 rounded-lg transition-colors hover:opacity-80"
            style={{ backgroundColor: pillBg, color: text }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4" style={{ color: '#6366f1' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: text, fontVariantNumeric: 'tabular-nums' }}>
            {weekLabel}
          </span>
        </div>
      </div>

      {/* ═══ Filters ═══ */}
      <div
        className="flex flex-wrap items-center gap-2.5 px-4 sm:px-6 py-2.5 border-b shrink-0"
        style={{ backgroundColor: surface, borderColor: border }}
      >
        <div className="flex items-center gap-1.5 mr-1" style={{ color: muted }}>
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: muted }}>
            {t.filters?.label ?? 'Filtreler'}
          </span>
        </div>

        {/* Lecturer */}
        <select
          value={lecturerFilter}
          onChange={e => setLecturerFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
          style={selectStyle}
        >
          <option value="">{rt.filterAll} — {rt.filterLecturer}</option>
          {allLecturers.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>

        {/* Room */}
        <select
          value={roomFilter}
          onChange={e => setRoomFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
          style={selectStyle}
        >
          <option value="">{rt.filterAll} — {rt.filterRoom}</option>
          {allRooms.map(room => (
            <option key={room} value={room}>{room}</option>
          ))}
        </select>

        {/* Room Type */}
        <select
          value={roomTypeFilter}
          onChange={e => setRoomTypeFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer focus:outline-none"
          style={selectStyle}
        >
          <option value="">{rt.filterAll} — {rt.filterRoomType}</option>
          {ROOM_TYPE_OPTIONS.filter(o => o.value !== 'all').map(opt => (
            <option key={opt.value} value={opt.value}>
              {locale === 'tr' ? opt.labelTr : opt.labelEn}
            </option>
          ))}
        </select>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: darkMode ? '#450a0a' : '#fee2e2',
              color: darkMode ? '#f87171' : '#b91c1c',
            }}
          >
            <X className="w-3 h-3" />
            {rt.clearFilters}
          </button>
        )}

        {/* Count */}
        <span
          className="ml-auto px-2 py-0.5 rounded-full"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            backgroundColor: darkMode ? '#1e293b' : '#f0f0f0',
            color: muted,
          }}
        >
          {filteredReservations.length} {rt.activeLabel.toLowerCase()}
        </span>
      </div>

      {/* ═══ Grid or Empty State ═══ */}
      {filteredReservations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: darkMode ? '#1e293b' : '#f1f5f9' }}
          >
            <CalendarDays className="w-7 h-7" style={{ color: muted }} />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: text, textAlign: 'center' }}>
            {rt.noReservationsThisWeek}
          </p>
        </div>
      ) : (
        <ReservationWeeklyGrid
          darkMode={darkMode}
          reservations={filteredReservations}
          weekDates={weekDates}
        />
      )}
    </div>
  );
}
