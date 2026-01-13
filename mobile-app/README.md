# ShareUpTime Mobile App - React Native

React Native + Expo mobile application for ShareUpTime social platform (iOS & Android).

**⚠️ See [../README.md](../README.md) for complete setup instructions**

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Expo CLI: `npm install -g expo-cli`
- **Expo Go app** on your phone (for development)

### Installation

```bash
cd mobile-app
npm install
npm start
```

### Run on Your Phone

1. **iOS:** Press `i` in terminal → Scan QR code with iPhone camera
2. **Android:** Press `a` → Expo Go app opens

### Run in Emulator

```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
```

## 📋 Configuration

Same backend as web frontend:

- **Dev:** http://localhost:4001/api/v1
- **Staging:** https://staging-api.shareuptime.com/api/v1  
- **Prod:** https://api.shareuptime.com/api/v1

## 🔗 API Integration

```javascript
import apiClient from './services/api';

// All endpoints use same backend as web
await apiClient.login(email, password);
await apiClient.getFeed();
await apiClient.sendMessage(id, msg);
```

```bash
# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## 📁 Project Structure

```
mobile-app/
├── src/
│   ├── App.js              # Main app component
│   ├── config/
│   │   └── apiConfig.js    # Shared API configuration
│   ├── services/
│   │   ├── apiClient.js    # Axios HTTP client
│   │   └── authService.js  # Authentication service
│   ├── screens/            # App screens (TBD)
│   ├── components/         # Reusable components (TBD)
│   └── utils/              # Helper functions (TBD)
├── app.json               # Expo configuration
├── package.json
└── .gitignore
```

## 🔐 Authentication

Mobile app uses the same backend as web:
- **Backend:** http://localhost:4001/api/v1
- **Auth:** JWT tokens stored in AsyncStorage

Login credentials (same as web):
```
Email: test@shareuptime.com
Password: Test123!
```

## 📡 API Integration

All API calls go through `apiClient` which automatically:
- Attaches JWT token to requests
- Handles 401 errors and token refresh
- Provides consistent error handling

```javascript
import apiClient from '@/services/apiClient';
import { POST_ENDPOINTS } from '@/config/apiConfig';

// Get posts
const posts = await apiClient.get(POST_ENDPOINTS.FEED);

// Create post
const newPost = await apiClient.post(POST_ENDPOINTS.CREATE, {
  content: 'Hello World!',
});
```

## 🧪 Testing

```bash
npm test
```

## 📦 Building for Production

### Android
```bash
expo prebuild
cd android
./gradlew assembleRelease
```

### iOS
```bash
expo prebuild
cd ios
xcodebuild -scheme ShareUpTime -configuration Release
```

## 🐛 Troubleshooting

### Metro Server Issues
```bash
npm start -- --reset-cache
```

### Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```bash
lsof -i :19000
kill -9 <PID>
```

## 📚 Documentation

- [Backend API](/backend/README.md)
- [Web Frontend](/Shareup-frontend/README.md)
- [API Config](./config/apiConfig.js)

## 📄 License

MIT - See [LICENSE](/LICENSE)

---

**Last Updated:** January 2026
