# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# OptiSched - Frontend

OptiSched is a **React + Vite + TypeScript** frontend project for managing course scheduling, class filters, and student schedules. It is designed to work with a backend API for full functionality.

---

## Features

- **Dynamic Filters**
  - Filter courses by **department**, **class**, and **block**.
  - Multi-level dropdowns for blocks (e.g., A-F) and classes (e.g., F204).
  - Admins and academic staff can see assigned courses; students cannot.

- **Manage Courses**
  - Admin panel for creating courses each semester.
  - Select courses via checkboxes to allow students to enroll.

- **LLM Schedule Generator (Future Feature)**
  - Students can upload course files (Word, Excel, PDF).
  - LLM reads the files and generates multiple optimal weekly schedules.
  - Currently frontend-only, backend integration planned.

- **UI Components**
  - Reusable components: buttons, tables, modals, dropdowns, status panels, and weekly grid.
  - Fully responsive design with Tailwind CSS.

---

## Backend API Contract (for the backend developer)

All hand-made mock data has been removed. The frontend now talks to the backend
through the service layer in `src/app/services/`. Every service calls the shared
`apiClient` (`src/app/services/apiClient.ts`), which prefixes requests with
`VITE_API_BASE_URL` (defaults to `/api`) and attaches `Authorization: Bearer
<token>` from `localStorage('optisched-token')`.

To point the frontend at your backend, create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

The TypeScript request/response shapes are the contract. Field names are aligned
1:1 with the backend PostgreSQL columns (`5may_db_nobugs.sql`). Match them exactly:

- `src/app/types/backendTypes.ts` — **canonical DB mirror**: `Role`, `Department`,
  `Instructor`, `Classroom`, `CourseRow` (Courses), `Section`, `DbSchedule`
  (Schedules), `DbUser` (Users), `CourseTypeRef`, `ClassroomTypeRef`, junctions.
- `Account`, `LoginRequest`, `LoginResponse` → `src/app/types/authTypes.ts` (mirrors Users + Roles)
- `AlgorithmInput`, `ScheduleStats`, `SchedulerResult`, `TermType` → `src/app/types/schedulerTypes.ts`
- `DbCourse` → `src/app/types/courseTypes.ts` (extends Courses with joined department fields)
- `Course`, `DayKey`, `CourseType` → `src/app/data/mockData.ts` (render model for the weekly grid)
- `Room`, `Reservation`, `TimeSlot`, etc. → `src/app/types/reservationTypes.ts`

### Endpoints

**Auth** (`services/authService.ts`)

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/auth/login` | `{ username, password }` | `{ account: Account, token: string }` (401/403 on bad creds) |
| POST | `/auth/logout` | — | 204 |
| GET | `/auth/me` | — | `Account` (401 if not authenticated) |

`Account` mirrors the `Users` table: `user_id`, `username`, `full_name`, `role`,
`department_id`, `department_name`. `role` is the `Roles.role_name` string — one of
`admin | dept_chair | instructor | secretary | viewer`.

Route/UI gating:
- `admin`, `dept_chair` → admin portal (full access; dept_chair = dean/chair)
- `secretary` → admin portal, scoped to their `department_id`/`department_name`
- `instructor` → academic portal (own schedule only)

`secretary` users must carry `department_id` (matches `DbCourse.department_id`) so
the catalog filters to their department.

**Scheduler** (`services/schedulerService.ts`)

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/scheduler/inputs` | — | `AlgorithmInput[]` (editable curriculum + `section_count`) |
| POST | `/scheduler/run` | `{ courses: AlgorithmInput[], term: 'fall' \| 'spring' }` | `SchedulerResult` (`{ courses: Course[], stats: ScheduleStats }`) |
| PUT | `/scheduler/inputs/:course_code` | `Partial<AlgorithmInput>` | `AlgorithmInput` |
| POST | `/scheduler/publish` | `{ courses: string[] }` (course ids) | `{ publishedAt: string }` |

`AlgorithmInput` mirrors `Courses` + `Sections` columns: `course_id`,
`course_code`, `course_name`, `weekly_hours`, `course_semester`, `section_count`
(how many `Sections` rows to open), `instructor_full_name`, `is_online`, `is_service`.

The backend owns the scheduling algorithm. `term` filtering convention:
`fall` = odd semesters, `spring` = even semesters.

> **Schedule output mapping.** The scheduler's native output is `Schedules` rows
> (`section_id`, `classroom_id`, `day_of_week`, `start_time`, `end_time`). The
> `/scheduler/run` response must return these mapped into the frontend render
> model `Course` (see `mockData.ts`): join `Sections`→`Courses` for `code`/`name`,
> `Instructors.full_name` for `lecturer`, `Classrooms.classroom_name` for `room`,
> derive `day` (`Monday`→`Mon`) and `startTime`/`endTime` as `HH:MM`. `colorIndex`
> and `type` are presentation-only — the API may default them (e.g. colorIndex =
> course_semester % 8) or leave the frontend to compute.

**Course catalog** (`services/courseService.ts`)

| Method | Path | Returns |
|---|---|---|
| GET | `/courses` | `DbCourse[]` |

**Lookups** (`services/lookupService.ts`)

| Method | Path | Returns |
|---|---|---|
| GET | `/departments` | `string[]` |
| GET | `/lecturers` | `string[]` |
| GET | `/class-levels` | `string[]` |
| GET | `/blocks` | `string[]` |
| GET | `/rooms` | `Room[]` |

**Reservations** (`services/reservationService.ts`)

| Method | Path | Body | Returns |
|---|---|---|---|
| GET | `/reservations` | — | `Reservation[]` |
| GET | `/reservations?userId=:id` | — | `Reservation[]` |
| POST | `/reservations` | `NewReservation` | `Reservation` |
| DELETE | `/reservations/:id` | — | 204 |
| GET | `/rooms/availability?date=&timeSlots=&roomType=&minCapacity=` | — | `(Room & { isAvailable: boolean })[]` |

> NOTE: Reservation persistence currently still uses a temporary `localStorage`
> store in `utils/reservationUtils.ts`, and room availability/filtering reads an
> empty `ROOMS` list there. Swap those helpers for the `reservationService` /
> `lookupService` calls above once the endpoints are live.

### Where data enters the app

- `context/AuthContext.tsx` → `authService` (login/logout, cached user)
- `context/SchedulerContext.tsx` → `schedulerService` (loads inputs on mount, runs algorithm)
- `hooks/useCourseData.ts` → `courseService` (catalog)
- `utils/reservationUtils.ts` → to be wired to `reservationService` / `lookupService`

Filter dropdowns (department/lecturer/class/block) derive their options from the
already-loaded schedule, so they work without the lookup endpoints; use
`lookupService` only when you need the full reference lists.
