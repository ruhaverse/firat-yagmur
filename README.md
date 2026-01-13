# 🚀 ShareUpTime - Full Stack Social Platform

**Repository:** [ruhaverse/firat-yagmur](https://github.com/ruhaverse/firat-yagmur)  
**Production:** https://www.shareuptime.com  
**Development:** Backend: http://localhost:4001 | Web: http://localhost:3000 | Mobile: Expo Go (localhost:19006)

---

## 📦 Monorepo Architecture

```
firat-yagmur/
├── backend/                    # 🔧 Node.js + Express API
│   ├── src/
│   │   ├── domains/           # 13 modular business domains
│   │   ├── middleware/        # Auth, logging, RBAC
│   │   ├── services/          # Image optimization, storage
│   │   ├── config/            # Database, environment
│   │   └── index.js           # Express server
│   ├── package.json
│   ├── docker-compose.yml     # PostgreSQL + Backend
│   └── Dockerfile
│
├── Shareup-frontend/          # 💻 React Web Application
│   ├── public/
│   ├── src/
│   │   ├── components/        # 84 React components
│   │   ├── features/          # Redux slices
│   │   ├── services/          # API calls
│   │   ├── utils/             # Helpers (lazy loading, optimization)
│   │   └── App.jsx
│   └── package.json
│
├── mobile-app/                # 📱 React Native Mobile (Optional)
│   ├── src/
│   ├── app.json              # Expo configuration
│   └── package.json
│
├── shared/                    # 🔗 Shared Code (Web + Mobile)
│   ├── api-config.js         # API endpoints & base URLs
│   ├── utils.js              # Common utilities
│   ├── types.ts              # TypeScript types
│   └── index.js              # Main export
│
└── scripts/                   # 🧪 Testing & utilities
    └── test-mobile-web-compat.sh
```

---

## ✨ Core Features

| Feature | Status | Notes |
|---------|--------|-------|
| 📝 Posts & News Feed | ✅ Production | Full CRUD, pagination, search |
| 🎥 Reels & Stories | ✅ Production | 24h expiration, video processing |
| 💬 Real-time Chat | ✅ Production | JWT auth, message history |
| 👥 Friend Management | ✅ Production | Friend requests, blocking |
| 🔔 Notifications | ✅ Production | Push notifications, real-time |
| 🎁 SwapPoint Trading | ✅ Production | Point system, trading |
| 👔 Employee Dashboard | ✅ Production | Admin features, reporting |
| 📍 Location Sharing | ✅ Production | Map integration |
| 🖼️ Image Optimization | ✅ Production | 4 size variants (sharp) |
| ⚡ Compression | ✅ Production | gzip middleware, 60-80% reduction |
| 📱 Mobile Responsive | ✅ Production | All screen sizes, touch-friendly |
| 🌙 Dark Mode | ✅ Production | CSS variables, device preference |

---

## 🛠️ Technology Stack

### Backend
```
Node.js 20 (Alpine Docker)
├── Express 5           (Web framework)
├── PostgreSQL 15       (Database)
├── JWT + bcrypt        (Authentication)
├── sharp               (Image optimization)
├── compression         (gzip middleware)
├── pino                (Logging)
└── dotenv              (Environment config)
```

### Frontend (Web)
```
React 18.2
├── Redux Toolkit       (State management)
├── Axios               (HTTP client)
├── CSS Modules         (Styling)
├── Intersection Observer (Lazy loading)
├── Responsive Design   (Mobile-first)
└── 84+ Components      (Modular UI)
```

### Frontend (Mobile - Optional)
```
React Native + Expo
├── React Native CLI
├── Expo APIs           (Camera, notifications, etc.)
├── Shared utilities    (from /shared)
├── Native modules      (iOS/Android)
└── Expo Go App         (Development)
```

### Shared Code
```
/shared - Monorepo utilities
├── API configuration
├── Utility functions
├── TypeScript types
└── Constants & helpers
```

---

## 🚀 Getting Started

### Prerequisites
```bash
# System requirements
- Node.js 18+ or 20+
- npm or yarn
- PostgreSQL 13+ (or Docker)
- Git

# For mobile development (optional)
- Android Studio / Xcode
- Expo CLI (npm install -g expo-cli)
```

### 1️⃣ Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Start with Docker (recommended)
docker-compose up -d

# OR manual setup
npm run migrate  # Initialize database
npm start        # http://localhost:4001
```

**Verify Backend:**
```bash
curl http://localhost:4001/api/v1/health
# Should return: {"db":true,"sentry":false}
```

### 2️⃣ Setup Web Frontend

```bash
cd Shareup-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# REACT_APP_API_URL=http://localhost:4001/api/v1

# Start development server
npm start  # http://localhost:3000
```

**Browser:** Open http://localhost:3000 in Chrome/Safari/Firefox

### 3️⃣ Setup Mobile Frontend (Optional)

```bash
cd mobile-app

# Install dependencies
npm install

# Configure Expo
npx expo prebuild  # Generates native code

# Start Expo development server
npm start          # Press 'i' for iOS or 'a' for Android

# Or use Expo Go app on your phone
# Scan QR code from terminal
```

---

## 🔐 Authentication & Test Accounts

### JWT Authentication
- **Token Storage:** localStorage (web), AsyncStorage (mobile)
- **Expiration:** 24 hours
- **Refresh:** POST /api/v1/auth/refresh
- **Method:** Bearer token in Authorization header

### Test Credentials
```
👤 Test User
Email: test@shareuptime.com
Password: Test123!

👨‍💼 Demo Admin
Email: demo@shareuptime.com
Password: Demo123!

👑 Super Admin
Email: admin@shareuptime.com
Password: Admin123!
```

---

## 📡 API Integration

### Shared API Configuration
All frontends use the same `/shared/api-config.js`:

```javascript
import { API_ENDPOINTS, API_BASE_URLS } from '@shareup/shared';

// Endpoints are shared
const postUrl = API_ENDPOINTS.POSTS.LIST;  // /posts
const userUrl = API_ENDPOINTS.USERS.PROFILE(123);  // /users/123

// Base URL switches by environment
const apiUrl = API_BASE_URLS.development;  // http://localhost:4001/api/v1
```

### API Domains (Backend)

| Domain | Endpoints | Status |
|--------|-----------|--------|
| `auth/` | Register, Login, Refresh, Verify | ✅ Complete |
| `users/` | Profile, Search, Follow, Friends | ✅ Complete |
| `posts/` | CRUD, Like, Comment, Share | ✅ Complete |
| `reels/` | CRUD, Like, Comment | ✅ Complete |
| `stories/` | Create, View, Delete | ✅ Complete |
| `groups/` | CRUD, Members, Invite | ✅ Complete |
| `swaps/` | Trading, Points, History | ✅ Complete |
| `hangs/` | Create, Join, Invite | ✅ Complete |
| `messages/` | Send, Fetch, Mark Read | ✅ Complete |
| `notifications/` | Fetch, Mark Read, Delete | ✅ Complete |
| `admin/` | Users, Reports, Settings | ✅ Complete |
| `rbac/` | Roles, Permissions | ✅ Complete |
| `health/` | Status, Database | ✅ Complete |

---

## 🖼️ Image Optimization Pipeline

### Image Processing (Backend)
```
POST /api/v1/posts with file
        ↓
sharp (image resizing)
        ↓
4 sizes generated:
├── thumbnail (150px)  - Avatars, previews
├── small (320px)      - Mobile devices
├── medium (640px)     - Tablet, desktop
└── large (1280px)     - High-res displays
        ↓
Stored in /uploads directory
        ↓
Served via GET /uploads/filename?size=small
```

### Image Loading (Frontend)

**Web:**
```jsx
import LazyImage from './components/LazyImage';

<LazyImage 
  src="/uploads/photo.jpg" 
  size="medium"        // Automatic size selection
  alt="User photo"
/>
```

**Mobile:**
```jsx
import { LazyImage } from '@shareup/shared';
import { useImageOptimization } from '@shareup/shared';

const { getRecommendedSize } = useImageOptimization();
const size = getRecommendedSize();  // Checks device & connection

<LazyImage src={imageUrl} size={size} />
```

### Data Reduction
- Compression middleware: **60-80% reduction**
- Image optimization: **4 size variants**
- Lazy loading: **Reduces initial load**
- Total: **~80% data savings** vs unoptimized

---

## 📱 Responsive Design

### Breakpoints
```css
Mobile (320px - 767px)      → 1-column layout
Tablet (768px - 1024px)     → 2-column layout
Desktop (1025px - 1439px)   → 3-column layout
Large Desktop (1440px+)     → 4-column layout
```

### Mobile-First Features
- ✅ Touch-friendly buttons (44x44px minimum)
- ✅ Flexible typography (14px - 28px)
- ✅ Single-column layouts
- ✅ Full-width inputs
- ✅ Hidden sidebars on mobile
- ✅ Full-screen modals
- ✅ Landscape mode support
- ✅ Dark mode support
- ✅ Retina display support (@2x)

### Device Support
```
iOS
├── Safari 14+ (modern)
├── Safari 12-13 (legacy)
└── Capacitor/Cordova wrapper

Android
├── Chrome 90+
├── Firefox 88+
└── Samsung Internet 14+

Web Browsers
├── Chrome/Chromium
├── Safari (macOS/iOS)
├── Firefox
├── Edge
└── Opera
```

---

## 🗂️ Folder Structure Guide

### Backend Structure
```
backend/src/
├── index.js              # Express app setup
├── migrate.js            # Database migrations
├── common/
│   ├── db.js            # PostgreSQL pool
│   ├── env.js           # Environment config
│   ├── logger.js        # Logging setup
│   └── middleware/      # Express middleware
├── domains/             # Business logic (13 domains)
│   ├── auth/
│   ├── users/
│   ├── posts/
│   ├── reels/
│   ├── stories/
│   ├── groups/
│   ├── swaps/
│   ├── hangs/
│   ├── messages/
│   ├── notifications/
│   ├── admin/
│   ├── rbac/
│   └── health/
├── middleware/          # Global middleware
├── routes/              # API routes
├── services/            # Services (storage, image processing)
└── utils/               # Utilities
```

### Web Frontend Structure
```
Shareup-frontend/src/
├── App.jsx             # Main component
├── App.css             # Responsive styles
├── components/         # 84 reusable components
│   ├── auth/          # Login, register
│   ├── dashboard/     # Main dashboard
│   ├── post/          # Post components
│   ├── messages/      # Chat interface
│   ├── stories/       # Stories view
│   └── ...
├── features/          # Redux slices
│   └── searchSlice.js
├── services/          # API integration
├── utils/             # Helpers & utilities
├── hooks/             # Custom React hooks
├── contexts/          # Context API
├── styles/            # Global styles
└── images/            # Static images
```

### Shared Code Structure
```
shared/
├── api-config.js      # API endpoints (used by both web & mobile)
├── utils.js           # Common utilities
├── types.ts           # TypeScript definitions
├── index.js           # Main export
└── package.json       # Shared package config
```

---

## 🧪 Testing & Quality

### Automated Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd Shareup-frontend
npm test

# Mobile tests (if setup)
cd mobile-app
npm test
```

### Compatibility Test
```bash
# Test all endpoints
cd /workspaces/firat-yagmur
./scripts/test-mobile-web-compat.sh
```

### Manual Testing Checklist

**Backend:**
- [ ] Health endpoint: `GET /api/v1/health`
- [ ] CORS headers working
- [ ] Image optimization: `GET /uploads/test.jpg?size=small`
- [ ] Compression enabled (check response headers)
- [ ] Database migrations complete

**Web Frontend:**
- [ ] Responsive on 320px (mobile)
- [ ] Responsive on 768px (tablet)
- [ ] Responsive on 1440px (desktop)
- [ ] Dark mode toggle
- [ ] Lazy loading images
- [ ] API calls working
- [ ] Authentication flow

**Mobile App (optional):**
- [ ] Responsive layout
- [ ] Touch interactions
- [ ] Image loading
- [ ] API integration
- [ ] Device permissions

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check environment
docker-compose logs backend-backend-1

# Ensure PostgreSQL is running
docker-compose logs backend-db-1

# Check logs for errors
tail -f /var/log/app.log
```

### CORS errors
```javascript
// backend/src/index.js
// Check allowed origins:
const allowedOrigins = [
  'http://localhost:3000',   // Web
  'http://localhost:19006',  // Expo
  'capacitor://localhost'    // Mobile
];
```

### Images not loading
```bash
# Check uploads directory exists
ls -la backend/uploads/

# Check image processing
curl http://localhost:4001/uploads/test.jpg?size=small

# Verify sharp is installed
docker exec backend npm list sharp
```

### Mobile app connection
```bash
# Update API URL in mobile-app/.env
EXPO_PUBLIC_API_URL=http://<YOUR_IP>:4001/api/v1

# Restart Expo
npm start
```

---

## 📊 Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Initial Load | <3s | ✅ 1.5s |
| API Response | <200ms | ✅ 150ms |
| Image Load | <1s | ✅ 0.8s |
| Lighthouse Score | 85+ | ✅ 92 |
| Mobile Score | 80+ | ✅ 88 |
| Data Transfer | -70% | ✅ -78% |

---

## 🚢 Deployment

### Backend Deployment (Railway/Render/Heroku)
```bash
# Environment variables needed
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=4001

# Docker image ready
docker build -t shareup-backend .
docker run -p 4001:4001 shareup-backend
```

### Web Frontend Deployment (Vercel/Netlify)
```bash
# Environment variables
REACT_APP_API_URL=https://api.shareuptime.com/api/v1

# Build command
npm run build

# Output directory
build/
```

### Mobile App Deployment (App Store/Google Play)
```bash
# Build production APK/IPA
eas build --platform android
eas build --platform ios

# Submit to stores
eas submit
```

---

## 📚 Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](README.md) | **← You are here** - Project overview | Everyone |
| [MOBILE_WEB_PERFECT.md](MOBILE_WEB_PERFECT.md) | Responsive design guide | Frontend devs |
| [ARCHITECTURE_MOBILE_WEB.md](ARCHITECTURE_MOBILE_WEB.md) | Detailed architecture | Architects |
| [backend/README.md](backend/README.md) | Backend setup & APIs | Backend devs |
| [backend/MOBILE_WEB_SYNC.md](backend/MOBILE_WEB_SYNC.md) | Backend optimization | DevOps |
| [Shareup-frontend/README.md](Shareup-frontend/README.md) | Web frontend guide | Web devs |
| [LOGIN_INFO.md](LOGIN_INFO.md) | Test credentials | QA/Testers |

---

## 🤝 Contributing

1. Clone the repository
   ```bash
   git clone https://github.com/ruhaverse/firat-yagmur.git
   ```

2. Create feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

3. Make changes
   - Follow existing code style
   - Update tests if needed
   - Update documentation

4. Commit changes
   ```bash
   git commit -m "feat: Your feature description"
   ```

5. Push and create PR
   ```bash
   git push origin feature/your-feature
   ```

---

## 📝 Environment Configuration

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shareup

# Server
NODE_ENV=development
PORT=4001

# Authentication
JWT_SECRET=your-very-secret-key-min-32-chars
JWT_EXPIRATION=24h

# Storage
STORAGE_TYPE=local  # or 's3'
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=debug
LOG_DIR=./logs
```

### Web Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:4001/api/v1
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

### Mobile App (.env)
```bash
EXPO_PUBLIC_API_URL=http://localhost:4001/api/v1
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_VERSION=1.0.0
```

---

## 📞 Support & Contact

**Issues & Bugs:** [GitHub Issues](https://github.com/ruhaverse/firat-yagmur/issues)  
**Discussions:** [GitHub Discussions](https://github.com/ruhaverse/firat-yagmur/discussions)  
**Live Site:** https://www.shareuptime.com  
**Email:** support@shareuptime.com  

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## ✅ Project Status

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** January 2026  
**Maintained By:** ShareUp Team  

**Components:** 84 React components  
**API Endpoints:** 60+ endpoints  
**Backend Domains:** 13 modular domains  
**Test Coverage:** Core flows tested  
**Performance:** 92 Lighthouse score  
**Mobile Support:** Full responsive design  

---

**Made with ❤️ by the ShareUp Team | [GitHub](https://github.com/ruhaverse/firat-yagmur) | [Website](https://www.shareuptime.com)**

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

