export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
export type CourseType = 'Lecture' | 'Lab' | 'Seminar' | 'Tutorial';

export interface Course {
  id: string;
  name: string;
  code: string;
  lecturer: string;
  lecturerId: string;
  department: string;
  classLevel: string;
  room: string;
  day: DayKey;
  startTime: string;
  endTime: string;
  studentsEnrolled: number;
  totalCapacity: number;
  colorIndex: number;
  type: CourseType;
  hasConflict?: boolean;
  conflictReason?: string;
}

export interface Lecturer {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
}

export const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const DAY_LABELS: Record<DayKey, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
};

export const COURSE_COLORS = [
  { lightBg: '#DBEAFE', lightBorder: '#93C5FD', lightText: '#1E40AF', darkBg: '#172554', darkBorder: '#3B82F6', darkText: '#93C5FD' },   // blue
  { lightBg: '#EDE9FE', lightBorder: '#C4B5FD', lightText: '#5B21B6', darkBg: '#2E1065', darkBorder: '#7C3AED', darkText: '#C4B5FD' },   // violet
  { lightBg: '#D1FAE5', lightBorder: '#6EE7B7', lightText: '#065F46', darkBg: '#022C22', darkBorder: '#34D399', darkText: '#6EE7B7' },   // emerald
  { lightBg: '#FEF3C7', lightBorder: '#FCD34D', lightText: '#78350F', darkBg: '#451A03', darkBorder: '#F59E0B', darkText: '#FCD34D' },   // amber
  { lightBg: '#FCE7F3', lightBorder: '#F9A8D4', lightText: '#9D174D', darkBg: '#500724', darkBorder: '#EC4899', darkText: '#F9A8D4' },   // pink
  { lightBg: '#CCFBF1', lightBorder: '#5EEAD4', lightText: '#115E59', darkBg: '#042F2E', darkBorder: '#14B8A6', darkText: '#5EEAD4' },   // teal
  { lightBg: '#E0E7FF', lightBorder: '#A5B4FC', lightText: '#3730A3', darkBg: '#1E1B4B', darkBorder: '#6366F1', darkText: '#A5B4FC' },   // indigo
  { lightBg: '#FFE4E6', lightBorder: '#FCA5A5', lightText: '#991B1B', darkBg: '#450A0A', darkBorder: '#F87171', darkText: '#FCA5A5' },   // rose
];

export const LECTURERS: Lecturer[] = [
  { id: 'l1', name: 'Dr. Sarah Chen', title: 'Associate Professor', department: 'Computer Science', email: 's.chen@university.edu' },
  { id: 'l2', name: 'Prof. James Wilson', title: 'Professor', department: 'Software Engineering', email: 'j.wilson@university.edu' },
  { id: 'l3', name: 'Dr. Maria Garcia', title: 'Assistant Professor', department: 'Computer Science', email: 'm.garcia@university.edu' },
  { id: 'l4', name: 'Dr. Ahmed Hassan', title: 'Associate Professor', department: 'Information Technology', email: 'a.hassan@university.edu' },
];

export const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Information Technology'];
export const CLASS_LEVELS = [
  '1st Year CS', '2nd Year CS', '3rd Year CS', '4th Year CS',
  '2nd Year IT', '3rd Year IT',
  '3rd Year SE', '4th Year SE',
];

