# ShareUpTime — Architecture & Repository Map

Purpose: provide a concise, developer-friendly map of the repository, coding conventions, where to find features, how to add new domains/components, and basic run/deploy steps. Use this as the single source of truth for project structure.

## Repo Overview

Root layout (high level):

```
<repo root>
├── backend/                # Node.js/Express API
│   ├── src/
│   │   ├── domains/        # Domain-oriented folders (auth, posts, reels, swaps, etc.)
│   │   ├── routes/         # Route wiring for API
│   │   ├── middleware/     # Request-level middleware (auth, logging, rbac)
│   │   ├── common/         # Shared helpers (db, logger, env helpers)
│   │   ├── services/       # Integrations (storage, notifications)
│   │   ├── index.js        # App bootstrap + server
│   │   └── migrate.js      # Database migration & seeding helper
│   ├── Dockerfile
│   └── docker-compose.yml
├── Shareup-frontend/       # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components organized by feature
│   │   ├── services/       # API client modules
│   │   ├── app/            # Redux store and slices
│   │   └── css/            # Styles
├── COMPONENT_CATALOG.md    # Component inventory
├── PROJECT_DOCS.md         # Onboarding & long-form docs
└── ARCHITECTURE.md         # This file
```

## Conventions

- Domain-first layout for backend: add a new domain under `backend/src/domains/<name>` containing `index.js`, `controller.js`, `service.js`, `model.js`, `routes.js` where applicable.
- Routes should be thin: translate HTTP -> call domain service. Business logic belongs to `service` or `controller` depending on pattern.
- Shared utilities and DB helpers live in `backend/src/common`.
- Tests: backend tests are under `backend/src/__tests__/` named by domain (e.g. `auth.test.js`). Frontend tests are colocated or under `Shareup-frontend/src/__tests__/`.
- Environment files: never commit secrets. Keep `.env` in `.gitignore`; use `.env.example` for required keys.

## Backend: file responsibilities

- `backend/src/index.js` — bootstrap server, middleware registration, error handlers and route mounting.
- `backend/src/migrate.js` — idempotent migration & seeding; used by CI and test startup.
- `backend/src/domains/<domain>/` — contains domain-specific `controller`, `service`, `routes`, and `model`.
- `backend/src/middleware/` — auth, logging, rbac. Keep thin and reuse across routes.
- `backend/src/common/db.js` — exposes a `query` wrapper / pool instance; use parameterized queries.

## Frontend: file responsibilities

- `Shareup-frontend/src/components/<feature>/` — feature-scoped presentational and container components.
- `Shareup-frontend/src/services/*` — API client modules; single responsibility per service (PostsService, UserService).
- `Shareup-frontend/src/app/store.js` — central Redux store; prefer feature slices under `app/`.

## How to add a new endpoint (Backend)

1. Create domain folder under `backend/src/domains/<name>`.
2. Implement `model.js` (DB interactions) and `service.js` (business logic).
3. Add `controller.js` to adapt `req/res` and call service functions.
4. Add `routes.js` that wires endpoints to controller handlers.
5. Register `routes.js` in `backend/src/routes/admin.js` or main router in `index.js`.
6. Add migration steps in `migrate.js` and tests under `src/__tests__/`.

## Local dev quick-start

Backend (uses dockerized Postgres):

```bash
# from repo root
cd backend
docker compose up -d db
npm install
cp .env.example .env   # set DB credentials as needed
npm run migrate
npm run dev
```

Frontend:

```bash
cd Shareup-frontend
npm install
npm start
```

## CI / Tests

- Backend tests run migrations first (see `backend/package.json` `test` script). Ensure Postgres is reachable (CI uses a service container).
- Linting: ESLint is enforced; address warnings if CI is configured to fail on warnings.

## Deployment notes

- Backend: build Docker image (see `backend/Dockerfile`) and run with `--env-file` or CI secrets.
- Frontend: static build artifact served by Hostinger or CDN.

## Team workflow recommendations

- Feature branches named `feature/<short-desc>` or `stabilize/<area>` for large infra changes.
- Small, focused PRs; include tests and migration steps in the same PR for backend schema changes.
- Maintain `COMPONENT_CATALOG.md` when adding/removing React components.

## Next actions for docs (tracked tasks)

- Expand per-domain READMEs under `backend/src/domains/<domain>/README.md` (TODO per-domain).
- Add CONTRIBUTING.md checklist for PR, migration and release steps.

---

If anything should be more detailed or you want a different organization, tell me which domain or feature to refine next and I'll update the docs and commit the changes.
