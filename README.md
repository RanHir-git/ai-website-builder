# AI Website Builder

A full-stack web application that uses AI (OpenAI GPT) to generate and modify HTML websites based on natural language prompts. Users can create, edit, publish, and share their AI-generated websites.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

## 🚀 Features

- **AI-Powered Website Generation**: Create complete HTML websites from natural language descriptions
- **AI-Powered Modifications**: Modify existing websites using conversational prompts
- **Project Management**: Create, edit, delete, and organize multiple projects
- **Community Gallery**: Browse and view published projects from other users
- **User Authentication**: Secure registration and login with JWT tokens
- **Credit System**: Track usage with credits (5 credits per project creation)
- **Real-time Preview**: See your website changes instantly
- **Conversation History**: Track all AI interactions for each project
- **Version Control**: Keep track of project versions and history

## 🏗️ Architecture

This is a **monorepo** containing both frontend and backend:

```
ai-website-builder/
├── backend/              # Express.js API server
│   ├── api/              # API routes, controllers, services
│   ├── config/           # Database and app configuration
│   ├── models/           # Mongoose schemas
│   ├── middleware/       # Express middleware
│   └── server.js        # Entry point
├── src/                  # React frontend
│   ├── cmps/            # React components
│   ├── pages/            # Page components
│   ├── services/         # API service layer
│   ├── contexts/         # React contexts (Auth)
│   └── assets/           # Static assets
├── backend/public/       # Built frontend (generated)
└── package.json          # Frontend dependencies
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **OpenAI API** - AI code generation
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Local installation or MongoDB Atlas account
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)
- **Git** - Version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-website-builder
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables

**Backend `.env` file** (`backend/.env`):
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ai-website-builder
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-website-builder

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Frontend** (optional - uses relative URLs by default):
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### 5. Open Your Browser

Visit `http://localhost:5173` to see the application!

## 📦 Building for Production

### Build Frontend

```bash
npm run build
```

This creates the production build in `backend/public/` directory.

### Start Production Server

```bash
cd backend
npm start
```

The server will serve both the API and frontend from `http://localhost:3000`.

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Render.

**Quick Summary:**
1. Build frontend: `npm run build`
2. Commit `backend/public/` folder
3. Deploy backend to Render (serves both API and frontend)
4. Set environment variables in Render

## 📚 Documentation

- **[Frontend README](./FRONTEND_README.md)** - Frontend-specific documentation
- **[Backend README](./backend/README.md)** - Backend API documentation
- **[API Endpoints](./backend/API_ENDPOINTS.md)** - Complete API reference
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions

## 🎯 Usage Guide

### Creating a Website

1. **Register/Login**: Create an account or login
2. **Enter Prompt**: On the homepage, describe the website you want
3. **AI Generation**: The AI will generate HTML code based on your description
4. **Preview**: View your website in the preview panel
5. **Edit**: Use the sidebar to request modifications

### Modifying a Website

1. **Open Project**: Go to "My Projects" and select a project
2. **Request Changes**: Type your modification request in the sidebar
3. **AI Processing**: The AI will modify the HTML code
4. **Review**: Check the preview to see changes

### Publishing Projects

1. **Open Project**: Navigate to your project page
2. **Click Publish**: Use the "Publish" button
3. **Community**: Your project will appear in the Community page

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

- **Registration**: Creates a new user account
- **Login**: Returns a JWT token
- **Protected Routes**: Require valid JWT token
- **Token Storage**: Stored in `localStorage`

## 💳 Credit System

- **Initial Credits**: New users start with 20 credits
- **Project Creation**: Costs 5 credits per project
- **Insufficient Credits**: Users cannot create projects without enough credits

## 🗂️ Project Structure Details

### Frontend Structure
```
src/
├── cmps/              # Reusable components
│   ├── Header.jsx     # Navigation header
│   ├── Footer.jsx     # Footer component
│   ├── sidebar.jsx    # Project sidebar with chat
│   └── ...
├── pages/             # Page components
│   ├── HomePage.jsx   # Landing page
│   ├── Project.jsx    # Project editor page
│   ├── MyProjectsPage.jsx
│   └── ...
├── services/          # API service layer
│   ├── api.js         # Base API utilities
│   ├── authService.js # Authentication
│   └── projectService.Remote.js
├── contexts/          # React contexts
│   └── AuthContext.jsx # Auth state management
└── assets/            # Static files
```

### Backend Structure
```
backend/
├── api/               # API modules
│   ├── auth/          # Authentication routes/controllers/services
│   ├── projects/      # Project CRUD operations
│   ├── user/          # User management
│   └── ai/            # AI service integration
├── models/            # Mongoose schemas
├── middleware/         # Express middleware
│   ├── auth.js        # JWT authentication
│   └── errorHandler.js
├── config/             # Configuration
│   └── database.js     # MongoDB connection
└── server.js           # Express app entry point
```

## 🧪 Testing

### Manual Testing

1. **Register a new user**
2. **Create a project** with AI
3. **Modify the project** using AI
4. **Publish the project**
5. **View in Community**

### API Testing

Use Postman or similar tools with the endpoints documented in [API_ENDPOINTS.md](./backend/API_ENDPOINTS.md).

## 🐛 Troubleshooting

### Common Issues

**Frontend not connecting to backend:**
- Check `VITE_API_URL` in frontend `.env`
- Verify backend is running on port 3000
- Check CORS configuration

**MongoDB connection errors:**
- Verify `MONGODB_URI` is correct
- Check MongoDB is running (if local)
- Verify network access (if MongoDB Atlas)

**AI generation fails:**
- Check `OPENAI_API_KEY` is set correctly
- Verify API key has credits/quota
- Check error logs in backend

**Build errors:**
- Clear `node_modules` and reinstall
- Check Node.js version compatibility
- Verify all environment variables are set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC License

## 🙏 Acknowledgments

- OpenAI for the GPT API
- React team for the amazing framework
- MongoDB for the database solution
- All open-source contributors

## 📞 Support

For issues and questions:
- Check existing documentation
- Review [API_ENDPOINTS.md](./backend/API_ENDPOINTS.md)
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues

---

**Built with ❤️ using React, Express, and OpenAI**
