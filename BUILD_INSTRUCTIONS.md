# Build Instructions - Frontend + Backend Combined

This guide explains how to build the frontend and serve it from the backend.

## Overview

The frontend is built into `backend/public/` folder, and the backend serves both:
- API routes at `/api/*`
- Frontend static files at `/*` (all other routes)

## Build Process

### Option 1: Build Frontend Separately (Recommended for Development)

1. **Build the frontend:**
   ```bash
   npm run build
   ```
   This will create files in `backend/public/` folder.

2. **Start the backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Access the app:**
   - Frontend: `http://localhost:3000`
   - API: `http://localhost:3000/api/*`

### Option 2: Build from Backend Directory

From the `backend` directory:
```bash
npm run build:frontend
```

This will:
1. Go to parent directory
2. Install frontend dependencies
3. Build frontend to `backend/public/`

## For Render Deployment

### Backend Service Configuration:

- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build:frontend`
- **Start Command**: `npm start`

This will:
1. Install backend dependencies
2. Build frontend (which outputs to `backend/public/`)
3. Start the backend server (which serves files from `backend/public/`)

## Environment Variables

### Frontend Build Time:
- `VITE_API_URL` - Set to your backend URL (e.g., `https://your-backend.onrender.com/api`)
  - If not set, defaults to `http://localhost:3000/api`
  - For same-origin deployment, you can leave it empty (will use relative URLs)

### Backend Runtime:
- `FRONTEND_URL` - Only needed if frontend is on a different domain
- If frontend and backend are on the same origin, leave empty or set to `true`

## File Structure After Build

```
backend/
├── public/              (Frontend build output)
│   ├── index.html
│   ├── assets/
│   │   ├── index-xxx.js
│   │   └── index-xxx.css
│   └── ...
├── server.js            (Serves API + static files)
├── package.json
└── ...
```

## How It Works

1. **API Routes** (`/api/*`) are handled by Express routes
2. **Static Files** (`/assets/*`, etc.) are served from `backend/public/`
3. **Frontend Routes** (`/`, `/projects`, etc.) serve `index.html` (React Router handles client-side routing)

## Troubleshooting

### Frontend not loading:
- Check that `backend/public/index.html` exists
- Verify build completed successfully
- Check browser console for errors

### API calls failing:
- Check `VITE_API_URL` environment variable
- Verify CORS settings in backend
- Check network tab in browser dev tools

### 404 errors on frontend routes:
- Make sure the catch-all route (`app.get('*')`) is after API routes
- Verify `index.html` exists in `backend/public/`
