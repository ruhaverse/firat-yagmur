# 🔧 ShareUpTime Backend API

**Production API:** <<https://www.shareuptime.com>>  
**Port:** 8080  
**API Base:** `/api/v1`  
**Technology:** Node.js + Express 5.0.1 + PostgreSQL

---

## 📋 Overview

ShareUpTime backend serves both **web application** and **mobile app** with 60+ API endpoints. This is a centralized API handling authentication, posts, reels, messaging, groups, notifications, and more.

### Key Features

- 🔐 **JWT Authentication**
- 📝 **Posts & Feed Management**
- 🎥 **Reels & Video Content**
- 💬 **Real-time Messaging** (WebSocket ready)
- 👥 **User & Friend Management**
- 🔔 **Notifications System**
- 📁 **File Upload** (Multer 2.0.2)
- 🔒 **Security** (Helmet + Rate Limiting)

---

## 🏗️ Architecture

```text
backend/
├── src/
│   ├── index.js              # Express server entry point

## 🏷 Versioning & Release Policy

- **Version file:** `backend/VERSION` contains the current backend build tag. Format: `MAJOR.MINOR.PATCH+YYYYMMDD` (example: `1.0.0+20251228`).
- **When to bump:** Increment `MAJOR` for breaking API changes, `MINOR` for additive API changes, and `PATCH` for bugfixes. Always update `backend/VERSION` in the same PR that introduces migrations or API changes.
- **Release procedure (quick):**
	1. Run `npm run migrate` locally and ensure no errors.
	2. Run `npm test` and confirm all tests pass.
	3. Update `backend/VERSION` with the new tag.
	4. Create PR, include migration notes and a short changelog entry.
	5. Merge after CI passes; notify frontend/mobile teams to pin or verify compatibility.

## ✅ Migration & Verification Checklist

- **Pre-merge (developer):**
	- Ensure `.env` is not committed and `.env.example` is updated if keys changed.
	- Run and pass `npm run migrate` against a local Postgres instance.
	- Run `npm test` (unit & integration) and fix failures.
	- Add migration notes to the PR description (tables changed, seeds added, downtime risk).

- **Post-merge (release):**
	- Confirm CI applied migrations in the staging environment and smoke-tested endpoints.
	- Verify critical endpoints (auth, posts, notifications) with a quick smoke run.
	- Update release notes and notify integrators (frontend & mobile) of the `backend/VERSION` change.

Run these commands locally to validate before creating a PR:

```bash
cd backend
npm install
# run migrations (requires Postgres)
npm run migrate
# run tests
npm test
```

│   ├── migrate.js            # Database migrations
│   ├── config/
│   │   └── db.js             # PostgreSQL configuration
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   ├── postsController.js # Posts & feed
│   │   └── reelsController.js # Reels & videos
│   ├── routes/
│   │   ├── auth.js           # Auth endpoints
│   │   ├── posts.js          # Posts endpoints
│   │   └── reels.js          # Reels endpoints
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   └── services/
│       └── storage.js        # File upload handling
├── uploads/                  # Uploaded files (local dev)
├── package.json
├── Dockerfile
└── docker-compose.yml
```text
---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Local Development

1. **Install dependencies:**

```bash
npm install
```text
1. **Configure environment:**

```bash
cp .env.example .env
# Edit .env with your database credentials
```text
> Developer note: See [ARCHITECTURE.md](../ARCHITECTURE.md) for a developer-focused repository map, domain conventions, and contribution workflow.
1. **Run database migrations:**

```bash
npm run migrate
```text
1. **Start development server:**

```bash
npm run dev
```text
Server runs on `<http://localhost:8080`>

### Docker Setup (Recommended)

```bash
docker-compose up -d --build
```text
---

## ⚙️ Configuration

### Environment Variables (.env)

```env
# Server
PORT=8080
NODE_ENV=development
API_BASE=/api/v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shareup
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=*

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```text
---

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | User login | ❌ |
| POST | `/logout` | User logout | ✅ |
| GET | `/verify` | Verify JWT token | ✅ |
| POST | `/forgot-password` | Password reset request | ❌ |
| POST | `/reset-password` | Reset password | ❌ |

### Posts (`/api/v1/posts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/feed` | Get feed posts | ✅ |
| POST | `/` | Create new post | ✅ |
| GET | `/:id` | Get post details | ✅ |
| PUT | `/:id` | Update post | ✅ |
| DELETE | `/:id` | Delete post | ✅ |
| POST | `/:id/like` | Like post | ✅ |
| POST | `/:id/comment` | Comment on post | ✅ |
| GET | `/:id/comments` | Get post comments | ✅ |

