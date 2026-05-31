import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Course, DayKey } from '../data/mockData';
import type { AlgorithmInput, LinkedCourseGroup, SchedulerConstraint, ScheduleStats, TermType } from '../types/schedulerTypes';
import type { ConstraintType, DayOfWeek } from '../types/schedulerTypes';
import * as schedulerService from '../services/schedulerService';
import { useUI } from './UIContext';

interface SchedulerContextType {
  isCalculating: boolean;
  calculationTime: number | null;
  runAlgorithm: () => void;
  scheduledCourses: Course[];
  scheduleStats: ScheduleStats | null;
  selectedTerm: TermType;
  setSelectedTerm: (term: TermType) => void;
  selectedLecturer: string;
  setSelectedLecturer: (name: string) => void;
  algorithmCourses: AlgorithmInput[];
  inputsLoading: boolean;
  updateCourseSection: (code: string, delta: number) => void;
  updateCourseContext: (code: string, newName: string, newLecturer: string) => void;
  importCourses: (courses: AlgorithmInput[]) => void;
  linkedGroups: LinkedCourseGroup[];
  addLinkedGroup: (courseCodes: string[]) => void;
  removeLinkedGroup: (groupId: string) => void;
  updateLinkedGroup: (groupId: string, courseCodes: string[]) => void;
  constraints: SchedulerConstraint[];
  addConstraint: (type: ConstraintType, target: string, day: DayOfWeek, hour: number) => void;
  removeConstraint: (id: string) => void;
  clearConstraints: (target?: string) => void;
  pinnedCourseIds: string[];
  togglePinCourse: (courseId: string) => void;
  clearPins: () => void;
}

const SchedulerContext = createContext<SchedulerContextType>({} as SchedulerContextType);

