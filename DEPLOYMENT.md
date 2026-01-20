# Deployment Guide for Render

This guide will help you deploy your AI Website Builder application to Render.

## Prerequisites

1. **Render Account**: Sign up at https://render.com (free tier available)
2. **MongoDB Atlas Account**: Sign up at https://www.mongodb.com/cloud/atlas (free tier available)
3. **GitHub Repository**: Push your code to GitHub

## Monorepo Setup (Frontend + Backend in Same Repo)

**✅ You can deploy both from the same repo!** No need to separate them.

Your structure probably looks like:
```
your-repo/
├── backend/          (Node.js backend)
│   ├── server.js
│   ├── package.json
│   └── ...
├── src/              (React frontend)
├── package.json      (Frontend package.json)
└── ...
```

**Key Point**: Set the **Root Directory** correctly:
- **Backend service**: Set `Root Directory` to `backend`
- **Frontend service**: Leave `Root Directory` empty (or set to `.`)

This tells Render which part of your repo to use for each service.

---

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user (remember username and password)
4. Whitelist IP addresses:
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/ai-website-builder`

---

## Step 2: Deploy Backend to Render

### 2.1 Build Frontend Locally (Before Deploying)

**Important**: Build the frontend and commit the built files to git:

```bash
# From project root
npm run build
```

This creates `backend/public/` folder with the built frontend files.

**Commit the built files:**
```bash
git add backend/public/
git commit -m "Build frontend for production"
git push
```

### 2.2 Create Backend Service on Render

1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository (the one with both frontend and backend)
3. Configure the service:
   - **Name**: `ai-website-builder-backend` (or your choice)
   - **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
   - **Environment**: `Node`
   - **Build Command**: `npm install` ⚠️ **Just `npm install` - frontend is already built**
   - **Start Command**: `npm start` ⚠️ **Just `npm start`**
   - **Plan**: Free (or paid if you need more resources)

**Note**: Since your frontend and backend are in the same repo, setting **Root Directory** to `backend` tells Render to only work with the backend folder. The `backend/public/` folder (with built frontend) should already be committed to git.

**Workflow:**
1. ✅ Build frontend: `npm run build` (creates `backend/public/`)
2. ✅ Commit built files: `git add backend/public/ && git commit && git push`
3. ✅ Render auto-deploys (pulls latest code including `backend/public/`)
4. ✅ Backend serves both API and frontend from `backend/public/`

**Common Mistakes:**
- ❌ Build Command: `npm install; npm run build` (don't build on Render, build locally)
- ✅ Build Command: `npm install` (just install backend dependencies)
- ❌ Start Command: `npm start server:prod` (no such script exists)
- ✅ Start Command: `npm start`

### 2.2 Set Environment Variables

In Render dashboard, go to your backend service → "Environment" tab, add these:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-website-builder
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random-and-secure
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-app.onrender.com
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Important Notes:**
- `PORT` should be `10000` (Render's default) or use `process.env.PORT` in your code
- `MONGODB_URI` - Use your MongoDB Atlas connection string
- `JWT_SECRET` - Generate a random secure string (you can use: `openssl rand -base64 32`)
- `FRONTEND_URL` - Will be set after deploying frontend (update this later)
- `OPENAI_API_KEY` - Your OpenAI API key

### 2.3 Update Backend Code for Render

Make sure your `backend/server.js` uses `process.env.PORT`:

```javascript
const PORT = process.env.PORT || 3000
```

This should already be correct in your code.

---

## Step 3: Deploy Frontend to Render

### 3.1 Update Frontend API URL

Update `src/services/api.js` or wherever your API base URL is set:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
```

### 3.2 Create Frontend Service

1. Go to Render Dashboard → "New" → "Static Site"
2. Connect your GitHub repository (same repo as backend)
3. Configure the service:
   - **Name**: `ai-website-builder-frontend` (or your choice)
   - **Root Directory**: (leave empty - root of repo) ⚠️ **IMPORTANT: Leave empty for frontend**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add:
     ```
     VITE_API_URL=https://your-backend-app.onrender.com/api
     ```

**Note**: Replace `your-backend-app.onrender.com` with your actual backend URL from Step 2.

### 3.3 Alternative: Deploy Frontend as Web Service

If Static Site doesn't work, use Web Service:
- **Root Directory**: (leave empty - root of repo)
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx serve -s dist -l 10000`
- Add to root `package.json` dependencies: `"serve": "^14.2.0"` (if using Web Service)

---

## Step 4: Update Environment Variables

After both services are deployed:

1. **Update Backend** `FRONTEND_URL`:
   - Go to backend service → Environment
   - Update `FRONTEND_URL` to your frontend URL: `https://your-frontend-app.onrender.com`

2. **Update Frontend** `VITE_API_URL`:
   - Go to frontend service → Environment
   - Ensure `VITE_API_URL` is set to: `https://your-backend-app.onrender.com/api`

---

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Try creating a project
4. Check backend logs in Render dashboard if there are errors

---

## Troubleshooting

### Backend Issues

- **Port Error**: Make sure you're using `process.env.PORT || 3000`
- **MongoDB Connection**: Check your MongoDB Atlas connection string and IP whitelist
- **CORS Error**: Verify `FRONTEND_URL` in backend matches your frontend URL exactly

### Frontend Issues

- **API Calls Failing**: Check `VITE_API_URL` environment variable
- **Build Fails**: Check build logs in Render dashboard
- **404 Errors**: Make sure `Publish Directory` is set to `dist`

### Common Errors

1. **"Cannot connect to MongoDB"**
   - Check MongoDB Atlas IP whitelist includes Render IPs
   - Verify connection string has correct password

2. **"CORS error"**
   - Backend `FRONTEND_URL` must match frontend URL exactly (including https://)
   - Check backend CORS configuration

3. **"Environment variable not found"**
   - Make sure all environment variables are set in Render dashboard
   - Redeploy after adding new variables

---

## Render URLs

After deployment, you'll get URLs like:
- Backend: `https://ai-website-builder-backend.onrender.com`
- Frontend: `https://ai-website-builder-frontend.onrender.com`

**Note**: Free tier services spin down after 15 minutes of inactivity and take ~30 seconds to wake up.

---

## Next Steps

1. Set up custom domains (optional)
2. Enable auto-deploy from GitHub (already enabled by default)
3. Set up monitoring and alerts
4. Consider upgrading to paid plan for better performance

---

## Quick Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend service deployed on Render
- [ ] Backend environment variables set
- [ ] Frontend service deployed on Render
- [ ] Frontend environment variables set
- [ ] `FRONTEND_URL` updated in backend
- [ ] `VITE_API_URL` set in frontend
- [ ] Test registration/login
- [ ] Test project creation
- [ ] Everything works! 🎉
