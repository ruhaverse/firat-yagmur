# Backend API - ShareUpTime

Express.js REST API server for ShareUpTime social platform.

**⚠️ See [../README.md](../README.md) for complete setup instructions**

## 🚀 Quick Start

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm start
```

**Server:** http://localhost:4001  
**API:** http://localhost:4001/api/v1

## 📋 Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `PORT=4001` - Backend port
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Change to strong secret
- `CORS_ORIGIN` - Allowed frontend domains

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js           # Express app setup
│   ├── migrate.js         # Database migrations
│   ├── common/            # Shared utilities
│   │   ├── env.js         # Environment config
│   │   ├── db.js          # Database connection
│   │   ├── logger.js      # Pino logger
│   │   └── middleware/    # Auth, RBAC, logging
│   ├── domains/           # 13 business domains
│   │   ├── auth/
│   │   ├── users/
│   │   ├── posts/
│   │   ├── reels/
│   │   ├── stories/
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── groups/
│   │   ├── friends/
│   │   ├── swaps/
│   │   ├── hangs/
│   │   ├── rbac/
│   │   └── health/
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Helper functions
├── __tests__/             # Test suite
├── Dockerfile
├── docker-compose.yml
├── package.json
└── .env
```

## 🗄️ Database

### Migrations

```bash
# Run migrations
npm run migrate

# Reset database (dev only)
dropdb shareup && createdb shareup && npm run migrate
```

### PostgreSQL Connection

```bash
# Connect to database
psql -U postgres -d shareup

# Useful queries
\dt              # List tables
\d table_name    # Describe table
SELECT * FROM users LIMIT 5;
```

## 📡 API Endpoints (60+)

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Posts
- `GET /api/v1/posts` - Get feed
- `POST /api/v1/posts` - Create post
- `GET /api/v1/posts/:id` - Get post
- `PUT /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post
- `POST /api/v1/posts/:id/like` - Like post
- `POST /api/v1/posts/:id/comments` - Add comment

### Users
- `GET /api/v1/users/:id` - Get profile
- `PUT /api/v1/users/:id` - Update profile
- `POST /api/v1/users/:id/follow` - Follow user
- `DELETE /api/v1/users/:id/follow` - Unfollow user

### Messages
- `GET /api/v1/messages/conversations` - Get conversations
- `GET /api/v1/messages/conversations/:id` - Get messages
- `POST /api/v1/messages/send` - Send message

### Reels
- `GET /api/v1/reels` - Get reels feed
- `POST /api/v1/reels` - Create reel
- `DELETE /api/v1/reels/:id` - Delete reel

### Stories
- `GET /api/v1/stories` - Get stories
- `POST /api/v1/stories` - Create story
- `DELETE /api/v1/stories/:id` - Delete story

### Notifications
- `GET /api/v1/notifications` - Get notifications
- `POST /api/v1/notifications/mark-read` - Mark as read

### Groups
- `GET /api/v1/groups` - List groups
- `POST /api/v1/groups` - Create group
- `GET /api/v1/groups/:id` - Get group
- `POST /api/v1/groups/:id/join` - Join group

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- app.test.js

# Watch mode
npm test -- --watch
```

## 🔍 Code Quality

```bash
# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix
```

## 🐳 Docker

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f db

# Stop services
docker-compose down
```

## 🚢 Production Deployment

### Environment Setup
```bash
NODE_ENV=production
PORT=4001
DATABASE_URL=postgresql://prod-user:password@prod-host:5432/shareup
JWT_SECRET=very-strong-secret-key-64-chars-minimum
CORS_ORIGIN=https://shareuptime.com,https://mobile.shareuptime.com
```

### Build & Deploy
```bash
# Docker build
docker build -t shareup-backend .
docker run -p 4001:4001 shareup-backend

# Or deploy to Heroku/Railway/Vercel
git push heroku main
```

## 🔐 Security

- JWT authentication with bcrypt hashing
- CORS enabled for Web (port 3000) and Mobile (port 19000)
- Rate limiting on auth endpoints
- SQL injection protection via parameterized queries
- Helmet.js for security headers
- Input validation on all endpoints

## 📊 Performance

- Compression middleware (gzip)
- Database connection pooling
- Structured logging with Pino
- Error handling and graceful shutdown

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL
psql -U postgres -c "SELECT 1"

# Reset connection
npm run migrate
npm start
```

### Port Already in Use
```bash
lsof -i :4001
kill -9 <PID>
```

### Clear Cache
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- [README](/README.md) - Main documentation
- [Web Frontend](/Shareup-frontend/README.md)
- [Mobile App](/mobile-app/README.md)
- [Shared Config](/shared/api-config.js)

## 📄 License

MIT - See [LICENSE](/LICENSE)

---

**Last Updated:** January 2026
