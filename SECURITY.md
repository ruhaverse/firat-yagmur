# Security & Secrets guidance

This file explains the minimal security steps before deploying the backend service to production.

- Do NOT commit secrets (env, keys) into the repo. Use GitHub Secrets or your deployment platform's secret store.
- Rotate `JWT_SECRET` and any API keys regularly.
- Use `NODE_ENV=production` and ensure debug logs are disabled in production.
- Limit CORS to the frontend origin (e.g., `https://shareuptime.com`) in production.
- Consider adding rate limiting (express-rate-limit), Helmet, and input validation for endpoints.
- Add Sentry or other monitoring for error tracking in production.

Quick hardening checklist:
- Add `express-rate-limit` (recommended)
- Add `helmet` middleware
- Ensure HTTPS / TLS termination
- Review dependencies (run `npm audit` and review Dependabot PRs)
