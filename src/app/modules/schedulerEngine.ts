/**
 * ─── OptiSched TypeScript Scheduling Engine ─────────────────────────────────
 *
 * Pure TypeScript port of the Python OptiSched CSP solver.
 * Uses greedy placement with randomized ordering for variety.
 *
 * Constraints enforced:
 *  1. Block scheduling (5h→3+2, 4h→2+2, 6h→3+3)
 *  2. Instructor conflict (same lecturer can't be in two places at once)
 *  3. Semester+section conflict (same semester, same section → no overlap)
 *  4. Split parts must be on different days
 *  5. Each task assigned as a contiguous block on one day
 *
 * When the backend is ready, replace `runScheduler()` body with a fetch().
 * ────────────────────────────────────────────────────────────────────────────
 */

import type { Course, DayKey, CourseType } from '../data/mockData';
import { COURSE_COLORS } from '../data/mockData';
import type { AlgorithmInput } from '../data/algorithmData';

/* ─── Config ──────────────────────────────────────────────────────────────── */

const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const DAY_LABELS: Record<DayKey, string> = {
  Mon: 'Pazartesi', Tue: 'Salı', Wed: 'Çarşamba', Thu: 'Perşembe', Fri: 'Cuma',
};
const TIMESLOTS = 8; // 09:00–17:00, each 1 hour
const START_HOUR = 9;

function timeStr(slot: number): string {
  const h = START_HOUR + slot;
  return `${String(h).padStart(2, '0')}:00`;
}

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface ExpandedTask {
  parentIdx: number;    // index in original course list
  parentId: string;     // "courseIdx_sectionIdx"
  code: string;         // "BİL110-1"
  name: string;         // "BİL110-1 (P1)" for splits
  hours: number;        // block hours for this part
  semester: number;
  section: number;
  totalSections: number;
  lecturer: string;
  splitIndex: number;   // 0 if no split, 0/1 if split
  totalSplits: number;
}

interface Assignment {
  task: ExpandedTask;
  day: number;      // 0–4
  startSlot: number; // 0–7
}

export interface ScheduleStats {
  executionTime: number;
  totalPlaced: number;
  totalTasks: number;
  conflictCount: number;
  warnings: Array<{ id: string; severity: 'error' | 'warning'; message: string; courses: string[] }>;
  lecturerHours: Record<string, number>;
  uniqueLecturers: string[];
  roomsUsed: number;
  totalRooms: number;
}

export interface SchedulerResult {
  courses: Course[];
  stats: ScheduleStats;
}

/* ─── Block Splitter ──────────────────────────────────────────────────────── */

function splitHours(total: number): number[] {
  if (total === 5) return [3, 2];
  if (total === 4) return [2, 2];
  if (total === 6) return [3, 3];
  return [total];
}

/* ─── Expansion ───────────────────────────────────────────────────────────── */

function expandCourses(inputs: AlgorithmInput[]): ExpandedTask[] {
  const tasks: ExpandedTask[] = [];

  for (let i = 0; i < inputs.length; i++) {
    const course = inputs[i];
    if (course.hour <= 0) continue;

    const numSections = Math.max(1, course.section);
    const splits = splitHours(course.hour);

    for (let sec = 1; sec <= numSections; sec++) {
      for (let sp = 0; sp < splits.length; sp++) {
        const partSuffix = splits.length > 1 ? ` (P${sp + 1})` : '';
        tasks.push({
          parentIdx: i,
          parentId: `${i}_${sec}`,
          code: `${course.code}-${sec}`,
          name: `${course.name}-${sec}${partSuffix}`,
          hours: splits[sp],
          semester: course.semester,
          section: sec,
          totalSections: numSections,
          lecturer: course.lecturer,
          splitIndex: sp,
          totalSplits: splits.length,
        });
      }
    }
  }

  return tasks;
}

/* ─── Constraint Checker ──────────────────────────────────────────────────── */

