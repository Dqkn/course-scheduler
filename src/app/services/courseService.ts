import type { DbCourse } from '../types/courseTypes';
import { MOCK_DB_COURSES } from '../data/courseCatalogMockData';

/**
 * ─── Course Service ─────────────────────────────────────────────────────────
 *
 * ⚡ THIS IS THE ONLY FILE YOU NEED TO MODIFY WHEN THE BACKEND IS READY ⚡
 *
 * Currently returns mock data with a simulated network delay.
 * When your API is live, simply replace the function body:
 *
 *   BEFORE (mock):
 *     return new Promise(resolve => setTimeout(() => resolve(MOCK_DB_COURSES), delay));
 *
 *   AFTER (real):
 *     const res = await fetch('/api/courses');
 *     if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *     return res.json();
 *
 * Nothing else in the codebase needs to change.
 * ────────────────────────────────────────────────────────────────────────────
 */

/**
 * Fetch the list of courses from the data source.
 *
 * @returns A promise that resolves to an array of `DbCourse` objects.
 */
export async function fetchCourseData(): Promise<DbCourse[]> {
  // Simulate realistic network latency (400–800 ms)
  const delay = 400 + Math.random() * 400;

  return new Promise<DbCourse[]>((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DB_COURSES);
    }, delay);
  });
}
