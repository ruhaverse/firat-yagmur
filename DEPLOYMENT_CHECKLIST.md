# 🚀 Deployment Checklist - ShareUpTime

Son güncelleme: 2025-11-30

## ✅ Backend Hazırlık

### 1. Kod Kalitesi
- [x] Tüm dosyalar syntax kontrolünden geçti
- [x] Input validation eklendi (email, password, content)
- [x] SQL injection koruması (parametreli sorgular)
- [x] XSS koruması (input sanitization)
- [x] Error handling geliştirildi
- [x] Rate limiting aktif (100 req/15min)
- [x] Helmet güvenlik başlıkları ayarlandı
- [x] CORS yapılandırması tamamlandı

### 2. Database
- [x] Migration dosyası hazır (`npm run migrate`)
- [x] Tüm tablolar tanımlandı (users, posts, reels, comments, likes, friendships, followers)
- [x] Foreign key ilişkileri kuruldu
- [x] Index'ler eklendi (performance için)
- [ ] Database backup stratejisi belirlendi

### 3. Güvenlik
- [x] JWT_SECRET strong bir değer ile değiştirildi
- [x] BCRYPT_SALT_ROUNDS = 10
- [x] Password minimum 8 karakter
- [x] Email validation
- [ ] HTTPS sertifikası hazır
- [ ] Environment variables güvenli saklanıyor

### 4. Environment Variables
```bash
# .env dosyasında olması gerekenler:
PORT=8080
NODE_ENV=production
API_BASE=/api/v1
DATABASE_URL=postgres://user:pass@host:5432/shareup
JWT_SECRET=[güçlü_secret_32+_karakter]
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=https://shareuptime.com,https://www.shareuptime.com
FILE_BASE_URL=https://shareuptime.com
```

### 5. API Endpoints Durumu
- [x] POST /api/v1/users/register - Kayıt
- [x] POST /api/v1/users/login - Giriş
- [x] GET /api/v1/users/:email - Kullanıcı bilgisi
- [x] GET /api/v1/posts - Postları listele
- [x] GET /api/v1/posts/:id - Tek post getir
- [x] POST /api/v1/posts/web/:userId - Post oluştur
- [x] DELETE /api/v1/posts/:id - Post sil (auth gerekli)
- [x] GET /api/v1/reels - Reels listele
- [x] GET /api/v1/reels/:id - Tek reel getir
- [x] POST /api/v1/reels/web/:userId - Reel oluştur
- [x] DELETE /api/v1/reels/:id - Reel sil (auth gerekli)

## ✅ Frontend Hazırlık

### 1. Kod Kalitesi
- [x] AuthService endpoint'leri güncellendi
- [x] UserService endpoint düzeltildi
- [x] Logger utility hazır
- [x] Error handling iyileştirildi
- [ ] Console.log'lar temizlendi (production için)
- [ ] Unused imports temizlendi

### 2. Build
```bash
# Production build komutu
cd Shareup-frontend
npm run build
```

### 3. Environment
- [x] Settings.js production API kullanıyor
- [x] CORS origin ayarlandı
- [ ] .env dosyası production için hazır

### 4. Performance
- [ ] Image optimization yapıldı
- [ ] Lazy loading eklendi
- [ ] Code splitting kontrol edildi
- [ ] Bundle size optimize edildi

## ✅ Docker Deployment

### 1. Backend Docker
```bash
cd backend
docker build -t shareup-backend:latest .
docker-compose up -d
```

### 2. Database
```bash
# Migration çalıştır
docker-compose exec backend npm run migrate
```

### 3. Kontroller
```bash
# Backend çalışıyor mu?
curl http://localhost:8080

# Database bağlantısı?
docker-compose logs db

# Backend logs?
docker-compose logs backend
```

## ✅ Hostinger Deployment

### 1. Backend Deployment
- [ ] Dosyaları upload et
- [ ] npm install çalıştır
- [ ] .env dosyasını oluştur
- [ ] Database bağlantısını test et
- [ ] npm run migrate çalıştır
- [ ] npm start veya PM2 ile başlat

### 2. Frontend Deployment
- [ ] npm run build çalıştır
- [ ] build/ klasörünü public_html'e upload et
- [ ] .htaccess dosyasını kontrol et (React Router için)

### 3. Database
- [ ] PostgreSQL database oluştur
- [ ] Kullanıcı ve şifre belirle
- [ ] DATABASE_URL'i güncelle
- [ ] Migration çalıştır

### 4. SSL/HTTPS
- [ ] SSL sertifikası aktif
- [ ] HTTP → HTTPS yönlendirmesi
- [ ] Mixed content uyarıları yok

## ✅ Post-Deployment Tests

### Backend API Tests
```bash
# Health check
curl https://www.shareuptime.com

# Register test
curl -X POST https://www.shareuptime.com/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test12345","firstName":"Test","lastName":"User"}'

# Login test
curl -X POST https://www.shareuptime.com/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test12345"}'

# Posts test
curl https://www.shareuptime.com/api/v1/posts

# Reels test
curl https://www.shareuptime.com/api/v1/reels
```

### Frontend Tests
- [ ] Ana sayfa yükleniyor
- [ ] Login formu çalışıyor
- [ ] Register formu çalışıyor
- [ ] Dashboard yükleniyor
- [ ] Posts yükleniyor
- [ ] Reels yükleniyor
- [ ] File upload çalışıyor
- [ ] Responsive tasarım düzgün

## ✅ Monitoring & Maintenance

### 1. Logs
- [ ] Backend log sistemi aktif
- [ ] Error tracking (örn: Sentry)
- [ ] Access logs

### 2. Backup
- [ ] Database günlük backup
- [ ] Uploaded files backup
- [ ] .env dosyası backup

### 3. Performance
- [ ] API response times monitör edilecek
- [ ] Database query performance
- [ ] Memory usage
- [ ] Disk space

### 4. Security
- [ ] Dependency güncellemeleri düzenli kontrol
- [ ] Security patches
- [ ] Rate limiting monitör
- [ ] Failed login attempts

## 🔧 Bilinen İyileştirmeler

### Backend
- [ ] Refresh token mekanizması ekle
- [ ] Email verification sistemi
- [ ] Password reset özelliği
- [ ] File upload size limits ayarla
- [ ] Image resize/optimize (sharp kütüphanesi)
- [ ] Pagination iyileştirmeleri
- [ ] Search functionality
- [ ] Notifications sistemi
- [ ] Real-time messaging (WebSocket)
- [ ] Unit tests
- [ ] Integration tests

### Frontend
- [ ] Progressive Web App (PWA) özelliği
- [ ] Offline support
- [ ] Push notifications
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Accessibility (a11y) iyileştirmeleri
- [ ] SEO optimizasyonu
- [ ] Analytics entegrasyonu

## 📞 Acil Durum Kontakları

- Backend Lead: [İsim]
- Frontend Lead: [İsim]
- DevOps: [İsim]
- Database Admin: [İsim]

## 🔗 Önemli Linkler

- Production: https://www.shareuptime.com
- Staging: https://staging.shareuptime.com (varsa)
- API Docs: [Link]
- GitHub Repo: https://github.com/ruhaverse/firat-yagmur
- Monitoring Dashboard: [Link]

---

**Not:** Bu checklist deployment öncesi her zaman gözden geçirilmelidir.
