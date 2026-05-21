import type { DbCourse } from '../types/courseTypes';
import { request, DEMO_MODE } from './apiClient';
import { DEMO_DB_COURSES } from './demoData';

/**
 * ─── Course Service ─────────────────────────────────────────────────────────
 *
 * Fetches the course catalog from the backend.
 *
 * Expected backend endpoint:
 *   GET /api/courses → DbCourse[]
 *
 * The shape must match the `DbCourse` interface in types/courseTypes.ts.
 * ────────────────────────────────────────────────────────────────────────────
 */
export async function fetchCourseData(): Promise<DbCourse[]> {
  if (DEMO_MODE) {
    // Simulate a small network delay so loading skeletons are visible.
    await new Promise(r => setTimeout(r, 300));
    return DEMO_DB_COURSES.map(c => ({ ...c }));
  }
  return request<DbCourse[]>('/courses');
}
