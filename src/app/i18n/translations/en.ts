import type { Translations } from './tr';

export const en: Translations = {
  // ── General ──
  beta: 'BETA',
  published: 'Published',
  close: 'Close',
  reset: 'Reset',

  // ── Day names ──
  days: {
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
  },

  // ── Landing ──
  landing: {
    subtitle: 'Intelligent Schedule Management for Modern Universities.\nChoose your role to get started.',
    termBadge: 'Spring Term 2026 · Week 10 of 15',
    adminLabel: 'Administration',
    adminSublabel: 'Dean & Secretariat',
    adminDesc: 'View the full programme at a glance, manage sections, and publish the final schedule.',
    adminFeatures: ['Full weekly grid view', 'Section management & resolution', 'Publish & export'],
    adminTag: 'ADMIN',
    adminEnter: 'Enter as Administration',
    academicLabel: 'Academic',
    academicSublabel: 'Lecturer Portal',
    academicDesc: 'View your personal weekly teaching schedule with class timings and room details.',
    academicFeatures: ['Personal calendar view', 'Class & room information', 'Weekly teaching summary'],
    academicTag: 'ACADEMIC',
    academicEnter: 'Enter as Academic',
    courseCatalog: 'Course Catalog',
    courseCatalogDesc: 'Browse 962 courses across 12 departments',
    footer: 'OptiSched v1.0 · Spring 2026 · Faculty of Computing',
  },

  // ── Header ──
  header: {
    dashboard: 'Dashboard',
    courses: 'Courses',
    signOut: 'Sign out',
    lightMode: 'Switch to Light Mode',
    darkMode: 'Switch to Dark Mode',
  },

  // ── Login ──
  login: {
    adminTitle: 'Management Portal',
    academicTitle: 'Academic Portal',
    adminSubtitle: 'Sign in to manage faculty scheduling',
    academicSubtitle: 'Sign in to view your schedule',
    accountId: 'Account ID',
    password: 'Password',
    signIn: 'Sign In',
    invalidCredentials: 'Invalid credentials. Please try again.',
    disclaimer: 'By logging in, you agree to the university\'s academic policies and privacy terms.',
    placeholder: 'e.g. cberdas',
  },

  // ── Admin Dashboard ──
  admin: {
    title: 'Weekly Programme',
    sessions: 'sessions',
    manageCourses: 'Manage Courses',
    export: 'Export',
    running: 'Running...',
    runAlgorithm: 'Run Algorithm',
  },

  // ── Academic View ──
  academic: {
    title: 'Öğretim Üyesi Ders Programı',
    hoursPerWeek: 'h / week',
    sessions: 'sessions',
    students: 'students',
    dailySummary: 'Daily Summary',
    weeklyTotal: 'Weekly Total',
    teachingHours: 'Teaching hours',
    freeDay: 'Free day',
  },

  // ── Filters ──
  filters: {
    label: 'Filters',
    searchPlaceholder: 'Search course, code…',
    allDepartments: 'All Departments',
    allLecturers: 'All Lecturers',
    allClasses: 'All Classes',
    allBlocks: 'All Blocks',
    block: 'Block',
    allRoomsIn: 'All {block} Classes',
    room: 'Room',
  },

  // ── Status Panel ──
  status: {
    title: 'Status Panel',
    clear: 'Clear',
    issues: 'issue',
    algorithmResult: 'Algorithm Result',
    calculating: 'Calculating...',
    executionTime: 'Execution time',
    placed: 'Placed',
    conflicts: 'Conflicts',
    warnings: 'Warnings',
    scheduleStats: 'Schedule Stats',
    totalSessions: 'Total Sessions',
    studentSessions: 'Student Sessions',
    roomsUsed: 'Rooms Used',
    lecturerHours: 'Lecturer Hours',
    publishProgramme: 'Publish Programme',
    resolveFirst: 'Resolve conflicts first',
    fixConflicts: 'Fix {n} conflict(s) to enable publishing',
  },

  // ── Course Detail Modal ──
  courseDetail: {
    conflict: 'Conflict',
    lecturer: 'Lecturer',
    department: 'Department',
    class: 'Class',
    room: 'Room',
    dayTime: 'Day & Time',
    enrolment: 'Enrolment',
    conflictDetected: 'Scheduling Conflict Detected',
    editCourse: 'Edit Course',
  },

  // ── Course Management Modal ──
  courseManage: {
    title: 'Manage Course Sections (Şubeler)',
    description: 'Add or remove parallel sections for courses. Set to \'0\' to close the course entirely. You must hit "Run Algorithm" again to apply changes.',
    searchPlaceholder: 'Search code, name...',
    noCourses: 'No courses found',
    hoursPerWeek: 'Hours/Wk',
    semester: 'Semester',
    sections: 'Sections',
    totalActive: 'Total active courses:',
    applyAndRun: 'Apply & Run Algorithm',
  },

  // ── Course Data Table ──
  courseTable: {
    title: 'Course Catalog',
    loading: 'Loading courses…',
    coursesOf: 'of',
    coursesCount: 'courses',
    refresh: 'Refresh',
    retry: 'Retry',
    searchPlaceholder: 'Search by code or name…',
    allDepartments: 'All Departments',
    noCourses: 'No courses found',
    noCoursesDesc: 'There are no courses in the catalog yet. They will appear here once data is loaded from the database.',
    noMatching: 'No matching courses',
    noMatchingDesc: 'Try adjusting your search or filter criteria.',
    dept: 'Dept',
    code: 'Code',
    courseName: 'Course Name',
    theory: 'Theory',
    lab: 'Lab',
    sem: 'Sem',
    statusLabel: 'Status',
    hr: 'hr',
    online: 'Online',
    inClass: 'In-class',
    service: 'Service',
    showing: 'Showing',
    departments: 'department',
    welcomePrefix: 'University course database · Welcome',
  },

  // ── Tooltip ──
  tooltip: {
    capacity: 'Capacity',
  },
} as const;
