# AI Website Builder - Backend API

Backend API server for the AI Website Builder application, built with Express.js and MongoDB.

## Features

- User authentication (register, login, JWT tokens)
- Project CRUD operations
- Community projects (published projects)
- Conversation history management
- Version control for projects
- MongoDB database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `backend` directory (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-website-builder
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=your-openai-api-key-here
```

**Note:** Get your OpenAI API key from https://platform.openai.com/api-keys (free tier available)

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires authentication)
- `POST /api/auth/logout` - Logout user (requires authentication)

### Projects

- `GET /api/projects` - Get all projects for current user (requires authentication)
- `GET /api/projects/community` - Get all published projects (public)
- `GET /api/projects/:id` - Get a single project (requires authentication, must be owner)
- `POST /api/projects` - Create a new project (requires authentication)
- `PUT /api/projects/:id` - Update a project (requires authentication, must be owner)
- `PATCH /api/projects/:id/publish` - Toggle publish status (requires authentication, must be owner)
- `DELETE /api/projects/:id` - Delete a project (requires authentication, must be owner)

### Health Check

- `GET /api/health` - Check if server is running

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Database Models

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `credits` (Number, default: 20)
- `totalCreation` (Number, default: 0)
- `emailVerified` (Boolean, default: false)
- `createdAt`, `updatedAt` (timestamps)

### Project
- `name` (String, required)
- `initialPrompt` (String, required)
- `currentCode` (String)
- `currentVersionIndex` (String)
- `userId` (ObjectId, reference to User)
- `isPublished` (Boolean, default: false)
- `createdAt`, `updatedAt` (timestamps)

### Conversation
- `role` (String, enum: 'user' | 'assistant', required)
- `content` (String, required)
- `projectId` (ObjectId, reference to Project)
- `timestamp` (Date)

### Version
- `code` (String, required)
- `description` (String)
- `projectId` (ObjectId, reference to Project)
- `timestamp` (Date)

## Error Handling

All errors are returned in the following format:
```json
{
  "success": false,
  "message": "Error message"
}
```

## CORS

CORS is configured to allow requests from the frontend URL specified in `FRONTEND_URL` environment variable.
