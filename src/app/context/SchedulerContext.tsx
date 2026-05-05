import React, { createContext, useContext, useState, useCallback } from 'react';
import { Course } from '../data/mockData';
import { ALGORITHM_COURSES, type AlgorithmInput } from '../data/algorithmData';
import { runScheduler, type ScheduleStats, type TermType } from '../modules/schedulerEngine';
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
  updateCourseSection: (code: string, delta: number) => void;
  updateCourseContext: (code: string, newName: string, newLecturer: string) => void;
}

const SchedulerContext = createContext<SchedulerContextType>({} as SchedulerContextType);

export function SchedulerProvider({ children }: { children: React.ReactNode }) {
  const { setPublishedAt, setOpenCourseIds } = useUI();
  
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationTime, setCalculationTime] = useState<number | null>(null);
  const [algorithmCourses, setAlgorithmCourses] = useState<AlgorithmInput[]>(ALGORITHM_COURSES);
  const [scheduledCourses, setScheduledCourses] = useState<Course[]>([]);
  const [scheduleStats, setScheduleStats] = useState<ScheduleStats | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<TermType>('spring');
  const [selectedLecturer, setSelectedLecturer] = useState<string>('');

  const updateCourseSection = useCallback((code: string, delta: number) => {
    setAlgorithmCourses(prev => prev.map(c => 
      c.code === code ? { ...c, section: Math.max(1, c.section + delta) } : c
    ));
  }, []);

  const updateCourseContext = useCallback((code: string, newName: string, newLecturer: string) => {
    setAlgorithmCourses(prev => prev.map(c => 
      c.code === code ? { ...c, name: newName, lecturer: newLecturer } : c
    ));
  }, []);

  const runAlgorithm = useCallback(() => {
    setIsCalculating(true);
    setCalculationTime(null);
    setPublishedAt(null);
    
    setTimeout(() => {
      try {
        const result = runScheduler(algorithmCourses, selectedTerm);
        setScheduledCourses(result.courses);
        setScheduleStats(result.stats);
        setCalculationTime(result.stats.executionTime);
        setOpenCourseIds(result.courses.map(c => c.id));
        
        if (result.stats.uniqueLecturers.length > 0 && !selectedLecturer) {
          setSelectedLecturer(result.stats.uniqueLecturers[0]);
        }
      } catch (err) {
        console.error('Scheduler failed:', err);
        setCalculationTime(-1);
      } finally {
        setIsCalculating(false);
      }
    }, 100);
  }, [algorithmCourses, selectedTerm, selectedLecturer, setPublishedAt, setOpenCourseIds]);

  return (
    <SchedulerContext.Provider value={{
      isCalculating, calculationTime, runAlgorithm,
      scheduledCourses, scheduleStats,
      selectedTerm, setSelectedTerm,
      selectedLecturer, setSelectedLecturer,
      algorithmCourses, updateCourseSection, updateCourseContext
    }}>
      {children}
    </SchedulerContext.Provider>
  );
}

export const useScheduler = () => useContext(SchedulerContext);
