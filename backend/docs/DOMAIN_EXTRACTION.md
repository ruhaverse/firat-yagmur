Domain Extraction

Purpose: Steps and checklist to extract a domain from the monorepo into a standalone microservice with minimal changes.

Quick checklist:
- Isolate code: domain logic lives in `src/domains/<domain>` and depends only on `src/common/*` utilities (DB, env, logger).
- Config: identify required env vars (`DATABASE_URL`, `JWT_SECRET`, `PORT`, any service-specific keys).
- Health + readiness: implement `/health` and `/ready` endpoints in the service.
- Tests & contracts: extract integration tests for the domain and run them against the service.

Extraction steps (example: `notifications`):
1. Create a new service repo or folder (example: `services/notifications-service`).
2. Copy `src/domains/notifications` and required `src/common` helpers (`db.js`, `env.js`, `logger.js`) into the service.
3. Add a small `index.js` that loads `getConfig()` from `env.js`, initializes `db` and `logger`, and registers the domain routes on an Express app.
4. Add `Dockerfile`, `.env.example`, and a lightweight `entrypoint` that validates env and starts the app.
5. Add CI job that builds the service image and runs the domain's contract tests.

Minimal runtime env (example):
- `DATABASE_URL` — Postgres connection string for the service
- `JWT_SECRET` — JWT signing secret (must not be default)
- `PORT` — HTTP port to listen on

Validation: the service's `entrypoint` should fail-fast when required envs are missing or insecure (e.g. default `JWT_SECRET`).

Example scaffolding is provided under `services/notifications-service`.
