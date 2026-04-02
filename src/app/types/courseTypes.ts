/**
 * ─── DbCourse ───────────────────────────────────────────────────────────────
 * Represents a course record as it comes from the university database.
 *
 * This interface maps 1:1 to the database schema. It is intentionally kept
 * separate from the existing `Course` interface (used in the weekly schedule
 * grid) so both domains can evolve independently.
 *
 * When the backend is ready, the API response should match this shape exactly.
 * ────────────────────────────────────────────────────────────────────────────
 */
export interface DbCourse {
  /** Department identifier: BİL, EEM, END, CE, BME, MAK, AI, CSE, BENG, EEE, IND, ME */
  dept_id: string;

  /** Course code, e.g. "CSE101", "BIL301" */
  code: string;

  /** Full course name, e.g. "Data Structures & Algorithms" */
  name: string;

  /** Theory (lecture) hours per week */
  t_hour: number;

  /** Lab / practice hours per week */
  l_hour: number;

  /** The semester this course belongs to (1–8) */
  program_semester: number;

  /** Whether this is a service course offered to other departments */
  is_service_course: boolean;

  /** Whether this course is delivered online */
  is_online: boolean;
}
