Notes App (Full Stack Challenge)

This repository contains a SPA split into two folders: `backend` (Node.js API) and `frontend` (React app). The backend implements Phase 1 (required) and Phase 2 (extra). The frontend is a modern React + Tailwind SPA with microinteractions and a mock login/register.

Structure
- backend: REST API with Node.js + TypeScript + Express + TypeORM (SQLite by default).
- frontend: React + Vite + TypeScript + Tailwind + Framer Motion. Connects to the API via Axios.

Required versions
- Node.js >= 18.17
- npm >= 9.6

How to run backend (Linux/macOS)
- From the project root: `./run.sh`
  - It will create `.env` from `.env.example` (if missing) and start the backend at `http://localhost:3001`.

Manual backend run
- `cd backend`
- Create env file
  - Linux/macOS: `cp .env.example .env`
  - Windows (PowerShell): `Copy-Item .env.example .env`
- `npm install`
- Dev: `npm run start:dev`

How to run frontend (development)
- `cd frontend`
- `cp .env.example .env` (optional; by default uses `http://localhost:3001/api`)
- `npm install`
- `npm run dev` → http://localhost:5173

Frontend build & preview
- `npm run build`
- `npm run preview` → http://localhost:5173

Database
- SQLite by default (`backend/notes.sqlite`). No extra installation required.

API (summary)
- Base URL: `http://localhost:3001/api`
- Health: `GET /health`
- Notes (Phase 1):
  - `POST /notes` create
  - `GET /notes` list (query: `archived=true|false`)
  - `GET /notes/:id` get one
  - `PUT /notes/:id` update title/content
  - `PATCH /notes/:id/archive` archive
  - `PATCH /notes/:id/unarchive` unarchive
  - `DELETE /notes/:id` delete
- Categories (Phase 2):
  - `POST /categories` create
  - `GET /categories` list
  - `DELETE /categories/:id` delete
  - Assignment & filter:
    - `POST /notes/:id/categories/:categoryId` assign
    - `DELETE /notes/:id/categories/:categoryId` remove
    - `GET /notes?categoryId=ID` filter by category

Curl examples
```bash
# Create a note
curl -X POST http://localhost:3001/api/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"First note","content":"Content"}'

# List active notes
curl http://localhost:3001/api/notes?archived=false

# Archive a note
curl -X PATCH http://localhost:3001/api/notes/1/archive

# Create a category and assign it to a note
curl -X POST http://localhost:3001/api/categories -H 'Content-Type: application/json' -d '{"name":"Work"}'
curl -X POST http://localhost:3001/api/notes/1/categories/1

# Filter by category
curl http://localhost:3001/api/notes?categoryId=1
```

Notes
- Backend covers Phase 1 (mandatory) and Phase 2 (extra).
- Frontend includes mock authentication (default: user@example.com / password123).

Troubleshooting
- If the frontend shows a Tailwind/Vite overlay error about a missing class (e.g., `shadow-elevated`), stop the dev server and run `npm run dev` again so Tailwind picks up the latest `@layer` utilities.
- If API calls fail from the frontend, verify the backend is running at `http://localhost:3001` and that `frontend/.env` has `VITE_API_BASE_URL=http://localhost:3001/api`.
- On Windows, if `Copy-Item` is not recognized, run PowerShell or create the `.env` files manually by copying the `.env.example` files.
