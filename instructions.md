# Desktop Grocery Delivery Management App - Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git
- Your existing ASP.NET Core Web API running and accessible

## Project Setup

### 1. Initialize the Project
```bash
# Navigate to your project directory
cd /home/zerows/Documents/3d\ car\ models/testDesktopApp

# Initialize package.json
npm init -y

# Install Electron
npm install --save-dev electron

# Install React and related dependencies
npm install react react-dom react-router-dom
npm install --save-dev @vitejs/plugin-react vite

# Install UI framework (Material-UI recommended)
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/x-data-grid

# Install state management
npm install @reduxjs/toolkit react-redux

# Install HTTP client for API calls
npm install axios

# Install real-time communication
npm install socket.io-client

# Install development tools
npm install --save-dev concurrently wait-on cross-env
```

### 2. Project Structure
Create the following folder structure:
```
testDesktopApp/
├── public/
│   └── index.html
├── src/
│   ├── main/           # Electron main process
│   │   └── main.js
│   ├── renderer/       # React app
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/   # API calls
│   │   ├── store/      # Redux store
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── preload/
│       └── preload.js
├── package.json
├── vite.config.js
└── electron-builder.yml
```

### 3. Configuration Files

#### package.json Scripts
Add these scripts to your package.json:
```json
{
  "main": "dist-electron/main.js",
  "scripts": {
    "dev": "concurrently \"npm run dev:vite\" \"npm run dev:electron\"",
    "dev:vite": "vite",
    "dev:electron": "wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .",
    "build": "vite build && electron-builder",
    "build:dir": "vite build && electron-builder --dir",
    "preview": "vite preview"
  }
}
```

#### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
})
```

### 4. Environment Configuration
Create `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 5. Core Features to Implement

#### Authentication
- Login page for store managers and staff
- JWT token management
- Role-based access control

#### Dashboard
- Order statistics
- Inventory alerts
- Delivery status overview
- Real-time notifications

#### Order Management
- Order list with filtering and sorting
- Order details view
- Status updates
- Print order receipts

#### Inventory Management
- Product catalog management
- Stock level monitoring
- Low stock alerts
- Bulk product updates

#### Delivery Management
- Assign orders to delivery staff
- Track delivery status
- Route optimization
- Delivery performance metrics

#### Customer Management
- Customer profiles
- Order history
- Support ticket management

### 6. API Integration Guidelines

#### HTTP Client Setup
Configure axios with your ASP.NET Core API:
```javascript
// src/renderer/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

#### Real-time Updates
Use SignalR client to connect with your ASP.NET Core API for real-time updates:
```bash
npm install @microsoft/signalr
```

### 7. Development Workflow

#### Start Development Server
```bash
npm run dev
```

#### Build for Production
```bash
npm run build
```

#### Testing
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev electron-builder

# Run tests
npm test
```

### 8. Deployment

#### Build Executable
```bash
# Install electron-builder
npm install --save-dev electron-builder

# Build for current platform
npm run build

# Build for specific platforms
npx electron-builder --linux
npx electron-builder --windows
npx electron-builder --mac
```

### 9. Integration with Existing Systems

#### ASP.NET Core Web API
- Ensure CORS is configured for the desktop app
- Implement proper authentication endpoints
- Set up SignalR hubs for real-time features

#### React Native App
- Consider sharing API service configurations
- Implement consistent data models
- Use similar state management patterns

### 10. Security Considerations
- Enable context isolation in Electron
- Implement proper CSP (Content Security Policy)
- Secure API endpoints with proper authentication
- Store sensitive data securely using Electron's safeStorage API

### 11. Performance Optimization
- Implement lazy loading for large datasets
- Use virtual scrolling for large lists
- Optimize bundle size with code splitting
- Enable hardware acceleration

## Next Steps
1. Set up the basic project structure
2. Implement authentication flow
3. Create the main dashboard
4. Build individual feature modules
5. Integrate with your existing ASP.NET Core API
6. Add real-time functionality
7. Test and optimize performance
8. Build and distribute the application

## Useful Resources
- [Electron Documentation](https://electronjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Vite Documentation](https://vitejs.dev/)
