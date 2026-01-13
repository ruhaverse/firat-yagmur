# ShareUpTime - Full Stack Social Platform

> Modern sosyal medya platformu | Web + Mobile + Backend

**Repository:** [ruhaverse/firat-yagmur](https://github.com/ruhaverse/firat-yagmur)  
**Version:** 1.0.0 | **Status:** ✅ Development  
**Website:** [shareuptime.com](https://shareuptime.com)

---

## 🚀 Hızlı Başlangıç (5 dakika)

### Tek Komutla Tüm Sistem Başlat
```bash
npm run start:all
```

### Veya Ayrı Ayrı Başlat

#### 1️⃣ Backend (Port 4001)
```bash
cd backend
npm install
cp .env.example .env  # DATABASE_URL, JWT_SECRET gerekli
npm run migrate       # DB şemasını kurar
npm start
```
**URL:** http://localhost:4001  
**API:** http://localhost:4001/api/v1

#### 2️⃣ Web Frontend (Port 3000)
```bash
cd Shareup-frontend
npm install
npm start
```
**URL:** http://localhost:3000

#### 3️⃣ Mobil App (React Native)
```bash
cd mobile-app
npm install
npm start
```
**Platform:**
- iOS: `npm run ios`
- Android: `npm run android`

---

## 📦 Proje Yapısı

```
shareuptime/
├── backend/              # Node.js + Express API (Port 4001)
│   ├── src/
│   │   ├── domains/      # Feature modules (auth, users, posts, etc.)
│   │   ├── middleware/   # Auth, RBAC, logging
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── index.js      # Server entry point
│   ├── __tests__/        # Unit & integration tests
│   └── .env              # Environment variables
│
├── Shareup-frontend/     # React 18 Web App (Port 3000)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   ├── store/        # Redux state management
│   │   └── App.js        # Main app
│   └── package.json
│
├── mobile-app/           # React Native CLI (iOS/Android)
│   ├── src/
│   ├── app.json          # App config
│   └── package.json
│
└── shared/               # Paylaşılan kod
    ├── api-config.js     # API endpoints & URLs
    └── types.ts          # TypeScript types
```

---

## 🛠️ Teknoloji Stack

| Layer | Teknoloji |
|-------|-----------|
| **Backend API** | Node.js 20 \| Express 5 \| PostgreSQL 15 |
| **Web Frontend** | React 18.2 \| Redux Toolkit \| Axios |
| **Mobile App** | React Native CLI \| Expo |
| **Auth** | JWT \| Bcrypt \| CORS |
| **DevOps** | Docker \| Docker Compose |

---

## � Ortam Değişkenleri (.env)

Backend ve Web aynı ortam değişkenlerini paylaşır:

```bash
# Backend (.env)
NODE_ENV=development
PORT=4001
DATABASE_URL=postgres://user:password@localhost:5432/shareup
JWT_SECRET=your-secret-key-change-in-production
API_BASE=/api/v1
CORS_ORIGIN=*
BCRYPT_SALT_ROUNDS=10

# Opsiyonel: File Storage (DigitalOcean Spaces)
SPACES_ENDPOINT=https://xxx.digitaloceanspaces.com
SPACES_KEY=your-key
SPACES_SECRET=your-secret
SPACES_BUCKET=shareup
```

**Mobil App** (.env.mobile):
```bash
API_BASE=http://localhost:4001/api/v1
ENVIRONMENT=development
```

---

## ✅ Sistem Gereksinimleri

- **Node.js** 20+ (Backend & Mobil)
- **npm** 10+
- **PostgreSQL** 15+
- **Git** (version control)

### macOS (Homebrew)
```bash
brew install node postgresql git
brew services start postgresql
```

### Ubuntu/WSL
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs postgresql git
```

### Windows
- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/download/windows/)
- [Git Bash](https://git-scm.com/)

---

## 🧪 Test & Kalite Kontrol

```bash
# Backend Tests
cd backend
npm test                    # Unit & integration tests
npm run lint               # Code quality check
npm run lint:fix           # Auto-fix linting issues

# Frontend Tests (React)
cd Shareup-frontend
npm test                   # Jest tests
npm run build              # Production build
```

---

## 🐳 Docker Kullan

```bash
# Backend'i Docker'da çalıştır
docker-compose -f backend/docker-compose.yml up -d

# Tüm servisleri başlat
docker-compose up -d
```

---

## 🔐 CORS & API Erişimi

**Tüm istemciler (Web, Mobil) aynı backend'e bağlanır:**

```javascript
// shared/api-config.js
API_BASE_URLS = {
  development: 'http://localhost:4001/api/v1',
  production: 'https://api.shareuptime.com/api/v1',
}
```

**Backend CORS Ayarı:**
- **Geliştirme:** `CORS_ORIGIN=*` (hepsi)
- **Üretim:** `CORS_ORIGIN=https://shareuptime.com,https://mobile.shareuptime.com`

---

## 📱 Mobil App Entegrasyon

### iOS
```bash
cd mobile-app
npm install
npm run ios
```

### Android
```bash
cd mobile-app
npm install
npm run android
```

> **Not:** Android Studio veya Xcode gerekli olabilir.

---

## 🚢 Production Deploy

### Backend (Railway, Vercel, Heroku)
```bash
cd backend
git push heroku main
```

### Frontend (Vercel, Netlify)
```bash
cd Shareup-frontend
npm run build
# Build artifacts → hosting provider
```

### Mobil App
- **iOS:** App Store
- **Android:** Google Play Store

---

## 🐛 Sorun Giderme

### Port Zaten Kullanılıyorsa
```bash
# Port 3000 başka process tarafından kullanılıyorsa
lsof -i :3000
kill -9 <PID>

# Port 4001 için
lsof -i :4001
kill -9 <PID>
```

### Database Bağlantısı Hatası
```bash
# PostgreSQL çalışıyor mu kontrol et
psql -U postgres -d shareup -c "SELECT 1"

# .env dosyasını kontrol et
cat backend/.env
```

### Node Modules Sorunu
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Dokümantasyon

- [Backend API Docs](/backend/docs/README.md)
- [Frontend Setup](/Shareup-frontend/README.md)
- [Mobil App Setup](/mobile-app/README.md)
- [Database Schema](/backend/docs/DATABASE.md)

---

## 👥 Katkı

1. Feature branch oluştur: `git checkout -b feature/amazing-feature`
2. Commit et: `git commit -m 'Add amazing feature'`
3. Push et: `git push origin feature/amazing-feature`
4. Pull Request aç

---

## 📄 Lisans

MIT License - [LICENSE](LICENSE)

---

## 📧 İletişim

**Email:** support@shareuptime.com  
**GitHub:** [@ruhaverse](https://github.com/ruhaverse)

---

**Son Güncelleme:** Ocak 2026 | **Versiyon:** 1.0.0

```
backend/src/
├── index.js (Express app)
├── migrate.js (Database setup)
├── domains/ (13 business modules)
├── middleware/ (Auth, logging, RBAC)
├── services/ (Image processing)
└── utils/ (Helpers)

Shareup-frontend/src/
├── components/ (84 components)
├── services/ (API calls)
├── utils/ (Helpers)
├── App.jsx
└── index.js

shared/
├── api-config.js
├── utils.js
├── types.ts
└── index.js
```

---

## 📚 Documentation

- **README.md** ← Single Source of Truth
- **backend/README.md** - Backend details
- **Shareup-frontend/README.md** - Frontend details
- **[GitHub Issues](https://github.com/ruhaverse/firat-yagmur/issues)** - Support

---

## 📄 License

MIT - See [LICENSE](LICENSE)

---

**Made with ❤️ by ShareUp Team**  
**Last Updated:** January 13, 2026  
[GitHub](https://github.com/ruhaverse/firat-yagmur) | [Website](https://www.shareuptime.com)

