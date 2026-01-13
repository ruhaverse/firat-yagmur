# 🔐 ShareUpTime Login Bilgileri

## Backend & Database Durumu
✅ **PostgreSQL:** Docker'da çalışıyor (Port 5432)
✅ **Backend API:** Docker'da çalışıyor (Port 4001)
✅ **Database:** Migrations tamamlandı
✅ **Toplam Kullanıcı:** 4 aktif hesap

## Test Kullanıcı Hesapları

### 1. Test Kullanıcısı
- **Email:** `test@shareuptime.com`
- **Şifre:** `Test123!`
- **İsim:** Test User

### 2. Demo Hesabı
- **Email:** `demo@shareuptime.com`
- **Şifre:** `Demo123!`
- **İsim:** Demo Account

### 3. Admin Kullanıcısı
- **Email:** `admin@shareuptime.com`
- **Şifre:** `Admin123!`
- **İsim:** Admin User

### 4. John Doe
- **Email:** `john@shareuptime.com`
- **Şifre:** `John123!`
- **İsim:** John Doe

## Backend API Endpoints

### Base URL
- **Local:** `http://localhost:4001/api/v1`
- **Docker:** `http://localhost:4001/api/v1`

### Authentication Endpoints
- **Register:** `POST /api/v1/users/register`
- **Login:** `POST /api/v1/users/login`
- **Health Check:** `GET /api/v1/health`

## Docker Commands

### Start Services
```bash
cd /workspaces/firat-yagmur/backend
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs backend
docker-compose logs db
```

### Check Status
```bash
docker-compose ps
```

## Frontend

Frontend localhost:3000'de çalışıyor (zaten açık).

### Login Testi
1. `http://localhost:3000` adresine git
2. Yukarıdaki hesaplardan herhangi biriyle login yap
3. News Feed'e yönlendirileceksin

## Database Direct Access

```bash
docker-compose exec db psql -U postgres -d shareup
```

### Useful SQL Queries

```sql
-- Tüm kullanıcıları listele
SELECT id, email, first_name, last_name, created_at FROM users;

-- Kullanıcı sayısı
SELECT COUNT(*) FROM users;

-- Post sayısı
SELECT COUNT(*) FROM posts;
```

## Environment Değişkenleri

### Backend (.env)
- `DATABASE_URL=postgres://postgres:postgres@db:5432/shareup`
- `PORT=4001`
- `JWT_SECRET=change_this_to_a_strong_secret_key_for_production`
- `NODE_ENV=development`

### Frontend (.env)
- `REACT_APP_API_URL=http://localhost:4001`
- `PORT=3000`

---

**Not:** Bu dosya otomatik oluşturulmuştur. Backend ve database şu anda Docker'da çalışıyor ve tamamen fonksiyonel.
