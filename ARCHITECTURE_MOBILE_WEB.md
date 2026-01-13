# 🏗️ ShareUp: Professional Multi-Platform Architecture

## 📐 Architecture Overview

```
firat-yagmur/
├── backend/                    # Shared Backend (Node.js + PostgreSQL)
│   ├── src/
│   │   ├── domains/           # Domain-driven design
│   │   ├── common/            # Shared utilities
│   │   └── index.js           # Express server
│   └── package.json
│
├── Shareup-frontend/          # Web Frontend (React)
│   ├── src/
│   │   ├── components/        # Web-specific components
│   │   ├── pages/             # Web pages
│   │   └── services/          # API services
│   └── package.json
│
├── mobile-app/                # Mobile Frontend (React Native) 
│   ├── src/
│   │   ├── components/        # Mobile-specific components
│   │   ├── screens/           # Mobile screens
│   │   └── services/          # API services (shared with web)
│   └── package.json
│
└── shared/                    # Shared Code (Types, Utils)
    ├── types/                 # TypeScript types
    ├── constants/             # Shared constants
    └── utils/                 # Shared utilities
```

---

## 🎯 Key Principles

### 1. **Separation of Concerns**
- **Backend**: Single source of truth (API + Database)
- **Web Frontend**: Browser-optimized UI/UX
- **Mobile Frontend**: Native mobile UI/UX
- **Shared Code**: Types, constants, utilities


### 2. **Independent Deployment**
```
Backend  → Railway/Heroku/AWS        (Port 4001)
Web      → Vercel/Netlify            (Port 3000)
Mobile   → Expo/App Store/Play Store (Bundle)
```

### 3. **Same Database, Different Experiences**
```sql
┌─────────────────────────────┐
│   PostgreSQL Database       │
│   (Single Source of Truth)  │
└─────────────┬───────────────┘
              │
    ┌─────────▼─────────┐
    │  Backend API      │
    │  (Express + JWT)  │
    └─────┬────────┬────┘
          │        │
    ┌─────▼──┐  ┌─▼──────┐
    │  Web   │  │ Mobile │
    │  React │  │  RN    │
    └────────┘  └────────┘
```

---

## 🔥 Backend: Universal API

### Endpoints Serve Both Platforms
```javascript
// backend/src/index.js
app.use('/api/v1/posts', postsRouter);      // ✅ Web + Mobile
app.use('/api/v1/reels', reelsRouter);      // ✅ Web + Mobile
app.use('/api/v1/stories', storiesRouter);  // ✅ Web + Mobile
app.use('/api/v1/auth', authRouter);        // ✅ Web + Mobile

// Image optimization for both
app.get('/uploads/:filename', (req, res) => {
  const { size } = req.query; // ?size=small|medium|large
  // Returns optimized image for web or mobile
});
```

### Environment Variables
```bash
# backend/.env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...

# CORS for both platforms
WEB_ORIGIN=https://www.shareuptime.com
MOBILE_ORIGIN=capacitor://localhost,ionic://localhost
```

---

## 💻 Web Frontend: Browser-Optimized

### Technology Stack
- **Framework**: React 18
- **Styling**: CSS + Bootstrap 3
- **State**: Redux Toolkit
- **API**: Axios with interceptors
- **Routing**: React Router v6

### Directory Structure
```
Shareup-frontend/
├── src/
│   ├── components/
│   │   ├── post/
│   │   │   ├── PostCard.jsx          # Web-specific post card
│   │   │   ├── PostForm.jsx          # Web form with drag-drop
│   │   │   └── PostList.jsx          # Grid layout for web
│   │   ├── Layout/
│   │   │   ├── Navbar.jsx            # Desktop navigation
│   │   │   └── Sidebar.jsx           # Desktop sidebar
│   │   └── widgets/
│   ├── pages/
│   │   ├── Dashboard.jsx             # Desktop dashboard
│   │   ├── Profile.jsx               # Web profile page
│   │   └── NewsFeed.jsx              # Web news feed
│   ├── services/
│   │   └── api.js                    # Axios instance
│   ├── hooks/
│   │   └── useAuth.js                # Auth hook
│   └── App.js
└── package.json
```