### Reels (`/api/v1/reels`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get reels list | ✅ |
| POST | `/` | Create new reel — canonical endpoint. Accepts optional `source` in JSON body for origin tracking. | ✅ |
| GET | `/:id` | Get reel details | ✅ |
| DELETE | `/:id` | Delete reel | ✅ |
| POST | `/:id/like` | Like reel | ✅ |
| POST | `/:id/comment` | Comment on reel | ✅ |

*(60+ total endpoints including users, messages, groups, notifications, stories, etc.)*

**Deprecation notice:** Legacy endpoints that encoded user identity in the URL (for example `/api/v1/reels/web/:userId`) have been removed. Always use `POST /api/v1/reels` with an authenticated token; ownership is derived from the JWT. If you previously relied on the URL to provide a source/origin, include a `source` string in the JSON request body instead.

#### Create post details

	- `content` (string) — required
	- `privacy` (string) — optional, one of `public`, `friends`, `private` (defaults to `public`)

---

#### Create swap details

- **Endpoint:** `POST /api/v1/swaps`
- **Auth:** Required — include `Authorization: Bearer <token>` header
- **Body:** JSON object with swap payload fields (see swap service). Do NOT include `userId` — the server will set `user_id` from the authenticated JWT.
- **Files:** Optional multipart files under field `swapfiles`.
- **Behavior:** The server will reject any attempt to set `user_id` from the URL or body; identity is token-based.

---

## 🔐 Security

### Implemented Security Features

1. **Helmet.js**: HTTP security headers
2. **Rate Limiting**: 100 requests per 15 minutes per IP
3. **CORS**: Configurable origin control
4. **JWT Authentication**: Secure token-based auth
5. **bcrypt**: Password hashing
6. **SQL Injection Protection**: Parameterized queries
7. **File Upload Validation**: File type & size limits

### Security Updates

**Latest (Nov 10, 2025):**
- ✅ Multer updated to 2.0.2 (security patch)
- ✅ Express updated to 5.0.1

---

## 🗄️ Database

### PostgreSQL Schema

**Main Tables:**

- `users` - User accounts
- `posts` - User posts & feed
- `reels` - Video content
- `messages` - Chat messages
- `conversations` - Message threads
- `notifications` - User notifications
- `groups` - Group information
- `friends` - Friend relationships
- `stories` - Temporary stories
- `comments` - Post/reel comments
- `likes` - Like tracking

**Migrations:**

```bash
npm run migrate
```text
---

## 🧪 Testing

### Run Tests

```bash
npm test
```text
### Test Coverage

```bash
npm run test:coverage
```text
*(Tests to be implemented)*

---

## 📦 Production Deployment

### Build for Production

```bash
npm run build  # If using TypeScript/build step
```text
### Start Production Server

```bash
npm start
```text
### Process Manager (PM2)

```bash
npm install -g pm2
pm2 start src/index.js --name shareup-backend
pm2 save
pm2 startup
```text
### Docker Production

```bash
docker build -t shareup-backend .
docker run -d -p 8080:8080 --env-file .env shareup-backend
```text
---

## 🔧 Development

### Code Structure

**Controllers:** Business logic for each feature  
**Routes:** API endpoint definitions  
**Middleware:** Request processing (auth, validation, etc.)  
**Services:** Reusable service modules (storage, email, etc.)  
**Config:** Configuration files (database, etc.)

### Adding New Endpoint

1. **Create controller** (`src/controllers/featureController.js`)
2. **Define routes** (`src/routes/feature.js`)
3. **Add middleware** if needed
4. **Update documentation**

### Database Migrations

```bash
# Create migration
npm run migrate:create -- migration_name

# Run migrations
npm run migrate

# Rollback
npm run migrate:rollback
```text
---

## 📊 Performance

- **Response Time:** <100ms average
- **Throughput:** Rate limited to 100 req/15min per IP
- **Database:** Optimized with indexes
- **Caching:** *(To be implemented)*

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
docker ps  # or
sudo systemctl status postgresql

# Verify .env credentials
cat .env | grep DB_
```text
### Port Already in Use

```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```text
### Migration Errors

```bash
# Reset database (CAUTION: deletes all data)
npm run migrate:reset

# Fresh migrate
npm run migrate
```text
---

## 📚 Related Documentation

- **Main README:** `/README.md`
- **Team Documentation:** `/TEAM_DOCUMENTATION.md`
- **Frontend Docs:** `/Shareup-frontend/README.md`
- **Deployment Guide:** `/DEPLOYMENT.md`

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | Nov 10, 2025 | Updated documentation, multer 2.0.2 |
| 1.0.0 | - | Initial backend implementation |

---

**Last Updated:** November 10, 2025  
**Status:** ✅ Production Ready  
**API Version:** v1

