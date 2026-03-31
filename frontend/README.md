Notes Frontend (React + Vite + Tailwind + Framer Motion)

Overview
- Ultra-modern SPA with a pastel, glassmorphism-inspired UI.
- Built with React + TypeScript (Vite), Tailwind CSS, Framer Motion and Motion One.
- Connects to the backend REST API via Axios.
- Includes mock Login/Register (no real server auth required for the challenge).

Requirements
- Node.js >= 18.17
- npm >= 9.6

Environment
- Copy `.env.example` to `.env` if you want to customize the API URL.
- `VITE_API_BASE_URL` defaults to `http://localhost:3001/api`.

Install & Run (development)
1) `cd frontend`
2) `npm install`
3) `npm run dev`
   - App will be available at http://localhost:5173
   - Make sure the backend is running at http://localhost:3001 (see repository root `README.md`).

Build & Preview
1) `npm run build`
2) `npm run preview` → serves the built app at http://localhost:5173

Default login (mock)
- Email: `user@example.com`
- Password: `password123`
- You can also register a new local user in the Register page (stored in localStorage).

Key Features mapped to the Challenge
- Phase 1 (Notes): create, edit, delete, archive/unarchive, list active/archived.
- Phase 2 (Categories): create/list/delete categories; assign/remove categories to notes; filter by category.

UI/UX Notes
- Pastel color palette with glass cards and soft shadows.
- Microinteractions for hover/tap, list enter/exit, modals and buttons using Framer Motion.
- Accessible forms with validation messages and focusable modals.

Project Structure (frontend)
- `src/api` → Axios client and typed services (`notes.ts`, `categories.ts`).
- `src/components` → Reusable UI (TopBar, SideBar, Modal, NoteCard, NoteEditor...).
- `src/pages` → Pages: Login, Register, NotesApp (protected area).
- `src/providers` → `AuthProvider` (mock auth using localStorage).
- `src/styles/index.css` → Tailwind layer + custom utility classes.

Endpoints used
- Base URL: `http://localhost:3001/api`
- Notes
  - `POST /notes` — create
  - `GET /notes?archived=true|false&categoryId=ID` — list/filter
  - `GET /notes/:id` — get one
  - `PUT /notes/:id` — update
  - `PATCH /notes/:id/archive` — archive
  - `PATCH /notes/:id/unarchive` — unarchive
  - `DELETE /notes/:id` — delete
- Categories
  - `POST /categories` — create
  - `GET /categories` — list
  - `DELETE /categories/:id` — delete
- Assign/remove category to note
  - `POST /notes/:id/categories/:categoryId`
  - `DELETE /notes/:id/categories/:categoryId`

Styling/Animation
- Tailwind configured in `tailwind.config.js` with pastel palette and soft shadows.
- Framer Motion and Motion One are available for microinteractions and transitions.

Troubleshooting
- If the Vite/Tailwind overlay shows an error about a missing custom class (e.g., `shadow-elevated`), stop the dev server and run `npm run dev` again so Tailwind picks up the latest `@layer` definitions.
- If API requests fail, ensure the backend is running at `http://localhost:3001` and that `VITE_API_BASE_URL` in `.env` matches your backend URL.
- On Windows, if ports are already in use, stop previous dev servers or change ports in `vite.config.ts` and `.env`.
