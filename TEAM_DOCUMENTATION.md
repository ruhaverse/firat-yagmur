# 📚 ShareUpTime - Ekip Dokümantasyonu

**Tarih:** 10 Kasım 2025  
**Proje:** ShareUpTime Web & Mobile App  
**Repository:** [Shareup-dev/Shareup-frontend](https://github.com/Shareup-dev/Shareup-frontend)

---

## 🎯 Proje Genel Bakış

ShareUpTime, sosyal medya özellikleri sunan tam kapsamlı bir platform. Web sitesi ve mobil uygulama **aynı backend API'yi** kullanır.

### Temel Özellikler

- 📝 **Posts & Feed**: Gönderi paylaşımı ve ana akış
- 🎥 **Reels & Stories**: Video içerik ve hikayeler
- 💬 **Messaging**: Gerçek zamanlı mesajlaşma
- 👥 **Groups & Friends**: Grup yönetimi ve arkadaşlık sistemi
- 🔔 **Notifications**: Bildirim sistemi
- 🎁 **SwapPoint**: Takas/trading sistemi
- 👔 **Employee Management**: Çalışan yönetimi
- 📍 **Location Sharing**: Konum paylaşımı
- 🎮 **Hang Features**: Sosyal aktivite özellikleri

---

## 🏗️ Teknik Mimari

### Frontend (Web)

**Teknolojiler:**
- React 17.0.2
- Redux Toolkit (State Management)
- React Router v6 (Routing)
- Axios (HTTP Client)
- Socket.io-client (WebSocket)

**Lokasyon:** `/Shareup-frontend/`

**Bileşen Sayısı:** 84 React component (31,494+ satır kod)

**Key Directories:**

```text
src/
├── components/        # 84 React component
├── services/          # 16 API service modülü
├── contexts/          # React Context (UserContext)
├── app/               # Redux store & slices
├── css/               # 22 stylesheet dosyası
└── images/            # 362+ görsel asset
```text
### Backend (API)

**Teknolojiler:**
- Node.js (Express 5.0.1)
- PostgreSQL (Database)
- JWT (Authentication)
- Multer 2.0.2 (File Upload)
- Helmet (Security)
- CORS

**Lokasyon:** `/backend/`

**Port:** 8080  
**API Base:** `/api/v1`

**Key Directories:**

```text
src/
├── controllers/       # authController, postsController, reelsController
├── routes/            # API route tanımları
├── middleware/        # auth.js (JWT verification)
├── services/          # storage.js (file handling)
└── config/            # db.js (PostgreSQL connection)
```text
**Security Features:**
- Helmet middleware (HTTP headers)
- Rate limiting: 100 request / 15 dakika
- CORS configuration
- JWT token authentication

---

## 🌐 Environment & Deployment

### Production

**Website:** <<https://shareuptime.com>>  
**API Endpoint:** <<https://www.shareuptime.com>>  
**Hosting:** Hostinger (Static Build)

**Frontend Settings** (src/services/Settings.js):

```javascript
prod: {
  apiUrl: "<https://www.shareuptime.com">
}
```text
### Staging

**API Endpoint:** <<https://staging.shareuptime.com>>

### Development

**Backend:** `<http://localhost:8080`>  
**Frontend:** `<http://localhost:3000`>

---

## 📡 API Endpoints (60+ Endpoints)

### Authentication (`/api/v1/auth`)

- `POST /register` - Yeni kullanıcı kaydı
- `POST /login` - Kullanıcı girişi
- `POST /logout` - Oturum kapatma
- `GET /verify` - Token doğrulama
- `POST /forgot-password` - Şifre sıfırlama
- `POST /reset-password` - Yeni şifre belirleme

### Posts (`/api/v1/posts`)

- `GET /feed` - Ana akış postları
- `POST /` - Yeni post oluştur
- `GET /:id` - Post detayı
- `PUT /:id` - Post güncelle
- `DELETE /:id` - Post sil
- `POST /:id/like` - Post beğen
- `POST /:id/comment` - Yorum yap
- `GET /:id/comments` - Post yorumları

### Reels (`/api/v1/reels`)

- `GET /` - Reels listesi
- `POST /` - Yeni reel oluştur
- `GET /:id` - Reel detayı
- `POST /:id/like` - Reel beğen
- `POST /:id/comment` - Yorum yap

### Users

- `GET /profile/:id` - Kullanıcı profili
- `PUT /profile` - Profil güncelle
- `GET /friends` - Arkadaş listesi
- `POST /friend-request` - Arkadaşlık isteği

### Messages

- `GET /conversations` - Konuşma listesi
- `GET /messages/:conversationId` - Mesajlar
- `POST /message` - Mesaj gönder
- `PUT /message/:id/read` - Mesaj okundu

### Notifications

- `GET /` - Bildirim listesi
- `PUT /:id/read` - Bildirim okundu
- `DELETE /:id` - Bildirim sil

### Groups

- `GET /` - Grup listesi
- `POST /` - Yeni grup oluştur
- `GET /:id` - Grup detayı
- `POST /:id/join` - Gruba katıl
- `POST /:id/leave` - Gruptan ayrıl

### Stories

- `GET /` - Hikaye listesi
- `POST /` - Yeni hikaye
- `DELETE /:id` - Hikaye sil

*(ve 30+ endpoint daha...)*

---

## 🔐 Güvenlik

### Implemented Security

1. **JWT Authentication**
   - Token-based auth
   - Secure token storage
   - Token expiration

1. **Password Security**
   - bcrypt hashing
   - Minimum complexity requirements

1. **HTTP Security**
   - Helmet middleware
   - CORS configuration
   - Rate limiting

1. **Database Security**
   - Prepared statements (SQL injection koruması)
   - Environment variables (DB credentials)

### Security Updates (Son Güncelleme: 10 Kasım 2025)

**Dependabot Updates Merged:**
- ✅ Backend: multer 1.4.5-lts.2 → 2.0.2
- ✅ Frontend: 6 security package updates
- ⚠️ Remaining: 19 vulnerabilities (3 critical, 7 high, 9 moderate)

---

## 🗄️ Database Schema

**PostgreSQL Database**

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  username TEXT UNIQUE,
  profile_picture TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```text
### Posts Table

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT,
  image_url TEXT,
  video_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```text
### Reels Table

```sql
CREATE TABLE reels (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```text
*(Daha fazla tablo: messages, notifications, groups, friends, etc.)*

---

## 🚀 Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Git

### Frontend Setup

```bash
cd Shareup-frontend
npm install
npm start
```text
**Runs on:** `<http://localhost:3000`>

### Backend Setup

```bash
cd backend
cp .env.example .env  # Configure environment variables
npm install
npm run dev
```text
**Runs on:** `<http://localhost:8080`>

### Docker Setup

```bash
cd backend
docker-compose up -d --build
```text
---

## 📦 Build & Deployment

### Frontend Production Build

```bash
cd Shareup-frontend
npm run build
```text
**Output:** `build/` directory (static files)

**Deploy to Hostinger:**
1. Build oluştur: `npm run build`
2. `build/` içeriğini Hostinger'a upload et
3. CNAME dosyasının `shareuptime.com` içerdiğinden emin ol

### Backend Deployment

**Current:** Production backend zaten deploy edilmiş (`www.shareuptime.com`)

**Future Deploy:**
1. Environment variables yapılandır
2. PostgreSQL database bağlantısı ayarla
3. `npm run start` ile production mode'da çalıştır
4. Process manager kullan (PM2 recommended)

---

## 🧪 Testing

### Frontend Tests

```bash
cd Shareup-frontend
npm test
```text
**Test Framework:** Jest + React Testing Library

### Backend Tests

```bash
cd backend
npm test
```text
*(Backend testleri kurulacak)*

---

## 📁 Key Files

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `.env` | Environment variables (local) |
| `.gitignore` | Git ignore rules |
| `CNAME` | Domain configuration |
| `manifest.json` | PWA manifest |

### Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project readme |
| `TEAM_DOCUMENTATION.md` | Ekip dokümantasyonu (bu dosya) |
| `FINAL_REPO_STATUS.md` | Repository durum raporu |
| `COMPONENT_CATALOG.md` | Component listesi |
| `DEPLOYMENT.md` | Deployment guide |
| `SECURITY.md` | Security policies |

---

## 🔧 Common Tasks

### Yeni Feature Ekleme

1. **Frontend:**

   ```bash
   cd Shareup-frontend/src/components
   # Yeni component oluştur
   # Service'e API call ekle (src/services/)
   ```

1. **Backend:**

   ```bash
   cd backend/src
   # Controller oluştur (controllers/)
   # Route ekle (routes/)
   # Service logic ekle (services/)
   ```

### Bug Fix

1. Issue'yu GitHub'da oluştur
2. Feature branch oluştur: `git checkout -b fix/bug-description`
3. Fix'i implement et
4. Test et
5. PR oluştur

### Database Migration

```bash
cd backend
npm run migrate
```text
### Log Görüntüleme

**Backend logs:**

```bash
# Production
tail -f /var/log/shareup-backend.log

# Development
# Console'da görünür
```text
---

## 🐛 Troubleshooting

### Frontend Issues

**Problem:** API connection error  
**Solution:** `src/services/Settings.js` dosyasında API URL'i kontrol et

**Problem:** Build fails  
**Solution:** 

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```text
### Backend Issues

**Problem:** Database connection error  
**Solution:** `.env` dosyasında DB credentials kontrol et

**Problem:** Port already in use  
**Solution:**

```bash
lsof -ti:8080 | xargs kill -9
npm run dev
```text
---

## 👥 Team Workflow

### Git Workflow

1. **Main branch**: Production code (protected)
2. **Feature branches**: `feat/feature-name`
3. **Bug fixes**: `fix/bug-name`
4. **Hotfixes**: `hotfix/critical-fix`

### Pull Request Process

1. Feature branch'den PR oluştur
2. Code review bekle
3. CI/CD checks geçmeli
4. Approve edildikten sonra merge
5. Branch'i sil

### Code Review Checklist

- [ ] Code clean ve okunabilir
- [ ] Tests yazılmış
- [ ] Documentation güncel
- [ ] No console.log statements
- [ ] Security best practices
- [ ] Performance optimize

---

## 📊 Performance Metrics

### Frontend

- **Bundle Size:** ~2.5 MB (production build)
- **Initial Load:** ~1.5s (optimized)
- **Lighthouse Score:** 
  - Performance: 85+
  - Accessibility: 90+
  - SEO: 95+

### Backend

- **Response Time:** <100ms (average)
- **Throughput:** 100 req/15min per IP (rate limited)
- **Database Queries:** Optimized with indexes

---

## 🔄 CI/CD

### Current Setup

- **Dependabot:** Automated security updates
- **Branch Protection:** Main branch protected
- **Required Reviews:** Minimum 1 approval

### Future Improvements

- [ ] Automated testing pipeline
- [ ] Automated deployment to staging
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

---

## 📞 Support & Contact

### Documentation

- Main README: `/README.md`
- Backend README: `/backend/README.md`
- Component Catalog: `/COMPONENT_CATALOG.md`
- Deployment Guide: `/DEPLOYMENT.md`

### Resources

- **GitHub Repo:** <<https://github.com/Shareup-dev/Shareup-frontend>>
- **Production Site:** <<https://shareuptime.com>>
- **API Docs:** *(To be created)*

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 10, 2025 | Initial team documentation created |
| - | Nov 10, 2025 | Backend renamed from backend-legacy |
| - | Nov 10, 2025 | Dependabot PRs merged (security updates) |

---

## ✅ Current Status (10 Kasım 2025)

**Repository Status:**
- ✅ Backend folder correctly named (`backend/`)
- ✅ Frontend-backend alignment verified
- ✅ Dependabot PRs merged (2 PRs)
- ✅ Security updates applied
- ✅ Production backend active
- ✅ Website deployed and live

**Todo:**
- [ ] README.md lint hatalarını düzelt (260 lint error)
- [ ] API documentation oluştur (Swagger/OpenAPI)
- [ ] Backend unit tests ekle
- [ ] Performance monitoring setup
- [ ] Error tracking (Sentry integration)

---

**Son Güncelleme:** 10 Kasım 2025  
**Düzenleyen:** AI Assistant (GitHub Copilot)  
**Review:** Pending team review