### API Service (Web)
```javascript
// Shareup-frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4001/api/v1',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 📱 Mobile Frontend: Native-Optimized

### Technology Stack
- **Framework**: React Native (Expo)
- **Navigation**: React Navigation
- **State**: Redux Toolkit (shared with web)
- **API**: Axios (shared instance)
- **Storage**: AsyncStorage

### Directory Structure
```
mobile-app/
├── src/
│   ├── components/
│   │   ├── post/
│   │   │   ├── PostCard.native.jsx   # Mobile post card
│   │   │   ├── PostForm.native.jsx   # Mobile camera integration
│   │   │   └── PostList.native.jsx   # FlatList for mobile
│   │   ├── navigation/
│   │   │   ├── TabNavigator.jsx      # Bottom tabs
│   │   │   └── StackNavigator.jsx    # Screen stack
│   │   └── common/
│   ├── screens/
│   │   ├── HomeScreen.jsx            # Mobile home
│   │   ├── ProfileScreen.jsx         # Mobile profile
│   │   └── CameraScreen.jsx          # Native camera
│   ├── services/
│   │   └── api.js                    # Axios instance (mobile)
│   ├── hooks/
│   │   └── useAuth.js                # Auth hook (mobile)
│   └── App.js
├── app.json                           # Expo configuration
└── package.json
```

### API Service (Mobile)
```javascript
// mobile-app/src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4001/api/v1',
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 🔗 Shared Code Strategy

### Option 1: NPM Private Package
```json
// shared/package.json
{
  "name": "@shareup/shared",
  "version": "1.0.0",
  "main": "index.js"
}
```

### Option 2: Workspace Monorepo (Yarn/pnpm)
```json
// package.json (root)
{
  "name": "shareup-monorepo",
  "private": true,
  "workspaces": [
    "backend",
    "Shareup-frontend",
    "mobile-app",
    "shared"
  ]
}
```

### Shared Types
```typescript
// shared/types/index.ts
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

export interface Post {
  id: number;
  author_id: number;
  content: string;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### Shared Constants
```javascript
// shared/constants/api.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  POSTS: {
    LIST: '/posts',
    CREATE: '/posts',
    UPDATE: (id) => `/posts/${id}`,
    DELETE: (id) => `/posts/${id}`,
  },
  USERS: {
    PROFILE: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
  },
};

export const IMAGE_SIZES = {
  THUMBNAIL: 'thumbnail',  // 150px
  SMALL: 'small',          // 320px
  MEDIUM: 'medium',        // 640px
  LARGE: 'large',          // 1280px
};
```

---

## 🚀 Development Workflow

### 1. Start Backend
```bash
cd backend
docker-compose up -d
# Backend runs on http://localhost:4001
```

### 2. Start Web Frontend
```bash
cd Shareup-frontend
npm install
npm start
# Web runs on http://localhost:3000
```

### 3. Start Mobile Frontend
```bash
cd mobile-app
npm install
npx expo start
# Mobile runs on Expo Go app or emulator
```

---

## 🔐 Authentication Strategy

### JWT Token Flow (Same for Both)
```
1. User logs in via web or mobile
2. Backend returns JWT token
3. Token stored in:
   - Web: localStorage
   - Mobile: AsyncStorage
4. All API requests include token
5. Backend validates token
6. Returns user-specific data
```

### Logout Strategy
```javascript
// Web
localStorage.removeItem('token');
window.location.href = '/login';

// Mobile
await AsyncStorage.removeItem('token');
navigation.navigate('Login');
```

---

## 📊 Database Schema (Shared)

```sql
-- Single database serves both platforms
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  profile_picture TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  author_id INTEGER REFERENCES users(id),
  content TEXT,
  image_url TEXT,
  privacy TEXT DEFAULT 'public',
  created_at TIMESTAMP DEFAULT now()
);

