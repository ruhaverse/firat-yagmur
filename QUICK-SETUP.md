# 🚀 ShareUpTime Website - Quick Setup Guide

This guide will help you get started with the ShareUpTime website project in minutes.

---

## ⚡ Quick Installation

### Step 1: Prerequisites

Make sure you have installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 8+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 8.x or higher
git --version     # Should show 2.x or higher
```

---

### Step 2: Clone & Install

```bash
# If not already cloned
git clone https://github.com/ruhaverse/firat-yagmur.git
cd firat-yagmur

# Install frontend dependencies
cd Shareup-frontend
npm install

# This will take 2-5 minutes
```

---

### Step 3: Start Development Server

```bash
# Make sure you're in Shareup-frontend directory
cd Shareup-frontend

# Start the development server
npm start

# The website will open automatically at http://localhost:3000
# If not, open your browser and go to: http://localhost:3000
```

---

## 🎯 What to Expect

### First Time Running

When you run `npm start`:
1. ✅ Webpack will compile the application
2. ✅ Development server starts on port 3000
3. ✅ Browser opens automatically
4. ✅ You'll see the ShareUpTime landing page

### Development Server Features

- **Hot Reload** - Changes appear instantly
- **Error Overlay** - See errors in the browser
- **Console Logging** - Debug info in browser console
- **Network Requests** - API calls to shareuptime.com

---

## 📁 Project Navigation

### Key Directories

```
Shareup-frontend/
├── src/
│   ├── components/     👈 Start here - All React components
│   │   ├── user/       - User profile, newsfeed, friends
│   │   ├── post/       - Post creation, comments
│   │   ├── dashboard/  - Header, footer, navigation
│   │   └── ...         - 16 total categories
│   │
│   ├── services/       👈 API calls
│   │   ├── Settings.js - API configuration
│   │   ├── UserService.js
│   │   ├── PostService.js
│   │   └── ...         - 16 service files
│   │
│   ├── css/           👈 Styling
│   │   ├── style.css   - Main styles
│   │   ├── main.min.css
│   │   └── ...         - 22 CSS files
│   │
│   ├── images/        👈 Assets (362 files)
│   ├── App.js         👈 Main application component
│   └── index.js       - Entry point
│
├── public/            - Static files
├── package.json       👈 Dependencies
└── README.md         - Original documentation
```

---

## 🔧 Common Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests (if configured)
npm test

# Install new package
npm install package-name

# Update dependencies
npm update
```

---

## 🌐 API Configuration

The website connects to the live API at `shareuptime.com`.

**File:** `src/services/Settings.js`

```javascript
const settings = {
  dev: { apiUrl: "http://localhost:8080" },      // Local backend
  staging: { apiUrl: "https://staging.shareuptime.com" },
  prod: { apiUrl: "https://www.shareuptime.com" }  // Production (default)
};
```

**Current:** Using **production** API (www.shareuptime.com)

---

## 📱 Testing Mobile Responsive

The website is mobile-first and responsive.

### Test in Chrome DevTools:

1. Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Click "Toggle Device Toolbar" icon or press `Ctrl+Shift+M`
3. Select different device sizes:
   - iPhone 12 Pro
   - iPad Pro
   - Galaxy S20
   - Custom sizes

---

## 🎨 Key Features to Explore

1. **Landing Page** - `/` - Main landing page
2. **Newsfeed** - `/newsfeed` - Social feed
3. **Profile** - `/profile` - User profile
4. **Messages** - `/messages` - Chat interface
5. **Groups** - `/groups` - Group management
6. **Stories** - `/stories` - Story viewer
7. **SwapPoint** - `/swap` - Trading marketplace

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
PORT=3001 npm start
```

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Cannot find module errors

**Solution:**
```bash
# Make sure you're in the right directory
cd Shareup-frontend

# Reinstall dependencies
npm install
```

### Issue: CORS errors in console

**Expected:** This is normal. The API at shareuptime.com handles CORS.

If you see authentication errors, that's expected for a local development environment connecting to production API.

---

## 📚 Next Steps

### Learn the Codebase

1. **Read the documentation:**
   - [COMPONENT_CATALOG.md](../COMPONENT_CATALOG.md) - All components explained
   - [PROJECT_DOCS.md](../PROJECT_DOCS.md) - Comprehensive guide
   - [README.md](README.md) - Original README

2. **Explore components:**
   - Start with `src/components/user/NewsfeedComponent.jsx`
   - Check `src/components/dashboard/HeaderComponent.jsx`
   - Review `src/App.js` for routing

3. **Understand services:**
   - Open `src/services/Settings.js`
   - Check `src/services/UserService.js`
   - Review API calls in service files

### Make Your First Change

1. **Edit a component:**
   ```javascript
   // File: src/components/dashboard/HeaderComponent.jsx
   // Find the header text and change it
   <h1>ShareUpTime</h1>  // Change to your text
   ```

2. **Save the file** - Changes appear instantly!

3. **Check the browser** - See your changes live

---

## 🎓 Learning Resources

### React
- [React Documentation](https://react.dev/)
- [React Tutorial](https://react.dev/learn)

### Redux
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Redux Fundamentals](https://redux.js.org/tutorials/fundamentals/part-1-overview)

### React Router
- [React Router v6](https://reactrouter.com/)

---

## 💡 Development Tips

### Hot Reload

- ✅ **JavaScript changes** - Instant reload
- ✅ **CSS changes** - Instant update
- ⚠️ **Config changes** - Requires restart

### Console Logging

```javascript
// Debug in components
console.log('Data:', data);

// Check props
console.log('Props:', props);

// Network calls
console.log('API Response:', response);
```

### React DevTools

Install the React Developer Tools browser extension:
- [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

---

## ✅ Verification Checklist

After installation, verify:

- [ ] `npm install` completed without errors
- [ ] Development server starts with `npm start`
- [ ] Browser opens to `http://localhost:3000`
- [ ] Landing page loads correctly
- [ ] Console shows no critical errors
- [ ] Changes to code appear in browser
- [ ] Responsive design works (test with DevTools)

---

## 🆘 Getting Help

If you encounter issues:

1. **Check the documentation:**
   - [README-TRANSFER.md](../README-TRANSFER.md)
   - [PROJECT_DOCS.md](../PROJECT_DOCS.md)

2. **Check console for errors:**
   - Press F12 in browser
   - Look at Console tab
   - Look at Network tab for API issues

3. **Common solutions:**
   - Clear cache: `npm cache clean --force`
   - Reinstall: `rm -rf node_modules && npm install`
   - Restart: Stop server and run `npm start` again

---

## 🎉 Success!

You're all set! You now have:
- ✅ Complete ShareUpTime website code
- ✅ Development environment running
- ✅ 84 React components to explore
- ✅ Hot reload for instant feedback
- ✅ Access to all documentation

**Happy Coding! 🚀**

---

**Last Updated:** November 12, 2025  
**Status:** Ready for Development