# 📘 Shareup Project Documentation

**Last Updated:** November 11, 2025  
**Repository:** [Shareup-frontend](https://github.com/Shareup-dev/Shareup-frontend)

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Development Setup](#development-setup)
5. [Backend API](#backend-api)
6. [Frontend Application](#frontend-application)
7. [Deployment](#deployment)
8. [Testing](#testing)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)
11. [Team Workflows](#team-workflows)

---

## 🎯 Project Overview

**Shareup** is a full-stack social networking platform with web and mobile applications.

### Key Features

- 👤 User authentication and profiles
- 📝 Posts, feed, and social interactions
- 💬 Real-time messaging
- 📸 Stories (24-hour expiring content)
- 👥 Group management
- 🎬 Reels (short-form video content)
- 🏢 Employee management
- 💱 SwapPoint trading system
- 🎮 Hang features (social activities)

### Technology Stack

**Frontend:**
- React 17
- Redux Toolkit (state management)
- React Router (navigation)
- Axios (API client)
- Socket.io-client (real-time features)

**Backend:**
- Node.js 18+
- Express 4
- PostgreSQL (database)
- JWT (authentication)
- Multer (file uploads)
- Helmet (security)
- Rate limiting (DDoS protection)

**Infrastructure:**
- Production: <https://www.shareuptime.com>
- Staging: <https://staging.shareuptime.com>
- Backend API: Port 8080, `/api/v1` base path

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Git
- GitHub CLI (optional, for PR management)

### Clone and Install

```bash
# Clone repository
git clone <https://github.com/Shareup-dev/Shareup-frontend.git>
cd Shareup-frontend

# Install frontend dependencies
cd Shareup-frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```text
### Start Development Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# Backend runs on <http://localhost:8080>
```text
**Terminal 2 - Frontend:**

```bash
cd Shareup-frontend
npm start
# Frontend runs on <http://localhost:3000>
```text
---

## 🏗️ Architecture

### Repository Structure

```text
Shareup-frontend/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── index.js           # Main server file
│   │   ├── config/            # Database and environment config
│   │   ├── controllers/       # Business logic (auth, posts, reels)
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Auth, validation, error handling
│   │   └── services/          # External services (storage, email)
│   ├── uploads/               # User-uploaded files
│   ├── package.json
│   └── Dockerfile             # Container configuration
│
├── Shareup-frontend/          # React web application
│   ├── src/
│   │   ├── components/        # React components (60+ components)
│   │   ├── services/          # API service layer
│   │   ├── contexts/          # React Context (UserContext)
│   │   ├── app/               # Redux store and slices
│   │   ├── css/               # Stylesheets (22 CSS files)
│   │   └── images/            # Static assets
│   ├── public/                # Static files (index.html, manifest)
│   ├── build/                 # Production build output
│   └── package.json
│
└── Documentation/             # Project documentation
    ├── README.md              # Main readme
    ├── PROJECT_DOCS.md        # This file
    ├── BACKEND_COMPARISON.md  # Backend analysis
    ├── COMPONENT_CATALOG.md   # Component inventory
    ├── SECURITY.md            # Security guidelines
    ├── DEPLOYMENT.md          # Deployment guide
    └── FINAL_REPO_STATUS.md   # Repository status
```text
### System Architecture

```text
┌─────────────────┐
│   Mobile App    │
│  (iOS/Android)  │
└────────┬────────┘
         │
         │ HTTPS (60+ endpoints)
         │
         ▼
┌─────────────────────────────────────────┐
│       Backend API (Node.js/Express)     │
│                                         │
│  • Port 8080                            │
│  • Base path: /api/v1                   │
│  • Authentication: JWT                  │
│  • Security: Helmet, Rate Limiting      │
│  • File uploads: Multer                 │
└───────────────┬─────────────────────────┘
                │
                │ SQL Queries
                ▼
        ┌───────────────┐
        │  PostgreSQL   │
        │   Database    │
        └───────────────┘
                ▲
                │
┌───────────────┴─────────────────┐
│   Frontend (React Web App)      │
│                                  │
│  • Port 3000 (dev)               │
│  • Production: shareuptime.com   │
│  • State: Redux Toolkit          │
│  • Routing: React Router         │
└──────────────────────────────────┘
```text
### API Endpoints Overview

**Authentication:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

**Posts:**
- `GET /api/v1/posts` - Get all posts
- `POST /api/v1/posts` - Create post
- `PUT /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post
- `POST /api/v1/posts/:id/like` - Like/unlike post

**Reels:**
- `GET /api/v1/reels` - Get all reels
- `POST /api/v1/reels` - Create reel
- `DELETE /api/v1/reels/:id` - Delete reel

*(Total: 60+ endpoints across auth, posts, reels, messages, groups, stories, etc.)*

---

## 💻 Development Setup

### Environment Variables

**Backend (.env):**

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/shareup
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shareup
DB_USER=your_user
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Server
PORT=8080
NODE_ENV=development
API_BASE=/api/v1

# CORS
CORS_ORIGIN=<http://localhost:3000>

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```text
**Frontend (.env):**

```bash
# API Configuration
REACT_APP_API_URL=<http://localhost:8080>
REACT_APP_SOCKET_URL=<http://localhost:8080>

# Environment
REACT_APP_ENV=development
```text
### Database Setup

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start

# Create database
sudo -u postgres psql
CREATE DATABASE shareup;
CREATE USER shareup_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shareup TO shareup_user;
\q

# Run migrations
cd backend
npm run migrate
```text
### IDE Setup (VS Code)

**Recommended Extensions:**
- ESLint
- Prettier
- GitLens
- Thunder Client (API testing)
- PostgreSQL (database management)

**Workspace Settings (`.vscode/settings.json`):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.autoFixOnSave": true,
  "files.exclude": {
    "node_modules": true,
    "build": true
  }
}
```text
---

## 🔧 Backend API

### Server Configuration

**File:** `backend/src/index.js`

```javascript
const PORT = process.env.PORT || 8080;
const API_BASE = process.env.API_BASE || '/api/v1';

// Security middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Max 100 requests per window
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File uploads
app.use('/uploads', express.static('uploads'));
```text
### Controllers

**Auth Controller** (`src/controllers/authController.js`):
- User registration with email/password
- Login with JWT token generation
- Password hashing with bcrypt
- Token refresh and logout

**Posts Controller** (`src/controllers/postsController.js`):
- CRUD operations for posts
- Like/unlike functionality
- Comment management
- Feed generation with pagination

**Reels Controller** (`src/controllers/reelsController.js`):
- Video upload and processing
- Reel creation and deletion
- Reel feed with infinite scroll

### Middleware

**Auth Middleware** (`src/middleware/auth.js`):

```javascript
// Protect routes requiring authentication
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalid' });
  }
};
```text
### Database Schema

**Users Table:**

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```text
**Posts Table:**

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  image VARCHAR(255),
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```text
### Running Backend

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start

# Run migrations
npm run migrate

# Run tests
npm test
```text
---

## 🎨 Frontend Application

### Component Structure

**Total Components:** 74 React components organized by feature

**Key Component Categories:**
1. **Dashboard & Navigation** (6 components)
   - Header, Sidebar, MainLayout
   
1. **User & Authentication** (20 components)
   - Login, Register, UserProfile, EditProfile
   
1. **Posts & Feed** (9 components)
   - CreatePost, PostCard, PostList, Comments
   
1. **Messages & Chat** (3 components)
   - ChatWindow, MessageList, MessageInput
   
1. **Stories** (2 components)
   - StoryViewer, StoryCreator
   
1. **Groups** (4 components)
   - GroupList, GroupDetail, CreateGroup
   
1. **Account Settings** (7 components)
   - SettingsMenu, Privacy, Notifications

### State Management (Redux)

**Store Configuration** (`src/app/store.js`):

```javascript
import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
// ... other reducers

export const store = configureStore({
  reducer: {
    search: searchReducer,
    // ... other slices
  },
});
```text
### API Service Layer

**Settings Service** (`src/services/Settings.js`):

```javascript
const settings = {
  dev: { apiUrl: "<http://localhost:8080"> },
  staging: { apiUrl: "<https://staging.shareuptime.com"> },
  prod: { apiUrl: "<https://www.shareuptime.com"> }
};

export const getCurrentSettings = () => settings.prod;
```text
**Auth Service** (`src/services/auth.services.js`):

```javascript
import axios from 'axios';
import { getCurrentSettings } from './Settings';

const API_URL = `${getCurrentSettings().apiUrl}/api/v1/auth`;

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};
```text
### Routing

**Main Routes** (`src/App.js`):

```javascript
<Router>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
    <Route path="/posts" element={<ProtectedRoute><PostList /></ProtectedRoute>} />
    <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
    {/* ... more routes */}
  </Routes>
</Router>
```text
### Styling

**CSS Architecture:**
- 22 CSS files in `src/css/`
- Global styles: `globals.css`, `style.css`
- Component-specific: `message.css`, `notifications.css`, `story.css`
- Third-party: FontAwesome, Emoji support

### Running Frontend

```bash
# Development server
npm start
# Opens <http://localhost:3000>

# Production build
npm run build
# Creates optimized build in /build

# Run tests
npm test

# Lint code
npm run lint
```text
---

## 🚀 Deployment

### Production Environment

**Frontend:**
- **URL:** <https://shareuptime.com>
- **Hosting:** Hostinger VPS
- **Build:** Static files served via nginx

**Backend:**
- **URL:** <https://www.shareuptime.com>
- **Port:** 8080
- **Base Path:** /api/v1
- **Hosting:** Docker container on VPS

### Build for Production

**Frontend Build:**

```bash
cd Shareup-frontend
npm run build

# Build output in /build directory
# Contains optimized JS, CSS, and assets
```text
**Backend Build:**

```bash
cd backend

# Using Docker
docker build -t shareup-backend .
docker run -d -p 8080:8080 --env-file .env shareup-backend

# Or direct Node.js
NODE_ENV=production npm start
```text
### Deployment Steps

1. **Build frontend:**

   ```bash
   cd Shareup-frontend
   npm run build
   ```

1. **Upload to server:**

   ```bash
   rsync -avz build/ user@server:/var/www/shareup/
   ```

1. **Configure nginx:**

   ```nginx
   server {
     listen 80;
     server_name shareuptime.com;
     root /var/www/shareup;
     index index.html;
     
     location / {
       try_files $uri /index.html;
     }
     
     location /api {
       proxy_pass <http://localhost:8080;>
     }
   }
   ```

1. **Deploy backend:**

   ```bash
   cd backend
   docker-compose up -d --build
   ```

### Environment-Specific Configuration

**Development:**
- Frontend: <http://localhost:3000>
- Backend: <http://localhost:8080>

**Staging:**
- Frontend: <https://staging.shareuptime.com>
- Backend: <https://staging.shareuptime.com/api>

**Production:**
- Frontend: <https://shareuptime.com>
- Backend: <https://www.shareuptime.com/api>

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test

# Run specific test suite
npm test -- auth.test.js

# Test coverage
npm run test:coverage
```text
### Frontend Tests

```bash
cd Shareup-frontend
npm test

# Run all tests
npm test -- --watchAll=false

# Test specific component
npm test -- UserProfile.test.js
```text
### Manual Testing Checklist

**Authentication:**
- [ ] User can register
- [ ] User can login
- [ ] JWT token is stored
- [ ] Protected routes require auth
- [ ] Logout clears token

**Posts:**
- [ ] User can create post
- [ ] Posts display in feed
- [ ] Like/unlike works
- [ ] Comments can be added
- [ ] Posts can be deleted

**Messages:**
- [ ] Real-time messages work
- [ ] Message history loads
- [ ] Typing indicators show
- [ ] Online status updates

---

## 🛠️ Common Tasks

### Add New API Endpoint

1. **Create controller function** (`backend/src/controllers/yourController.js`):

   ```javascript
   export const yourFunction = async (req, res) => {
     try {
       // Your logic here
       res.json({ success: true, data: result });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };
   ```

1. **Add route** (`backend/src/routes/yourRoute.js`):

   ```javascript
   import express from 'express';
   import { yourFunction } from '../controllers/yourController.js';
   import { protect } from '../middleware/auth.js';
   
   const router = express.Router();
   router.post('/your-endpoint', protect, yourFunction);
   export default router;
   ```

1. **Register route** (`backend/src/index.js`):

   ```javascript
   import yourRoute from './routes/yourRoute.js';
   app.use('/api/v1/your-resource', yourRoute);
   ```

### Add New React Component

1. **Create component file** (`Shareup-frontend/src/components/YourComponent.jsx`):

   ```javascript
   import React from 'react';
   
   const YourComponent = ({ prop1, prop2 }) => {
     return (
       <div className="your-component">
         {/* Your JSX */}
       </div>
     );
   };
   
   export default YourComponent;
   ```

1. **Add to parent component:**

   ```javascript
   import YourComponent from './components/YourComponent';
   
   <YourComponent prop1={value1} prop2={value2} />
   ```

### Update Dependencies

```bash
# Check for outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all packages (careful!)
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix
```text
### Database Migrations

```bash
cd backend

# Create new migration
npm run migrate:create -- migration_name

# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback
```text
---

## 🔍 Troubleshooting

### Common Issues

**Backend won't start:**

```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill process using port
kill -9 <PID>

# Check database connection
psql -U shareup_user -d shareup -h localhost
```text
**Frontend build fails:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```text
**Authentication errors:**
- Check JWT_SECRET is set in backend `.env`
- Verify token is being sent in Authorization header
- Check token expiration time
- Clear browser localStorage and re-login

**Database connection errors:**
- Verify PostgreSQL is running: `sudo service postgresql status`
- Check DATABASE_URL in `.env`
- Test connection: `psql -U shareup_user -d shareup`
- Check firewall: `sudo ufw status`

**CORS errors:**
- Update CORS_ORIGIN in backend `.env`
- Check frontend is making requests to correct API URL
- Verify credentials are included in axios requests

### Logs and Debugging

**Backend logs:**

```bash
# View Docker logs
docker logs shareup-backend -f

# View pm2 logs
pm2 logs

# Check error logs
tail -f backend/logs/error.log
```text
**Frontend debugging:**
- Open browser DevTools (F12)
- Check Console for errors
- Network tab for API requests
- Redux DevTools for state

---

## 👥 Team Workflows

### Git Workflow

**Branching Strategy:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

**Creating Feature:**

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
gh pr create --title "feat: your feature" --body "Description"
```text
**Code Review Process:**
1. Create PR with descriptive title
2. Add reviewers from team
3. Wait for approval (minimum 1 reviewer)
4. Address review comments
5. Merge when approved

### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add user profile editing
fix: resolve login token expiration bug
docs: update API documentation
style: format code with prettier
refactor: restructure auth service
test: add unit tests for posts controller
chore: update dependencies
```text
### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots here
```text
### Code Review Checklist

**Reviewer should check:**
- [ ] Code follows project style guide
- [ ] No console.log() statements left
- [ ] Error handling is proper
- [ ] Tests are included/updated
- [ ] Documentation is updated
- [ ] No sensitive data exposed
- [ ] Performance considerations addressed

### Deployment Process

1. **Test on staging:**

   ```bash
   git push origin develop
   # Automated deployment to staging
   ```

1. **Verify staging works:**
   - Run smoke tests
   - Check critical features
   - Review logs for errors

1. **Merge to main:**

   ```bash
   git checkout main
   git merge develop
   git push origin main
   # Automated deployment to production
   ```

1. **Monitor production:**
   - Watch server logs
   - Check error tracking (Sentry)
   - Monitor performance metrics

### Team Communication

**Daily Standup Questions:**
1. What did you complete yesterday?
2. What will you work on today?
3. Any blockers or issues?

**Communication Channels:**
- Slack/Discord - Daily communication
- GitHub Issues - Bug tracking
- GitHub Projects - Sprint planning
- Pull Requests - Code discussions

---

## 📞 Support & Resources

### Documentation Links

- **Main README:** [README.md](README.md)
- **Backend Analysis:** [BACKEND_COMPARISON.md](BACKEND_COMPARISON.md)
- **Component Catalog:** [COMPONENT_CATALOG.md](COMPONENT_CATALOG.md)
- **Security Guide:** [SECURITY.md](SECURITY.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

### External Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Redux Toolkit](https://redux-toolkit.js.org/)

### Team Contacts

- **Project Lead:** [Add name/contact]
- **Backend Lead:** [Add name/contact]
- **Frontend Lead:** [Add name/contact]
- **DevOps:** [Add name/contact]

---

## 📝 Change Log

### November 2025

- ✅ Backend folder renamed from `backend-legacy` to `backend`
- ✅ Merged Dependabot PR #24 (ws security update)
- ✅ Created comprehensive project documentation
- ✅ Updated README files
- ✅ Fixed markdown linting issues

### October 2025

- Initial repository setup
- Backend API development
- Frontend React application
- Mobile app integration (60+ endpoints)

---

**For questions or issues, please:**
1. Check this documentation first
2. Search GitHub Issues
3. Ask in team Slack/Discord
4. Create new GitHub Issue if needed

**Happy coding! 🚀**

