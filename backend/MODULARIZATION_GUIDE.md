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
