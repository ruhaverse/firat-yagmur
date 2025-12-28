# Modularization Guide

This guide documents the conventions and process for migrating legacy code into the domain-based layout under `backend/src/domains`. Follow this when extracting a legacy domain to keep structure consistent and tests passing.

## Domain folder conventions
Each domain should live in `backend/src/domains/<domain>/` and contain the following files where applicable:

- `index.js` — domain entrypoint. Must export `register(app, deps)` which wires routes and other domain startup code.
- `routes.js` — optional express Router exposing routes and middleware wiring. `index.js` should import and mount it.
- `controller.js` — request handlers that translate HTTP → services. Keep controllers thin; return consistent response shapes.
- `service.js` — business logic, DB queries, and interactions with other services. Services should accept `deps` (e.g., `db`, `logger`, `storage`) via factory or function args.
- `model.js` — optional data access helpers, SQL builders, or ORM models.
- `tests/` — domain-specific integration/unit tests (Jest + Supertest integration tests belong here or in `backend/src/__tests__`).

Naming and style notes:
- Keep file exports consistent: controllers export plain functions; service exports a factory `createService(deps)` or an object with methods.
- Prefer `async/await` and propagate errors with `throw` (centralized error handler in `src/index.js` will format responses).
- Keep route response shapes compatible with legacy controllers until parity is verified by tests.

## How domains are registered (loader)

At startup, `backend/src/index.js` will scan `backend/src/domains` and try to `require('<domain>/index.js')`. The domain `index.js` should export a `register(app, deps)` function. Example:

```js
// backend/src/domains/posts/index.js
module.exports.register = (app, deps) => {
  const router = require('./routes');
  app.use(`${deps.config.apiBase}/posts`, router(deps));
};
```

`deps` is the project-level dependency bag exported from `backend/src/common` and includes `db`, `logger`, `config`, and helpful services.

## Checklist: extracting a legacy domain

1. Copy legacy code to `backend/src/domains/<domain>/` preserving behavior.
2. Create `index.js` that registers the domain using the loader pattern above.
3. Refactor legacy route definitions into `routes.js` and thin controllers into `controller.js`.
4. Move DB logic to `service.js` and ensure it accepts `deps`.
5. Add integration tests that assert response shapes and DB side-effects — mirror legacy controller tests for parity.
6. Run full test suite locally (`npm test`) and ensure migrations run successfully.
7. Open a PR containing the domain extraction and tests only (do not delete legacy files yet).
8. Wait for CI to run the test matrix. If CI passes green, update the PR to remove legacy files (see Safe Removal below) and re-run CI.

## Safe removal / deprecation policy

- Do not delete legacy controllers, routes, or services until CI passes for the extraction PR and maintainers approve.
- When removing, do it in the same PR or a follow-up PR that references the extraction PR and clearly lists removed files.
- Add a brief migration summary to the PR describing behavior parity checks, key tests, and manual smoke-test steps.

We provide a small preview script (`backend/scripts/legacy_removal_preview.ps1`) and a candidate list file (`backend/legacy_removal_candidates.txt`) to help review what would be removed. Run the preview locally to ensure files are correct before deletion.

## API status code conventions

- `GET` successful: `200` and JSON body typically `{ data: ... }` or domain-specific wrapper.
- `POST` created: `201` and JSON body with the created resource (or location header when appropriate).
- `PUT`/`PATCH` successful update: `200` (or `204` if no body returned).
- `DELETE` successful deletion: `204` (no body) when resource removed.
- Errors: use appropriate 4xx/5xx codes and include `{ error: 'message' }`.

When migrating, prefer to keep legacy status codes until tests verify parity; then you may adopt stricter conventions across the codebase in a follow-up PR.

## Testing workflow

- Local quick run (no Docker DB):

  1. Ensure local Postgres is running and accessible at `postgres://postgres:postgres@localhost:5432/shareup` (tests use this by default).
  2. From `backend` run:

```bash
npm test
```

