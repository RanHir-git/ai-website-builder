import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables FIRST, before any other imports that might use them
dotenv.config()
const apiKey = process.env.OPENAI_API_KEY
console.log('OPENAI_API_KEY loaded:', apiKey ? 'YES (length: ' + apiKey.length + ')' : 'NO')
if (apiKey) {
  console.log('First 15 chars:', apiKey.substring(0, 15))
  console.log('Last 10 chars:', apiKey.substring(apiKey.length - 10))
  console.log('Has leading space:', apiKey.startsWith(' '))
  console.log('Has trailing space:', apiKey.endsWith(' '))
  console.log('Starts with sk-:', apiKey.trim().startsWith('sk-'))
}

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { connectDB } from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'

// Import routes (these import services that use environment variables)
import authRoutes from './api/auth/auth.routes.js'
import projectRoutes from './api/projects/projects.routes.js'
import userRoutes from './api/user/user.routes.js'

// Connect to database
connectDB()

// Initialize Express app
const app = express()

// Middleware
// CORS: Allow requests from frontend URL (if separate) or same origin (if serving from backend)
const frontendUrl = process.env.FRONTEND_URL
if (frontendUrl) {
  // Frontend on separate domain - configure CORS
  app.use(cors({
    origin: frontendUrl,
    credentials: true,
  }))
} else {
  // Frontend served from same origin - CORS not needed, but enable for API flexibility
  app.use(cors({
    origin: true, // Allow same-origin and configured origins
    credentials: true,
  }))
}
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes (must come before static file serving)
app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/user', userRoutes)

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

// Serve static files from public directory (frontend build)
app.use(express.static(path.join(__dirname, 'public')))

// Serve frontend for all non-API routes (React Router SPA)
// This must come after API routes but before error handler
app.get('*', (req, res, next) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Route not found',
    })
  }
  // Serve index.html for all other routes (React Router will handle routing)
  const indexPath = path.join(__dirname, 'public', 'index.html')
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If index.html doesn't exist (frontend not built), pass to error handler
      next(err)
    }
  })
})

// Error handler middleware (must be last)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
