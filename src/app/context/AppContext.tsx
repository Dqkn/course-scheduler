import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Course, COURSES } from '../data/mockData';

export type UserRole = 'admin' | 'academic' | 'student';

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
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
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

  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  
  // Initialize with all courses open by default
  const [openCourseIds, setOpenCourseIds] = useState<string[]>(
    COURSES.map(c => c.id)
  );
  
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

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
        userRole,
        setUserRole,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);