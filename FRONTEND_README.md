# Frontend Documentation - AI Website Builder

Complete documentation for the React frontend application.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Components](#components)
- [Pages](#pages)
- [Services](#services)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Build & Deployment](#build--deployment)

## 🎯 Overview

The frontend is a React Single Page Application (SPA) built with Vite. It provides a user interface for creating, editing, and managing AI-generated websites.

### Key Features

- **AI-Powered Creation**: Create websites from natural language prompts
- **Real-time Preview**: See changes instantly
- **Project Management**: Organize multiple projects
- **Community Gallery**: Browse published projects
- **User Authentication**: Secure login/registration
- **Responsive Design**: Works on all devices

## 🛠️ Tech Stack

- **React 18.2.0** - UI library
- **React Router 6.20.0** - Client-side routing
- **Vite 5.0.8** - Build tool and dev server
- **Tailwind CSS 3.4.19** - Utility-first CSS
- **Lucide React 0.562.0** - Icon library
- **Context API** - State management (no Redux)

## 📁 Project Structure

```
src/
├── assets/                 # Static assets
│   ├── fonts/             # Custom fonts
│   ├── imgs/              # Images and icons
│   ├── setup/             # Typography setup
│   └── styles/            # CSS files
│       ├── basics/        # Base styles
│       ├── cmps/          # Component styles
│       └── pages/         # Page styles
├── cmps/                  # Reusable components
│   ├── Header.jsx         # Navigation header
│   ├── Footer.jsx         # Footer component
│   ├── sidebar.jsx        # Project sidebar with chat
│   ├── EditorPanel.jsx    # Code editor panel
│   ├── projectPreview.jsx # Website preview iframe
│   ├── LoginModal.jsx     # Login modal
│   ├── SignupModal.jsx    # Registration modal
│   └── homepage/
│       └── hero.jsx       # Homepage hero section
├── pages/                 # Page components
│   ├── HomePage.jsx       # Landing page
│   ├── Project.jsx        # Project editor page
│   ├── MyProjectsPage.jsx # User's projects list
│   ├── CommunityPage.jsx  # Published projects gallery
│   ├── Preview.jsx        # Standalone preview page
│   ├── PricingPage.jsx    # Pricing information
│   ├── AboutPage.jsx      # About page
│   └── ContactPage.jsx    # Contact page
├── services/              # API service layer
│   ├── api.js             # Base API utilities
│   ├── authService.js     # Authentication service
│   ├── projectService.Remote.js # Project CRUD
│   └── userService.js     # User data service
├── contexts/              # React contexts
│   └── AuthContext.jsx    # Authentication context
├── utils/                 # Utility functions
│   └── cn.js              # Class name utility
├── App.jsx                # Main app component
└── main.jsx               # Entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
VITE_API_URL=http://localhost:3000/api
```

**Note**: If `VITE_API_URL` is not set, the app uses:
- Development: `http://localhost:3000/api`
- Production: `/api` (relative URL for same-origin)

### Build

```bash
# Build for production
npm run build
```

Output goes to `backend/public/` directory.

## 🧩 Components

### Header Component

**Location**: `src/cmps/Header.jsx`

Navigation header with:
- Logo and branding
- Navigation links
- User authentication status
- User credits display
- Login/Signup buttons

**Props**: None (uses AuthContext)

**Usage**:
```jsx
import Header from './cmps/Header'

function App() {
  return (
    <div>
      <Header />
      {/* rest of app */}
    </div>
  )
}
```

### Sidebar Component

**Location**: `src/cmps/sidebar.jsx`

Project sidebar with:
- Conversation history
- AI chat interface
- Modification request input
- Loading states

**Props**:
- `isMenuOpen` (boolean) - Sidebar visibility
- `project` (object) - Current project data
- `setProject` (function) - Update project state
- `isGenerating` (boolean) - AI generation status
- `setIsGenerating` (function) - Update generation status

**Usage**:
```jsx
<Sidebar
  isMenuOpen={isMenuOpen}
  project={project}
  setProject={setProject}
  isGenerating={isGenerating}
  setIsGenerating={setIsGenerating}
/>
```

### Project Preview Component

**Location**: `src/cmps/projectPreview.jsx`

Displays the generated website in an iframe.

**Props**:
- `htmlCode` (string) - HTML code to display
- `isGenerating` (boolean) - Loading state

**Usage**:
```jsx
<ProjectPreview htmlCode={project.currentCode} isGenerating={isGenerating} />
```

### Login/Signup Modals

**Location**: `src/cmps/LoginModal.jsx`, `src/cmps/SignupModal.jsx`

Modal dialogs for user authentication.

**Props**:
- `isOpen` (boolean) - Modal visibility
- `onClose` (function) - Close handler

**Usage**:
```jsx
<LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
```

## 📄 Pages

### HomePage

**Location**: `src/pages/HomePage.jsx`

Landing page with:
- Hero section with AI creation form
- Features showcase
- Call-to-action buttons

**Route**: `/`

**Key Features**:
- AI project creation form
- Credit validation
- Authentication check
- Redirect to new project on creation

### Project Page

**Location**: `src/pages/Project.jsx`

Main project editor page with:
- Sidebar for AI modifications
- Code editor panel
- Live preview
- Publish/unpublish functionality

**Route**: `/project/:id`

**Key Features**:
- Load project data
- AI-powered modifications
- Real-time preview updates
- Project publishing

### My Projects Page

**Location**: `src/pages/MyProjectsPage.jsx`

List of user's projects with:
- Project cards
- Delete functionality
- Navigation to project editor

**Route**: `/my-projects`

**Protected**: Yes (requires authentication)

### Community Page

**Location**: `src/pages/CommunityPage.jsx`

Gallery of published projects from all users.

**Route**: `/community`

**Protected**: No (public access)

## 🔌 Services

### API Service

**Location**: `src/services/api.js`

Base API utilities for making HTTP requests.

**Functions**:
- `apiRequest(endpoint, options)` - Generic request handler
- `get(endpoint)` - GET request
- `post(endpoint, data)` - POST request
- `put(endpoint, data)` - PUT request
- `del(endpoint)` - DELETE request
- `patch(endpoint, data)` - PATCH request

**Features**:
- Automatic JWT token injection
- Error handling
- Token cleanup on 401 errors

**Usage**:
```jsx
import { get, post } from '../services/api'

const data = await get('/projects')
const result = await post('/projects', { name: 'New Project' })
```

### Auth Service

**Location**: `src/services/authService.js`

Authentication-related API calls.

**Functions**:
- `register(userData)` - Register new user
- `login(credentials)` - Login user
- `logout()` - Logout user
- `getCurrentUser()` - Get current user from token

**Usage**:
```jsx
import { login, register } from '../services/authService'

const user = await login({ email: 'user@example.com', password: 'pass' })
```

### Project Service

**Location**: `src/services/projectService.Remote.js`

Project CRUD operations.

**Functions**:
- `getProjects()` - Get user's projects
- `getProject(id)` - Get single project
- `createProject(data)` - Create new project
- `updateProject(id, data)` - Update project
- `deleteProject(id)` - Delete project
- `togglePublish(id)` - Toggle publish status
- `getCommunityProjects()` - Get published projects

**Usage**:
```jsx
import { createProject, getProjects } from '../services/projectService.Remote'

const projects = await getProjects()
const newProject = await createProject({ name: 'My Site', initialPrompt: '...' })
```

## 🔄 State Management

### Auth Context

**Location**: `src/contexts/AuthContext.jsx`

Global authentication state management.

**Provider**: Wraps the entire app in `App.jsx`

**State**:
- `user` - Current user object
- `isAuthenticated` - Authentication status
- `loading` - Loading state

**Functions**:
- `login(credentials)` - Login user
- `register(userData)` - Register user
- `logout()` - Logout user
- `refreshUser()` - Refresh user data

**Usage**:
```jsx
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />
  }
  
  return <div>Welcome, {user.name}!</div>
}
```

### Local State

Components use React hooks for local state:
- `useState` - Component state
- `useEffect` - Side effects
- `useNavigate` - Navigation (React Router)

## 🛣️ Routing

**Location**: `src/App.jsx`

React Router configuration.

**Routes**:
- `/` - HomePage
- `/project/:id` - Project editor
- `/my-projects` - User's projects
- `/community` - Published projects
- `/preview/:id` - Standalone preview
- `/pricing` - Pricing page
- `/about` - About page
- `/contact` - Contact page

**Protected Routes**:
- `/project/:id` - Requires authentication
- `/my-projects` - Requires authentication

**Usage**:
```jsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Project from './pages/Project'

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/project/:id" element={<Project />} />
</Routes>
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling.

**Configuration**: `tailwind.config.js`

**Custom Classes**: Defined in component CSS files

### CSS Files Structure

```
src/assets/styles/
├── basics/          # Base styles
│   ├── base.css     # Reset and base styles
│   ├── layout.css    # Layout utilities
│   └── typography.css
├── cmps/            # Component styles
│   ├── Header.css
│   ├── Sidebar.css
│   └── ...
├── pages/            # Page styles
│   ├── HomePage.css
│   └── ...
└── main.css          # Main stylesheet
```

### Utility Function

**Location**: `src/utils/cn.js`

Utility for merging class names (similar to `clsx`).

**Usage**:
```jsx
import { cn } from '../utils/cn'

<div className={cn('base-class', isActive && 'active-class')} />
```

## 🏗️ Build & Deployment

### Development Build

```bash
npm run dev
```

- Hot Module Replacement (HMR)
- Fast refresh
- Source maps
- Runs on port 5173

### Production Build

```bash
npm run build
```

**Output**: `backend/public/`

**Build Process**:
1. Vite bundles React app
2. Optimizes assets
3. Outputs to `backend/public/`
4. Backend serves static files

### Build Configuration

**Location**: `vite.config.js`

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, 'backend/public'),
    emptyOutDir: true,
  },
})
```

### Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for production deployment.

**Quick Steps**:
1. `npm run build`
2. Commit `backend/public/`
3. Deploy backend (serves frontend automatically)

## 🔧 Development Tips

### Adding a New Component

1. Create component file in `src/cmps/`
2. Create CSS file in `src/assets/styles/cmps/`
3. Import and use in pages

### Adding a New Page

1. Create page file in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `Header.jsx`

### API Integration

1. Add service function in `src/services/`
2. Use in component with `useEffect` or event handlers
3. Handle loading and error states

### Styling Guidelines

- Use Tailwind utility classes when possible
- Create component CSS files for complex styles
- Follow existing naming conventions
- Keep styles modular

## 🐛 Common Issues

### API Calls Failing

- Check `VITE_API_URL` environment variable
- Verify backend is running
- Check browser console for CORS errors

### Build Errors

- Clear `node_modules` and reinstall
- Check Node.js version
- Verify all imports are correct

### Routing Issues

- Ensure React Router is properly configured
- Check route paths match exactly
- Verify protected routes have auth checks

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**Happy Coding! 🚀**
