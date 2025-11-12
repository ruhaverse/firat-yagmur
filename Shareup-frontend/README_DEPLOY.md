# Shareup Frontend — Build & deploy (production)

This file describes how the Shareup React frontend (located in `Shareup-frontend/`) is built and how to deploy it to a custom domain `shareuptime.com`.

Local build

1. Install deps:

```bash
cd Shareup-frontend
npm ci
```

2. Build:

```bash
npm run build
```

Deploy options

- GitHub Pages (included): We added a workflow `.github/workflows/deploy_frontend_pages.yml` that builds and deploys the `Shareup-frontend/build` artifact to Pages. The workflow writes a `CNAME` containing `shareuptime.com` so Pages knows the custom domain.

  Steps you must do manually for Pages:
  - In the repo's GitHub Pages settings, enable Pages for the `gh-pages` environment or use the default Pages deployment option.
  - Set the custom domain to `shareuptime.com` in the Pages UI (or the workflow will write `CNAME` automatically, but the domain's DNS must point to GitHub Pages).
  - Create the DNS A/AAAA records at your DNS provider to point to GitHub Pages IPs (see GitHub docs).

- Other hosts (Netlify, Vercel, DigitalOcean App Platform): you can build locally and upload the `build/` directory or configure the provider to build from the repo. For these platforms, add provider-specific secrets to GitHub and I can add a workflow for automatic deploy.

Post-deploy verification

- Check the site loads from `https://shareuptime.com`.
- Verify API calls succeed against backend endpoints (CORS must allow the frontend origin).
