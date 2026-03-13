import { useState, useMemo } from 'react';
import { Course } from '../data/mockData';

export type DepartmentFilter = 'CSE' | 'BIL' | '';

export function useCourseFilters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentFilter>('');
  const [selectedClass, setSelectedClass] = useState<string>('');

  const departments = [
    { value: 'CSE', label: 'CSE (Computer Science Engineering)' },
    { value: 'BIL', label: 'BIL (Bilgisayar Mühendisliği)' }
  ];

  const classOptions = useMemo(() => {
    if (selectedDepartment === 'CSE') {
      return [
        { value: 'CSE 1st Year', label: 'CSE 1st Year' },
        { value: 'CSE 2nd Year', label: 'CSE 2nd Year' },
        { value: 'CSE 3rd Year', label: 'CSE 3rd Year' },
        { value: 'CSE 4th Year', label: 'CSE 4th Year' },
      ];
    } else if (selectedDepartment === 'BIL') {
      return [
        { value: 'BIL 1st Year', label: 'BIL 1st Year' },
        { value: 'BIL 2nd Year', label: 'BIL 2nd Year' },
        { value: 'BIL 3rd Year', label: 'BIL 3rd Year' },
        { value: 'BIL 4th Year', label: 'BIL 4th Year' },
      ];
    }
    return [];
  }, [selectedDepartment]);

  const handleDepartmentChange = (dept: DepartmentFilter) => {
    setSelectedDepartment(dept);
    setSelectedClass(''); // Reset class when department changes
  };

  const filterCourses = (courses: Course[]) => {
    return courses.filter(course => {
      let passSearch = true;
      let passDept = true;
      let passClass = true;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        passSearch = 
          course.name.toLowerCase().includes(query) ||
          course.code.toLowerCase().includes(query) ||
          course.lecturer.toLowerCase().includes(query);
      }

      if (selectedDepartment === 'CSE') {
        passDept = course.department === 'Computer Science' || course.department === 'Software Engineering' || course.department === 'Information Technology';
      } else if (selectedDepartment === 'BIL') {
        // Assuming mock data might not have BIL yet, but just in case
        passDept = course.department === 'Computer Engineering' || course.department === 'Bilgisayar Mühendisliği';
      }

      if (selectedClass) {
        // Simple mapping from "CSE 1st Year" -> "1st Year CS" (or similar) to match mock data
        if (selectedClass === 'CSE 1st Year') passClass = course.classLevel.includes('1st Year');
        else if (selectedClass === 'CSE 2nd Year') passClass = course.classLevel.includes('2nd Year');
        else if (selectedClass === 'CSE 3rd Year') passClass = course.classLevel.includes('3rd Year');
        else if (selectedClass === 'CSE 4th Year') passClass = course.classLevel.includes('4th Year');
        else if (selectedClass === 'BIL 1st Year') passClass = course.classLevel.includes('1st Year');
        else if (selectedClass === 'BIL 2nd Year') passClass = course.classLevel.includes('2nd Year');
        else if (selectedClass === 'BIL 3rd Year') passClass = course.classLevel.includes('3rd Year');
        else if (selectedClass === 'BIL 4th Year') passClass = course.classLevel.includes('4th Year');
      }

      if (!searchQuery && !selectedDepartment) {
        return true;
      }

      return passSearch && passDept && (!selectedClass || passClass);
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedDepartment,
    handleDepartmentChange,
    selectedClass,
    setSelectedClass,
    departments,
    classOptions,
    filterCourses,
  };
}
