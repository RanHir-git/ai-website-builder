# Deployment Guide for Render

This guide will help you deploy your AI Website Builder application to Render. The application uses a **single-service architecture** where the backend serves both the API and the frontend.

## Architecture Overview

- **Frontend**: React app built with Vite
- **Backend**: Express.js server serving API and static frontend files
- **Build Output**: Frontend builds to `backend/public/` directory
- **Deployment**: Single Render Web Service (backend only)
- **Same Origin**: Frontend and backend served from the same URL (no CORS issues)

## Prerequisites

1. **Render Account**: Sign up at https://render.com (free tier available)
2. **MongoDB Atlas Account**: Sign up at https://www.mongodb.com/cloud/atlas (free tier available)
3. **GitHub Repository**: Push your code to GitHub
4. **OpenAI API Key**: Get from https://platform.openai.com/account/api-keys

## Project Structure

```
ai-website-builder/
├── backend/
│   ├── public/              # Frontend build output (created by npm run build)
│   │   ├── index.html
│   │   └── assets/
│   ├── server.js           # Express server (serves API + static files)
│   ├── package.json
│   └── ...
├── src/                     # React frontend source
├── vite.config.js          # Builds to backend/public/
├── package.json            # Frontend dependencies
└── ...
```

---

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Remember username and password
4. Whitelist IP addresses:
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://username:password@cluster.mongodb.net/ai-website-builder`

---

## Step 2: Build Frontend Locally

**Important**: Build the frontend before deploying. The built files must be committed to git.

### 2.1 Build Frontend

From the project root directory:

```bash
npm run build
```

This command:
- Builds your React app using Vite
- Outputs files to `backend/public/` directory
- Creates `index.html`, `assets/`, and other static files

### 2.2 Verify Build Output

Check that `backend/public/` folder exists and contains:
- `index.html`
- `assets/` folder with JS and CSS files

```bash
# Check if build was successful
ls backend/public/
```

### 2.3 Commit Built Files

**Important**: The `backend/public/` folder must be committed to git so Render can deploy it.

```bash
git add backend/public/
git commit -m "Build frontend for production"
git push
```

**Note**: Make sure `backend/public/` is NOT in `.gitignore`. If it is, remove it.

---

## Step 3: Deploy Backend to Render

### 3.1 Create Web Service

1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Select the repository containing your project

### 3.2 Configure Service Settings

Configure the service with these exact settings:

- **Name**: `ai-website-builder` (or your choice)
- **Root Directory**: `backend` ⚠️ **CRITICAL: Must be `backend`**
- **Environment**: `Node`
- **Build Command**: `npm install` ⚠️ **Just `npm install` - frontend is already built**
- **Start Command**: `npm start` ⚠️ **Just `npm start`**
- **Plan**: Free (or paid if you need more resources)

**Why these settings?**
- **Root Directory**: `backend` tells Render to work only with the backend folder
- **Build Command**: Only installs backend dependencies (frontend is pre-built and committed)
- **Start Command**: Starts the Express server which serves both API and frontend

### 3.3 Set Environment Variables

In Render dashboard, go to your service → "Environment" tab, add these variables:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-website-builder
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random-and-secure
JWT_EXPIRES_IN=7d
FRONTEND_URL=
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Important Notes:**
- `NODE_ENV`: **Must be `production`** - This tells the app it's in production mode
- `PORT`: Render uses port 10000 (or set via `process.env.PORT` in your code)
- `MONGODB_URI`: Your MongoDB Atlas connection string from Step 1
- `JWT_SECRET`: Generate a random secure string (use: `openssl rand -base64 32`)
- `JWT_EXPIRES_IN`: Token expiration (e.g., `7d` for 7 days)
- `FRONTEND_URL`: **Leave empty** - frontend is served from same origin
- `OPENAI_API_KEY`: Your OpenAI API key (starts with `sk-`)

**⚠️ Important**: If you see `Environment: development` in the logs after deployment, add `NODE_ENV=production` to your environment variables and redeploy.

### 3.4 Deploy

**Before clicking "Create Web Service"**, make sure you've added all environment variables (especially `NODE_ENV=production`).