export const COURSES: Course[] = [
  // ── MONDAY ──────────────────────────────────────────────────────────────
  {
    id: 'c1', name: 'Data Structures & Algorithms', code: 'CS201',
    lecturer: 'Dr. Sarah Chen', lecturerId: 'l1',
    department: 'Computer Science', classLevel: '2nd Year CS',
    room: 'A-101', day: 'Mon', startTime: '09:00', endTime: '11:00',
    studentsEnrolled: 45, totalCapacity: 50, colorIndex: 0, type: 'Lecture',
  },
  {
    id: 'c2', name: 'Software Engineering Principles', code: 'SE301',
    lecturer: 'Prof. James Wilson', lecturerId: 'l2',
    department: 'Software Engineering', classLevel: '3rd Year SE',
    room: 'B-203', day: 'Mon', startTime: '09:00', endTime: '10:30',
    studentsEnrolled: 38, totalCapacity: 40, colorIndex: 1, type: 'Lecture',
  },
  {
    id: 'c3', name: 'Database Systems', code: 'CS302',
    lecturer: 'Dr. Sarah Chen', lecturerId: 'l1',
    department: 'Computer Science', classLevel: '3rd Year CS',
    room: 'A-101', day: 'Mon', startTime: '11:00', endTime: '13:00',
    studentsEnrolled: 40, totalCapacity: 50, colorIndex: 2, type: 'Lecture',
  },
  {
    id: 'c4', name: 'Computer Networks', code: 'IT301',
    lecturer: 'Dr. Ahmed Hassan', lecturerId: 'l4',
    department: 'Information Technology', classLevel: '3rd Year IT',
    room: 'C-105', day: 'Mon', startTime: '14:00', endTime: '16:00',
    studentsEnrolled: 35, totalCapacity: 45, colorIndex: 3, type: 'Lecture',
  },

  // ── TUESDAY ─────────────────────────────────────────────────────────────
  {
    id: 'c5', name: 'Artificial Intelligence', code: 'CS401',
    lecturer: 'Dr. Maria Garcia', lecturerId: 'l3',
    department: 'Computer Science', classLevel: '4th Year CS',
    room: 'B-201', day: 'Tue', startTime: '09:00', endTime: '11:00',
    studentsEnrolled: 42, totalCapacity: 50, colorIndex: 4, type: 'Lecture',
  },
  {
    id: 'c6', name: 'Web Development', code: 'IT201',
    lecturer: 'Prof. James Wilson', lecturerId: 'l2',
    department: 'Information Technology', classLevel: '2nd Year IT',
    room: 'Lab-1', day: 'Tue', startTime: '09:00', endTime: '11:00',
    studentsEnrolled: 30, totalCapacity: 35, colorIndex: 5, type: 'Lab',
  },
  {
    id: 'c7', name: 'Machine Learning', code: 'CS402',
    lecturer: 'Dr. Maria Garcia', lecturerId: 'l3',
    department: 'Computer Science', classLevel: '4th Year SE',
    room: 'B-201', day: 'Tue', startTime: '11:00', endTime: '13:00',
    studentsEnrolled: 28, totalCapacity: 40, colorIndex: 6, type: 'Lecture',
  },
  {
    id: 'c8', name: 'Operating Systems', code: 'CS202',
    lecturer: 'Dr. Ahmed Hassan', lecturerId: 'l4',
    department: 'Computer Science', classLevel: '2nd Year CS',
    room: 'A-102', day: 'Tue', startTime: '13:00', endTime: '15:00',
    studentsEnrolled: 48, totalCapacity: 50, colorIndex: 7, type: 'Lecture',
    hasConflict: true, conflictReason: 'Class conflict: 2nd Year CS double-booked 14:00–15:00',
  },
  {
    id: 'c9', name: 'Data Structures Lab', code: 'CS201L',
    lecturer: 'Dr. Sarah Chen', lecturerId: 'l1',
    department: 'Computer Science', classLevel: '2nd Year CS',
    room: 'Lab-2', day: 'Tue', startTime: '14:00', endTime: '16:00',
    studentsEnrolled: 24, totalCapacity: 25, colorIndex: 0, type: 'Lab',
    hasConflict: true, conflictReason: 'Class conflict: 2nd Year CS double-booked 14:00–15:00',
  },

  // ── WEDNESDAY ───────────────────────────────────────────────────────────
  {
    id: 'c10', name: 'Database Systems', code: 'CS302',
    lecturer: 'Dr. Sarah Chen', lecturerId: 'l1',
    department: 'Computer Science', classLevel: '3rd Year CS',
    room: 'A-101', day: 'Wed', startTime: '09:00', endTime: '10:30',
    studentsEnrolled: 40, totalCapacity: 50, colorIndex: 2, type: 'Lecture',
  },
  {
    id: 'c11', name: 'Software Engineering Lab', code: 'SE301L',
    lecturer: 'Prof. James Wilson', lecturerId: 'l2',
    department: 'Software Engineering', classLevel: '3rd Year SE',
    room: 'Lab-3', day: 'Wed', startTime: '10:00', endTime: '12:00',
    studentsEnrolled: 20, totalCapacity: 25, colorIndex: 1, type: 'Lab',
  },
  {
    id: 'c12', name: 'Computer Networks', code: 'IT301',
    lecturer: 'Dr. Ahmed Hassan', lecturerId: 'l4',
    department: 'Information Technology', classLevel: '3rd Year IT',
    room: 'C-105', day: 'Wed', startTime: '11:00', endTime: '13:00',
    studentsEnrolled: 35, totalCapacity: 45, colorIndex: 3, type: 'Lecture',
  },
  {
    id: 'c13', name: 'Web Development', code: 'IT201',
    lecturer: 'Prof. James Wilson', lecturerId: 'l2',
    department: 'Information Technology', classLevel: '2nd Year IT',
    room: 'Lab-1', day: 'Wed', startTime: '14:00', endTime: '15:30',
    studentsEnrolled: 30, totalCapacity: 35, colorIndex: 5, type: 'Lab',
  },
  {
    id: 'c14', name: 'Machine Learning Lab', code: 'CS402L',
    lecturer: 'Dr. Maria Garcia', lecturerId: 'l3',
    department: 'Computer Science', classLevel: '4th Year SE',
    room: 'Lab-2', day: 'Wed', startTime: '14:00', endTime: '16:00',
    studentsEnrolled: 15, totalCapacity: 20, colorIndex: 6, type: 'Lab',
  },

  // ── THURSDAY ────────────────────────────────────────────────────────────
  {
    id: 'c15', name: 'Artificial Intelligence', code: 'CS401',
    lecturer: 'Dr. Maria Garcia', lecturerId: 'l3',
    department: 'Computer Science', classLevel: '4th Year CS',
    room: 'B-201', day: 'Thu', startTime: '09:00', endTime: '11:00',
    studentsEnrolled: 42, totalCapacity: 50, colorIndex: 4, type: 'Lecture',
  },
  {
    id: 'c16', name: 'Data Structures & Algorithms', code: 'CS201',
    lecturer: 'Dr. Sarah Chen', lecturerId: 'l1',
    department: 'Computer Science', classLevel: '2nd Year CS',
    room: 'A-101', day: 'Thu', startTime: '09:00', endTime: '11:00',
    studentsEnrolled: 45, totalCapacity: 50, colorIndex: 0, type: 'Lecture',
  },
  {
    id: 'c17', name: 'Operating Systems', code: 'CS202',
    lecturer: 'Dr. Ahmed Hassan', lecturerId: 'l4',
    department: 'Computer Science', classLevel: '2nd Year CS',
    room: 'A-102', day: 'Thu', startTime: '11:00', endTime: '12:30',
    studentsEnrolled: 48, totalCapacity: 50, colorIndex: 7, type: 'Lecture',
  },
  {
    id: 'c18', name: 'Software Engineering Principles', code: 'SE301',
    lecturer: 'Prof. James Wilson', lecturerId: 'l2',
    department: 'Software Engineering', classLevel: '3rd Year SE',
    room: 'B-203', day: 'Thu', startTime: '13:00', endTime: '15:00',
    studentsEnrolled: 38, totalCapacity: 40, colorIndex: 1, type: 'Lecture',
  },
  {
    id: 'c19', name: 'Database Systems Lab', code: 'CS302L',
    lecturer: 'Dr. Sarah Chen', lecturerId: 'l1',
    department: 'Computer Science', classLevel: '3rd Year CS',
    room: 'Lab-2', day: 'Thu', startTime: '14:00', endTime: '16:00',
    studentsEnrolled: 22, totalCapacity: 25, colorIndex: 2, type: 'Lab',
  },

  // ── FRIDAY ──────────────────────────────────────────────────────────────
  {
    id: 'c20', name: 'Computer Networks', code: 'IT301',
    lecturer: 'Dr. Ahmed Hassan', lecturerId: 'l4',
    department: 'Information Technology', classLevel: '3rd Year IT',
    room: 'C-105', day: 'Fri', startTime: '09:00', endTime: '11:00',
    studentsEnrolled: 35, totalCapacity: 45, colorIndex: 3, type: 'Lecture',
  },
  {
    id: 'c21', name: 'Web Development', code: 'IT201',
    lecturer: 'Prof. James Wilson', lecturerId: 'l2',
    department: 'Information Technology', classLevel: '2nd Year IT',
    room: 'Lab-1', day: 'Fri', startTime: '09:00', endTime: '11:00',
    studentsEnrolled: 30, totalCapacity: 35, colorIndex: 5, type: 'Lab',
  },
  {
    id: 'c22', name: 'Artificial Intelligence Lab', code: 'CS401L',
    lecturer: 'Dr. Maria Garcia', lecturerId: 'l3',
    department: 'Computer Science', classLevel: '4th Year CS',
    room: 'Lab-3', day: 'Fri', startTime: '11:00', endTime: '13:00',
    studentsEnrolled: 21, totalCapacity: 25, colorIndex: 4, type: 'Lab',
  },
  {
    id: 'c23', name: 'Operating Systems', code: 'CS202',
    lecturer: 'Dr. Ahmed Hassan', lecturerId: 'l4',
    department: 'Computer Science', classLevel: '2nd Year CS',
    room: 'A-102', day: 'Fri', startTime: '13:00', endTime: '15:00',
    studentsEnrolled: 48, totalCapacity: 50, colorIndex: 7, type: 'Lecture',
  },
  {
    id: 'c24', name: 'Machine Learning', code: 'CS402',
    lecturer: 'Dr. Maria Garcia', lecturerId: 'l3',
    department: 'Computer Science', classLevel: '4th Year SE',
    room: 'B-201', day: 'Fri', startTime: '14:00', endTime: '16:00',
    studentsEnrolled: 28, totalCapacity: 40, colorIndex: 6, type: 'Lecture',
  },
];

export const STATUS_DATA = {
  algorithmTime: 2.34,
  totalPlaced: 24,
  totalCourses: 24,
  conflictCount: 2,
  warnings: [
    {
      id: 'w1',
      severity: 'error' as const,
      message: '2nd Year CS double-booked on Tuesday 14:00–15:00',
      courses: ['c8', 'c9'],
    },
  ],
  stats: {
    totalStudentSessions: 692,
    roomsUsed: 8,
    totalRooms: 12,
    lecturerHours: {
      'Dr. Sarah Chen': 14,
      'Prof. James Wilson': 13,
      'Dr. Maria Garcia': 14,
      'Dr. Ahmed Hassan': 12,
    },
  },
};
