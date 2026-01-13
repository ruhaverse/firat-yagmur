# 🚀 ShareUpTime - Full Stack Social Platform

**Repository:** [ruhaverse/firat-yagmur](https://github.com/ruhaverse/firat-yagmur)  
**Production:** https://www.shareuptime.com  
**Development:** Backend: http://localhost:4001 | Frontend: http://localhost:3000

## 📋 Project Overview

Complete social media platform with React + Node.js + PostgreSQL stack.

### ✨ Features
- 📝 Posts & News Feed
- 🎥 Reels & Stories (24h)
- 💬 Real-time Messaging & Chat
- 👥 Groups & Friend Management
- 🔔 Push Notifications
- 🎁 SwapPoint Trading System
- 📍 Location Sharing
- 👔 Employee Dashboard

### 🛠️ Tech Stack
- **Frontend:** React 18.2, Redux Toolkit, 121 JS/JSX files, 84 components
- **Backend:** Node.js 18+, Express 5, PostgreSQL 15, 13 modular domains
- **API:** 60+ REST endpoints, JWT authentication, bcrypt password hashing
- **Storage:** DigitalOcean Spaces (images/videos)
- **Deployment:** Docker Compose ready, production optimized

---

## 🚀 Quick Start

### Docker (Recommended)
```bash
# Clone repository
git clone https://github.com/ruhaverse/firat-yagmur.git
cd firat-yagmur/backend

# Start PostgreSQL + Backend
docker-compose up -d

# Backend will be at http://localhost:4001
# Database at localhost:5432
```

### Manual Setup
```bash
# Backend
cd backend
npm install
cp .env.example .env  # Configure DATABASE_URL, JWT_SECRET
npm run migrate       # Setup database
npm start            # http://localhost:4001

# Frontend (new terminal)
cd Shareup-frontend
npm install
npm start            # http://localhost:3000
```

### Test Accounts
```
Email: test@shareuptime.com | Password: Test123!
Email: demo@shareuptime.com | Password: Demo123!
Email: admin@shareuptime.com | Password: Admin123!
```

---

## 🏗️ Architecture

**Backend Domains (13):**
1. auth - Authentication
2. friends - Friend management  
3. posts - Posts & feed
4. reels - Short videos
5. stories - 24h stories
6. groups - Group features
7. swaps - Trading system
8. hangs - Social activities
9. notifications - Push notifications
10. messages - Real-time chat (planned)
11. admin - Admin panel
12. rbac - Role-based access
13. health - Health checks

**Frontend Components (84):**
- Dashboard & Navigation (6)
- User & Auth (20)
- Posts & Feed (9)
- Messages & Chat (3)
- Stories (2)
- Groups (4)
- Widgets (4)
- Employee Management (3)
- SwapPoint Trading (2)
- Hang Features (5)
- Profile Views (3)
- Share Features (1)
- Account Settings (7)
- Others (15)

---

## ⚙️ Environment Setup

**Backend (.env):**
```bash
PORT=4001
DATABASE_URL=postgres://user:pass@localhost:5432/shareup
JWT_SECRET=your_secret_here_min_32_chars
API_BASE=/api/v1
NODE_ENV=development
```

**Frontend:** Auto-configured via `services/Settings.js`

---

## 🔌 API Endpoints

**Base:** `http://localhost:4001/api/v1` (dev) | `https://www.shareuptime.com/api/v1` (prod)

**Key Endpoints:**
- `POST /auth/login` - Authentication
- `GET /posts` - Feed
- `POST /posts` - Create post
- `GET /messages/conversations` - Messages
- `GET /notifications` - Notifications
- `POST /groups` - Create group
- `GET /stories` - Stories
- `GET /reels` - Reels

60+ total endpoints across 13 domains.

---

## 📞 Contact & Support

- **Repository:** [github.com/ruhaverse/firat-yagmur](https://github.com/ruhaverse/firat-yagmur)
- **Issues:** [GitHub Issues](https://github.com/ruhaverse/firat-yagmur/issues)
- **Mobile App:** [Shareup-Mobile-App-CLI](https://github.com/Shareup-dev/Shareup-Mobile-App-CLI)

**Last Updated:** January 13, 2026
- ✅ **Build Status**: Production build successful, zero breaking changes
- ✅ **Security**: Backend SQL injection protection verified, bcrypt+JWT secure

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f db

# Stop services
docker-compose down

# Database access
docker-compose exec db psql -U postgres -d shareup
```

---

**Last Updated:** January 13, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Frontend:** https://shareuptime.com  
**Backend API:** https://www.shareuptime.com/api/v1

**Happy Coding! 🚀**

