# 🚀 Firat Yagmur (ShareUpTime) - Full Stack Social Platform

**Repository:** [ruhaverse/firat-yagmur](https://github.com/ruhaverse/firat-yagmur)  
**Contact:** info@shareuptime.com  
**Production (Planned):** https://www.shareuptime.com  
**Development:** Backend: http://localhost:4001 | Frontend: http://localhost:3000

> 📘 **Documentation:** See [PROJECT_DOCS.md](PROJECT_DOCS.md) for comprehensive setup, API reference, and development guide!

**Architecture doc:** see [ARCHITECTURE.md](ARCHITECTURE.md) for a developer-focused, team-readable repository map and contribution conventions.

---

## 📋 Project Overview

ShareUpTime is a comprehensive social media platform with features including:

- 📝 Posts & Feed
- 🎥 Reels & Stories
- 💬 Real-time Messaging
- 👥 Groups & Friends
- 🔔 Notifications
- 🎁 SwapPoint (Trading System)
- 👔 Employee Management
- 📍 Location Sharing

**Technology Stack:**

- **Frontend:** React 18, Redux Toolkit, React Router 5
- **Backend:** Node.js 18+, Express 5, PostgreSQL 14+
- **Architecture:** Domain-driven design (13 domains)
- **API:** Port 4001 (dev), 60+ endpoints, JWT auth
- **Real-time:** WebSocket support (planned)
- **Deployment:** Hostinger VPS (planned)

---

## 📊 Project Statistics

| Metric | Count | Details |
|--------|-------|---------|
| **Components** | **84** | React/JSX components |
| **Total Lines** | **31,494** | Component code |
| **Component Categories** | **16** | Organized folders |
| **CSS Files** | **22** | Stylesheets |
| **Services** | **16** | API service modules |
| **Images/Assets** | **362** | Icons, images, emojis |

---

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/ruhaverse/firat-yagmur.git
cd firat-yagmur

# Install dependencies
cd backend
npm install

cd ../Shareup-frontend
npm install

# Setup environment
cd ../backend
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Start backend (Terminal 1)
npm run dev
# Backend runs on http://localhost:4001

# Start frontend (Terminal 2)
cd ../Shareup-frontend
npm start
# Frontend runs on http://localhost:3000
```

---

## 🗂️ Project Structure

```
firat-yagmur/
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── domains/         # 13 business domains
│   │   │   ├── auth/        # User authentication
│   │   │   ├── friends/     # Friend management
│   │   │   ├── posts/       # Posts & feed
│   │   │   ├── reels/       # Short videos
│   │   │   ├── stories/     # 24h stories
│   │   │   ├── groups/      # Group features
│   │   │   ├── swaps/       # Trading system
│   │   │   └── ...          # + 6 more
│   │   ├── common/          # DB & utilities
│   │   ├── shared/          # Middleware
│   │   └── migrate.js       # Migrations
│   ├── .env.example         # Environment template
│   └── package.json
│
├── Shareup-frontend/        # React web app
│   ├── src/
│   │   ├── components/      # 84 React components
│   │   ├── services/        # API clients
│   │   ├── contexts/        # React Context
│   │   ├── app/             # Redux store
│   │   └── css/             # Stylesheets
│   └── package.json
│
└── Documentation/           # Project docs
    ├── PROJECT_DOCS.md      # Main documentation
    ├── ARCHITECTURE.md      # System design
    └── DEPLOYMENT.md        # Deploy guide
```

## 📚 Backend Domains (13)

The backend uses domain-driven architecture for better organization:

1. **auth** - User authentication & management
2. **friends** - Friend requests & relationships
3. **posts** - Posts & news feed
4. **reels** - Short-form videos
5. **stories** - 24-hour expiring content
6. **groups** - Group management
7. **swaps** - Trading/swap system
8. **hangs** - Social activities
9. **notifications** - Push & in-app notifications
10. **messages** - Real-time messaging (planned)
11. **admin** - Admin panel features
12. **rbac** - Role-based access control
13. **health** - Health check endpoints

## 📂 Frontend Components (84)

```
Shareup-frontend/
├── public/                    # Static files
│   ├── index.html
│   ├── CNAME                  # shareuptime.com
│   ├── manifest.json
│   └── assets/                # Icons, images
├── src/
│   ├── components/            # 84 React components (16 categories)
│   │   ├── dashboard/         # Dashboard & Navigation (6 components)
│   │   ├── user/              # User Profile & Auth (20 components)
│   │   ├── post/              # Posts & Feed (9 components)
│   │   ├── Messages/          # Messaging (1 component)
│   │   ├── chat/              # Chat UI (2 components)
│   │   ├── Stories/           # Stories (2 components)
│   │   ├── group/             # Groups (4 components)
│   │   ├── widgets/           # Sidebar Widgets (4 components)
│   │   ├── employee/          # Employee Management (3 components)
│   │   ├── SwapPoint/         # Trading System (2 components)
│   │   ├── Hang/              # Hang Features (5 components)
│   │   ├── ParentHang/        # Parent Hang (1 component)
│   │   ├── Profile/           # Profile Views (3 components)
│   │   ├── share/             # Share Features (1 component)
│   │   ├── AccountSettings/   # Settings (7 components)
│   │   ├── ChatTest/          # Chat Testing (1 component)
│   │   └── [Root]/            # Layout, Giphy, Stickers, ProtectedRoute (5)
│   ├── services/              # API services (16 files)
│   │   ├── Settings.js        # API configuration
│   │   ├── PostService.js     # Posts API
│   │   ├── UserService.js     # User API
│   │   ├── MessageService.js  # Messages API
│   │   ├── GroupService.js    # Groups API
│   │   ├── StoriesService.js  # Stories API
│   │   └── ...                # Other services
│   ├── css/                   # Stylesheets (22 files)
│   │   ├── main.min.css       # Main styles (426KB)
│   │   ├── style.css          # Core styles (285KB)
│   │   ├── responsive.css     # Mobile responsive
│   │   ├── notifications.css  # Notification styles
│   │   ├── story.css          # Stories styles
│   │   └── ...
│   ├── contexts/              # React contexts
│   │   └── UserContext.jsx    # Global user state
│   ├── app/                   # Redux store
│   │   ├── store.js
│   │   └── searchSlice.js
│   ├── images/                # Assets (362 files)
│   │   ├── posts/
│   │   ├── profile/
│   │   ├── user/
│   │   └── resources/
│   ├── App.js                 # Main app component
│   └── index.js               # Entry point
└── package.json               # Dependencies

backend/                       # Node.js/Express API (Production)
├── src/
│   ├── index.js              # Main server file
│   ├── controllers/          # Business logic
│   ├── routes/               # API endpoints  
│   ├── middleware/           # Auth & validation
│   └── services/             # External services
├── package.json
└── README.md                 # Backend documentation
```text
> 📚 See [COMPONENT_CATALOG.md](COMPONENT_CATALOG.md) for complete component list

---

## 🧩 Component Catalog

### 1. **Dashboard & Navigation** (6 components)

| Component | File | Purpose |
|-----------|------|---------|
| DashboardComponent | `dashboard/DashboardComponent.jsx` | Main dashboard view |
| HeaderComponent | `dashboard/HeaderComponent.jsx` | Top navigation bar |
| FooterComponent | `dashboard/FooterComponent.jsx` | Footer navigation |
| ShareupInsideHeaderComponent | `dashboard/ShareupInsideHeaderComponent.jsx` | Internal header |
| ShortcutWidgetComponent | `dashboard/ShortcutWidgetComponent.jsx` | Quick access shortcuts |
| Modal | `dashboard/Modal.jsx` | Reusable modal dialog |

### 2. **User & Authentication** (20 components)

| Component | File | Purpose |
|-----------|------|---------|
| Index | `user/Index.jsx` | User root component |
| NewsfeedComponent | `user/NewsfeedComponent.jsx` | News feed display |
| FriendsComponent | `user/FriendsComponent.jsx` | Friends list |
| AddFriendsComponent | `user/AddFriendsComponent.jsx` | Add friends UI |
| FriendSearchComponent | `user/FriendSearchComponent.jsx` | Search friends |
| FriendsTestComponent | `user/FriendsTestComponent.jsx` | Friends test UI |
| AboutComponent | `user/AboutComponent.jsx` | User about section |
| ActivityComponent | `user/ActivityComponent.jsx` | User activity feed |
| EditProfileComponent | `user/EditProfileComponent.jsx` | Edit profile form |
| OtherProfileComponent | `user/OtherProfileComponent.jsx` | Other user's profile |
| EditPostComponent | `user/EditPostComponent.jsx` | Edit post form |
| ForgotPasswordComponent | `user/ForgotPasswordComponent.jsx` | Password recovery |
| PhoneComponent | `user/PhoneComponent.jsx` | Phone verification |
| Country | `user/Country.js` | Country selector |
| NotificationChatComponent | `user/NotificationChatComponent.jsx` | Notification UI |
| AboutmeModal | `user/AboutmeModal.jsx` | About me modal |
| DetailsModal | `user/DetailsModal.jsx` | User details modal |
| HobiesModal | `user/HobiesModal.jsx` | Hobbies modal |
| GuideComponent | `user/GuideComponent.jsx` | User guide |
| PrivacyPolicyComponent | `user/PrivacyPolicyComponent.jsx` | Privacy policy |

### 3. **Posts & Feed** (9 components)

| Component | File | Purpose |
|-----------|------|---------|
| PostComponent | `post/PostComponent.jsx` | Single post display |
| PostTextBoxComponent | `post/PostTextBoxComponent.jsx` | Create post input |
| PostCommentBoxComponent | `post/PostCommentBoxComponent.jsx` | Comment input |
| CommentPostComponent | `post/CommentPostComponent.jsx` | Comment display |
| EditPostComponent | `post/EditPostComponent.jsx` | Edit post UI |
| ReelPostComponent | `post/ReelPostComponent.jsx` | Reels display |
| SharePostComponent | `post/SharePostComponent.jsx` | Share post UI |
| SwapPostComponent | `post/SwapPostComponent.jsx` | Swap/trade post |
| SavedSharesComponent | `post/SavedSharesComponent.jsx` | Saved posts list |

### 4. **Messages & Chat** (3 components)

| Component | File | Purpose |
|-----------|------|---------|
| MessagesComponent | `Messages/MessagesComponent.jsx` | Messages list |
| ChatComponent | `chat/ChatComponent.jsx` | Chat UI |
| chat | `chat/chat.js` | Chat utilities |

### 5. **Stories** (2 components)

| Component | File | Purpose |
|-----------|------|---------|
| StoriesComponent | `Stories/StoriesComponent.jsx` | Stories feed |
| DisplayComponent | `Stories/DisplayComponent.jsx` | Story viewer |

### 6. **Groups** (4 components)

| Component | File | Purpose |
|-----------|------|---------|
| GroupComponent | `group/GroupComponent.jsx` | Group display |
| CreateGroupComponent | `group/CreateGroupComponent.jsx` | Create group form |
| CreateGroupComponentMain | `group/CreateGroupComponentMain.jsx` | Group creation main |
| ViewGroupComponent | `group/ViewGroupComponent.jsx` | View group details |

### 7. **Sidebar Widgets** (4 components)

| Component | File | Purpose |
|-----------|------|---------|
| MenuWidgetComponent | `widgets/MenuWidgetComponent.jsx` | Navigation menu |
| FriendsWidgetComponent | `widgets/FriendsWidgetComponent.jsx` | Friends sidebar |
| FollowingWidgetComponent | `widgets/FollowingWidgetComponent.jsx` | Following list |
| GroupsWidgetComponent | `widgets/GroupsWidgetComponent.jsx` | Groups sidebar |

### 8. **Employee Management** (3 components)

| Component | File | Purpose |
|-----------|------|---------|
| CreateEmployeeComponent | `employee/CreateEmployeeComponent.jsx` | Create employee |
| ListEmployeeComponent | `employee/ListEmployeeComponent.jsx` | Employee list |
| ViewEmployeeComponent | `employee/ViewEmployeeComponent.jsx` | View employee details |

### 9. **SwapPoint (Trading)** (2 components)

| Component | File | Purpose |
|-----------|------|---------|
| SwapComponent | `SwapPoint/SwapComponent.jsx` | Swap item display |
| SwapComponents | `SwapPoint/SwapComponents.jsx` | Swap utilities |

### 10. **Hang Features** (5 components)

| Component | File | Purpose |
|-----------|------|---------|
| HangGiftComponent | `Hang/HangGiftComponent.jsx` | Gift UI |
| CheckoutComponent | `Hang/CheckoutComponent.jsx` | Checkout process |
| ShippingComponent | `Hang/ShippingComponent.jsx` | Shipping details |
| PayConfirmComponent | `Hang/PayConfirmComponent.jsx` | Payment confirmation |
| GeoLocator | `Hang/GeoLocator.jsx` | Geolocation |

### 11. **Profile Views** (3 components)

| Component | File | Purpose |
|-----------|------|---------|
| FriendProfileComponent | `Profile/FriendProfileComponent.jsx` | Friend's profile |
| FriendProfWidgtComponent | `Profile/FriendProfWidgtComponent.jsx` | Profile widget |
| PostProfileComponent | `Profile/PostProfileComponent.jsx` | Profile posts |

### 12. **Share Features** (1 component)

| Component | File | Purpose |
|-----------|------|---------|
| ShareItemComponent | `share/ShareItemComponent.jsx` | Share item UI |

### 13. **Account Settings** (7 components)

| Component | File | Purpose |
|-----------|------|---------|
| SecuritySettingsComponent | `AccountSettings/SecuritySettingsComponent.jsx` | Security settings |
| LocationComponent | `AccountSettings/LocationComponent.jsx` | Location settings |
| CurrentLocation | `AccountSettings/CurrentLocation.jsx` | Current location |
| LocSearchComponent | `AccountSettings/LocSearchComponent.jsx` | Location search |
| DropdownPrivacyComponent | `AccountSettings/DropdownPrivacyComponent.jsx` | Privacy dropdown |
| DropdownOnComponent | `AccountSettings/DropdownOnComponent.jsx` | On/Off toggle |
| DropdownLimitsComponent | `AccountSettings/DropdownLimitsComponent.jsx` | Limits dropdown |

### 14. **Root Components** (5 components)

| Component | File | Purpose |
|-----------|------|---------|
| LayoutComponent | `LayoutComponent.jsx` | Main layout wrapper |
| ProtectedRoute | `ProtectedRoute.jsx` | Auth-protected routes |
| Giphy | `Giphy.jsx` | Giphy integration |
| Stickers | `Stickers.jsx` | Sticker selector |
| Layout redunndnat | `Layout redunndnat.jsx` | Legacy layout (unused) |

### 15. **Chat Testing** (1 component)

| Component | File | Purpose |
|-----------|------|---------|
| ChatTestComponent | `ChatTest/ChatTestComponent.jsx` | Chat testing UI |

### 16. **Parent Hang** (1 component)

| Component | File | Purpose |
|-----------|------|---------|
| ParentGiftsComponent | `ParentHang/ParentGiftsComponent.jsx` | Parent gifts |

---

## 🎨 UI/UX Elements

### CSS Stylesheets (22 files)

| File | Size | Purpose |
|------|------|---------|
| `main.min.css` | 426KB | **Main stylesheet** (minified) |
| `style.css` | 285KB | Core UI styles |
| `responsive.css` | 36KB | Mobile responsive design |
| `notifications.css` | 15KB | Notification styles |
| `story.css` | 18KB | Stories UI |
| `strip.css` | 13KB | Strip layout |
| `emojionearea.min.css` | 22KB | Emoji picker |
| `message.css` | 5.4KB | Messages UI |
| `message_input.css` | 3.6KB | Message input |
| `color.css` | 4.3KB | Color palette |
| `searchbar.css` | 2.5KB | Search UI |
| `tile.css` | 1.7KB | Tile layout |
| `slider.css` | 1.5KB | Image slider |
| `globals.css` | 452B | Global styles |
| `styleguide.css` | 678B | Style guide |

### FontAwesome Icons

- **Location:** `css/fontawesome/`
- **Includes:** Full icon library

### Emoji Support

- **Location:** `css/emoji/`
- **Count:** 800+ emoji images
- **Format:** PNG

---

## 🔧 Services (API Integration)

| Service | File | Purpose |
|---------|------|---------|
| **Settings** | `services/Settings.js` | API base URL config |
| **PostService** | `services/PostService.js` | Posts CRUD |
| **UserService** | `services/UserService.js` | User operations |
| **MessageService** | `services/MessageService.js` | Messaging |
| **GroupService** | `services/GroupService.js` | Groups |
| **StoriesService** | `services/StoriesService.js` | Stories |
| **SearchService** | `services/SearchService.js` | Search |
| **ShareService** | `services/ShareService.js` | Share features |
| **EmployeeService** | `services/EmployeeService.js` | Employee mgmt |
| **Auth Services** | `services/auth.services.js` | Authentication |
| **Reels** | `services/Reels.service.js` | Reels |
| **Swap** | `services/swap.service.js` | Trading |
| **Hang Share** | `services/hangShare.service.js` | Hang features |
| **Chat** | `services/chat.service.js` | Chat |
| **Profile** | `services/profile.service.js` | Profile |
| **Story** | `services/story.service.js` | Story utilities |

**API Configuration:**

```javascript
// services/Settings.js - Current configuration
const settings = {
  dev: { apiUrl: "http://localhost:4001" },
  staging: { apiUrl: "https://staging.shareuptime.com" },
  prod: { apiUrl: "https://www.shareuptime.com" }
};
```

---

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm 8+
- PostgreSQL 14+

### Environment Setup

**Backend (.env):**
```bash
PORT=4001
DATABASE_URL=postgres://postgres:postgres@localhost:5432/shareup
JWT_SECRET=your_secret_here
API_BASE=/api/v1
```

**Frontend:**
Frontend automatically connects to backend based on Settings.js configuration.

### Development Commands

**Backend:**
```bash
npm run dev        # Start with nodemon
npm run migrate    # Run DB migrations
npm test          # Run tests
```

**Frontend:**

```bash
npm start         # Development server (port 3000)
npm run build     # Production build
npm test          # Run tests
```

---

## 📦 Deployment (Planned)

**Target:** Hostinger VPS / GitHub Pages  
**Backend:** Port 4001, Docker container  
**Frontend:** Static build served via nginx  
**Domain:** www.shareuptime.com

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

**Quick Deploy:**

```bash
npm run build
tar -czf build.tar.gz build/
scp build.tar.gz username@shareuptime.com:~/
ssh username@shareuptime.com "cd ~/public_html && tar -xzf ~/build.tar.gz --strip-components=1"
```text
---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[HOSTINGER-DEPLOY.md](./HOSTINGER-DEPLOY.md)** | Frontend deployment guide |
| **[BACKEND_ALIGNMENT_COMPLETE.md](./BACKEND_ALIGNMENT_COMPLETE.md)** | Backend integration report |
| **[BACKEND_COMPARISON.md](./BACKEND_COMPARISON.md)** | API endpoint coverage |
| **[MIGRATION-COMPLETE.md](./MIGRATION-COMPLETE.md)** | Migration summary |
| **backend-legacy/LEGACY_README.md** | Legacy backend (archived) |

---

## 🔐 Backend API

**Base URL:** `<https://www.shareuptime.com/api`>  
**Shared with:** Mobile App (iOS/Android)  
**Endpoints:** 60+ API endpoints

### Key Endpoints

- `POST /api/auth/login` - Authentication
- `GET /api/posts` - Feed
- `POST /api/posts` - Create post
- `GET /api/messages/conversations` - Messages
- `GET /api/notifications` - Notifications
- `POST /api/groups` - Create group
- `GET /api/stories` - Stories

See mobile app docs: <https://github.com/Shareup-dev/Shareup-Mobile-App-CLI/blob/dev/docs/>

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login/Registration
- [ ] Create post (text, image, video)
- [ ] View feed
- [ ] Comment on post
- [ ] Send message
- [ ] Create group
- [ ] Upload story
- [ ] Real-time notifications

---

## 👥 Team & Contribution

**Important:** This codebase represents **3-4 years of frontend development work**.

**Contribution Guidelines:**
- UI/UX components are STABLE — do not modify without explicit approval
- All API calls go through `services/` layer
- Follow existing component structure
- Test on mobile devices (responsive design)

---

## 📈 Project Metrics

- **Total Components:** 84
- **Lines of Code:** 31,494 (components only)
- **CSS Stylesheets:** 22 files
- **Services:** 16 API integrations
- **Assets:** 362 images/icons
- **Development Time:** 3-4 years
- **Technology:** React 17, Redux, React Router

---

## 🔗 Related Repositories

- **Mobile App:** [Shareup-Mobile-App-CLI](https://github.com/Shareup-dev/Shareup-Mobile-App-CLI)
- **Backend:** Centralized at <www.shareuptime.com> (included in this repo at `/backend`)

---

## 📚 Documentation

- **[PROJECT_DOCS.md](PROJECT_DOCS.md)** - Comprehensive documentation (setup, API, development)
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture & design patterns
- **[COMPONENT_CATALOG.md](COMPONENT_CATALOG.md)** - Complete component inventory
- **[SECURITY.md](SECURITY.md)** - Security guidelines and best practices
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment procedures

---

**Repository:** [ruhaverse/firat-yagmur](https://github.com/ruhaverse/firat-yagmur)  
**Contact:** info@shareuptime.com  
**Last Updated:** January 13, 2026

---

## 📞 Support

For issues or questions:

1. Check [PROJECT_DOCS.md](PROJECT_DOCS.md) documentation
2. Search [GitHub Issues](https://github.com/ruhaverse/firat-yagmur/issues)
3. Contact: info@shareuptime.com

---

## 🔄 Recent Updates

### January 2026 - Repository Migration & Architecture
- ✅ **Repository Migration**: Moved to ruhaverse/firat-yagmur
- ✅ **Backend Domains**: Implemented 13-domain architecture
- ✅ **Friends System**: Full CRUD + request management (8 endpoints)
- ✅ **New Domains**: Groups, newsFeed, stories added
- ✅ **Frontend Fixes**: User display normalization (snake_case → camelCase)
- ✅ **Documentation**: Updated all docs with current info
- ✅ **Environment**: Created .env.example for backend

### November 2025 - Code Quality & Documentation
- ✅ **React Modernization**: Deprecated APIs removed (findDOMNode, string refs)
- ✅ **ESLint Cleanup**: Critical warnings fixed (missing keys, unused imports)
- ✅ **Markdown Formatting**: 126 → 5 linting errors (all documentation)
- ✅ **Build Status**: Production build successful, zero breaking changes
- ✅ **Security**: Backend SQL injection protection verified, bcrypt+JWT secure

---

**Happy Coding! 🚀**

---

**Last Updated:** 16 Kasım 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Frontend:** <https://shareuptime.com>  
**Backend API:** <https://www.shareuptime.com/api>