Click "Create Web Service". Render will:
1. Clone your repository
2. Navigate to `backend/` directory
3. Run `npm install` (installs backend dependencies)
4. Start server with `npm start`
5. Your app will be live at: `https://your-service-name.onrender.com`

**After deployment, check the logs:**
- Go to your service → "Logs" tab
- You should see: `Environment: production`
- If you see `Environment: development`, go back to "Environment" tab and add `NODE_ENV=production`

---

## Step 4: Verify Deployment

### 4.1 Check Service Status

1. Go to Render Dashboard → Your Service
2. Check "Events" tab for deployment status
3. Wait for "Deploy succeeded" message

### 4.2 Test Your Application

1. Visit your Render URL: `https://your-service-name.onrender.com`
2. You should see your frontend homepage
3. Test API endpoints:
   - Health check: `https://your-service-name.onrender.com/api/health`
   - Should return: `{"success": true, "message": "Server is running", ...}`

### 4.3 Test Functionality

1. **Register/Login**: Create a new account or login
2. **Create Project**: Use "Create with AI" button
3. **View Projects**: Check "My Projects" page
4. **Community**: Browse published projects

---

## Development Workflow

### Local Development

**Terminal 1 - Frontend (dev server):**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173` (Vite default)

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

**Note**: For local dev, frontend uses `http://localhost:3000/api` for API calls (configured in `src/services/api.js`).

### Production Deployment Workflow

Every time you make changes:

1. **Build frontend:**
   ```bash
   npm run build
   ```

2. **Commit and push:**
   ```bash
   git add backend/public/
   git commit -m "Update frontend build"
   git push
   ```

3. **Render auto-deploys:**
   - Render detects the push
   - Pulls latest code (including `backend/public/`)
   - Runs `npm install` in `backend/` directory
   - Restarts server with `npm start`
   - Your changes are live!

---

## How It Works

### Build Process

1. **Local**: `npm run build` → Creates `backend/public/` with built frontend
2. **Git**: Commit `backend/public/` → Built files are in repository
3. **Render**: Pulls repo → Gets `backend/public/` folder
4. **Render**: Runs `npm install` → Installs backend dependencies only
5. **Render**: Runs `npm start` → Starts Express server

### Server Configuration

The Express server (`backend/server.js`) serves:

1. **API Routes**: `/api/*`
   - `/api/auth/*` - Authentication endpoints
   - `/api/projects/*` - Project CRUD endpoints
   - `/api/user/*` - User endpoints

2. **Static Files**: `/assets/*`, `/index.html`, etc.
   - Served from `backend/public/` directory
   - Handled by `express.static()`

3. **Frontend Routes**: `/*` (all other routes)
   - Serves `backend/public/index.html`
   - React Router handles client-side routing

### Same-Origin Benefits

Since frontend and backend are on the same origin:
- ✅ No CORS configuration needed
- ✅ Cookies work automatically
- ✅ Simpler authentication flow
- ✅ Single URL to remember

---

## Troubleshooting

### Backend Issues

**Problem**: Service fails to start
- **Check**: Build logs in Render dashboard
- **Solution**: Verify `Root Directory` is set to `backend`
- **Solution**: Verify `Start Command` is `npm start`

**Problem**: "Cannot connect to MongoDB" or login/projects not working
- **Step 1**: Check Render logs for MongoDB connection errors
  - Go to Render Dashboard → Your Service → "Logs" tab
  - Look for: `✅ MongoDB Connected:` (success) or `❌ Error connecting to MongoDB:` (failure)
- **Step 2**: Verify `MONGODB_URI` environment variable is set
  - Go to Render Dashboard → Your Service → "Environment" tab
  - Check `MONGODB_URI` exists and is correct
  - Format: `mongodb+srv://username:password@cluster.mongodb.net/ai-website-builder`
  - Replace `<password>` with actual password (no angle brackets)
  - Include database name at end (`/ai-website-builder`)
- **Step 3**: Check MongoDB Atlas Network Access
  - Go to MongoDB Atlas → "Network Access"
  - Click "Add IP Address"
  - Click "Allow Access from Anywhere" (0.0.0.0/0)
  - Or add Render's specific IPs if you prefer