export function SchedulerProvider({ children }: { children: React.ReactNode }) {
  const { setPublishedAt, setOpenCourseIds } = useUI();

  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationTime, setCalculationTime] = useState<number | null>(null);
  // Curriculum/section inputs come from the backend (GET /api/scheduler/inputs).
  const [algorithmCourses, setAlgorithmCourses] = useState<AlgorithmInput[]>([]);
  const [inputsLoading, setInputsLoading] = useState(true);
  const [scheduledCourses, setScheduledCourses] = useState<Course[]>([]);
  const [scheduleStats, setScheduleStats] = useState<ScheduleStats | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<TermType>('spring');
  const [selectedLecturer, setSelectedLecturer] = useState<string>('');
  const [linkedGroups, setLinkedGroups] = useState<LinkedCourseGroup[]>([]);
  const [constraints, setConstraints] = useState<SchedulerConstraint[]>([]);
  const [pinnedCourseIds, setPinnedCourseIds] = useState<string[]>([]);
  // Keep a ref to scheduledCourses so pin logic can read them without stale closures
  const scheduledRef = useRef<Course[]>([]);
  scheduledRef.current = scheduledCourses;

  const addConstraint = useCallback((type: ConstraintType, target: string, day: DayOfWeek, hour: number) => {
    setConstraints(prev => {
      const exists = prev.some(c => c.type === type && c.target === target && c.day === day && c.hour === hour);
      if (exists) return prev;
      return [...prev, { id: crypto.randomUUID(), type, target, day, hour }];
    });
  }, []);

  const removeConstraint = useCallback((id: string) => {
    setConstraints(prev => prev.filter(c => c.id !== id));
  }, []);

  const clearConstraints = useCallback((target?: string) => {
    if (target) {
      setConstraints(prev => prev.filter(c => c.target !== target));
    } else {
      setConstraints([]);
    }
  }, []);

  const togglePinCourse = useCallback((courseId: string) => {
    setPinnedCourseIds(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  }, []);

  const clearPins = useCallback(() => {
    setPinnedCourseIds([]);
  }, []);

  const addLinkedGroup = useCallback((courseCodes: string[]) => {
    if (courseCodes.length < 2) return;
    setLinkedGroups(prev => [...prev, { id: crypto.randomUUID(), courseCodes }]);
  }, []);

  const removeLinkedGroup = useCallback((groupId: string) => {
    setLinkedGroups(prev => prev.filter(g => g.id !== groupId));
  }, []);

  const updateLinkedGroup = useCallback((groupId: string, courseCodes: string[]) => {
    if (courseCodes.length < 2) {
      setLinkedGroups(prev => prev.filter(g => g.id !== groupId));
      return;
    }
    setLinkedGroups(prev => prev.map(g => g.id === groupId ? { ...g, courseCodes } : g));
  }, []);

  // Load the editable curriculum inputs once on mount.
  useEffect(() => {
    let cancelled = false;
    setInputsLoading(true);
    schedulerService
      .fetchAlgorithmInputs()
      .then(inputs => {
        if (!cancelled) setAlgorithmCourses(inputs);
      })
      .catch(err => {
        // Backend not ready yet → stay with an empty list (empty state in UI).
        console.error('Failed to load scheduler inputs:', err);
        if (!cancelled) setAlgorithmCourses([]);
      })
      .finally(() => {
        if (!cancelled) setInputsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateCourseSection = useCallback((code: string, delta: number) => {
    setAlgorithmCourses(prev => prev.map(c =>
      c.course_code === code ? { ...c, section_count: Math.max(1, c.section_count + delta) } : c
    ));
  }, []);

  const updateCourseContext = useCallback((code: string, newName: string, newLecturer: string) => {
    setAlgorithmCourses(prev => prev.map(c =>
      c.course_code === code ? { ...c, course_name: newName, instructor_full_name: newLecturer } : c
    ));
  }, []);

  const importCourses = useCallback((imported: AlgorithmInput[]) => {
    setAlgorithmCourses(prev => {
      const map = new Map(prev.map(c => [c.course_code, c]));
      for (const c of imported) {
        map.set(c.course_code, c);
      }
      return Array.from(map.values());
    });
  }, []);

  const runAlgorithm = useCallback(async () => {
    setIsCalculating(true);
    setCalculationTime(null);
    setPublishedAt(null);

    // Build auto-constraints from pinned courses
    const pinConstraints: SchedulerConstraint[] = [];
    const currentCourses = scheduledRef.current;
    for (const id of pinnedCourseIds) {
      const course = currentCourses.find(c => c.id === id);
      if (!course) continue;
      const startHour = parseInt(course.startTime.split(':')[0]);
      const endHour = parseInt(course.endTime.split(':')[0]);
      const dayMap: Record<string, DayOfWeek> = { Mon: 'Mon', Tue: 'Tue', Wed: 'Wed', Thu: 'Thu', Fri: 'Fri' };
      const day = dayMap[course.day as DayKey];
      if (!day) continue;
      for (let h = startHour; h < endHour; h++) {
        pinConstraints.push({
          id: `pin-${id}-${day}-${h}`,
          type: 'course_fixed',
          target: course.code,
          day,
          hour: h,
        });
      }
    }

    const allConstraints = [...constraints, ...pinConstraints];

    try {
      const result = await schedulerService.runScheduler(algorithmCourses, selectedTerm, linkedGroups, allConstraints);

      // Mark pinned courses in the result
      const pinnedSet = new Set(pinnedCourseIds);
      const markedCourses = result.courses.map(c =>
        pinnedSet.has(c.id) ? { ...c, isPinned: true } : c
      );

      setScheduledCourses(markedCourses);
      setScheduleStats(result.stats);
      setCalculationTime(result.stats.executionTime);
      setOpenCourseIds(result.courses.map(c => c.id));

      // Remove pins for courses that no longer exist in results
      const resultIds = new Set(result.courses.map(c => c.id));
      setPinnedCourseIds(prev => prev.filter(id => resultIds.has(id)));

      if (result.stats.uniqueLecturers.length > 0 && !selectedLecturer) {
        setSelectedLecturer(result.stats.uniqueLecturers[0]);
      }
    } catch (err) {
      console.error('Scheduler failed:', err);
      setScheduledCourses([]);
      setScheduleStats(null);
      setCalculationTime(-1);
    } finally {
      setIsCalculating(false);
    }
  }, [algorithmCourses, selectedTerm, selectedLecturer, linkedGroups, constraints, pinnedCourseIds, setPublishedAt, setOpenCourseIds]);

  return (
    <SchedulerContext.Provider value={{
      isCalculating, calculationTime, runAlgorithm,
      scheduledCourses, scheduleStats,
      selectedTerm, setSelectedTerm,
      selectedLecturer, setSelectedLecturer,
      algorithmCourses, inputsLoading, updateCourseSection, updateCourseContext, importCourses,
      linkedGroups, addLinkedGroup, removeLinkedGroup, updateLinkedGroup,
      constraints, addConstraint, removeConstraint, clearConstraints,
      pinnedCourseIds, togglePinCourse, clearPins
    }}>
      {children}
    </SchedulerContext.Provider>
  );
}

export const useScheduler = () => useContext(SchedulerContext);
