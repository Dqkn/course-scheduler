import type {
  Reservation,
  Room,
  RoomTypeFilter,
  TimeSlot,
  RoomGrouped,
} from '../types/reservationTypes';
import { MOCK_ROOMS } from '../data/roomReservationMockData';

const STORAGE_KEY = 'optisched-reservations';

// ── localStorage helpers ──

export function getReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReservation(reservation: Reservation): void {
  const all = getReservations();
  all.push(reservation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function removeReservation(id: string): void {
  const all = getReservations().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getUserReservations(userId: string): Reservation[] {
  return getReservations().filter(r => r.userId === userId);
}

// ── Availability check ──

export function isRoomAvailable(
  roomCode: string,
  date: string,
  timeSlots: TimeSlot[],
): boolean {
  const reservations = getReservations();
  return !reservations.some(
    r =>
      r.roomCode === roomCode &&
      r.date === date &&
      r.timeSlots.some(ts => timeSlots.includes(ts)),
  );
}

// ── Filtering ──

export function filterRooms(
  roomType: RoomTypeFilter,
  minCapacity: number,
  date: string,
  timeSlots: TimeSlot[],
): (Room & { isAvailable: boolean })[] {
  return MOCK_ROOMS
    .filter(room => {
      if (roomType !== 'all' && room.type !== roomType) return false;
      if (room.capacity < minCapacity) return false;
      return true;
    })
    .map(room => ({
      ...room,
      isAvailable: isRoomAvailable(room.roomCode, date, timeSlots),
    }));
}

// ── Grouping ──

export function groupRoomsByBlockAndFloor(
  rooms: (Room & { isAvailable: boolean })[],
): RoomGrouped[] {
  const blockMap = new Map<string, Map<number, (Room & { isAvailable: boolean })[]>>();

  for (const room of rooms) {
    if (!blockMap.has(room.block)) {
      blockMap.set(room.block, new Map());
    }
    const floorMap = blockMap.get(room.block)!;
    if (!floorMap.has(room.floor)) {
      floorMap.set(room.floor, []);
    }
    floorMap.get(room.floor)!.push(room);
  }

  const result: RoomGrouped[] = [];
  const sortedBlocks = [...blockMap.keys()].sort();

  for (const block of sortedBlocks) {
    const floorMap = blockMap.get(block)!;
    const sortedFloors = [...floorMap.keys()].sort((a, b) => a - b);
    const floors = sortedFloors.map(floor => ({
      floor,
      rooms: floorMap.get(floor)!.sort((a, b) => a.roomCode.localeCompare(b.roomCode)),
    }));
    result.push({ block, floors });
  }

  return result;
}

// ── ID generation ──

export function generateReservationId(): string {
  return `res_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Date helpers ──

export function getTodayString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function formatDateTr(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${d}.${m}.${y}`;
}

export function formatDateEn(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

export function getRoomTypeLabel(type: string, locale: 'tr' | 'en'): string {
  const map: Record<string, Record<string, string>> = {
    derslik: { tr: 'Derslik', en: 'Classroom' },
    amfi: { tr: 'Amfi', en: 'Amphitheater' },
    laboratuvar: { tr: 'Laboratuvar', en: 'Laboratory' },
    all: { tr: 'Tümü', en: 'All' },
  };
  return map[type]?.[locale] ?? type;
}
