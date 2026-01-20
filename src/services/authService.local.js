/**
 * Authentication service - Local storage version
 * Handles all authentication-related operations using localStorage
 */

import { getUsers as getUsersFromData, saveUsers as saveUsersToData } from './dataService'

// Storage key for current user and token
const CURRENT_USER_STORAGE_KEY = 'user'
const TOKEN_STORAGE_KEY = 'token'

/**
 * Get all users from data service
 * @returns {Array} Array of user objects
 */
const getUsers = () => {
  return getUsersFromData()
}

/**
 * Save users to data service
 * @param {Array} users - Array of user objects
 */
const saveUsers = (users) => {
  saveUsersToData(users)
}

/**
 * Generate a simple token (for local storage)
 * @returns {string} Token string
 */
const generateToken = () => {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} User object with token
 */
export const login = async (credentials) => {
  const { email, password } = credentials
  const users = getUsers()
  
  // Find user by email
  const user = users.find(u => u.email === email)
  
  if (!user) {
    throw new Error('Invalid email or password')
  }
  
  // Check password (in a real app, passwords should be hashed)
  if (user.password !== password) {
    throw new Error('Invalid email or password')
  }
  
  // Generate token
  const token = generateToken()
  
  // Save token and user to localStorage
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user))
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return {
    ...userWithoutPassword,
    token
  }
}

/**
 * Register new user
 * @param {Object} userData - { name, email, password, ... }
 * @returns {Promise<Object>} User object with token
 */
export const register = async (userData) => {
  const { name, email, password } = userData
  const users = getUsers()
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error('User with this email already exists')
  }
  
  // Create new user
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    password, // In a real app, this should be hashed
    credit: 0, // Default credit
    createdAt: new Date().toISOString()
  }
  
  // Add user to array
  users.push(newUser)
  saveUsers(users)
  
  // Generate token
  const token = generateToken()
  
  // Save token and user to localStorage
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser))
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return {
    ...userWithoutPassword,
    token
  }
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User object or null
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!token) return null

  try {
    const userStr = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
    if (userStr) {
      const user = JSON.parse(userStr)
      // Verify user still exists in users array
      const users = getUsers()
      const foundUser = users.find(u => u.id === user.id)
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        return userWithoutPassword
      }
    }
    // Token exists but user not found, clear token
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
    return null
  } catch (error) {
    // Token is invalid, clear it
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
    return null
  }
}

/**
 * Logout user
 * Clears token and current user from localStorage
 */
export const logout = async () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_STORAGE_KEY)
}
