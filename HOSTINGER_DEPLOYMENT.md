# 🚀 Hostinger Deployment Guide - ShareUpTime Website

**Tarih:** 30 Kasım 2025  
**Proje:** ShareUpTime Frontend Website  
**Platform:** Hostinger Shared/VPS Hosting

---

## 📋 Ön Gereksinimler

### Yerel Bilgisayarınızda

- ✅ Node.js 14+ kurulu
- ✅ Git kurulu
- ✅ FTP/SSH client (FileZilla veya terminal)
- ✅ Hostinger hesap bilgileri hazır

### Hostinger Hesabınızda

- ✅ Hosting planı aktif
- ✅ Domain bağlı (örn: shareuptime.com)
- ✅ FTP/SSH erişim bilgileri
- ✅ File Manager erişimi

---

## 🔧 Adım 1: Production Build Oluşturma

### 1.1 Environment Ayarları

Yerel projenizde `.env` dosyasını production için güncelleyin:

```bash
cd Shareup-frontend
```

`.env` dosyası oluşturun (veya .env.example'dan kopyalayın):

```env
# Production API URL
REACT_APP_API_URL=https://www.shareuptime.com

# WebSocket URL
REACT_APP_WS_URL=wss://www.shareuptime.com

# App Info
REACT_APP_NAME=ShareUpTime
REACT_APP_VERSION=1.0.0

# Build Configuration
GENERATE_SOURCEMAP=false
```

### 1.2 Production Build

```bash
cd /workspaces/firat-yagmur/Shareup-frontend
npm run build
```

Bu komut `build/` klasörü oluşturur (~112MB).

**Build İçeriği:**

```text
build/
├── asset-manifest.json
├── index.html
├── static/
│   ├── css/
│   │   └── main.b5e474c6.css
│   ├── js/
│   │   └── main.d877fd53.js
│   └── media/
│       └── (tüm resimler, fontlar)
└── (diğer statik dosyalar)
```

---

## 📤 Adım 2: Hostinger'a Upload

### Seçenek A: FileZilla (FTP) ile Upload

#### 1. FileZilla'yı Aç

- Host: `ftp.shareuptime.com` (veya Hostinger'dan aldığınız FTP host)
- Username: FTP kullanıcı adınız
- Password: FTP şifreniz
- Port: `21` (FTP) veya `22` (SFTP)

#### 2. Public_html Klasörüne Gidin

Hostinger'da siteniz genellikle şu yolda:

```text
/public_html/
```

#### 3. Build İçeriğini Upload

**ÖNEMLİ:** `build/` klasörünün **içindeki** dosyaları upload edin, klasörün kendisini değil!

```text
Yerel:          /Shareup-frontend/build/*
Hostinger:      /public_html/
```

**Upload edilecek dosyalar:**

- `index.html`
- `asset-manifest.json`
- `static/` klasörü (tümüyle)
- Diğer tüm dosyalar

### Seçenek B: SSH/Terminal ile Upload

```bash
# 1. Build'i sıkıştır
cd Shareup-frontend
tar -czf shareup-build.tar.gz -C build .

# 2. Hostinger'a upload
scp shareup-build.tar.gz username@shareuptime.com:~/

# 3. SSH ile bağlan
ssh username@shareuptime.com

# 4. Dosyaları public_html'e çıkar
cd ~/public_html
tar -xzf ../shareup-build.tar.gz

# 5. Temizlik
rm ../shareup-build.tar.gz
```

### Seçenek C: Hostinger File Manager

1. Hostinger Panel → File Manager
2. `public_html` klasörüne gidin
3. Eski dosyaları silin (yedek aldıktan sonra)
4. `build/` içindeki dosyaları drag & drop ile yükleyin

---

## 🔐 Adım 3: .htaccess Konfigürasyonu

`public_html/` klasöründe `.htaccess` dosyası oluşturun veya güncelleyin:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # HTTPS'e yönlendirme
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # React Router için - tüm istekleri index.html'e gönder
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Directory browsing'i kapat
Options -Indexes

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images - 1 yıl
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  
  # CSS ve JavaScript - 1 ay
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  
  # Default - 2 gün
  ExpiresDefault "access plus 2 days"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

---

## ✅ Adım 4: Doğrulama ve Test

### 4.1 Site Erişim Testi

```bash
# Browser'da aç:
https://shareuptime.com
```

### 4.2 Kontrol Listesi

- [ ] Ana sayfa yükleniyor mu?
- [ ] CSS ve JavaScript dosyaları yükleniyor mu?
- [ ] Resimler görünüyor mu?
- [ ] React Router çalışıyor mu? (URL değişimlerinde sayfa yenilenmemeli)
- [ ] API bağlantısı çalışıyor mu? (<https://www.shareuptime.com>)
- [ ] HTTPS yönlendirme çalışıyor mu?
- [ ] Console'da hata var mı? (F12 → Console)
- [ ] Network tab'da 404 hatası var mı? (F12 → Network)

### 4.3 Performance Test

Chrome DevTools → Lighthouse ile test:

```text
- Performance: 70+
- Accessibility: 80+
- Best Practices: 80+
- SEO: 80+
```

---

## 🐛 Sorun Giderme

### Sorun 1: Blank White Page

**Sebep:** JavaScript dosyaları yüklenmiyor

**Çözüm:**

1. `.htaccess` dosyasını kontrol et
2. `index.html` içindeki path'leri kontrol et
3. Browser cache'i temizle (Ctrl+Shift+Delete)

```bash
# SSH ile dosya izinlerini düzelt
chmod 644 public_html/index.html
chmod 644 public_html/.htaccess
chmod 755 public_html/static
```

### Sorun 2: React Router 404 Hatası

**Sebep:** `.htaccess` RewriteRule çalışmıyor

**Çözüm:**

1. `.htaccess` dosyasının varlığını kontrol et
2. Apache `mod_rewrite` modülü aktif mi kontrol et
3. Hostinger desteğinden `AllowOverride All` ayarını kontrol et

### Sorun 3: API Bağlantı Hatası

**Sebep:** CORS veya backend erişim sorunu

**Çözüm:**

1. `.env` dosyasında `REACT_APP_API_URL` doğru mu?
2. Backend CORS ayarları frontend domain'ini içeriyor mu?
3. Backend erişilebilir mi? (curl test)

```bash
curl -I https://www.shareuptime.com/api/v1/
```

### Sorun 4: Images / Fonts Yüklenmiyor

**Sebep:** Dosya izinleri veya path hataları

**Çözüm:**

```bash
# SSH ile tüm dosya izinlerini düzelt
cd ~/public_html
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

### Sorun 5: Cache Problemi

**Çözüm:**

```bash
# Yeni build'de versiyon değiştir
# package.json içinde version'u artır
"version": "1.0.1"

# Build hash'i değişecek:
# main.d877fd53.js → main.abc123de.js
```

---

## 🔄 Güncelleme Prosedürü

### Kod Değişikliği Sonrası Update

```bash
# 1. Yerel değişiklikleri commit et
git add -A
git commit -m "Update: feature xyz"
git push

# 2. Yeni build oluştur
cd Shareup-frontend
npm run build

# 3. Hostinger'a upload
# - FileZilla ile public_html'e upload
# VEYA
# - SSH ile tar.gz upload + extract

# 4. Cache temizle (isteğe bağlı)
# Hostinger Panel → Advanced → Clear Cache
```

### Otomatik Deployment (İsteğe Bağlı)

GitHub Actions ile otomatik deployment için:

1. `.github/workflows/deploy.yml` oluştur
2. Hostinger FTP credentials'ı GitHub Secrets'a ekle
3. Her push'ta otomatik build + deploy

---

## 📊 Deployment Checklist

### Deployment Öncesi

- [ ] `.env` production URL'leri güncel
- [ ] `npm run build` başarılı
- [ ] Build size kontrol (~112MB)
- [ ] Eski build'den yedek al
- [ ] Hostinger hosting aktif

### Deployment Sırasında

- [ ] FTP/SSH bağlantı testi
- [ ] `public_html/` yedekle
- [ ] Eski dosyaları temizle
- [ ] Build dosyalarını upload
- [ ] `.htaccess` yerleştir
- [ ] Dosya izinleri ayarla

### Deployment Sonrası

- [ ] Site erişim testi (<https://shareuptime.com>)
- [ ] React Router testi (URL değişimleri)
- [ ] API bağlantı testi
- [ ] Images/Fonts yükleme testi
- [ ] Console hata kontrolü
- [ ] Network 404 kontrolü
- [ ] Mobile responsive test
- [ ] Performance test (Lighthouse)
- [ ] SSL sertifika kontrolü

---

## 🎯 Best Practices

### 1. Always Backup

```bash
# Deployment öncesi yedek al
cd ~/public_html
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz .
mv backup-*.tar.gz ~/backups/
```

### 2. Use Version Control

Build hash'leri ile versiyonlama:

- `main.d877fd53.js` → unique hash her build'de
- Browser cache problemi olmaz

### 3. Monitor Performance

- Google Analytics entegre et
- Error tracking (Sentry) kullan
- Uptime monitoring (UptimeRobot)

### 4. Security

- HTTPS zorunlu (Let's Encrypt ücretsiz)
- Security headers `.htaccess`'te
- Regular updates (npm audit)

### 5. Optimization

- Image optimization (WebP)
- Gzip compression aktif
- Browser caching ayarları
- CDN kullanımı (opsiyonel)

---

## 📞 Destek

### Hostinger Destek

- Live Chat: 7/24 aktif
- Email: <support@hostinger.com>
- Knowledge Base: <https://support.hostinger.com>

### Proje Destek

- GitHub Issues: ruhaverse/firat-yagmur
- Documentation: README.md, PROJECT_DOCS.md

---

## ✅ Final Kontrol

Deployment tamamlandıktan sonra:

```bash
# 1. Site erişim
curl -I https://shareuptime.com

# 2. HTTPS redirect
curl -I http://shareuptime.com

# 3. Static files
curl -I https://shareuptime.com/static/js/main.d877fd53.js

# 4. API connection
curl https://www.shareuptime.com/api/v1/
```

**Expected Results:**

- HTTP 200 OK
- HTTPS redirect working
- Static files loading
- API responding

---

## Deployment Complete! 🎉

ShareUpTime website artık Hostinger'da canlı!

**Son Güncelleme:** 30 Kasım 2025
