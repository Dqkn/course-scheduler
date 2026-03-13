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