- Local with Docker (recommended to match CI):

  1. `docker-compose up -d db` from `backend` directory (or project root if `backend/docker-compose.yml` exists).
  2. Wait for DB readiness, then run `npm test` in `backend`.

- CI:

  - CI runs the `npm test` script which first runs `node src/migrate.js` to apply migrations then Jest. Ensure tests and migrations are idempotent and reliable in CI environment.

## Post-migration checklist (merge steps)

1. Domain extraction PR contains only refactor + tests.
2. CI passes green for the PR on all workflows.
3. Maintainers approve the PR.
4. Update the PR to remove legacy files (or create the follow-up removal PR referencing the extraction PR) and run CI again.
5. Once CI passes, merge and optionally run a staging smoke test.

## Troubleshooting

- If migrations fail in CI, ensure migration script is idempotent and logs full SQL errors. Use unique dollar-quoting in PL/pgSQL bodies to avoid nested quote issues.
- If parity tests fail, run the failing test with `--runInBand` and inspect request/response logs printed by tests.

---

If you'd like, I can create a PR containing the extraction + tests or prepare the removal PR but I will not delete legacy files until CI passes as described above.

## Monolith → Microservices Guidelines

Purpose: development runs as a monolith for speed; production will be microservices for scalability and isolation. Follow these rules when changing code so later split is easy.

- Development vs Hosting:
  - Development: run all domains together in one service/container for fast iteration and simple debugging.
  - Hosting/Production: deploy domains as individual services (auth, posts, notifications, etc.) with separate CI/CD pipelines, service-level scaling, and independent release cadence.

- Shared modules and structure:
  - Keep reusable code in `backend/src/common/` (e.g., `db.js`, `logger.js`, middleware). These modules must be environment-agnostic and accept configuration via `deps` or env vars.
  - Avoid importing domain internals from other domains; use well-defined interfaces via `service` factories that accept a `deps` bag.
  - Prefer dependency injection (pass `db`, `logger`, `config`, `storage`) instead of requiring global singletons — simplifies extracting a domain into its own service.

- Database and connection considerations:
  - Use `DATABASE_URL` env var and keep connection pooling centralized in `common/db.js`.
  - Document pool sizing and limits in this guide (e.g., `PG_MAX_CLIENTS`), because microservices will each need their own pool configuration when split.
  - Plan for connection pooling in hosting: use smaller per-service pools + connection pooling proxies (PgBouncer) for high-scale environments.

- Environment and configuration:
  - Read configuration from env vars (`DATABASE_URL`, `PORT`, `LOG_LEVEL`, `STORAGE_BUCKET`) and avoid hardcoded paths.
  - Keep per-service config lightweight; when splitting, move service-specific vars to their service's deployment manifest.

- CI/CD and testing:
  - Keep CI lightweight during development: `lint` + `npm test` per PR.
  - When moving to hosting, extend CI to include per-service builds, container image scans, and deployment steps.
  - Design tests so domain-level integration tests can run independently against a test database or service mocks.

- Observability & logging:
  - Use structured logging (`pino`) and include `service`/`domain` fields in logs so logs are filterable after splitting into services.
  - Emit metrics (latency, errors) at domain boundaries to ease monitoring in microservices.

- Documentation & feature placement:
  - When adding a feature, annotate whether it belongs to a domain or shared infra in the PR description.
  - Keep infra changes (middleware, auth strategies, storage drivers) in `common/` and document migration implications.

- Migration checklist (splitting a domain into a service):
  1. Ensure domain code only depends on `common/` and exported service interfaces.
  2. Create a new service skeleton (Dockerfile, minimal `package.json`) and move domain code with `deps` wiring.
  3. Add env/config and CI pipeline for the new service; configure its DB pool and secrets.
  4. Deploy to staging, run integration smoke tests, and monitor logs/metrics.
  5. Gradually route traffic and scale the service independently.

Follow these guidelines when refactoring, and I will apply them to future changes. I will not remove or consolidate infrastructure in ways that impede this migration plan without marking the change and documenting it here.
