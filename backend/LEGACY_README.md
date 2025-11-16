# ⚠️ LEGACY BACKEND - NOT USED IN PRODUCTION

## Status: DEPRECATED

This backend implementation is **NO LONGER USED** in production. It has been replaced by the centralized ShareUpTime.com backend infrastructure.

## Production Backend

- **Base URL:** `<https://www.shareuptime.com/api`>
- **Repository:** <https://github.com/Shareup-dev/shareuptime-social-media>
- **Branch:** new_dev
- **Features:** 60+ API endpoints, WebSocket support, real-time notifications

## Why This Backend Is Not Used

1. **Incomplete API Coverage:** Only 5 endpoints vs 60+ needed
   - ✅ `/api/v1/users/register`
   - ✅ `/api/v1/users/login`
   - ✅ `/api/v1/users/:email`
   - ✅ `/api/v1/posts/web/:userId`
   - ✅ `/api/v1/reels/web/:userId`

1. **Missing Features:**
   - ❌ Comments system
   - ❌ Friends/Following
   - ❌ Messages/Chat
   - ❌ Notifications
   - ❌ Groups
   - ❌ Stories
   - ❌ Post interactions (like, save, share)

1. **Replaced By:** Centralized ShareUpTime.com backend
   - Used by mobile app (iOS/Android)
   - Full feature parity
   - Production-tested
   - Scalable infrastructure

## What This Backend Was

A minimal Node.js/Express backend that was created for initial website development. It included:

- Basic user registration/login
- Simple post creation
- Reels upload
- Local file storage (uploads/)

## Migration

The website frontend has been updated to use the ShareUpTime.com backend:

```javascript
// Shareup-frontend/src/services/Settings.js
const settings = {
  prod: {
    apiUrl: "<https://www.shareuptime.com">
  }
};
```text
## For Developers

If you need to run this legacy backend locally for testing:

```bash
cd backend
cp .env.example .env
# Edit .env with local PostgreSQL credentials
npm install
npm run migrate
npm start
```text
**Note:** This is only for local development/testing. Do NOT deploy this backend to production.

## Files in This Directory

- `src/index.js` - Express server setup
- `src/routes/` - Minimal route definitions
- `src/controllers/` - Basic CRUD operations
- `src/services/storage.js` - Local file upload (AWS SDK removed)
- `src/migrate.js` - Simple database migrations

## Deployment

**Website deployment does NOT include this backend.**

The website is deployed as a **static React app** only:

- Frontend build → Hostinger `public_html/`
- Backend → Centralized ShareUpTime.com API (already deployed)

See `HOSTINGER-DEPLOY.md` for deployment instructions (frontend only).

---

**Last Updated:** November 10, 2025  
**Status:** ARCHIVED / LEGACY  
**Production API:** <https://www.shareuptime.com/api>

