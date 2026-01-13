# 🚀 ShareUpTime - Full Stack Social Platform

**Repository:** [ruhaverse/firat-yagmur](https://github.com/ruhaverse/firat-yagmur)  
**Production:** https://www.shareuptime.com  
**Development:** Backend: http://localhost:4001 | Web: http://localhost:3000

---

## 📦 Project Structure

```
firat-yagmur/
├── backend/              # 🔧 Node.js + Express API
├── Shareup-frontend/     # 💻 React Web Application  
├── shared/               # 🔗 Shared Utilities
└── scripts/              # 🧪 Testing Scripts
```

---

## ✨ Features

📝 Posts & Feed | 🎥 Reels | 📖 Stories | 💬 Chat | 👥 Friends | 🔔 Notifications | 🎁 SwapPoint | 👔 Admin Panel | 🖼️ Image Optimization | ⚡ Compression | 📱 Responsive | 🌙 Dark Mode

---

## 🛠️ Tech Stack

**Backend:** Node.js 20 | Express 5 | PostgreSQL 15 | JWT Auth | sharp | compression  
**Frontend:** React 18.2 | Redux Toolkit | Axios | Lazy Loading | Responsive Design

---

## 🚀 Quick Start

### Backend
```bash
cd backend

# Docker (Recommended)
docker-compose up -d

# OR Manual
npm install && cp .env.example .env
npm run migrate && npm start
# http://localhost:4001
```

### Web Frontend
```bash
cd Shareup-frontend

npm install && cp .env.example .env
npm start
# http://localhost:3000
```

---

## 🔐 Test Accounts

```
Email: test@shareuptime.com | Password: Test123!
Email: demo@shareuptime.com | Password: Demo123!
Email: admin@shareuptime.com | Password: Admin123!
```

---

## 📡 API Endpoints

| Domain | Endpoints |
|--------|-----------|
| `auth/` | Register, Login, Refresh, Verify |
| `users/` | Profile, Search, Follow, Friends |
| `posts/` | CRUD, Like, Comment, Share |
| `reels/` | CRUD, Like, Comment |
| `stories/` | Create, View, Delete |
| `groups/` | CRUD, Members, Invite |
| `swaps/` | Trading, Points, History |
| `hangs/` | Create, Join, Invite |
| `messages/` | Send, Fetch, Mark Read |
| `notifications/` | Fetch, Mark Read, Delete |

---

## 🖼️ Image Optimization

Backend stores images and serves 4 sizes:

```bash
GET /uploads/photo.jpg?size=thumbnail  # 150px
GET /uploads/photo.jpg?size=small      # 320px (mobile)
GET /uploads/photo.jpg?size=medium     # 640px (tablet)
GET /uploads/photo.jpg?size=large      # 1280px (desktop)
GET /uploads/photo.jpg                 # Original
```

**Frontend Usage:**
```jsx
<LazyImage src="/uploads/photo.jpg" size="medium" alt="Photo" />
```

**Data Reduction:** 60-80% via compression + lazy loading

---

## 📱 Responsive Design

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | 320-767px | 1 column |
| Tablet | 768-1024px | 2 columns |
| Desktop | 1025-1439px | 3 columns |
| Large | 1440px+ | 4 columns |

**Features:** Touch-friendly buttons (44x44px) | Flexible typography | Full-width inputs | Hidden sidebars on mobile | Dark mode | Retina support

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd Shareup-frontend && npm test

# API compatibility tests
./scripts/test-mobile-web-compat.sh
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
docker-compose logs backend-backend-1
```

### CORS errors
Update `backend/src/index.js` allowed origins

### Images not loading
```bash
curl http://localhost:4001/uploads/test.jpg?size=small
```

---

## 📊 Performance

| Metric | Target | Current |
|--------|--------|---------|
| Initial Load | <3s | ✅ 1.5s |
| API Response | <200ms | ✅ 150ms |
| Lighthouse | 85+ | ✅ 92 |
| Mobile Score | 80+ | ✅ 88 |

---

## 🚢 Deployment

### Backend
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
NODE_ENV=production
PORT=4001

docker build -t shareup-backend .
docker run -p 4001:4001 shareup-backend
```

### Web Frontend
```bash
REACT_APP_API_URL=https://api.shareuptime.com/api/v1

npm run build
# Deploy build/ to Vercel/Netlify
```

---

## 📝 Environment Configuration

### Backend (.env)
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shareup
NODE_ENV=development
PORT=4001
JWT_SECRET=your-very-secret-key-min-32-chars
JWT_EXPIRATION=24h
STORAGE_TYPE=local
UPLOAD_DIR=./uploads
LOG_LEVEL=debug
```

### Web Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:4001/api/v1
REACT_APP_ENVIRONMENT=development
```

---

## 📁 Folder Structure

```
backend/src/
├── index.js (Express setup)
├── migrate.js (Database)
├── domains/ (13 business domains)
├── middleware/ (Auth, logging, RBAC)
├── services/ (Image processing)
└── utils/ (Helpers)

Shareup-frontend/src/
├── components/ (84 components)
├── features/ (Redux slices)
├── services/ (API calls)
├── utils/ (Helpers)
└── App.jsx

shared/
├── api-config.js (API endpoints)
├── utils.js (Common functions)
├── types.ts (TypeScript types)
└── index.js (Exports)
```

---

## 📚 Documentation

- **README.md** ← You are here (Single source of truth)
- **backend/README.md** - Backend specific setup
- **Shareup-frontend/README.md** - Frontend specific setup

---

## 📱 Mobile App

Mobile app is in a **separate repository**: [ruhaverse/shareup-mobile](https://github.com/ruhaverse/shareup-mobile)

- Framework: React Native CLI
- Platforms: iOS & Android
- Backend: Same API as web (http://localhost:4001/api/v1)

---

## 📞 Support

**Issues:** [GitHub Issues](https://github.com/ruhaverse/firat-yagmur/issues)  
**Email:** support@shareuptime.com  
**Website:** https://www.shareuptime.com

---

## 📄 License

MIT - See [LICENSE](LICENSE)

---

## ✅ Status

**Version:** 1.0.0 | **Status:** ✅ Production Ready | **Updated:** January 2026

**Stats:**  
- 84 React components
- 60+ API endpoints  
- 13 backend domains
- 92 Lighthouse score
- Full responsive design

---

**Made with ❤️ by ShareUp Team | [GitHub](https://github.com/ruhaverse/firat-yagmur) | [Website](https://www.shareuptime.com)**

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

