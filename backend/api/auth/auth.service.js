/**
 * Auth Service
 * Business logic for authentication operations
 */

import User from '../../models/User.js'
import { generateToken } from '../../utils/generateToken.js'

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} User object with token
 */
export const registerUser = async (userData) => {
  const { name, email, password } = userData

  // Check if user already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    throw new Error('User with this email already exists')
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  })

  // Generate token
  const token = generateToken(user._id)

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      totalCreation: user.totalCreation,
      createdAt: user.createdAt,
    },
  }
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} User object with token
 */
export const loginUser = async (credentials) => {
  const { email, password } = credentials

  // Check if user exists and get password
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new Error('Invalid email or password')
  }

  // Check password
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }

  // Generate token
  const token = generateToken(user._id)

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      totalCreation: user.totalCreation,
      createdAt: user.createdAt,
    },
  }
}

/**
 * Get current user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User object
 */
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId)

  if (!user) {
    throw new Error('User not found')
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    credits: user.credits,
    totalCreation: user.totalCreation,
    createdAt: user.createdAt,
  }
}