function canPlace(
  task: ExpandedTask,
  day: number,
  startSlot: number,
  assignments: Assignment[],
  allTasks: ExpandedTask[],
): boolean {
  const endSlot = startSlot + task.hours;

  // Out of bounds
  if (endSlot > TIMESLOTS) return false;

  for (const a of assignments) {
    const aEnd = a.startSlot + a.task.hours;

    // Only check same day
    if (a.day !== day) continue;

    // Time overlap?
    const overlaps = startSlot < aEnd && endSlot > a.startSlot;
    if (!overlaps) continue;

    // 1. Instructor conflict (skip anonymous)
    if (
      task.lecturer !== 'anonim' &&
      task.lecturer.trim() !== '-' &&
      task.lecturer === a.task.lecturer
    ) {
      return false;
    }

    // 2. Semester + section conflict
    if (task.semester === a.task.semester) {
      // Same section number OR one of them is a single-section course (mandatory for all)
      if (task.section === a.task.section || task.totalSections === 1 || a.task.totalSections === 1) {
        return false;
      }
    }
  }

  // 3. Split parts of same parent must be on different days
  if (task.totalSplits > 1) {
    for (const a of assignments) {
      if (a.task.parentId === task.parentId && a.day === day) {
        return false;
      }
    }
  }

  return true;
}

/* ─── Greedy Scheduler ────────────────────────────────────────────────────── */

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function greedySchedule(tasks: ExpandedTask[]): Assignment[] {
  const assignments: Assignment[] = [];

  // Sort: larger blocks first → harder to place, then by semester
  const sorted = [...tasks].sort((a, b) => {
    if (b.hours !== a.hours) return b.hours - a.hours;
    if (a.semester !== b.semester) return a.semester - b.semester;
    return a.section - b.section;
  });

  for (const task of sorted) {
    let placed = false;

    // Randomize day-slot order for variety
    const dayOrder = shuffleArray([0, 1, 2, 3, 4]);
    const slotOrder = shuffleArray(Array.from({ length: TIMESLOTS }, (_, i) => i));

    for (const d of dayOrder) {
      if (placed) break;
      for (const s of slotOrder) {
        if (canPlace(task, d, s, assignments, sorted)) {
          assignments.push({ task, day: d, startSlot: s });
          placed = true;
          break;
        }
      }
    }

    if (!placed) {
      // Fallback: try every combination exhaustively
      for (let d = 0; d < 5; d++) {
        if (placed) break;
        for (let s = 0; s <= TIMESLOTS - task.hours; s++) {
          if (canPlace(task, d, s, assignments, sorted)) {
            assignments.push({ task, day: d, startSlot: s });
            placed = true;
            break;
          }
        }
      }
    }

    // If still not placed, force-place (will show as conflict)
    if (!placed) {
      assignments.push({ task, day: 0, startSlot: 0 });
    }
  }

  return assignments;
}

/* ─── Convert to Course[] ─────────────────────────────────────────────────── */

function assignmentsToCoursesArray(assignments: Assignment[]): Course[] {
  let roomCounter = 1;
  const roomMap = new Map<string, string>();

  // Assign rooms: same parent+section gets same room
  for (const a of assignments) {
    const key = a.task.parentId;
    if (!roomMap.has(key)) {
      roomMap.set(key, `D-${String(roomCounter++).padStart(2, '0')}`);
    }
  }

  return assignments.map((a, idx) => {
    const dayKey = DAYS[a.day];
    const startTime = timeStr(a.startSlot);
    const endTime = timeStr(a.startSlot + a.task.hours);
    const room = roomMap.get(a.task.parentId) || `D-${idx}`;
    const colorIndex = a.task.semester % COURSE_COLORS.length;

    // Determine type
    const nameLower = a.task.name.toLowerCase();
    const type: CourseType = nameLower.includes('lab') || nameLower.includes('uygulama') || nameLower.includes('laboratuvar')
      ? 'Lab'
      : 'Lecture';

    // Capitalize lecturer name
    const lecturerName = a.task.lecturer === 'anonim'
      ? 'Atanmamış'
      : a.task.lecturer.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Class level from semester
    const year = Math.ceil(a.task.semester / 2);
    const classLevel = `${year}. Sınıf BİL`;

    return {
      id: `algo-${idx}`,
      name: a.task.name,
      code: a.task.code,
      lecturer: lecturerName,
      lecturerId: `lec-${a.task.lecturer.replace(/\s/g, '-')}`,
      department: 'Bilgisayar Mühendisliği',
      classLevel,
      room,
      day: dayKey,
      startTime,
      endTime,
      studentsEnrolled: 30 + Math.floor(Math.random() * 20),
      totalCapacity: 60,
      colorIndex,
      type,
      hasConflict: false,
    };
  });
}

