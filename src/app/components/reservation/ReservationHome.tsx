import { CalendarPlus, ClipboardList } from 'lucide-react';
import { useLocale } from '../../i18n';
import type { ReservationView } from '../../types/reservationTypes';

interface Props {
  darkMode: boolean;
  onNavigate: (view: ReservationView) => void;
}

export function ReservationHome({ darkMode, onNavigate }: Props) {
  const { t } = useLocale();
  const rt = t.reservation;

  const border = darkMode ? '#1e293b' : '#d1d5db';
  const surface = darkMode ? '#0f172a' : '#ffffff';
  const text = darkMode ? '#f1f5f9' : '#1a1a2e';
  const muted = darkMode ? '#94a3b8' : '#475569';

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
      <h2
        style={{ fontSize: '24px', fontWeight: 700, color: text, letterSpacing: '-0.02em' }}
        className="mb-2 text-center"
      >
        {rt.title}
      </h2>
      <p style={{ fontSize: '14px', color: muted }} className="mb-10 text-center max-w-md">
        {rt.subtitle}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl">
        {/* New Reservation Card */}
        <button
          onClick={() => onNavigate('filters')}
          className="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          style={{
            backgroundColor: surface,
            borderColor: border,
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            }}
          >
            <CalendarPlus className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <p style={{ fontSize: '16px', fontWeight: 700, color: text }}>{rt.newReservation}</p>
            <p style={{ fontSize: '12px', color: muted, marginTop: 4 }}>{rt.newReservationDesc}</p>
          </div>
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))'
                : 'linear-gradient(135deg, rgba(99,102,241,0.04), rgba(139,92,246,0.04))',
            }}
          />
        </button>

        {/* Active Reservations Card */}
        <button
          onClick={() => onNavigate('active')}
          className="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          style={{
            backgroundColor: surface,
            borderColor: border,
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
            }}
          >
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <div className="text-center">
            <p style={{ fontSize: '16px', fontWeight: 700, color: text }}>{rt.activeReservations}</p>
            <p style={{ fontSize: '12px', color: muted, marginTop: 4 }}>{rt.activeReservationsDesc}</p>
          </div>
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background: darkMode
                ? 'linear-gradient(135deg, rgba(8,145,178,0.08), rgba(6,182,212,0.08))'
                : 'linear-gradient(135deg, rgba(8,145,178,0.04), rgba(6,182,212,0.04))',
            }}
          />
        </button>
      </div>
    </div>
  );
}
