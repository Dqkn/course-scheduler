/**
 * ─── schedulerService ───────────────────────────────────────────────────────
 * Wraps backend scheduler endpoints. SchedulerContext is the only consumer.
 *
 * Expected backend endpoints:
 *   GET  /api/scheduler/inputs
 *        → AlgorithmInput[]   (curriculum + current section counts)
 *
 *   POST /api/scheduler/run
 *        body: { courses: AlgorithmInput[], term: 'fall' | 'spring' }
 *        → SchedulerResult    (placed Course[] + ScheduleStats)
 *
 *   PUT  /api/scheduler/inputs/:code
 *        body: Partial<AlgorithmInput>
 *        → AlgorithmInput     (update section count, name, lecturer)
 *
 *   POST /api/scheduler/publish
 *        body: { courses: string[] }   (ids of placed courses to publish)
 *        → { publishedAt: string }
 *
 * The backend owns the actual CSP/heuristic solver; the frontend just shows
 * what it returns and surfaces stats.
 * ────────────────────────────────────────────────────────────────────────────
 */

import type {
  AlgorithmInput,
  SchedulerResult,
  TermType,
} from '../types/schedulerTypes';
import { request, DEMO_MODE } from './apiClient';
import { DEMO_ALGORITHM_INPUTS, runDemoScheduler } from './demoData';

export async function fetchAlgorithmInputs(): Promise<AlgorithmInput[]> {
  if (DEMO_MODE) return DEMO_ALGORITHM_INPUTS.map(c => ({ ...c }));
  return request<AlgorithmInput[]>('/scheduler/inputs');
}

export async function runScheduler(
  courses: AlgorithmInput[],
  term: TermType,
): Promise<SchedulerResult> {
  if (DEMO_MODE) return runDemoScheduler(courses, term);
  return request<SchedulerResult>('/scheduler/run', {
    method: 'POST',
    body: { courses, term },
  });
}

export async function updateAlgorithmInput(
  code: string,
  patch: Partial<AlgorithmInput>,
): Promise<AlgorithmInput> {
  if (DEMO_MODE) return { course_code: code, ...patch } as AlgorithmInput;
  return request<AlgorithmInput>(`/scheduler/inputs/${encodeURIComponent(code)}`, {
    method: 'PUT',
    body: patch,
  });
}

export async function publishSchedule(courseIds: string[]): Promise<{ publishedAt: string }> {
  if (DEMO_MODE) return { publishedAt: new Date().toISOString() };
  return request<{ publishedAt: string }>('/scheduler/publish', {
    method: 'POST',
    body: { courses: courseIds },
  });
}