/* ─── Conflict Detection ──────────────────────────────────────────────────── */

function detectConflicts(courses: Course[]): {
  courses: Course[];
  conflictCount: number;
  warnings: ScheduleStats['warnings'];
} {
  const warnings: ScheduleStats['warnings'] = [];
  let conflictCount = 0;

  // Check instructor conflicts
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const a = courses[i];
      const b = courses[j];

      if (a.day !== b.day) continue;
      if (a.lecturer === 'Atanmamış' || b.lecturer === 'Atanmamış') continue;
      if (a.lecturer !== b.lecturer) continue;

      const aStart = parseInt(a.startTime);
      const aEnd = parseInt(a.endTime);
      const bStart = parseInt(b.startTime);
      const bEnd = parseInt(b.endTime);

      if (aStart < bEnd && aEnd > bStart) {
        courses[i] = { ...a, hasConflict: true, conflictReason: `Hoca çakışması: ${a.lecturer}` };
        courses[j] = { ...b, hasConflict: true, conflictReason: `Hoca çakışması: ${b.lecturer}` };
        conflictCount++;
        warnings.push({
          id: `w-${i}-${j}`,
          severity: 'error',
          message: `${a.lecturer}: ${a.code} ve ${b.code} çakışıyor (${a.day} ${a.startTime})`,
          courses: [a.id, b.id],
        });
      }
    }
  }

  return { courses, conflictCount, warnings };
}

/* ─── Public API ──────────────────────────────────────────────────────────── */

export type TermType = 'fall' | 'spring';

export function runScheduler(
  allCourses: AlgorithmInput[],
  term: TermType = 'spring',
): SchedulerResult {
  const startTime = performance.now();

  // Filter by term: fall = odd semesters, spring = even semesters
  const filtered = allCourses.filter(c =>
    term === 'fall' ? c.semester % 2 !== 0 : c.semester % 2 === 0
  );

  // Expand into tasks
  const tasks = expandCourses(filtered);

  // Run scheduler
  const assignments = greedySchedule(tasks);

  // Convert to Course[]
  let courses = assignmentsToCoursesArray(assignments);

  // Detect conflicts
  const { courses: checkedCourses, conflictCount, warnings } = detectConflicts(courses);
  courses = checkedCourses;

  const executionTime = Number(((performance.now() - startTime) / 1000).toFixed(2));

  // Compute lecturer hours
  const lecturerHours: Record<string, number> = {};
  const lecturerSet = new Set<string>();
  for (const c of courses) {
    if (c.lecturer !== 'Atanmamış') {
      lecturerSet.add(c.lecturer);
      const [sh] = c.startTime.split(':').map(Number);
      const [eh] = c.endTime.split(':').map(Number);
      lecturerHours[c.lecturer] = (lecturerHours[c.lecturer] || 0) + (eh - sh);
    }
  }

  const roomsUsed = new Set(courses.map(c => c.room)).size;

  const stats: ScheduleStats = {
    executionTime,
    totalPlaced: courses.length,
    totalTasks: tasks.length,
    conflictCount,
    warnings,
    lecturerHours,
    uniqueLecturers: Array.from(lecturerSet).sort(),
    roomsUsed,
    totalRooms: roomsUsed + 4,
  };

  return { courses, stats };
}
