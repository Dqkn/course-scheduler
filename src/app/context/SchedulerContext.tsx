import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Course } from '../data/mockData';
import type { AlgorithmInput, ScheduleStats, TermType } from '../types/schedulerTypes';
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
  /** True while the curriculum inputs are being loaded from the backend. */
  inputsLoading: boolean;
  updateCourseSection: (code: string, delta: number) => void;
  updateCourseContext: (code: string, newName: string, newLecturer: string) => void;
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

  const runAlgorithm = useCallback(async () => {
    setIsCalculating(true);
    setCalculationTime(null);
    setPublishedAt(null);

    try {
      const result = await schedulerService.runScheduler(algorithmCourses, selectedTerm);
      setScheduledCourses(result.courses);
      setScheduleStats(result.stats);
      setCalculationTime(result.stats.executionTime);
      setOpenCourseIds(result.courses.map(c => c.id));

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
  }, [algorithmCourses, selectedTerm, selectedLecturer, setPublishedAt, setOpenCourseIds]);

  return (
    <SchedulerContext.Provider value={{
      isCalculating, calculationTime, runAlgorithm,
      scheduledCourses, scheduleStats,
      selectedTerm, setSelectedTerm,
      selectedLecturer, setSelectedLecturer,
      algorithmCourses, inputsLoading, updateCourseSection, updateCourseContext
    }}>
      {children}
    </SchedulerContext.Provider>
  );
}

export const useScheduler = () => useContext(SchedulerContext);