-- Same schema, different UI/UX!
```

---

## 🎨 UI/UX Differences

### Web
- **Layout**: Multi-column grid (3-column)
- **Navigation**: Top navbar + left sidebar
- **Forms**: Large text areas, drag-drop file upload
- **Images**: Hover effects, lightbox modals
- **Interactions**: Click, hover, keyboard shortcuts

### Mobile
- **Layout**: Single-column list (FlatList)
- **Navigation**: Bottom tabs + stack navigation
- **Forms**: Native keyboard, camera integration
- **Images**: Tap to view, swipe gestures
- **Interactions**: Touch, swipe, pinch-to-zoom

---

## 🔄 API Response Format (Same)

```json
{
  "data": [
    {
      "id": 1,
      "author_id": 1,
      "content": "Hello world!",
      "image_url": "/uploads/photo.jpg?size=medium",
      "likes_count": 10,
      "comments_count": 3,
      "created_at": "2026-01-13T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Image URLs (Platform-Aware)
```javascript
// Web: Load medium/large
const imageUrl = `/uploads/photo.jpg?size=medium`;

// Mobile: Load small/thumbnail (save data)
const imageUrl = `/uploads/photo.jpg?size=small`;
```

---

## 📦 Deployment Strategy

### Backend (One Instance)
```bash
# Railway/Heroku
git push railway main

# Environment
NODE_ENV=production
DATABASE_URL=postgresql://...
PORT=4001
```

### Web Frontend
```bash
# Vercel
vercel deploy

# Environment
REACT_APP_API_URL=https://api.shareuptime.com
```

### Mobile Frontend
```bash
# Expo/EAS Build
eas build --platform all

# Environment
EXPO_PUBLIC_API_URL=https://api.shareuptime.com

# Then submit to:
# - Apple App Store (iOS)
# - Google Play Store (Android)
```

---

## 🧪 Testing Strategy

### Backend Tests (Shared)
```bash
cd backend
npm test
# Tests API endpoints for both platforms
```

### Web Tests
```bash
cd Shareup-frontend
npm test
# Tests web-specific UI components
```

### Mobile Tests
```bash
cd mobile-app
npm test
# Tests mobile-specific UI components
```

---

## 🔧 Configuration Files

### Backend
```javascript
// backend/src/common/env.js
module.exports = {
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 4001,
  
  // CORS origins for both platforms
  corsOrigins: [
    'http://localhost:3000',      // Web dev
    'http://localhost:19006',     // Mobile dev (Expo)
    'capacitor://localhost',      // Mobile production
    'https://www.shareuptime.com' // Web production
  ]
};
```

### Web
```bash
# Shareup-frontend/.env
REACT_APP_API_URL=http://localhost:4001/api/v1
REACT_APP_PLATFORM=web
```

### Mobile
```bash
# mobile-app/.env
EXPO_PUBLIC_API_URL=http://localhost:4001/api/v1
EXPO_PUBLIC_PLATFORM=mobile
```

---

## 🚨 Critical Rules

### ✅ DO
- Use **same backend** for both platforms
- Use **same database**
- Use **same authentication** (JWT)
- Use **same API endpoints**
- Share **types and constants**
- Optimize **images per platform**
- Deploy **independently**

### ❌ DON'T
- Don't duplicate backend code
- Don't create platform-specific endpoints (unless absolutely necessary)
- Don't store platform-specific data in database
- Don't mix web and mobile UI code
- Don't share React components directly (use shared logic only)

---

## 📈 Scalability

### Backend Scaling
```
Load Balancer
    ↓
┌───────┬───────┬───────┐
│ API 1 │ API 2 │ API 3 │  ← Horizontal scaling
└───┬───┴───┬───┴───┬───┘
    └───────┴───────┘
         ↓
   PostgreSQL (Single DB)
```

### Frontend Scaling
- **Web**: CDN (Vercel/Cloudflare)
- **Mobile**: App Store distribution

---

## 🎯 Result

```
✅ One Backend (Node.js + PostgreSQL)
✅ One Database (Shared data)
✅ Two Frontends (Web + Mobile)
✅ Independent deployments
✅ Shared authentication
✅ Optimized for each platform
✅ No conflicts!
```

**Professional, scalable, maintainable architecture! 🚀**
