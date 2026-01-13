# ShareUpTime Web Frontend - React 18

React 18.2 + Redux Toolkit web application for ShareUpTime social platform.

**⚠️ See [../README.md](../README.md) for complete setup instructions**

## 🚀 Quick Start

```bash
cd Shareup-frontend
npm install
npm start
```

**Development:** http://localhost:3000

## ⚙️ Configuration

The app auto-detects backend based on hostname:

- **localhost** → Development (http://localhost:4001)
- **staging.\*** → Staging (https://staging-api.shareuptime.com)
- **shareuptime.com** → Production (https://api.shareuptime.com)

Override with environment variable:
```bash
REACT_APP_API_URL=http://localhost:4001 npm start
```

```
Shareup-frontend/
├── src/
│   ├── App.js             # Main app component
│   ├── index.js           # Entry point
│   ├── App.css
│   ├── components/        # 84+ React components
│   │   ├── post/
│   │   ├── profile/
│   │   ├── chat/
│   │   ├── messages/
│   │   ├── group/
│   │   ├── notifications/
│   │   └── ...
│   ├── pages/             # Page components
│   ├── services/          # API clients
│   │   ├── auth.services.js
│   │   ├── PostService.js
│   │   ├── ReelsServices.js
│   │   ├── Settings.js    # API config
│   │   └── ...
│   ├── store/             # Redux store
│   │   ├── store.js
│   │   └── searchSlice.js
│   ├── utils/             # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── styles/            # CSS/styling
│   └── images/            # Assets
├── public/                # Static files
├── package.json
└── .env                   # Environment config
```

## 🔐 Test Accounts

```
Email: test@shareuptime.com | Password: Test123!
Email: admin@shareuptime.com | Password: Admin123!
```

## 📦 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | 18.2.0 | UI library |
| React Router | 5.3.4 | Navigation |
| Redux Toolkit | 1.9.7 | State management |
| Axios | 1.7.9 | HTTP client |
| Bootstrap | 4.6.2 | UI framework |
| React Icons | 4.12.0 | Icon library |

## 🎨 Features

- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Theme switching
- **Real-time Updates** - WebSocket support
- **Image Optimization** - 4 responsive sizes
- **Lazy Loading** - Performance optimization
- **Redux State** - Centralized state management

## 🧪 Testing

```bash
# Run tests
npm test

# Build for production
npm run build

# Serve production build
npm install -g serve
serve -s build
```

## 🚢 Production Build

```bash
# Create optimized build
npm run build

# Output in: build/
```

Deploy to:
- **Vercel** - `vercel deploy`
- **Netlify** - Drag & drop `build/` folder
- **GitHub Pages** - `npm run build && npm run deploy`

## 🐛 Troubleshooting

### API Connection Error
- Verify backend running: http://localhost:4001
- Check `Settings.js` for correct API URL
- Check browser console for CORS errors

### Port 3000 Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

### Hot Reload Not Working
```bash
npm start -- --reset-cache
```

## 📚 API Integration

All API calls use shared `Settings.js` configuration:

```javascript
import settings from './services/Settings';
import axios from 'axios';

// Auto-configured baseURL
const api = axios.create({
  baseURL: `${settings.apiUrl}/api/v1`,
});

// Usage
api.get('/posts');
api.post('/posts', postData);
```

## 🔍 Code Quality

```bash
# Check ESLint
npm run lint

# (if available) Run tests
npm test
```

## 📊 Performance Tips

- Use React.lazy() for code splitting
- Implement image lazy loading
- Optimize Redux selectors
- Use memoization for expensive components

## 📄 License

MIT - See [LICENSE](/LICENSE)

---

**Last Updated:** January 2026
