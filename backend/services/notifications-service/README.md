Notifications Service (example)

This folder contains a minimal example showing how to run the `notifications` domain as a standalone service.

How it works:
- `index.js` loads `src/domains/notifications` and mounts routes on an Express app.
- `entrypoint.sh` validates required env vars and then starts the node process.
- Use `.env.example` as a starting point; replace secrets before deploying.

Build & run (from `backend` folder):
```
cd services/notifications-service
docker build -t notifications-service-example .
docker run --rm -e DATABASE_URL="postgres://postgres:postgres@db:5432/shareup" -e JWT_SECRET=your_secret -p 4001:4001 notifications-service-example
```

This scaffold is intentionally minimal — adapt copy paths and dependency lists to your hosting environment.
