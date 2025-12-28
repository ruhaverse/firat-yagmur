## Release v1.0.0+20251228

Date: 2025-12-28

Summary:
- Integrated backend (merged `integrate/backend-db` into `main`).
- Added formal `backend/VERSION` and release/migration checklist to `backend/README.md`.
- Updated repository `ARCHITECTURE.md` with backend versioning guidance.
- Updated mobile `BACKEND_README.md` to reference `backend/VERSION` and sync checklist.

Verification performed:
- `npm install` and `npm test` in `backend` — all tests passed (7 suites, 12 tests).
- Database migrations applied successfully during test run.

Notes for integrators:
- Backend tag: `v1.0.0+20251228` — frontends should verify compatibility before updating pinned clients.
- `.env` remains excluded; ensure CI/staging secrets are present before applying migrations.
