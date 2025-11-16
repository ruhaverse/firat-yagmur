# ShareUpTime Frontend - React Application

This is the **frontend web application** for ShareUpTime social platform.

> 📘 **For complete documentation**, see [PROJECT_DOCS.md](../PROJECT_DOCS.md) in the root directory

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start
# Opens <http://localhost:3000>

# Build for production
npm run build
```text
---

## Technology Stack

- **React 17** with Create React App
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io** for real-time features

---

## Available Scripts

### `npm start`

Runs the app in development mode at <http://localhost:3000>

The page will reload if you make edits. Lint errors will appear in the console.

### `npm test`

Launches the test runner in interactive watch mode.

See [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and filenames include hashes.

See [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you eject, you cannot go back!**

If you are not satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

---

## Project Structure

```text
src/
├── components/      # 84 React components
├── services/        # API service layer (16 services)
├── contexts/        # React contexts (UserContext)
├── app/            # Redux store and slices
├── css/            # 22 stylesheets
├── images/         # Assets (362 files)
├── App.js          # Main app component
└── index.js        # Entry point
```text
---

## API Configuration

API endpoints are configured in `src/services/Settings.js`:

```javascript
const settings = {
  dev: { apiUrl: "<http://localhost:8080"> },
  staging: { apiUrl: "<https://staging.shareuptime.com"> },
  prod: { apiUrl: "<https://www.shareuptime.com"> }
};
```text
Currently using: **Production** (settings.prod)

---

## Key Features

- 👤 User authentication and profiles
- 📝 Posts and feed
- 💬 Real-time messaging
- 📸 Stories (24-hour content)
- 👥 Groups
- 🎬 Reels (short videos)
- 🔔 Notifications
- 🎁 SwapPoint trading
- 🏢 Employee management

---

## Learn More

- **Project Documentation:** [PROJECT_DOCS.md](../PROJECT_DOCS.md)
- **Component Catalog:** [COMPONENT_CATALOG.md](../COMPONENT_CATALOG.md)
- **Create React App docs:** <https://facebook.github.io/create-react-app/docs/getting-started>
- **React docs:** <https://reactjs.org/>

---

**For team onboarding, architecture details, and deployment guides, see [PROJECT_DOCS.md](../PROJECT_DOCS.md)**

