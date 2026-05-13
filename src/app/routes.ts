import { createBrowserRouter } from 'react-router';
import { Root } from './pages/Root';
import { Landing } from './pages/Landing';
import { AdminDashboard } from './pages/AdminDashboard';
import { AcademicView } from './pages/AcademicView';
import { CourseCatalog } from './pages/CourseCatalog';
import { ClassroomReservation } from './pages/ClassroomReservation';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: 'admin', Component: AdminDashboard },
      { path: 'academic', Component: AcademicView },
      { path: 'reservations', Component: ClassroomReservation },
      { path: 'courses', Component: CourseCatalog },
    ],
  },
]);
