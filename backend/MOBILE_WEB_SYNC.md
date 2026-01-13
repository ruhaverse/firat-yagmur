# Mobile-Web Synchronization Strategy

**Last Updated:** January 13, 2026

## ✅ Architecture Overview

ShareUpTime uses a **unified backend API** that serves both web and mobile clients. This ensures perfect data synchronization across all platforms.

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Mobile    │◄────────►│   Backend API    │◄────────►│   Website   │
│   (iOS/     │  JWT     │  (Port 4001)     │  JWT     │  (Port 3000)│
│  Android)   │  Auth    │  PostgreSQL      │  Auth    │   React     │
└─────────────┘         └──────────────────┘         └─────────────┘
       │                         │                          │
       └─────────────────────────┴──────────────────────────┘
                    SAME DATABASE - REAL-TIME SYNC
```

## 🔑 Key Features for Mobile-Web Compatibility

### 1. **Unified Authentication (JWT)**
- ✅ Same JWT tokens work for both mobile and web
- ✅ 7-day expiration for both platforms
- ✅ Refresh token mechanism (ready for implementation)

### 2. **CORS Configuration**
```javascript
CORS_ORIGIN=http://localhost:3000,
            http://localhost:19006,
            http://localhost:19000,
            capacitor://localhost,
            https://www.shareuptime.com
```
- ✅ Web origins (localhost:3000, shareuptime.com)
- ✅ Mobile origins (Expo, React Native, Capacitor)
- ✅ No-origin requests allowed (native apps)


### 3. **API Response Format (Consistent)**
All endpoints return the same JSON structure:
```json
{
  "data": { /* response data */ },
  "success": true/false,
  "error": "error message if any"
}
```

### 4. **File Upload & Media Handling**

#### Multi-size Image Support
```javascript
// Backend stores FULL resolution images
POST /api/v1/posts/
  - Accepts: files[] (up to 8 files, 10MB each)
  - Returns: Full-size image URLs

// Mobile: Can request resized images via query params
GET /uploads/image.jpg?size=small    // 320x320
GET /uploads/image.jpg?size=medium   // 640x640
GET /uploads/image.jpg?size=large    // 1280x1280
GET /uploads/image.jpg               // Original size
```

**🚀 RECOMMENDATION:** Add image resizing middleware for mobile optimization.

### 5. **Pagination Support**
```javascript
// All list endpoints support pagination
GET /api/v1/posts?limit=20&offset=0
GET /api/v1/posts/email/:email?page=1&limit=50

// Mobile: Use smaller limit (10-20)
// Web: Use larger limit (50-100)
```

## 📱 Mobile-Specific Optimizations

### Current Status:
- ✅ CORS configured for mobile origins
- ✅ No-origin requests allowed
- ✅ File uploads work (multipart/form-data)
- ✅ Same database = instant sync
- ❌ No image resizing (mobile gets full size)
- ❌ No response compression (mobile bandwidth)
- ❌ No offline sync (coming soon)

### Recommended Additions:

#### 1. **Image Optimization Endpoint**
```javascript
// Add to backend/src/services/storage.js
const sharp = require('sharp');

async function resizeImage(filepath, size) {
  const sizes = {
    small: 320,
    medium: 640,
    large: 1280
  };
  
  const dimension = sizes[size] || 1280;
  
  return sharp(filepath)
    .resize(dimension, dimension, { fit: 'cover' })
    .jpeg({ quality: 80 })
    .toBuffer();
}
```

#### 2. **Response Compression**
```javascript
// backend/src/index.js
const compression = require('compression');

app.use(compression({
  filter: (req, res) => {
    // Compress JSON responses for mobile
    if (req.headers['user-agent']?.includes('Mobile')) {
      return true;
    }
    return compression.filter(req, res);
  }
}));
```

#### 3. **API Version Support**
```javascript
// Future-proof: Support multiple API versions
/api/v1/posts  // Current
/api/v2/posts  // Future (breaking changes)

// Mobile apps specify version in headers
headers: { 'X-API-Version': 'v1' }
```

## 🔄 Data Synchronization

### How It Works:
1. **Mobile creates a post** → Backend writes to PostgreSQL
2. **Web refreshes** → Sees the new post instantly
3. **Web likes the post** → Backend updates database
4. **Mobile fetches posts** → Sees the like count updated

### Real-time Sync (Optional - Future):
```javascript
// WebSocket for live updates (not implemented yet)
io.on('connection', (socket) => {
  socket.on('post_created', (data) => {
    io.emit('new_post', data); // Notify all clients
  });
});
```

## 🎨 Image Size Strategy

### Storage:
- ✅ Backend stores **original size** in `/uploads/`
- ✅ Original filename preserved
- ✅ Full quality retained

### Delivery:
| Platform | Image Size | Resolution | Quality |
|----------|-----------|------------|---------|
| **Mobile** | Small | 320x320 | 80% |
| **Mobile** | Medium | 640x640 | 85% |
| **Web** | Large | 1280x1280 | 90% |
| **Web** | Original | Full res | 100% |

### Implementation:
```javascript
// Frontend request examples

