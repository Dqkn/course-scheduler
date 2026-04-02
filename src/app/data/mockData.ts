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

