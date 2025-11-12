# 🚀 Hostinger Deployment Guide - shareuptime.com (Frontend Only)

## 📋 Overview

**Important:** This deployment is for **FRONTEND ONLY**. The backend is centralized and already deployed at `https://www.shareuptime.com/api` (shared with mobile app).

### Architecture

```text
┌─────────────────────────────────┐
│   Hostinger (public_html/)       │
│   ├── React Static Build         │
│   ├── .htaccess (routing)        │
│   └── Assets (images, CSS, JS)  │
└─────────────┬───────────────────┘
              │ API Calls (HTTPS)
              ▼
┌─────────────────────────────────┐
│   ShareUpTime.com Backend        │
│   https://www.shareuptime.com/api│
│   ├── 60+ API Endpoints          │
│   ├── PostgreSQL Database        │
│   ├── WebSocket Support          │
│   └── Mobile App Compatible      │
└─────────────────────────────────┘
```

---

## 🔧 Prerequisites

- **Hostinger Plan:** Business or higher (for custom domains)
- **Domain:** shareuptime.com (pointed to Hostinger DNS)
- **SSH Access:** Enabled in Hostinger cPanel

---

## 📦 Step 1: Build Frontend

### Local Machine

```bash
cd Shareup-frontend

# Install dependencies
npm install

# Build for production
GENERATE_SOURCEMAP=false NODE_OPTIONS="--max-old-space-size=6144" npm run build
```

**Output:** `build/` folder (~5MB total)

- `build/static/css/` - Stylesheets
- `build/static/js/` - JavaScript bundles
- `build/index.html` - Entry point
- `build/assets/` - Images, icons

---

## 🌐 Step 2: Upload to Hostinger

### Option A: SCP (Recommended)

```bash
# Compress build folder
cd Shareup-frontend
tar -czf build.tar.gz build/

# Upload to Hostinger
scp build.tar.gz username@shareuptime.com:~/

# SSH to Hostinger
ssh username@shareuptime.com

# Extract to public_html
cd ~/public_html
tar -xzf ~/build.tar.gz --strip-components=1
rm ~/build.tar.gz

# Set permissions
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

### Option B: File Manager (Hostinger cPanel)

1. Build locally: `npm run build`
2. Compress `build/` → `build.zip`
3. Login to Hostinger cPanel → File Manager
4. Navigate to `public_html/`
5. Upload `build.zip`
6. Extract archive
7. Move contents from `build/` to root
8. Delete `build/` folder and `build.zip`

---

## ⚙️ Step 3: Configure .htaccess

Create `/public_html/.htaccess`:

```apache
# React Router - SPA support
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Serve existing files directly
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/index\.html$

  # Route all other requests to index.html
  RewriteRule . /index.html [L]
</IfModule>

# MIME Types
AddType application/javascript .js
AddType text/css .css
AddType image/svg+xml .svg

# Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json image/svg+xml
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Disable directory browsing
Options -Indexes

# Block access to sensitive files
<FilesMatch "\.(env|log|bak|sql)$">
  Order allow,deny
  Deny from all
</FilesMatch>
```

---

## 🔐 Step 4: SSL Certificate

### Hostinger cPanel

1. Navigate to **SSL/TLS** section
2. Select **Install SSL Certificate**
3. Choose domain: `shareuptime.com`
4. Select **Let's Encrypt** (Free)
5. Click **Install**
6. Enable **Force HTTPS redirect**

**Auto-renewal:** Enabled by default (Let's Encrypt renews every 90 days)

---

## 🧪 Step 5: Test Deployment

### Frontend

```bash
curl https://shareuptime.com
# Should return HTML with React app
```

### Backend API (External)

```bash
curl https://www.shareuptime.com/api/auth/verify
# Should return JSON (401 if no token provided)
```

### Routing Test

Visit:
- `https://shareuptime.com/` - Home
- `https://shareuptime.com/profile` - Profile page
- `https://shareuptime.com/messages` - Messages

All should load without 404 errors (React Router handles routing).

---

## 🔄 Update Workflow

When updating frontend:

```bash
# Local machine
cd Shareup-frontend
git pull origin main
npm install
npm run build

# Upload new build
tar -czf build.tar.gz build/
scp build.tar.gz username@shareuptime.com:~/

# SSH to Hostinger
ssh username@shareuptime.com
cd ~/public_html

# Backup current version
tar -czf ~/backup-$(date +%Y%m%d-%H%M%S).tar.gz .

# Deploy new version
rm -rf static/ index.html manifest.json robots.txt asset-manifest.json
tar -xzf ~/build.tar.gz --strip-components=1
rm ~/build.tar.gz
```

---

## 📊 Monitoring

### Check Site Status

```bash
curl -I https://shareuptime.com
# HTTP/2 200 OK
```

### Check API Connectivity

```bash
curl https://www.shareuptime.com/api/posts
# Should return JSON (posts data)
```

### Error Logs

Hostinger cPanel → **Error Logs** section

Common issues:
- `404` → Check `.htaccess` rewrite rules
- `500` → Check file permissions (755 for dirs, 644 for files)
- API errors → Backend issue (contact backend team)

---

## 🆘 Troubleshooting

### Issue: Blank page after deployment

**Solution:**
```bash
# Check if index.html exists
ls -la ~/public_html/index.html

# Check homepage field in package.json (should be "/")
# Rebuild with correct homepage:
cd Shareup-frontend
npm run build
```

### Issue: CSS/JS not loading

**Solution:**
```bash
# Check MIME types in .htaccess
# Verify static/ folder exists
ls -la ~/public_html/static/

# Check file permissions
find ~/public_html -type f -exec chmod 644 {} \;
```

### Issue: React Router 404 errors

**Solution:**
- Verify `.htaccess` exists in `public_html/`
- Check Apache `mod_rewrite` is enabled (Hostinger default: ON)
- Test: `curl https://shareuptime.com/profile` (should return HTML, not 404)

### Issue: API calls failing

**Solution:**
```bash
# Check frontend Settings.js
# Should be: apiUrl: "https://www.shareuptime.com"

# Test API directly
curl https://www.shareuptime.com/api/posts

# If API is down, contact backend team
```

---

## 📝 Checklist

Before going live:

- [ ] Frontend build created (`npm run build`)
- [ ] Build uploaded to `public_html/`
- [ ] `.htaccess` configured (React Router support)
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Force HTTPS enabled
- [ ] Domain DNS points to Hostinger
- [ ] Test: Homepage loads (`https://shareuptime.com`)
- [ ] Test: Routing works (`/profile`, `/messages`)
- [ ] Test: API calls work (login, view posts)
- [ ] File permissions correct (755/644)
- [ ] Error logs clear

---

## 🎯 Summary

**What's deployed:** React frontend (static files only)

**What's NOT deployed:** Backend (uses external API)

**Backend:** `https://www.shareuptime.com/api` (already deployed, shared with mobile app)

**Deployment time:** ~10 minutes

**Updates:** Upload new build, extract to `public_html/`

**Zero-downtime updates:** Backup → Replace → Rollback if needed

---

**Last Updated:** November 10, 2025  
**Frontend:** shareuptime.com (Hostinger)  
**Backend:** www.shareuptime.com/api (Centralized)
