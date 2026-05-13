import { useState } from 'react';
import { ArrowLeft, Trash2, Calendar, Clock, Users, Building2, AlertCircle } from 'lucide-react';
import { useLocale } from '../../i18n';
import type { Reservation } from '../../types/reservationTypes';
import { getUserReservations, removeReservation, formatDateTr, formatDateEn, getRoomTypeLabel } from '../../utils/reservationUtils';

interface Props {
  darkMode: boolean;
  userId: string;
  onBack: () => void;
}

export function ActiveReservations({ darkMode, userId, onBack }: Props) {
  const { t, locale } = useLocale();
  const rt = t.reservation;
  const [reservations, setReservations] = useState<Reservation[]>(() => getUserReservations(userId));
  const [cancelConfirm, setCancelConfirm] = useState<string | null>(null);

  const border = darkMode ? '#1e293b' : '#d1d5db';
  const surface = darkMode ? '#0f172a' : '#ffffff';
  const text = darkMode ? '#f1f5f9' : '#1a1a2e';
  const muted = darkMode ? '#94a3b8' : '#475569';
  const pillBg = darkMode ? '#1e293b' : '#f0f0f0';

  function handleCancel(id: string) {
    removeReservation(id);
    setReservations(prev => prev.filter(r => r.id !== id));
    setCancelConfirm(null);
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{ backgroundColor: pillBg, color: muted, fontSize: '13px' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {rt.back}
          </button>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: text }}>{rt.activeReservations}</h2>
          <span
            className="ml-auto px-2.5 py-0.5 rounded-full"
            style={{
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: darkMode ? '#172554' : '#dbeafe',
              color: darkMode ? '#93c5fd' : '#1e40af',
            }}
          >
            {reservations.length}
          </span>
        </div>

        {/* Empty State */}
        {reservations.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl border"
            style={{ backgroundColor: surface, borderColor: border }}
          >
            <Calendar className="w-12 h-12 mb-4" style={{ color: muted }} />
            <p style={{ fontSize: '15px', fontWeight: 600, color: text }}>{rt.noActiveReservations}</p>
            <p style={{ fontSize: '13px', color: muted, marginTop: 4 }}>{rt.noActiveReservationsDesc}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(res => {
                const dateFormatted = locale === 'tr' ? formatDateTr(res.date) : formatDateEn(res.date);
                const createdFormatted = new Date(res.createdAt).toLocaleString(
                  locale === 'tr' ? 'tr-TR' : 'en-GB',
                  { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' },
                );

                return (
                  <div
                    key={res.id}
                    className="rounded-xl border p-4 transition-all"
                    style={{ backgroundColor: surface, borderColor: border }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span style={{ fontSize: '16px', fontWeight: 700, color: text }}>
                            {res.roomCode}
                          </span>
                          <span
                            className="px-2 py-0.5 rounded-full"
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              backgroundColor: darkMode ? '#052e16' : '#dcfce7',
                              color: darkMode ? '#4ade80' : '#166534',
                            }}
                          >
                            {rt.activeLabel}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          <div className="flex items-center gap-1.5" style={{ fontSize: '12px', color: muted }}>
                            <Calendar className="w-3 h-3" />
                            {dateFormatted}
                          </div>
                          <div className="flex items-center gap-1.5" style={{ fontSize: '12px', color: muted }}>
                            <Clock className="w-3 h-3" />
                            {res.timeSlots.join(', ')}
                          </div>
                          <div className="flex items-center gap-1.5" style={{ fontSize: '12px', color: muted }}>
                            <Users className="w-3 h-3" />
                            {rt.capacityLabel}: {res.roomCapacity}
                          </div>
                          <div className="flex items-center gap-1.5" style={{ fontSize: '12px', color: muted }}>
                            <Building2 className="w-3 h-3" />
                            {getRoomTypeLabel(res.roomType, locale)}
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-2" style={{ fontSize: '11px', color: muted }}>
                          <span>{rt.createdBy}: {res.userName}</span>
                          <span>·</span>
                          <span>{createdFormatted}</span>
                        </div>
                      </div>

                      {/* Cancel button */}
                      <div className="shrink-0">
                        {cancelConfirm === res.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCancel(res.id)}
                              className="px-2.5 py-1.5 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                              style={{
                                fontSize: '11px',
                                backgroundColor: darkMode ? '#7f1d1d' : '#fef2f2',
                                color: '#dc2626',
                              }}
                            >
                              {rt.confirmCancel}
                            </button>
                            <button
                              onClick={() => setCancelConfirm(null)}
                              className="px-2 py-1.5 rounded-lg font-medium transition-colors"
                              style={{
                                fontSize: '11px',
                                backgroundColor: pillBg,
                                color: muted,
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCancelConfirm(res.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-[1.02]"
                            style={{
                              fontSize: '11px',
                              backgroundColor: darkMode ? '#450a0a' : '#fef2f2',
                              color: darkMode ? '#fca5a5' : '#dc2626',
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                            {rt.cancelReservation}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
