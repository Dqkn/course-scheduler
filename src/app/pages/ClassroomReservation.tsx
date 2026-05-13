import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LoginScreen } from '../components/LoginScreen';
import { ReservationHome } from '../components/reservation/ReservationHome';
import { ReservationFilters } from '../components/reservation/ReservationFilters';
import { ReservationResults } from '../components/reservation/ReservationResults';
import { ReservationConfirmModal } from '../components/reservation/ReservationConfirmModal';
import { ActiveReservations } from '../components/reservation/ActiveReservations';
import { AllReservationsView } from '../components/reservation/AllReservationsView';
import type { ReservationView, ReservationFilterState, Room } from '../types/reservationTypes';

export function ClassroomReservation() {
  const { darkMode, currentUser } = useApp();

  const [view, setView] = useState<ReservationView>('home');
  const [filters, setFilters] = useState<ReservationFilterState | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<(Room & { isAvailable: boolean }) | null>(null);

  // Guard: require login (non-student)
  if (!currentUser) {
    return <LoginScreen portalType="admin" />;
  }

  function handleSearch(f: ReservationFilterState) {
    setFilters(f);
    setView('results');
  }

  function handleSelectRoom(room: Room & { isAvailable: boolean }) {
    if (room.isAvailable) {
      setSelectedRoom(room);
    }
  }

  function handleReserved() {
    // After successful reservation, refresh results
    setSelectedRoom(null);
    // Re-trigger results to refresh availability
    if (filters) {
      setFilters({ ...filters });
    }
  }

  function handleNavigate(v: ReservationView) {
    setView(v);
    if (v === 'home') {
      setFilters(null);
      setSelectedRoom(null);
    }
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: darkMode ? '#050c1a' : '#fafafa' }}
    >

      {/* View Router */}
      {view === 'home' && (
        <ReservationHome
          darkMode={darkMode}
          userRole={currentUser.role}
          onNavigate={handleNavigate}
        />
      )}

      {view === 'filters' && (
        <ReservationFilters
          darkMode={darkMode}
          onSearch={handleSearch}
          onBack={() => handleNavigate('home')}
        />
      )}

      {view === 'results' && filters && (
        <ReservationResults
          darkMode={darkMode}
          filters={filters}
          onBack={() => setView('filters')}
          onSelectRoom={handleSelectRoom}
        />
      )}

      {view === 'active' && (
        <ActiveReservations
          darkMode={darkMode}
          userId={currentUser.id}
          onBack={() => handleNavigate('home')}
        />
      )}

      {view === 'allReservations' && (
        <AllReservationsView
          darkMode={darkMode}
          onBack={() => handleNavigate('home')}
        />
      )}

      {/* Confirm Modal */}
      {selectedRoom && filters && (
        <ReservationConfirmModal
          darkMode={darkMode}
          room={selectedRoom}
          filters={filters}
          userId={currentUser.id}
          userName={currentUser.name}
          userRole={currentUser.role}
          onClose={() => setSelectedRoom(null)}
          onReserved={handleReserved}
        />
      )}
    </div>
  );
}
