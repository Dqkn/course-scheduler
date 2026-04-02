import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Course } from '../data/mockData';
import { ALGORITHM_COURSES, type AlgorithmInput } from '../data/algorithmData';
import { runScheduler, type ScheduleStats, type TermType } from '../modules/schedulerEngine';
import { Account, ALL_ACCOUNTS } from '../data/mockAccounts';

export type { Account } from '../data/mockAccounts';

export interface Filters {
  department: string;
  lecturer: string;
  classLevel: string;
  search: string;
  block: string;
  room: string;
}

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: Account | null;
  login: (id: string, pass: string) => boolean;
  logout: () => void;
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  resetFilters: () => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  publishedAt: string | null;
  setPublishedAt: (ts: string | null) => void;
  openCourseIds: string[];
  toggleCourseOpen: (courseId: string) => void;
  isManageModalOpen: boolean;
  setIsManageModalOpen: (isOpen: boolean) => void;
  isCalculating: boolean;
  calculationTime: number | null;
  runAlgorithm: () => void;
  // ── New: algorithm-generated schedule ──
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

const defaultFilters: Filters = {
  department: '',
  lecturer: '',
  classLevel: '',
  search: '',
  block: '',
  room: '',
};

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('optisched-dark');
    return stored === 'true';
  });

  const [currentUser, setCurrentUser] = useState<Account | null>(() => {
    const stored = localStorage.getItem('optisched-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((id: string, pass: string) => {
    const account = ALL_ACCOUNTS.find(a => a.id === id && a.password === pass);
    if (account) {
      setCurrentUser(account);
      localStorage.setItem('optisched-user', JSON.stringify(account));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('optisched-user');
  }, []);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationTime, setCalculationTime] = useState<number | null>(null);

  // ── Algorithm State ────────────────────────────────────────────────────
  const [algorithmCourses, setAlgorithmCourses] = useState<AlgorithmInput[]>(ALGORITHM_COURSES);

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

  const [scheduledCourses, setScheduledCourses] = useState<Course[]>([]);
  const [scheduleStats, setScheduleStats] = useState<ScheduleStats | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<TermType>('spring');
  const [selectedLecturer, setSelectedLecturer] = useState<string>('');

  const [openCourseIds, setOpenCourseIds] = useState<string[]>([]);

  const runAlgorithm = useCallback(() => {
    setIsCalculating(true);
    setCalculationTime(null);
    setPublishedAt(null);
    
    // Use setTimeout to let the UI show "Calculating..." before the sync work blocks
    setTimeout(() => {
      try {
        const result = runScheduler(algorithmCourses, selectedTerm);
        
        setScheduledCourses(result.courses);
        setScheduleStats(result.stats);
        setCalculationTime(result.stats.executionTime);
        setOpenCourseIds(result.courses.map(c => c.id));
        
        // Auto-select first named lecturer for Academic view
        if (result.stats.uniqueLecturers.length > 0 && !selectedLecturer) {
          setSelectedLecturer(result.stats.uniqueLecturers[0]);
        }
      } catch (err) {
        console.error('Scheduler failed:', err);
        setCalculationTime(-1); // error indicator
      } finally {
        setIsCalculating(false);
      }
    }, 100);
  }, [selectedTerm, selectedLecturer, algorithmCourses]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('optisched-dark', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  const setFilter = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const toggleCourseOpen = useCallback((courseId: string) => {
    setOpenCourseIds(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        currentUser,
        login,
        logout,
        filters,
        setFilter,
        resetFilters,
        selectedCourse,
        setSelectedCourse,
        publishedAt,
        setPublishedAt,
        openCourseIds,
        toggleCourseOpen,
        isManageModalOpen,
        setIsManageModalOpen,
        isCalculating,
        calculationTime,
        runAlgorithm,
        scheduledCourses,
        scheduleStats,
        selectedTerm,
        setSelectedTerm,
        selectedLecturer,
        setSelectedLecturer,
        algorithmCourses,
        updateCourseSection,
        updateCourseContext,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);