- **Step 4**: Verify MongoDB user credentials
  - Go to MongoDB Atlas → "Database Access"
  - Check username and password match your connection string
  - Make sure user has read/write permissions
- **Step 5**: Test connection string locally
  - Copy your `MONGODB_URI` from Render
  - Test with MongoDB Compass or `mongosh` to verify it works

**Problem**: "OPENAI_API_KEY is not set"
- **Check**: Environment variable is set in Render dashboard
- **Check**: No extra spaces in the API key value
- **Solution**: Redeploy after adding environment variable

**Problem**: Port error
- **Check**: `backend/server.js` uses `process.env.PORT || 3000`
- **Solution**: Render automatically sets `PORT` environment variable

### Frontend Issues

**Problem**: Frontend shows blank page
- **Check**: `backend/public/index.html` exists in git
- **Check**: Build was successful (`npm run build`)
- **Solution**: Rebuild and recommit `backend/public/`

**Problem**: API calls fail
- **Check**: API base URL in `src/services/api.js`
- **Check**: Should use relative URLs (`/api/...`) for same-origin
- **Solution**: No `VITE_API_URL` needed for same-origin deployment

**Problem**: 404 errors on frontend routes
- **Check**: `backend/server.js` has catch-all route `app.get('*', ...)`
- **Check**: Route serves `backend/public/index.html`
- **Solution**: Verify server.js configuration

### Build Issues

**Problem**: Build outputs to wrong location
- **Check**: `vite.config.js` has `outDir: path.resolve(__dirname, 'backend/public')`
- **Solution**: Verify vite.config.js is correct

**Problem**: `backend/public/` not in git
- **Check**: `.gitignore` doesn't include `backend/public`
- **Solution**: Remove `backend/public` from `.gitignore` if present

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | Yes | Environment mode | `production` |
| `PORT` | Yes | Server port (auto-set by Render) | `10000` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | Secret for JWT tokens | Random string |
| `JWT_EXPIRES_IN` | Yes | Token expiration time | `7d` |
| `FRONTEND_URL` | No | Frontend URL (empty for same-origin) | (leave empty) |
| `OPENAI_API_KEY` | Yes | OpenAI API key | `sk-...` |

---

## Render URLs

After deployment, you'll get ONE URL:
- **Application**: `https://your-service-name.onrender.com`
  - Frontend: `https://your-service-name.onrender.com`
  - API: `https://your-service-name.onrender.com/api/*`

**Note**: Free tier services spin down after 15 minutes of inactivity and take ~30 seconds to wake up.

---

## Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB user created and IP whitelisted
- [ ] Frontend built locally: `npm run build`
- [ ] `backend/public/` folder exists and contains files
- [ ] Built files committed to git: `git add backend/public/ && git commit && git push`
- [ ] Render service created
- [ ] Root Directory set to: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] All environment variables set in Render
- [ ] Service deployed successfully
- [ ] Frontend loads at Render URL
- [ ] API health check works: `/api/health`
- [ ] Registration/login works
- [ ] Project creation works
- [ ] Everything works! 🎉

---

## Next Steps

1. **Custom Domain**: Add your own domain in Render dashboard
2. **Auto-Deploy**: Already enabled - pushes to main branch auto-deploy
3. **Monitoring**: Check logs in Render dashboard for errors
4. **Upgrade**: Consider paid plan for better performance (no spin-down)

---

## Common Mistakes to Avoid

❌ **Don't** set Build Command to `npm install && npm run build` (frontend is pre-built)
✅ **Do** set Build Command to `npm install` only

❌ **Don't** set Root Directory to `.` or leave empty
✅ **Do** set Root Directory to `backend`

❌ **Don't** create separate frontend service
✅ **Do** use single backend service (serves both)

❌ **Don't** forget to commit `backend/public/` folder
✅ **Do** commit built files after every `npm run build`

❌ **Don't** set `FRONTEND_URL` to a separate URL
✅ **Do** leave `FRONTEND_URL` empty (same origin)

---

## Support

If you encounter issues:
1. Check Render deployment logs
2. Check MongoDB Atlas connection
3. Verify all environment variables are set
4. Test locally first: `npm run build && cd backend && npm start`

For more help, check:
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Express.js Docs: https://expressjs.com
