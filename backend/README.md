# Backend API Documentation - AI Website Builder

Complete documentation for the Express.js backend API server.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Database Models](#database-models)
- [AI Integration](#ai-integration)
- [Error Handling](#error-handling)
- [Deployment](#deployment)

## 🎯 Overview

The backend is a RESTful API built with Express.js that provides:

- User authentication and authorization
- Project CRUD operations
- AI-powered website generation (OpenAI GPT)
- Community project sharing
- Credit system management
- Conversation and version tracking

### Key Features

- **Layered Architecture**: Routes → Controllers → Services → Models
- **JWT Authentication**: Secure token-based auth
- **MongoDB Integration**: Mongoose ODM
- **AI Integration**: OpenAI GPT for code generation
- **Error Handling**: Centralized error middleware
- **Static File Serving**: Serves frontend build

## 🏗️ Architecture

The backend follows a **layered architecture** pattern:

```
backend/
├── api/                    # API modules
│   ├── auth/              # Authentication module
│   │   ├── auth.routes.js    # Route definitions
│   │   ├── auth.controller.js # Request handlers
│   │   └── auth.service.js    # Business logic
│   ├── projects/          # Projects module
│   │   ├── projects.routes.js
│   │   ├── projects.controller.js
│   │   └── projects.service.js
│   ├── user/              # User module
│   │   ├── user.routes.js
│   │   ├── user.controller.js
│   │   └── user.service.js
│   └── ai/                # AI service
│       └── ai.service.js
├── models/                # Mongoose schemas
│   ├── User.js
│   ├── Project.js
│   ├── Conversation.js
│   └── Version.js
├── middleware/            # Express middleware
│   ├── auth.js            # JWT authentication
│   └── errorHandler.js    # Error handling
├── config/                # Configuration
│   └── database.js        # MongoDB connection
├── utils/                 # Utilities
│   └── generateToken.js  # JWT token generation
├── scripts/               # Utility scripts
│   ├── seed.js           # Database seeding
│   └── seedFromJSON.js
└── server.js              # Express app entry point
```

### Architecture Flow

```
Request → Routes → Controller → Service → Model → Database
                ↓
            Response ← Controller ← Service ← Model
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **MongoDB** - Database
- **Mongoose 8.0.3** - ODM (Object Document Mapper)
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcryptjs 2.4.3** - Password hashing
- **OpenAI 4.20.1** - AI code generation
- **dotenv 16.3.1** - Environment variables
- **cors 2.8.5** - Cross-origin resource sharing

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or higher
- MongoDB (local or MongoDB Atlas)
- OpenAI API key

### Installation

```bash
# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-website-builder
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-website-builder

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend (optional - leave empty for same-origin)
FRONTEND_URL=http://localhost:5173

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Running the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

### Health Check

Test the server:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📡 API Endpoints

For complete API documentation, see [API_ENDPOINTS.md](./API_ENDPOINTS.md).

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Project Endpoints

- `GET /api/projects` - Get user's projects (protected)
- `GET /api/projects/community` - Get published projects (public)
- `GET /api/projects/:id` - Get single project (protected, owner only)
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected, owner only)
- `PATCH /api/projects/:id/publish` - Toggle publish status (protected, owner only)
- `DELETE /api/projects/:id` - Delete project (protected, owner only)

### User Endpoints

- `GET /api/user/credits` - Get user credits (protected)
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)
- `PATCH /api/user/credits/increment` - Increment credits (protected)
- `PATCH /api/user/credits/decrement` - Decrement credits (protected)

## 🔐 Authentication

### JWT Tokens

The API uses JSON Web Tokens (JWT) for authentication.

**Token Structure**:
```json
{
  "userId": "user_id_here",
  "email": "user@example.com"
}
```

**Token Expiration**: 7 days (configurable via `JWT_EXPIRES_IN`)

### Protected Routes

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### Authentication Middleware

**Location**: `backend/middleware/auth.js`

```javascript
import { protect } from '../middleware/auth.js'

router.get('/projects', protect, projectsController.getProjects)
```

**What it does**:
1. Extracts token from Authorization header
2. Verifies token signature
3. Attaches user to `req.user`
4. Returns 401 if invalid/missing

## 🗄️ Database Models

### User Model

**Location**: `backend/models/User.js`

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  credits: Number (default: 20),
  totalCreation: Number (default: 0),
  emailVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Methods**:
- `matchPassword(password)` - Compare password with hash

### Project Model

**Location**: `backend/models/Project.js`

```javascript
{
  name: String (required),
  initialPrompt: String (required),
  currentCode: String,
  currentVersionIndex: String,
  userId: ObjectId (ref: User),
  isPublished: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Conversation Model

**Location**: `backend/models/Conversation.js`

```javascript
{
  role: String (enum: 'user' | 'assistant', required),
  content: String (required),
  projectId: ObjectId (ref: Project),
  timestamp: Date
}
```

### Version Model

**Location**: `backend/models/Version.js`

```javascript
{
  code: String (required),
  description: String,
  projectId: ObjectId (ref: Project),
  timestamp: Date
}
```

## 🤖 AI Integration

### AI Service

**Location**: `backend/api/ai/ai.service.js`

The AI service integrates with OpenAI GPT to:
- Generate HTML code from user prompts
- Modify existing HTML code based on requests
- Create descriptive summaries of changes

### Functions

**`createProjectWithAI(userPrompt)`**
- Enhances user prompt
- Generates HTML code
- Returns HTML code and summary message

**`modifyProjectWithAI(currentHTML, userRequest)`**
- Enhances modification request
- Modifies HTML code
- Returns updated HTML and summary message

### System Prompts

System prompts are defined in `backend/api/ai/ai.service.js`:
- Prompt enhancement prompts
- Code generation prompts
- Summary generation prompts

### Credit Deduction

- **Project Creation**: Deducts 5 credits
- **Project Modification**: No credit deduction (free)
- **Insufficient Credits**: Returns error before AI call

## ⚠️ Error Handling

### Error Handler Middleware

**Location**: `backend/middleware/errorHandler.js`

Centralized error handling middleware.

**Error Format**:
```json
{
  "success": false,
  "message": "Error message here"
}
```

**HTTP Status Codes**:
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Types

- **Validation Errors**: Missing required fields
- **Authentication Errors**: Invalid/missing token
- **Authorization Errors**: Insufficient permissions
- **Database Errors**: MongoDB connection/query errors
- **AI Errors**: OpenAI API failures

## 🔧 Development

### Project Structure Best Practices

1. **Routes** (`*.routes.js`): Define endpoints only
2. **Controllers** (`*.controller.js`): Handle HTTP requests/responses
3. **Services** (`*.service.js`): Business logic and database operations
4. **Models** (`*.js` in `models/`): Database schemas

### Adding a New Endpoint

1. **Define Route** in `*.routes.js`:
```javascript
router.post('/new-endpoint', protect, controller.newEndpoint)
```

2. **Create Controller** in `*.controller.js`:
```javascript
export const newEndpoint = async (req, res, next) => {
  try {
    const result = await service.newFunction(req.body, req.user._id)
    res.json({ success: true, data: result })
  } catch (error) {
    next(error)
  }
}
```

3. **Create Service** in `*.service.js`:
```javascript
export const newFunction = async (data, userId) => {
  // Business logic here
  const result = await Model.create(data)
  return result
}
```

### Database Seeding

**Seed Script**: `backend/scripts/seed.js`

```bash
npm run seed
```

Creates sample data for testing.

## 🌐 CORS Configuration

CORS is configured in `server.js`:

```javascript
const frontendUrl = process.env.FRONTEND_URL
if (frontendUrl) {
  app.use(cors({
    origin: frontendUrl,
    credentials: true,
  }))
} else {
  app.use(cors({
    origin: true, // Same origin
    credentials: true,
  }))
}
```

**For Production**:
- Leave `FRONTEND_URL` empty for same-origin deployment
- Set `FRONTEND_URL` if frontend is on separate domain

## 📦 Static File Serving

The backend serves the frontend build from `backend/public/`:

```javascript
app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'Route not found' })
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
```

## 🚀 Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed deployment instructions.

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use secure `JWT_SECRET`
- [ ] Configure MongoDB Atlas
- [ ] Set `OPENAI_API_KEY`
- [ ] Leave `FRONTEND_URL` empty (same-origin)
- [ ] Build frontend: `npm run build` (from root)
- [ ] Commit `backend/public/` folder
- [ ] Deploy to Render/Heroku/etc.

### Environment Variables for Production

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=secure-random-string
JWT_EXPIRES_IN=7d
FRONTEND_URL=
OPENAI_API_KEY=sk-...
```

## 🧪 Testing

### Manual Testing

Use Postman or curl to test endpoints:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Projects (with token)
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### API Documentation

See [API_ENDPOINTS.md](./API_ENDPOINTS.md) for complete endpoint documentation with examples.

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correct
- Check MongoDB is running (if local)
- Verify network access (if MongoDB Atlas)
- Check IP whitelist in MongoDB Atlas

### Authentication Issues

- Verify `JWT_SECRET` is set
- Check token format in Authorization header
- Verify token hasn't expired
- Check user exists in database

### AI Generation Issues

- Verify `OPENAI_API_KEY` is set correctly
- Check API key has credits/quota
- Review error logs for specific OpenAI errors
- Check network connectivity

### Static File Serving Issues

- Verify `backend/public/` folder exists
- Check `index.html` is in `backend/public/`
- Verify build was successful
- Check file permissions

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Documentation](https://jwt.io/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**Built with Express.js and MongoDB** 🚀
