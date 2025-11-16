# Deployment checklist for Shareup (shareuptime.com)

This document lists the recommended, sequential steps to deploy the `backend/` service and migrate `shareup.qa` -> `shareuptime.com` safely.

1) Secrets & credentials (GitHub repository secrets)

   - DATABASE_URL (production Postgres URI)
   - JWT_SECRET (strong random secret)
   - SPACES_KEY, SPACES_SECRET, SPACES_BUCKET, SPACES_ENDPOINT (optional)
   - DOCKER_USERNAME, DOCKER_PASSWORD, DOCKER_REPO (if pushing images)
   - SSH_HOST, SSH_USER, SSH_PRIVATE_KEY (if deploying via SSH)

Required GitHub Actions secret names (exact)

- BACKEND_DATABASE_URL -> full Postgres connection string (postgres://user:pw@host:5432/dbname)
- BACKEND_JWT_SECRET -> JWT signing secret used by backend
- SPACES_KEY, SPACES_SECRET, SPACES_BUCKET, SPACES_ENDPOINT -> (optional) S3-compatible storage
- DOCKER_USERNAME, DOCKER_PASSWORD, DOCKER_REPO -> credentials for container registry (if CI pushes images)
- SSH_PRIVATE_KEY, SSH_HOST, SSH_USER -> if the deploy job will SSH to a host

Add these exact names to the repository Secrets UI so the workflows can access them. The CI workflow will fail fast if required secrets are missing — see the `ci.yml` job conditions.

2) Create production DB and run migrations

   - Ensure the production DB user has rights to create tables or run migrations.
   - From CI or locally run: `NODE_ENV=production DATABASE_URL=<prod-uri> npm run migrate --prefix backend`

3) Build & push Docker image (if using Docker)

   - CI will build and push when `DOCKER_*` secrets are present.

4) Deploy application

   - DigitalOcean App Platform: configure with container image `DOCKER_REPO:latest` and set env vars in the App settings.
   - Or SSH deploy: git pull, docker compose pull && docker compose up -d on target host.

5) Domain & SSL

   - Update DNS A/AAAA records to point to hosting IP(s) for `shareuptime.com`.
   - Use managed TLS (platform) or use Let's Encrypt (Certbot) on the host.

Frontend-specific: GitHub Pages deployment (optional, no extra secrets)

- We included a Pages deploy workflow that builds the React app located in `Shareup-frontend/` and deploys to GitHub Pages. By default it writes a `CNAME` with `shareuptime.com` into the build output so Pages will apply the custom domain.
- DNS for GitHub Pages: create A records pointing to GitHub Pages IPs and/or an ALIAS/ANAME to `username.github.io` depending on your DNS provider. See: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site>

If you prefer to host the frontend elsewhere (Netlify, Vercel, S3 + CloudFront, or a Docker host), update or add a workflow under `.github/workflows` matching the platform and add necessary secrets (e.g., `NETLIFY_AUTH_TOKEN`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc.).

6) Smoke tests & verification

   - Verify: GET /api/v1/ -> health
   - Register/Login flows, Posts and Reels file upload flows
   - Verify media URLs resolve and CORS is configured for frontend domain

7) Rollback plan

   - Keep previous image/tag for quick rollback; test DB compatibility before destructive migrations.

Notes:

 - This repo's backend is intentionally independent from the mobile app repo; do not change mobile app code here.
 - Add repo secrets in GitHub before enabling automatic deploy workflow.

