# ShareUpTime - Full Stack Social Media Platform

Modern sosyal medya platformu | Real-time notifications | Posts, Reels, Hangs, Swaps ve daha fazla

**Developed by:** ShareUpTime Team

## 📋 Sistem Mimarisi

**Backend:** Node.js/Express + PostgreSQL  
**Frontend:** React 18 + Redux + Axios  
**Mobile:** React Native (planlandı)

### Veritabanı
- PostgreSQL (db:5432)
- Users, Posts, Reels, Hangs, Swaps, Groups, Friends, Notifications tabloları
- JWT authentication (7-day expiration)

---

## 🚀 Hızlı Başlangıç

### Backend Setup
```bash
cd backend
npm install
npm start
# Port 4001 üzerinde çalışır
# Tüm 13 domain otomatik load olur
```

### Frontend Setup
```bash
cd Shareup-frontend
npm install
npm start
# Port 3000 üzerinde çalışır
# API otomatik localhost:4001'e bağlanır
```

**Endpoints:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4001
- API Docs: `/api/v1/*` (domain-based routes)

---

## 📦 Proje Yapısı

```
├── backend/
│   ├── src/
│   │   ├── domains/          # 13 domain modules
│   │   │   ├── auth/         # Login/Register/JWT
│   │   │   ├── posts/        # Posts service
│   │   │   ├── reels/        # Reels service
│   │   │   ├── hangs/        # Events service
│   │   │   ├── swaps/        # Trading service
│   │   │   ├── groups/       # Groups service
│   │   │   ├── friends/      # Friends service
│   │   │   ├── notifications/ # Real-time notifications
│   │   │   └── ...           # (admin, health, newsFeed, rbac, stories)
│   │   ├── common/           # Shared utilities (logger, db, env)
│   │   ├── middleware/       # Auth, RBAC, logging
│   │   └── routes/           # API routes
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── Shareup-frontend/
│   ├── src/
│   │   ├── components/       # React components (all functional)
│   │   ├── services/         # API services (axios)
│   │   ├── contexts/         # UserContext (state management)
│   │   ├── hooks/            # Custom hooks
│   │   ├── features/         # Redux slices
│   │   ├── utils/            # Helper functions
│   │   └── css/              # Styles
│   ├── public/
│   └── Dockerfile
│
└── mobile-app/               # React Native (WIP)
```

---

## 🔑 Temel Özellikler

| Feature | Status | Endpoint |
|---------|--------|----------|
| Authentication | ✅ | POST /api/v1/users/login |
| User Profiles | ✅ | GET /api/v1/users/:id |
| Posts | ✅ | POST /api/v1/posts |
| Reels (Video) | ✅ | POST /api/v1/reels |
| Hangs (Events) | ✅ | POST /api/v1/hangs |
| Swaps (Trading) | ✅ | POST /api/v1/swaps |
| Groups | ✅ | POST /api/v1/groups |
| Friends | ✅ | GET /api/v1/friends |
| Notifications | ✅ | WebSocket |
| Admin Dashboard | ✅ | /admin |

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT
- **File Upload:** Multer + Sharp (image processing)
- **Logger:** Winston/pino
- **Testing:** Jest

### Frontend
- **UI Framework:** React 18 (functional components with hooks)
- **State:** Redux + React Context
- **HTTP:** Axios
- **Styling:** CSS + Bootstrap + styled-components
- **Forms:** React Hook Form
- **Router:** React Router v5
- **Testing:** Jest + React Testing Library

---

## 🔐 Kimlik Doğrulama

**Flow:**
1. User login/register
2. JWT token oluşturulur
3. Token `localStorage` kaydedilir (7 gün geçerli)
4. Axios interceptor header'a token ekler
5. Protected routes `/newsfeed` ve diğerleri kontrol edilir

**Test Account:**
```
Email: test@example.com
Password: password123
```

---

## 📝 Recent Changes

- ✅ 7 class components → functional components (hooks)
- ✅ Fixed JSX state assignment bug
- ✅ Code cleanup (TODO comments removed)
- ✅ All syntax validated
- ✅ 59 console statements (logging/debugging - normal)

---

## 🚢 Deployment

### Docker
```bash
cd backend
docker build -t shareup-api .
docker run -p 4001:4001 shareup-api

cd Shareup-frontend
docker build -t shareup-web .
docker run -p 3000:3000 shareup-web
```

### Environment Variables
**Backend (.env):**
```
PORT=4001
DB_HOST=db
DB_PORT=5432
DB_NAME=shareup
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your-secret-key
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:4001
```

---

## 🤝 Ekip Notları

- **Component Pattern:** Functional components with hooks (useState, useEffect, useContext)
- **State Management:** React Context API (UserContext) + local component state
- **API Calls:** Axios with interceptors for JWT authentication
- **Error Handling:** Try-catch blocks + user feedback
- **Code Quality:** ESLint configured, no debugger statements
- **Git Workflow:** Feature branches → main branch (protected)

---

## 📧 Geliştirici

**GitHub:** [@ruhaverse](https://github.com/ruhaverse)