// Mobile (React Native)
<Image 
  source={{ uri: `${post.media[0]}?size=small` }} 
  style={{ width: 100, height: 100 }} 
/>

// Web (React)
<img 
  src={`${post.media[0]}?size=large`} 
  alt="Post" 
  style={{ maxWidth: '800px' }} 
/>
```

## 🔐 Security Considerations

### Same Security for Both:
- ✅ JWT token validation
- ✅ Rate limiting (100 req/15min)
- ✅ Input sanitization
- ✅ XSS protection
- ✅ SQL injection protection
- ✅ File upload validation (type, size)

### Platform Detection:
```javascript
// Detect client type from User-Agent
const isMobile = req.headers['user-agent']?.includes('Mobile');
const isWeb = req.headers['user-agent']?.includes('Mozilla');

// Apply different rate limits
const mobileLimit = rateLimit({ max: 200 }); // Higher for mobile
const webLimit = rateLimit({ max: 100 }); // Standard for web
```

## 📊 Performance Optimization

### Current:
- ✅ Database connection pooling
- ✅ Single backend instance (Docker)
- ✅ Static file serving via Nginx (production)
- ❌ No CDN for images
- ❌ No Redis caching

### Recommendations:
1. **Add Redis for caching** (reduce DB queries)
2. **Use CDN for images** (faster mobile loading)
3. **Implement pagination everywhere**
4. **Add compression middleware**
5. **Consider GraphQL for mobile** (flexible queries)

## 🚀 Deployment Checklist

### For Production:
- [ ] Set `FILE_BASE_URL=https://www.shareuptime.com`
- [ ] Update CORS to production domains
- [ ] Enable HTTPS only
- [ ] Add CDN for `/uploads/`
- [ ] Monitor API usage (mobile vs web)
- [ ] Set up error tracking (Sentry)
- [ ] Add health check endpoint
- [ ] Configure auto-scaling

## 📱 Mobile App Configuration

### Environment Variables:
```javascript
// mobile/.env
API_URL=https://www.shareuptime.com
API_VERSION=v1
AUTH_STORAGE_KEY=@shareuptime:auth
IMAGE_QUALITY=0.8
MAX_IMAGE_SIZE=5242880 // 5MB

// Auto-detect environment
const API_BASE = __DEV__ 
  ? 'http://localhost:4001' 
  : 'https://www.shareuptime.com';
```

### API Service:
```javascript
// mobile/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Platform': 'mobile',
    'X-API-Version': 'v1'
  }
});

// Auto-attach JWT token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@shareuptime:auth');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## ✅ Verification Tests

### Test Mobile-Web Sync:
```bash
# 1. Mobile creates post
curl -X POST http://localhost:4001/api/v1/posts \
  -H "Authorization: Bearer <mobile_token>" \
  -F "content=Posted from mobile!" \
  -F "files=@photo.jpg"

# 2. Web fetches posts
curl http://localhost:4001/api/v1/posts \
  -H "Authorization: Bearer <web_token>"

# Result: Mobile post appears in web response ✅
```

### Test Cross-platform Like:
```bash
# 1. Web user likes post
curl -X POST http://localhost:4001/api/v1/posts/1/like \
  -H "Authorization: Bearer <web_token>"

# 2. Mobile fetches post
curl http://localhost:4001/api/v1/posts/1 \
  -H "Authorization: Bearer <mobile_token>"

# Result: Like count increased ✅
```

## 🎯 Summary

### ✅ What Works NOW:
- Same backend API for both platforms
- Same database = instant sync
- JWT auth works for both
- File uploads work for both
- CORS properly configured
- No data conflicts

### 🔧 Recommended Improvements:
1. Add image resizing (sharp package)
2. Add response compression
3. Add Redis caching
4. Use CDN for images
5. Add WebSocket for real-time updates
6. Monitor API usage per platform

### 🚫 Things That DON'T Break:
- Mobile and web **never** conflict
- Same JWT tokens work everywhere
- Database transactions are atomic
- File uploads are platform-agnostic
- API responses are identical

## 📞 Support

If mobile or web sync issues occur:
1. Check JWT token validity
2. Verify CORS headers
3. Check network connectivity
4. Review API logs in Docker
5. Test with Postman first

---

**Last Updated:** January 13, 2026  
**Backend Version:** 1.0.0  
**API Version:** v1
