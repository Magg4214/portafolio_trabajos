Notes App Backend (Node.js + TypeScript + Express + TypeORM)

Overview
- Layered REST API (routes/controllers → services → repositories via TypeORM).
- Relational persistence using TypeORM. SQLite by default for easy local run.
- Phase 1: create/list/update/delete and archive/unarchive notes.
- Phase 2: categories (create/list/delete), assign categories to notes, filter notes by category.

Requirements
- Node.js >= 18.17
- npm >= 9.6

Quick start
1) From repository root (Linux/macOS): `./run.sh`
   - Starts the backend at http://localhost:3001

Windows
- Use the manual run below (PowerShell/CMD). The bash script `run.sh` is intended for Linux/macOS only.

Manual run
1) `cd backend`
2) Create env file:
   - Linux/macOS: `cp .env.example .env`
   - Windows (PowerShell): `Copy-Item .env.example .env`
3) `npm install`
4) Dev mode: `npm run start:dev` (ts-node-dev)

Environment (.env)
- PORT=3001
- DB_TYPE=sqlite
- DB_NAME=notes.sqlite
- Optional for other DBs: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD

Base URL
- http://localhost:3001
- API prefix: `/api`

Health
- `GET /health` → `{ status: "ok" }`

Endpoints (for frontend reference)
- Notes
  - `POST /api/notes` — create note
    - body: `{ title: string (1..255), content: string (min 1) }`
  - `GET /api/notes` — list notes
    - query:
      - `archived` optional: `true | false` (string)
      - `categoryId` optional: positive integer
  - `GET /api/notes/:id` — get single note
  - `PUT /api/notes/:id` — update title/content
    - body: `{ title?: string (1..255), content?: string (min 1) }`
  - `PATCH /api/notes/:id/archive` — archive note
  - `PATCH /api/notes/:id/unarchive` — unarchive note
  - `DELETE /api/notes/:id` — delete note

- Categories
  - `POST /api/categories` — create category
    - body: `{ name: string (1..100) }`
  - `GET /api/categories` — list categories
  - `DELETE /api/categories/:id` — delete category

- Note ↔ Category assignment
  - `POST /api/notes/:id/categories/:categoryId` — assign category to note
  - `DELETE /api/notes/:id/categories/:categoryId` — remove category from note

Design notes
- TypeORM runs with `synchronize=true` to make the challenge easy to run locally out-of-the-box.
- ManyToMany between notes and categories with a join table.
- Input validation with Zod for body, query and params. Errors return 400 with details.

Curl examples
```bash
# Create a note
curl -X POST http://localhost:3001/api/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"First note","content":"Hello"}'

# List active notes
curl 'http://localhost:3001/api/notes?archived=false'

# Archive note id=1
curl -X PATCH http://localhost:3001/api/notes/1/archive

# Create a category and assign it to a note
curl -X POST http://localhost:3001/api/categories -H 'Content-Type: application/json' -d '{"name":"Work"}'
curl -X POST http://localhost:3001/api/notes/1/categories/1

# Filter by category (id=1)
curl 'http://localhost:3001/api/notes?categoryId=1'
```

Error format
```json
{
  "message": "Validation error",
  "details": {}
}
```

Code quality
- Lint: `npm run lint`