import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
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
