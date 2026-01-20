/**
 * Auth Controller
 * Handles HTTP requests and responses for authentication
 */

import * as authService from './auth.service.js'

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      })
    }

    const result = await authService.registerUser({ name, email, password })

    res.status(201).json({
      success: true,
      ...result,
    })
  } catch (error) {
    if (error.message === 'User with this email already exists') {
      return res.status(400).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    const result = await authService.loginUser({ email, password })

    res.json({
      success: true,
      ...result,
    })
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        message: error.message,
      })
    }
    next(error)
  }
}

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id)

    res.json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  // Since we're using JWT, logout is handled client-side by removing the token
  // This endpoint is here for consistency and potential future server-side session management
  res.json({
    success: true,
    message: 'Logged out successfully',
  })
}
