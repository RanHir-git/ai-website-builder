# Backend Setup Guide

## Quick Start

1. **Install MongoDB**
   - Download and install MongoDB from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   - Start MongoDB service (if using local installation)

2. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your settings
   # Make sure to change JWT_SECRET to a secure random string
   ```

4. **Start the Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify Installation**
   - Open http://localhost:3000/api/health
   - You should see: `{"success":true,"message":"Server is running",...}`

## MongoDB Setup Options

### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ai-website-builder`

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

## Testing the API

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get User Projects (requires token)
```bash
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Integration

To connect your frontend to the backend:

1. **Update Frontend Environment**
   - Create/update `.env` file in project root:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

2. **Switch to Remote Service**
   - Update imports in your components to use `projectService.Remote.js` instead of `projectService.local.js`
   - Update `authService.js` instead of `authService.local.js`

3. **Start Both Servers**
   - Backend: `cd backend && npm run dev`
   - Frontend: `npm run dev`

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Verify network/firewall settings

### CORS Errors
- Make sure `FRONTEND_URL` in `.env` matches your frontend URL
- Default is `http://localhost:5173` (Vite default)

### Authentication Errors
- Make sure JWT_SECRET is set in `.env`
- Tokens expire after 7 days by default (configurable via JWT_EXPIRES_IN)

### Port Already in Use
- Change `PORT` in `.env` to a different port
- Or stop the process using port 3000
