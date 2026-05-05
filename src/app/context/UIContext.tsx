import React, { createContext, useContext, useState, useCallback } from 'react';
import { Course } from '../data/mockData';

export interface Filters {
  department: string;
  lecturer: string;
  classLevel: string;
  search: string;
  block: string;
  room: string;
}

const defaultFilters: Filters = {
  department: '',
  lecturer: '',
  classLevel: '',
  search: '',
  block: '',
  room: '',
};

interface UIContextType {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  resetFilters: () => void;
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  publishedAt: string | null;
  setPublishedAt: (ts: string | null) => void;
  openCourseIds: string[];
  setOpenCourseIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleCourseOpen: (courseId: string) => void;
  isManageModalOpen: boolean;
  setIsManageModalOpen: (isOpen: boolean) => void;
}

const UIContext = createContext<UIContextType>({} as UIContextType);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [openCourseIds, setOpenCourseIds] = useState<string[]>([]);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const setFilter = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
    <UIContext.Provider value={{
      filters, setFilter, resetFilters,
      selectedCourse, setSelectedCourse,
      publishedAt, setPublishedAt,
      openCourseIds, setOpenCourseIds, toggleCourseOpen,
      isManageModalOpen, setIsManageModalOpen
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
