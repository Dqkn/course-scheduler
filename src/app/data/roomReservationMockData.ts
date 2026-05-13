import type { Room } from '../types/reservationTypes';

export const MOCK_ROOMS: Room[] = [
  { roomCode: 'E401', capacity: 51, type: 'derslik', block: 'E', floor: 4 },
  { roomCode: 'E402', capacity: 29, type: 'derslik', block: 'E', floor: 4 },
  { roomCode: 'E408', capacity: 62, type: 'amfi', block: 'E', floor: 4 },
  { roomCode: 'E411', capacity: 43, type: 'derslik', block: 'E', floor: 4 },
  { roomCode: 'F201', capacity: 47, type: 'derslik', block: 'F', floor: 2 },
  { roomCode: 'F302', capacity: 52, type: 'laboratuvar', block: 'F', floor: 3 },
  { roomCode: 'F505', capacity: 34, type: 'derslik', block: 'F', floor: 5 },
  { roomCode: 'F509', capacity: 36, type: 'derslik', block: 'F', floor: 5 },
  { roomCode: 'F510', capacity: 36, type: 'derslik', block: 'F', floor: 5 },
  { roomCode: 'F514', capacity: 28, type: 'derslik', block: 'F', floor: 5 },
  { roomCode: 'A101', capacity: 100, type: 'amfi', block: 'A', floor: 1 },
  { roomCode: 'B204', capacity: 40, type: 'laboratuvar', block: 'B', floor: 2 },
];
